#!/usr/bin/env python3
"""Generate Simplified Chinese (_sc) pages from Traditional Chinese (_cn) pages."""
import re
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
CONVERTER = opencc.OpenCC("t2s")

CN_FILES = ["index_cn.html", "dfs_cn.html", "dfma_cn.html", "join_cn.html"]

# Protect URLs, filenames, and English fragments from conversion.
PROTECT_PATTERNS = [
    re.compile(r'href="[^"]*"'),
    re.compile(r'src="[^"]*"'),
    re.compile(r'data="[^"]*"'),
    re.compile(r'content="[^"]*"'),
    re.compile(r'https?://[^\s"<>]+'),
    re.compile(r'[a-zA-Z0-9_\-]+\.(html|png|jpg|svg|js|css)'),
    re.compile(r'data-locale="[^"]*"'),
    re.compile(r'data-count="[^"]*"'),
    re.compile(r'class="[^"]*"'),
    re.compile(r'id="[^"]*"'),
    re.compile(r'style="[^"]*"'),
    re.compile(r'<!--.*?-->', re.DOTALL),
]


def protect(text: str) -> tuple[str, list[str]]:
    placeholders: list[str] = []

    def stash(match: re.Match) -> str:
        placeholders.append(match.group(0))
        return f"\x00{len(placeholders) - 1}\x00"

    for pattern in PROTECT_PATTERNS:
        text = pattern.sub(stash, text)
    return text, placeholders


def restore(text: str, placeholders: list[str]) -> str:
    for i, value in enumerate(placeholders):
        text = text.replace(f"\x00{i}\x00", value)
    return text


def convert_chinese(text: str) -> str:
    protected, placeholders = protect(text)
    converted = CONVERTER.convert(protected)
    return restore(converted, placeholders)


def sc_filename(cn_name: str) -> str:
    return cn_name.replace("_cn.html", "_sc.html")


def base_name(path: str) -> str:
    return path.replace("_cn.html", "").replace("_sc.html", "").replace(".html", "")


def en_page(sc_or_cn: str) -> str:
    name = Path(sc_or_cn).name
    if name.startswith("index"):
        return "index.html"
    return name.replace("_cn.html", ".html").replace("_sc.html", ".html")


def cn_page(sc_or_en: str) -> str:
    name = Path(sc_or_en).name
    if name == "index.html":
        return "index_cn.html"
    if name.endswith("_sc.html"):
        return name.replace("_sc.html", "_cn.html")
    if name.endswith(".html") and "_cn" not in name:
        stem = name.replace(".html", "")
        return f"{stem}_cn.html"
    return name


def sc_page(name: str) -> str:
    if name == "index.html" or name == "index_cn.html":
        return "index_sc.html"
    if name.endswith("_cn.html"):
        return name.replace("_cn.html", "_sc.html")
    if name.endswith(".html") and "_sc" not in name and "_cn" not in name:
        return name.replace(".html", "_sc.html")
    return name


def build_sc_nav_block(current: str) -> str:
    """Return language switch <li> items for a SC page header."""
    en = en_page(current)
    cn = cn_page(current)
    return (
        f'<li><a href="{en}" class="language-switch">English</a></li>'
        f'<li><a href="{cn}" class="language-switch language-switch--alt">繁体</a></li>'
    )


def patch_sc_content(content: str, filename: str) -> str:
    sc_name = sc_filename(filename)

    content = content.replace('lang="zh-HK"', 'lang="zh-CN"')
    content = content.replace("_cn.html", "_sc.html")

    # Policy map: use simplified locale key
    content = content.replace('data-locale="zh"', 'data-locale="zh-sc"')

    # Replace nav language switches in SC pages
    nav_lang_pattern = re.compile(
        r"<li><a href=\"[^\"]+\.html\" class=\"language-switch\">English</a></li>"
    )
    content = nav_lang_pattern.sub(
        lambda _: build_sc_nav_block(sc_name), content, count=1
    )

    return content


def add_alt_css_to_inline(content: str) -> str:
    rule = ".language-switch--alt{margin-left:0;padding-left:var(--s2);border-left:none}"
    if "language-switch--alt" in content:
        return content
    if ".language-switch:hover" in content:
        return content.replace(
            ".language-switch:hover{color:var(--orange)!important}",
            ".language-switch:hover{color:var(--orange)!important}" + rule,
            1,
        )
    return content.replace(
        ".language-switch:hover{color:var(--orange) !important;}",
        ".language-switch:hover{color:var(--orange) !important;}\n    .language-switch--alt{margin-left:0;padding-left:var(--s2);border-left:none;}",
        1,
    )


def main() -> None:
    for cn_file in CN_FILES:
        src = ROOT / cn_file
        dst = ROOT / sc_filename(cn_file)
        raw = src.read_text(encoding="utf-8")
        converted = convert_chinese(raw)
        converted = patch_sc_content(converted, cn_file)
        converted = add_alt_css_to_inline(converted)
        dst.write_text(converted, encoding="utf-8")
        print(f"Wrote {dst.name}")


if __name__ == "__main__":
    main()

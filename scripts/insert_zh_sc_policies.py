import re
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
JS = ROOT / "js" / "dfs-policy-map.js"
c = opencc.OpenCC("t2s")

text = JS.read_text(encoding="utf-8")
zh_block = text.split("    zh: [", 1)[1].split("\n    ]\n  };", 1)[0]
zh_sc_block = c.convert(zh_block).replace("    zh:", "    'zh-sc':", 1)
# zh_sc_block already has wrong key - fix
zh_sc_block = zh_sc_block  # content only, no key

insert = "    'zh-sc': [" + zh_sc_block.split("[", 1)[1] if "[" in zh_sc_block else c.convert(zh_block)

# Direct convert preserving structure
converted = c.convert(zh_block)
new_section = "    'zh-sc': [\n" + converted + "\n    ]"

if "'zh-sc':" in text:
    print("already has zh-sc")
else:
    text = text.replace("\n    ]\n  };", "\n    ],\n" + new_section + "\n  };", 1)
    JS.write_text(text, encoding="utf-8")
    print("inserted zh-sc")

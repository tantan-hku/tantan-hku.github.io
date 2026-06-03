import json
import re
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
JS = ROOT / "js" / "dfs-policy-map.js"
c = opencc.OpenCC("t2s")

text = JS.read_text(encoding="utf-8")
zh_block = text.split("zh: [", 1)[1].split("],\n  };", 1)[0]

entries = []
for chunk in re.findall(r"\{[^}]+\}", zh_block):
    entry = {}
    for key in ("id", "name", "type", "lon", "lat", "policy"):
        if key in ("lon", "lat"):
            m = re.search(rf"{key}: ([-\d.]+)", chunk)
            if m:
                entry[key] = float(m.group(1))
        else:
            m = re.search(rf"{key}: '([^']*)'", chunk)
            if m:
                entry[key] = m.group(1)
    if entry.get("id"):
        entry["name"] = c.convert(entry["name"])
        entry["policy"] = c.convert(entry["policy"])
        entries.append(entry)

lines = ["    'zh-sc': ["]
for e in entries:
    lines.append(
        f"      {{ id: '{e['id']}', name: '{e['name']}', type: '{e['type']}', "
        f"lon: {e['lon']}, lat: {e['lat']}, policy: '{e['policy']}' }},"
    )
lines.append("    ]")
out = ROOT / "scripts" / "zh_sc_policies.txt"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("ok")

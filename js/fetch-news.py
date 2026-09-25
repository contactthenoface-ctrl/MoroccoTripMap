#!/usr/bin/env python3
"""
Fetch fresh Morocco tourism / World Cup 2030 headlines from Google News RSS
and write them to data/news.json.

Run manually with:  python3 js/fetch-news.py   (from the repo root, so the
                     data/news.json output path below resolves correctly)
Run automatically:  see .github/workflows/update-news.yml (runs daily, and
                     can also be triggered manually or more often — see the
                     comment inside that workflow file).

No API key needed: Google News publishes a public RSS feed for any search
query. We just parse it with the standard library.
"""
import json
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

QUERY = 'Morocco tourism OR "Morocco World Cup 2030" OR "Maroc tourisme"'
FEED_URL = (
    "https://news.google.com/rss/search?q="
    + urllib.parse.quote(QUERY)
    + "&hl=en-MA&gl=MA&ceid=MA:en"
)
OUTPUT_PATH = "data/news.json"
MAX_ITEMS = 12


def fetch_feed(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def parse_items(xml_text: str):
    root = ET.fromstring(xml_text)
    items = []
    for item in root.findall("./channel/item")[:MAX_ITEMS]:
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        source_el = item.find("source")
        source = source_el.text.strip() if source_el is not None and source_el.text else "Google News"

        published_iso = ""
        if pub_date:
            try:
                dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
                published_iso = dt.replace(tzinfo=timezone.utc).isoformat()
            except ValueError:
                published_iso = ""

        items.append(
            {
                "title": title,
                "link": link,
                "source": source,
                "published": published_iso,
                "image": "",
            }
        )
    return items


def main():
    xml_text = fetch_feed(FEED_URL)
    items = parse_items(xml_text)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "items": items,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(items)} items to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

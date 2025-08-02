import requests
import re
import json

UPSTREAM_URL = "https://pigzillaaa-scraper.vercel.app/tims"
OUTPUT_FILE = "channels.json"
REFERER = "https://kleanplay.shop/"
ORIGIN = "https://kleanplay.shop"

def parse_m3u(playlist_text):
    lines = playlist_text.strip().splitlines()
    channels = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        if line.startswith("#EXTINF:"):
            # Extract channel name
            name_match = re.search(r',(.+)$', line)
            name = name_match.group(1).strip() if name_match else "Unknown"

            # Extract tvg-id or create from name
            id_match = re.search(r'tvg-id="([^"]+)"', line)
            id_ = id_match.group(1) if id_match else re.sub(r'\W+', '', name.lower())

            # Get stream URL from next line
            if i + 1 < len(lines):
                link = lines[i + 1].strip()
            else:
                link = ""

            # Construct logo URL (customize as needed)
            logo = f"https://raw.githubusercontent.com/abusaeeidx/Tv-Channel-Logo/heads/main/Default/{id_}.png"

            channel = {
                "name": name,
                "id": id_,
                "logo": logo,
                "link": link,
                "referer": REFERER,
                "origin": ORIGIN
            }
            channels.append(channel)
            i += 2  # Skip to line after URL
        else:
            i += 1

    return channels

def main():
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*'
    }

    try:
        res = requests.get(UPSTREAM_URL, headers=headers, timeout=15)
        res.raise_for_status()
        playlist_text = res.text
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch playlist: {e}")
        return

    channels = parse_m3u(playlist_text)

    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(channels, f, indent=4)
        print(f"✅ Saved {len(channels)} channels to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Failed to write JSON file: {e}")

if __name__ == "__main__":
    main()

name: 🔄 Update Tims247 JSON Playlist

on:
  schedule:
    - cron: '*/5 * * * *'  # every 5 minutes
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-playlist:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0
          persist-credentials: true

      - name: 🐍 Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'

      - name: 📦 Install dependencies
        run: pip install --upgrade pip requests

      - name: 🧠 Configure Git user
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@users.noreply.github.com"

      - name: 🔄 Run JSON generation script
        run: |
          python generate_channels_json.py

      - name: 💤 Sleep random delay
        run: sleep $((RANDOM % 10 + 5))

      - name: 💾 Commit and push if changes
        run: |
          git add channels.json
          if git diff --cached --quiet; then
            echo "✅ No changes to commit"
            exit 0
          fi
          git commit -m "🔄 Updated channels.json @ $(date -u +'%Y-%m-%d %H:%M:%S')"
          git push origin main

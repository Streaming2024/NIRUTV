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

      - name: 🔄 Run JSON generation script and check output
        run: |
          python generate_channels_json.py
          echo "Listing files in repo root:"
          ls -l
          echo "Preview of channels.json:"
          head -n 20 channels.json || echo "channels.json not found"

      - name: 🧠 Configure Git user
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@users.noreply.github.com"

      - name: 💾 Commit and push if channels.json changed
        run: |
          git add channels.json
          if git diff --cached --quiet; then
            echo "✅ No changes to commit"
            exit 0
          fi
          git commit -m "🔄 Updated channels.json @ $(date -u +'%Y-%m-%d %H:%M:%S')"
          git push origin main

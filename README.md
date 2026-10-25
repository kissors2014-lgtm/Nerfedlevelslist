# Nerfedlevelslist
Nerfed Levels geometry Dash list
# Geometry Dash List

A static, Pointercrate-inspired Geometry Dash list. No backend needed.

## Files

- `levels.json` – all the data (levels in order, records)
- `index.html`, `style.css`, `script.js` – the website

## Run locally

Because the page uses `fetch`, opening the file directly won't work. Start a simple server:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## GitHub Pages

1. Upload the files to a GitHub repository
2. Settings → Pages → Branch: `main`, folder: `/ (root)`
3. After a few minutes it is available at `https://username.github.io/repo-name/`

## Adding a level

Add a new object to the `levels` array in `levels.json`. **The order in the array is the ranking** (the first item is #1).

```json
{
  "name": "Level name",
  "creator": "Creator",
  "verifier": "Verifier",
  "videoId": "YouTube video ID",
  "levelId": 123456,
  "requirement": 55,
  "records": [
    { "player": "Name", "percent": 100, "video": "https://..." }
  ]
}
```

## Settings

- `mainListSize`: how many levels belong to the main list (the rest are legacy and give no points)
- The points formula is the `pointsForRank` function at the top of `script.js`

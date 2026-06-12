# Guild Meetup 2026 — Hamont-Achel

A simple one-page website for the guild meetup on **18 July 2026** in Hamont-Achel, Belgium.

🌐 **Live site:** https://silvermoon-guard.github.io/guild_meetup/

## Want to update it?

You don't need to be a programmer. **Read [`CLAUDE.md`](./CLAUDE.md)** — it explains, in
plain English, how to add photos and change text. The short version:

- **Add a photo** → drop an image into the [`images/`](./images) folder.
- **Change the words** → edit [`index.html`](./index.html).
- **Make it live** → push to the `main` branch; it republishes automatically in ~2 minutes.

The easiest way is to open **Claude Code** in this folder and just ask for what you want.

## How it works

`index.html` is the whole site. Photos in `images/` are turned into the gallery by
`scripts/build-gallery.mjs`, and the `Publish website` GitHub Action
([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) rebuilds the gallery
and deploys to GitHub Pages on every push to `main`.

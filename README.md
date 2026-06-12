# Guild Meetup 2026 — Hamont-Achel

A small static website for the guild meetup on **18 July 2026** in Hamont-Achel, Belgium.
No framework, no build tooling — just HTML/CSS/JS published with GitHub Pages.

🌐 **Live site:** https://silvermoon-guard.github.io/guild_meetup/

---

## How it works

- **`index.html`** is the default site — the whole page, all text and layout, served at the
  root URL `/`.
- **`images/`** holds the photos. A tiny helper, `scripts/build-gallery.mjs`, turns whatever
  is in that folder into the photo gallery (the file name becomes the caption).
- **`designs/`** holds optional alternative layouts ("experiments"), each at its own URL.
- The **`Publish website`** GitHub Action (`.github/workflows/deploy.yml`) runs on every push
  to `main`: it rebuilds the galleries and deploys everything to GitHub Pages in ~1–2 minutes.

You don't deploy anything by hand — **push to `main` and it goes live.**

---

## Experiments (multiple designs)

You can keep several designs side by side without touching the main one. Each experiment is
a self-contained page in its own folder and gets its own address:

| In the repo | Public URL |
|---|---|
| `index.html` | https://silvermoon-guard.github.io/guild_meetup/ |
| `designs/poster/index.html` | https://silvermoon-guard.github.io/guild_meetup/designs/poster/ |
| `designs/<your-name>/index.html` | `…/guild_meetup/designs/<your-name>/` |

All designs share the **same `images/` folder** — add a photo once and it shows up in every
design automatically.

**Add one:** copy `designs/poster/` to `designs/<name>/`, edit it, keep the
`<!-- GALLERY:START --> … <!-- GALLERY:END -->` markers if you want a gallery, then push.
**View it:** once the deploy is green, open `…/guild_meetup/designs/<name>/`.
(Easiest of all: ask Claude Code — *"make a new design experiment called `<name>`"*.)

---

## Update it yourself with Claude Code

The intended way to maintain this site is to talk to **Claude Code** (an AI coding agent) in
plain English. It reads [`CLAUDE.md`](./CLAUDE.md) and does the technical work for you.

### 1. One-time setup

You'll need [**Node.js**](https://nodejs.org) (v18+) and [**git**](https://git-scm.com).
Then:

```bash
# Install Claude Code (either method works)
npm install -g @anthropic-ai/claude-code
# – or – native installer:
# curl -fsSL https://claude.ai/install.sh | bash

# Get the project onto your computer
git clone git@github.com:silvermoon-guard/guild_meetup.git
cd guild_meetup

# Start Claude Code (the first run walks you through a one-time login)
claude
```

Full install docs: https://docs.claude.com/en/docs/claude-code

### 2. Ask for what you want

Once `claude` is running inside the `guild_meetup` folder, just type requests. Examples:

| I want to… | Say something like… |
|---|---|
| Add photos | *"Add these photos to the gallery"* (then drag the files in, or give their paths) |
| Set a caption | *"Caption `beloren-guild-raid.png` as 'Belo'ren on Al'Akir'."* |
| Remove a photo | *"Remove the campfire photo."* |
| Change text / date / contact | *"Change the date to 25 July 2026 everywhere it appears."* |
| Preview before going live | *"Show me a local preview."* |
| Create an experiment | *"Make a new design experiment called sunset."* |
| Promote an experiment | *"Promote the sunset design to be the main one."* |
| Publish your changes | *"Publish it"* / *"Push the changes live."* |
| Undo something | *"Undo the last change"* / *"Put the site back to yesterday's version."* |
| Fix a failed publish | *"The publish failed — check the Actions log and fix it."* |

### 3. Publish

Nothing is live until it's pushed to GitHub. When you're happy, say **"publish it"** and
Claude will commit and push; the site updates itself in ~1–2 minutes. You can watch the
green checkmark appear on the repo's **Actions** tab.

> Tip: make changes in small steps and ask for a preview before publishing. If anything
> looks off, just ask Claude to undo it.

For the full plain-English guide (recipes, troubleshooting, glossary) see **[`CLAUDE.md`](./CLAUDE.md)**.

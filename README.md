# Guild Meetup 2026 — Hamont-Achel

A small static website for the guild meetup on **18 July 2026** in Hamont-Achel, Belgium.
No frameworks, no build step — just HTML/CSS/JS published with GitHub Pages.

🌐 **Live site:** https://silvermoon-guard.github.io/guild_meetup/

**Jump to:** [The designs](#the-designs) · [How it works](#how-it-works) · [Edit it yourself (no coding)](#edit-it-yourself-no-coding) · [Add a design](#add-a-design) · [Publishing](#publishing)

---

## The designs

The same invite, a few different ways. The first is the live default; the rest are
experiments, each at its own address. Browse them all from the directory at **`/designs/`**.

| Version | Link | What it is |
|---|---|---|
| **Campfire** *(default, live)* | https://silvermoon-guard.github.io/guild_meetup/ | The official invite — full plan, travel & FAQ |
| Directory | https://silvermoon-guard.github.io/guild_meetup/designs/ | Pick a design |
| Poster | https://silvermoon-guard.github.io/guild_meetup/designs/poster/ | Compact one-page flyer |
| App | https://silvermoon-guard.github.io/guild_meetup/designs/app/ | Phone-app feel: tabs, schedule, city cards |
| Explore | https://silvermoon-guard.github.io/guild_meetup/designs/explore/ | Image-forward tour of the nearby cities |

---

## How it works

- **`index.html`** — the default page (all text and layout), served at the root URL `/`.
- **`designs/`** — alternative layouts, each in its own folder at its own URL.
  `designs/index.html` is the directory page at `/designs/`.
- **`images/locations/`** — the city photos (Eindhoven, Amsterdam, …). They're
  Creative-Commons licensed and credited on the pages that use them.
- **`.github/workflows/deploy.yml`** — the automation that republishes the whole site to
  GitHub Pages on every push to `main` (~1–2 minutes). Nobody deploys by hand.

> *Optional:* a drop-in photo gallery is supported — `scripts/build-gallery.mjs` turns any
> images in the top-level `images/` folder into a gallery on any page with the gallery
> markers. It's currently unused, but available if you ever want one.

---

## Edit it yourself (no coding)

You don't need to be a developer. The easiest way to change anything is to open
**Claude Code** (an AI assistant) in this folder and ask in plain English — it reads
[`CLAUDE.md`](./CLAUDE.md) and does the technical part for you.

**One-time setup** — needs [Node.js](https://nodejs.org) (v18+) and [git](https://git-scm.com):

```bash
npm install -g @anthropic-ai/claude-code          # install Claude Code
git clone git@github.com:silvermoon-guard/guild_meetup.git
cd guild_meetup
claude                                             # first run does a one-time login
```

Install help: https://docs.claude.com/en/docs/claude-code

**Then just ask.** A few examples:

| You want to… | Say to Claude |
|---|---|
| Change the date / wording / contact | *"Change the date to 25 July 2026 everywhere it appears."* |
| Swap a city photo | *"Replace the Eindhoven photo with this one."* (drag the file in) |
| Preview before it goes live | *"Show me a local preview."* |
| Create a new design | *"Make a new design experiment called sunset."* |
| Make a design the default | *"Promote the sunset design to be the main one."* |
| Publish your changes | *"Publish it."* |
| Undo something | *"Undo the last change."* |
| A publish failed | *"The publish failed — check the Actions log and fix it."* |

> **Tip:** change things in small steps, ask for a preview, and if something looks off just
> say *"undo that."*

For the full plain-English guide (recipes, troubleshooting, glossary), see
**[`CLAUDE.md`](./CLAUDE.md)**.

---

## Add a design

Copy `designs/poster/` to `designs/<name>/`, edit the copy, and push — it goes live at
`…/designs/<name>/`. Add a card for it in `designs/index.html` so people can find it from the
directory. (Easiest of all: ask Claude — *"make a new design experiment called `<name>`."*)

---

## Publishing

Nothing is live until it's pushed to the **`main`** branch. Push it (or tell Claude
*"publish it"*) and the **Publish website** GitHub Action redeploys in ~1–2 minutes — you can
watch the green checkmark appear on the repo's **Actions** tab.

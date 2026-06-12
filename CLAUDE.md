# Guild Meetup website — how to update it

Hi! 👋 This file explains how to change the Guild Meetup website **without needing
to be a programmer**. If you can drag a file and type a sentence, you can do this.

You can read this yourself, but the easiest way to use it is to open **Claude Code**
in this folder and just ask in plain English, e.g.:

> "Add the three photos on my desktop to the website."
>
> "Change the contact email to mynewemail@example.com."
>
> "Take down the photo of the campfire."

Claude will follow the instructions below for you. The rest of this document is
written so that **both you and Claude** know exactly what to do.

---

## The 30-second version

- The website is **one page**: `index.html`.
- Photos live in the **`images/` folder**. To add a photo, you put a picture in
  that folder. To remove one, you delete it from that folder. That's it.
- When a change is saved to GitHub, the website **rebuilds and goes live by itself**
  in about 1–2 minutes. Nobody has to "deploy" anything.
- The live website address is:
  **https://silvermoon-guard.github.io/guild_meetup/**

---

## The one rule to understand: "publishing"

Your changes only appear on the real website after they are **pushed to GitHub**
(the place the website is hosted from). Saving a file on your own computer is *not*
enough on its own — it has to be sent ("pushed") to GitHub.

Don't worry about the jargon. Just remember:

> **Nothing is live until it's pushed. Once it's pushed, it's live in ~2 minutes.**

If you're using Claude Code, just say **"publish it"** or **"push the changes"** and
Claude will do the technical part. You can watch it happen on the repo's
**"Actions"** tab on GitHub — a green checkmark means it's live.

---

## "I just want to…" — recipes

### ➕ Add one or more photos

**The easy way (ask Claude Code):**
> "Add these photos to the gallery: [drag the files in or give the paths]."

**By hand:**
1. Put your image file(s) into the **`images/`** folder.
2. Give each file a clear name, because **the file name becomes the caption**:
   - `firelands-first-kill.jpg` → shows as **"Firelands First Kill"**
   - Use dashes `-` or underscores `_` between words. Avoid spaces if you can.
3. Publish (push to GitHub). The new photos appear automatically.

**Good to know:**
- Supported types: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`, `.svg`.
- Photos show in **alphabetical order**. To control the order, start the name with
  a number: `01-arrival.jpg`, `02-bbq.jpg`, `03-campfire.jpg`. The number is only
  used for sorting — it is removed from the caption automatically.
- A date prefix works too and is also removed from the caption:
  `2014-07-ragnaros.jpg` → **"Ragnaros"**.
- Big photos are fine, but smaller files load faster. Anything under ~2 MB is great.

### ✏️ Set an exact caption (optional)

If the auto-caption from the file name isn't quite right, you can write your own.
Create (or edit) a file called **`images/captions.json`** that looks like this:

```json
{
  "firelands-first-kill.jpg": "When we finally killed Ragnaros (2014)",
  "beloren-guild-raid.png": "Belo'ren on Al'Akir — Battle Standard up"
}
```

Each line is `"the exact file name": "the caption you want"`. Files not listed here
just use the automatic caption. (Or simply ask Claude: *"Caption the raid photo as …"*.)

### 🗑️ Remove a photo

- **Ask Claude:** *"Remove the campfire photo."*
- **By hand:** delete the file from the `images/` folder, then publish.

### 📅 Change the date, intro text, or contact details

All the words on the page live in **`index.html`**. You can ask Claude to change any
of it in plain English, for example:
> "Change the date to 25 July 2026 everywhere it appears."
>
> "Update the contact email to jan@example.com."
>
> "Reword the intro paragraph to mention the new pool."

If you want to edit by hand, open `index.html` in any text editor and search for the
text you want to change. The date appears in a few places (the big "18", "July 2026",
and the page title), so it's easiest to let Claude catch them all.

### 👀 Preview before publishing

To see your changes on your own computer before they go live, ask Claude:
> "Show me a local preview."

Or do it by hand from this folder:
```bash
node scripts/build-gallery.mjs   # refresh the gallery from the images/ folder
open index.html                  # opens the page in your browser (macOS)
```
This preview is private to your computer. It does **not** change the live site until
you publish.

---

## For Claude Code — operational notes

When a non-technical user asks you to change this site, follow these steps. Keep your
explanations short and friendly; do the technical work for them.

**Adding/removing/renaming images:**
1. Move/copy/delete files in the `images/` folder as requested. Prefer clear,
   hyphenated, lowercase file names. Preserve a number prefix if ordering matters.
2. Run the gallery build so every design reflects the change:
   ```bash
   node scripts/build-gallery.mjs
   ```
   This updates the gallery in **all** pages that have one (the main `index.html` and
   any experiments under `designs/`) — they all share the single `images/` folder.
   Never hand-edit the block between `<!-- GALLERY:START -->` and
   `<!-- GALLERY:END -->` — that block is generated by the script and will be
   overwritten. Captions are controlled by file names or `images/captions.json`.
3. Show the user what changed, then publish (see below) once they're happy.

**Editing page text:** edit `index.html` directly. The date appears in the `<title>`,
the hero `.date`/`.month`, and prose — update all occurrences. The contact is a
`mailto:` link near the bottom (`#questions`).

**Publishing (only when the user confirms, or clearly asked to "publish"/"push"):**
```bash
git add -A
git commit -m "Short description of the change"
git push
```
The `Publish website` GitHub Action then rebuilds the gallery and deploys to Pages
automatically (~1–2 min). You can check status with `gh run list --limit 1` or point
the user to the repo's **Actions** tab. The live URL is
https://silvermoon-guard.github.io/guild_meetup/.

**Guardrails — please respect these:**
- 🚫 Do **not** put the host's real home address or phone number on the site. The text
  intentionally says the address is shared privately after confirmation. Keep it that way.
- 🚫 Do not commit huge raw videos or hundreds of MB of images — keep the repo light.
- ✅ Always run `node scripts/build-gallery.mjs` after changing the `images/` folder.
- ✅ Confirm before pushing if the user only asked you to "make a change" without
  saying "publish" — show them the local result first.

---

## What each file is (project map)

| File / folder | What it's for |
|---|---|
| `index.html` | The **default** website (what visitors see at the main URL `/`). Edit this to change wording. |
| `designs/` | Alternative layout experiments, each served at its own URL (e.g. `designs/poster/` → `/designs/poster/`). See "Multiple design options" below. |
| `images/` | Drop photos here. They become the gallery on every design automatically. |
| `images/captions.json` | *(optional)* Custom captions for specific photos. |
| `scripts/build-gallery.mjs` | The helper that rebuilds the gallery in every design from `images/`. Runs automatically when publishing; you rarely run it by hand. |
| `.github/workflows/deploy.yml` | The automation that publishes the site to GitHub Pages on every change. You should not need to touch this. |
| `CLAUDE.md` | This guide. |
| `README.md` | A short summary for anyone browsing the repo on GitHub. |
| `Guildmeeting.txt` | The original written description the site is based on (reference). |
| `preview.html` | The original rough design draft (reference, not published as the main page). |

---

## Multiple design options (experiments)

You can keep several different designs of the page side by side, each at its own web
address, without touching the main one. This is handy for trying out a new look before
deciding to switch to it.

**How it works:**
- The **default** design is `index.html` at the top of the repo. It's what people see at
  the main address: **https://silvermoon-guard.github.io/guild_meetup/**
- Each **experiment** lives in its own folder under `designs/`, as `designs/<name>/index.html`,
  and gets its own address. Example already in the repo:
  `designs/poster/index.html` → **https://silvermoon-guard.github.io/guild_meetup/designs/poster/**
- Every design shares the **same `images/` folder**. Add a photo once and it appears in
  all of them automatically — the build script figures out the correct image path for
  each design's location.

**To create a new experiment** (easiest: just ask Claude, *"make a new design experiment called sunset"*):
1. Copy an existing folder, e.g. `designs/poster/` → `designs/sunset/`, and edit that copy.
   Keep the `<!-- GALLERY:START --> … <!-- GALLERY:END -->` markers if you want a gallery.
2. Run `node scripts/build-gallery.mjs` so its gallery fills in.
3. Publish. It goes live at `/designs/sunset/`. The main page is unaffected.

**To make an experiment the new default:** copy its contents into the top-level `index.html`
(ask Claude — *"promote the poster design to be the main one"*). The old default can be kept
as an experiment under `designs/` if you want to be able to switch back.

**For Claude:** new designs are self-contained HTML files under `designs/<name>/`. Reference
the shared photos with the right relative path (`../../images/…` from `designs/<name>/`), or
just include the gallery markers and let `build-gallery.mjs` write the correct paths. The
deploy workflow publishes the whole repo, so any new folder is served automatically — no
workflow changes needed.

---

## Troubleshooting

- **"I added a photo but I don't see it on the website."**
  Did you publish (push to GitHub)? Give it ~2 minutes after the green checkmark on the
  Actions tab. Then **hard-refresh** your browser (Cmd+Shift+R on Mac, Ctrl+F5 on Windows)
  to clear the cached old version.
- **"The photo shows but the caption is wrong."**
  Rename the file to something readable, or add an entry in `images/captions.json`.
  Then publish again.
- **"The Actions tab shows a red ✗ instead of green ✓."**
  Open Claude Code and say *"the website publish failed, can you check the Actions log
  and fix it?"* — Claude can read the error and sort it out.
- **"I want to undo a change."**
  Ask Claude: *"undo the last change"* or *"put the website back to how it was yesterday."*

---

## Glossary (plain English)

- **Repo / repository** — the project folder, stored on GitHub.
- **Push / publish** — send your saved changes to GitHub, which makes them go live.
- **Commit** — a saved snapshot of your changes, with a short note about what changed.
- **GitHub Pages** — the free GitHub feature that turns this folder into a public website.
- **Action / workflow** — the robot that rebuilds and publishes the site for you.
- **The gallery** — the grid of photos on the page, built from the `images/` folder.

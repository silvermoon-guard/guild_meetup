#!/usr/bin/env node
/*
 * build-gallery.mjs
 * -----------------
 * Looks at every picture inside the `images/` folder and rewrites the photo
 * gallery inside EVERY design that has a gallery — that's any .html file in the
 * repo containing the two gallery markers:
 *
 *     <!-- GALLERY:START -->   ... gallery goes here ...   <!-- GALLERY:END -->
 *
 * That means the main page (index.html) AND any alternative designs you add
 * under designs/<name>/index.html all share the same images/ folder and update
 * together. Image paths are worked out automatically for each file's location.
 *
 * You do NOT normally run this by hand — it runs automatically when changes are
 * published (see .github/workflows/deploy.yml). Running it locally is safe too:
 *
 *     node scripts/build-gallery.mjs
 *
 * HOW TO ADD A PHOTO: drop an image file into the `images/` folder. The file
 * NAME becomes the caption, e.g. `2014-firelands-kill.jpg` -> "Firelands Kill"
 * (a leading date/number is used only for ordering and stripped from the
 * caption). Files show in alphabetical order — prefix with 01-, 02-, ... to
 * control it. For an exact caption, add an images/captions.json file:
 *     { "2014-firelands-kill.jpg": "When we finally killed Ragnaros (2014)" }
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, extname, basename, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = join(ROOT, "images");
const CAPTIONS_FILE = join(IMAGES_DIR, "captions.json");

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"];
const START = "<!-- GALLERY:START -->";
const END = "<!-- GALLERY:END -->";
const SKIP_DIRS = new Set(["node_modules", "images"]); // dot-dirs (.git, .github) skipped separately

// Turn a file name into a friendly caption.
// "2014-firelands-kill.jpg" -> "Firelands Kill"
function prettifyName(file) {
  let name = basename(file, extname(file));
  name = name.replace(/^[\d]{1,4}([-_.][\d]{1,2}){0,2}[-_.\s]+/, "");
  name = name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!name) return "Photo";
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function loadCaptions() {
  if (!existsSync(CAPTIONS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CAPTIONS_FILE, "utf8"));
  } catch (err) {
    console.warn(`⚠️  Could not read images/captions.json (${err.message}) — ignoring it.`);
    return {};
  }
}

function listImages() {
  if (!existsSync(IMAGES_DIR)) return [];
  return readdirSync(IMAGES_DIR)
    .filter((f) => IMAGE_EXTENSIONS.includes(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
}

// Every .html file in the repo (recursively), skipping dot-dirs and SKIP_DIRS.
function findHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...findHtmlFiles(full));
    } else if (extname(entry.name).toLowerCase() === ".html") {
      out.push(full);
    }
  }
  return out;
}

// Relative URL prefix from a given HTML file to the images/ folder.
// root index.html -> "images"; designs/x/index.html -> "../../images"
function imagesPrefixFor(htmlFile) {
  return relative(dirname(htmlFile), IMAGES_DIR).split(sep).join("/");
}

function buildGalleryHtml(images, captions, prefix) {
  if (images.length === 0) {
    return `      <p class="gallery-empty">No photos yet — drop image files into the <code>images/</code> folder and they'll show up here automatically.</p>`;
  }
  const figures = images.map((file) => {
    const src = `${prefix}/${encodeURIComponent(file)}`;
    const caption = escapeHtml(captions[file] ?? prettifyName(file));
    return `        <figure>
          <a href="${src}" target="_blank" rel="noopener">
            <img src="${src}" alt="${caption}" loading="lazy" />
          </a>
          <figcaption>${caption}</figcaption>
        </figure>`;
  });
  return `      <div class="gallery-grid">\n${figures.join("\n")}\n      </div>`;
}

function updateFile(htmlFile, images, captions) {
  const html = readFileSync(htmlFile, "utf8");
  const startIdx = html.indexOf(START);
  const endIdx = html.indexOf(END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return null; // no gallery here

  const gallery = buildGalleryHtml(images, captions, imagesPrefixFor(htmlFile));
  const before = html.slice(0, startIdx + START.length);
  const after = html.slice(endIdx);
  const updated = `${before}\n${gallery}\n      ${after}`;

  const rel = relative(ROOT, htmlFile) || basename(htmlFile);
  if (updated === html) return { rel, changed: false };
  writeFileSync(htmlFile, updated, "utf8");
  return { rel, changed: true };
}

function main() {
  const images = listImages();
  const captions = loadCaptions();
  const results = findHtmlFiles(ROOT).map((f) => updateFile(f, images, captions)).filter(Boolean);

  if (results.length === 0) {
    console.log(`ℹ️  No pages contain gallery markers — nothing to build.`);
    console.log(`   (Add "${START}" … "${END}" to a page to enable an auto photo gallery.)`);
    return;
  }
  console.log(`✅ ${images.length} photo(s) · ${results.length} design(s) with a gallery:`);
  results.forEach((r) => console.log(`   ${r.changed ? "updated" : "up to date"} — ${r.rel}`));
  if (images.length) {
    console.log("   captions: " + images.map((f) => `"${captions[f] ?? prettifyName(f)}"`).join(", "));
  }
}

main();

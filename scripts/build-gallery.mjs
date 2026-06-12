#!/usr/bin/env node
/*
 * build-gallery.mjs
 * -----------------
 * Looks at every picture inside the `images/` folder and rewrites the photo
 * gallery inside `index.html` so it shows all of them.
 *
 * You do NOT normally run this by hand. It runs automatically when changes are
 * published (see .github/workflows/deploy.yml). But running it locally is safe:
 *
 *     node scripts/build-gallery.mjs
 *
 * Nothing else in index.html is touched — only the bit between the two markers:
 *     <!-- GALLERY:START -->   ... gallery goes here ...   <!-- GALLERY:END -->
 *
 * HOW TO ADD A PHOTO: just drop an image file into the `images/` folder. The
 * file NAME becomes the caption, so name it something readable, e.g.
 *     2014-firelands-kill.jpg   ->   "Firelands Kill"
 * A leading date or number (like "2014-" or "01_") is used only for ordering
 * and is stripped from the caption. Files are shown in alphabetical order, so
 * prefix with 01-, 02-, ... if you want to control the order.
 *
 * OPTIONAL CAPTIONS: to set an exact caption, add an images/captions.json file:
 *     { "2014-firelands-kill.jpg": "When we finally killed Ragnaros (2014)" }
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = join(ROOT, "images");
const INDEX_HTML = join(ROOT, "index.html");
const CAPTIONS_FILE = join(IMAGES_DIR, "captions.json");

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"];
const START = "<!-- GALLERY:START -->";
const END = "<!-- GALLERY:END -->";

// Turn a file name into a friendly caption.
// "2014-firelands-kill.jpg" -> "Firelands Kill"
function prettifyName(file) {
  let name = basename(file, extname(file));
  // Drop a leading ordering prefix like "01-", "002_", "2014-07-" etc.
  name = name.replace(/^[\d]{1,4}([-_.][\d]{1,2}){0,2}[-_.\s]+/, "");
  name = name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!name) return "Photo";
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Escape text so it is safe to drop inside HTML.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function buildGalleryHtml(images, captions) {
  if (images.length === 0) {
    return `      <p class="gallery-empty">No photos yet — drop image files into the <code>images/</code> folder and they'll show up here automatically.</p>`;
  }
  const figures = images.map((file) => {
    const src = `images/${encodeURIComponent(file)}`;
    const caption = captions[file] ?? prettifyName(file);
    const safeCaption = escapeHtml(caption);
    return `        <figure>
          <a href="${src}" target="_blank" rel="noopener">
            <img src="${src}" alt="${safeCaption}" loading="lazy" />
          </a>
          <figcaption>${safeCaption}</figcaption>
        </figure>`;
  });
  return `      <div class="gallery-grid">\n${figures.join("\n")}\n      </div>`;
}

function main() {
  if (!existsSync(INDEX_HTML)) {
    console.error("❌ index.html not found — run this from the project root.");
    process.exit(1);
  }
  const html = readFileSync(INDEX_HTML, "utf8");
  const startIdx = html.indexOf(START);
  const endIdx = html.indexOf(END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.error(`❌ Could not find the gallery markers in index.html.\n   Expected "${START}" ... "${END}".`);
    process.exit(1);
  }

  const images = listImages();
  const captions = loadCaptions();
  const gallery = buildGalleryHtml(images, captions);

  const before = html.slice(0, startIdx + START.length);
  const after = html.slice(endIdx);
  const updated = `${before}\n${gallery}\n      ${after}`;

  if (updated === html) {
    console.log(`✅ Gallery already up to date (${images.length} photo(s)).`);
    return;
  }
  writeFileSync(INDEX_HTML, updated, "utf8");
  console.log(`✅ Gallery rebuilt with ${images.length} photo(s):`);
  images.forEach((f) => console.log(`   • ${f} → "${captions[f] ?? prettifyName(f)}"`));
}

main();

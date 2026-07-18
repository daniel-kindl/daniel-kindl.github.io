import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// Enforce target output directories
const metaDir = path.join(process.cwd(), 'public', 'assets', 'meta');

if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir, { recursive: true });

// Dark-theme palette — keep in sync with :root[data-theme='dark'] in src/styles/global.css
const COLOR_BG = '#0a0a0a'; // matches --bg-primary
const COLOR_BORDER = '#262626'; // matches --border-color
const COLOR_TEXT_ACCENT = '#a0a0a0'; // matches --text-muted
const COLOR_TEXT_PRIMARY = '#f5f5f5'; // matches --text-primary
const COLOR_CROSSHAIR_ACCENT = '#171717'; // decorative only, no CSS var equivalent

// Canvas layout constants
const FRAME_INSET = 10;
const FRAME_LINE_WIDTH = 2;
const CROSSHAIR_LINE_WIDTH = 1;
const FONT_SIZE_RATIO = 0.04;
const MIN_FONT_SIZE = 10;

function createImage(width, height, text, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background: Minimal Stark Dark-Mode Solid
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, width, height);

  // Structural Grid Frame accent
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = FRAME_LINE_WIDTH;
  ctx.strokeRect(FRAME_INSET, FRAME_INSET, width - FRAME_INSET * 2, height - FRAME_INSET * 2);

  // Blueprint crosshair indicator
  ctx.strokeStyle = COLOR_CROSSHAIR_ACCENT;
  ctx.lineWidth = CROSSHAIR_LINE_WIDTH;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Monospace Minimal Typography
  ctx.fillStyle = COLOR_TEXT_ACCENT;
  ctx.font = `bold ${Math.max(MIN_FONT_SIZE, Math.floor(width * FONT_SIZE_RATIO))}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[ASSET GEN]: Created ${path.relative(process.cwd(), outputPath)}`);
}

// 1. Meta / SEO Application Targets
createImage(192, 192, 'icon-192', path.join(metaDir, 'icon-192.png'));
createImage(512, 512, 'icon-512', path.join(metaDir, 'icon-512.png'));
createImage(1200, 630, 'DANIEL KINDL // OG_DEFAULT', path.join(metaDir, 'og-default.png'));
createImage(180, 180, 'DK', path.join(process.cwd(), 'public', 'apple-touch-icon.png'));

// 1b. Per-entry social share (OG) images for every project and writing post
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_MARGIN = 90;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] ?? '';

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

function extractTitle(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);
  const titleLine = frontmatter?.[1].match(/^title:\s*(.+)$/m);
  return titleLine?.[1].trim().replace(/^['"]|['"]$/g, '') ?? null;
}

function collectEntries(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const title = extractTitle(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return title ? { slug: file.replace(/\.md$/, ''), title } : null;
    })
    .filter((entry) => entry !== null);
}

function createEntryOgImage(kind, title, outputPath) {
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);

  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = FRAME_LINE_WIDTH;
  ctx.strokeRect(FRAME_INSET, FRAME_INSET, OG_WIDTH - FRAME_INSET * 2, OG_HEIGHT - FRAME_INSET * 2);

  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  ctx.fillStyle = COLOR_TEXT_ACCENT;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`[ ${kind.toUpperCase()} ]`, OG_MARGIN, 130);

  ctx.fillStyle = COLOR_TEXT_PRIMARY;
  ctx.font = 'bold 56px monospace';
  const lines = wrapText(ctx, title, OG_WIDTH - OG_MARGIN * 2);
  const lineHeight = 68;
  const startY = OG_HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, OG_MARGIN, startY + index * lineHeight);
  });

  ctx.fillStyle = COLOR_TEXT_ACCENT;
  ctx.font = 'bold 24px monospace';
  ctx.fillText('DANIEL KINDL', OG_MARGIN, OG_HEIGHT - 80);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[ASSET GEN]: Created ${path.relative(process.cwd(), outputPath)}`);
}

for (const [collection, kind] of [
  ['projects', 'project'],
  ['writing', 'writing'],
]) {
  const entriesDir = path.join(process.cwd(), 'src', 'content', collection);
  const outputDir = path.join(metaDir, 'og', collection);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const entry of collectEntries(entriesDir)) {
    createEntryOgImage(kind, entry.title, path.join(outputDir, `${entry.slug}.png`));
  }
}

// 2. Fallback SVGs / Favicons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="${COLOR_BG}"/><rect x="2" y="2" width="28" height="28" rx="4" stroke="${COLOR_BORDER}" stroke-width="2"/><text x="50%" y="55%" font-family="monospace" font-weight="bold" font-size="14" fill="${COLOR_TEXT_ACCENT}" dominant-baseline="middle" text-anchor="middle">DK</text></svg>`;
fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.svg'), svgContent);
console.log('[ASSET GEN]: Created public/icon.svg');

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// Enforce target output directories
const metaDir = path.join(process.cwd(), 'public', 'assets', 'meta');

if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir, { recursive: true });

function createImage(width, height, text, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background: Minimal Stark Dark-Mode Solid
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Structural Grid Frame accent
  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Blueprint crosshair indicator
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Monospace Minimal Typography
  ctx.fillStyle = '#a3a3a3';
  ctx.font = `bold ${Math.max(10, Math.floor(width * 0.04))}px monospace`;
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

// 2. Fallback SVGs / Favicons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#0a0a0a"/><rect x="2" y="2" width="28" height="28" rx="4" stroke="#262626" stroke-width="2"/><text x="50%" y="55%" font-family="monospace" font-weight="bold" font-size="14" fill="#a3a3a3" dominant-baseline="middle" text-anchor="middle">DK</text></svg>`;
fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.svg'), svgContent);
console.log('[ASSET GEN]: Created public/icon.svg');

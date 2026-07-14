# Daniel Kindl Portfolio

Production portfolio website built with Astro 7, TypeScript, Tailwind CSS 4, and selected Svelte 5 islands.

## Setup

`npm install` builds the native [`canvas`](https://www.npmjs.com/package/canvas) module (used by
`generate-assets.js`), which requires Cairo/Pango system libraries. On a fresh Debian/Ubuntu
machine, install them first:

```
sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

(GitHub Actions' `ubuntu-latest` runner has these preinstalled, which is why CI doesn't need this
step.) See the [`node-canvas` install guide](https://github.com/Automattic/node-canvas#installation)
for other platforms.

## Scripts

| Command             | Purpose                        |
| :------------------ | :----------------------------- |
| `npm run dev`       | Start local development server |
| `npm run typecheck` | Run Astro type checks          |
| `npm run lint`      | Run ESLint                     |
| `npm run build`     | Build static production output |
| `npm run preview`   | Preview built output           |

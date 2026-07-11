import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Highlight-start: Add your target live domain here
  site: 'https://daniel-kindl.github.io',
  // Highlight-end
  integrations: [sitemap(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});

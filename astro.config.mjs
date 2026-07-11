import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://daniel-kindl.github.io',
  integrations: [sitemap(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});

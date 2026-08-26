import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const hastScrollableTables = {
  name: 'scrollable-tables',
  element: {
    filter: ['table'],
    visit(node, context) {
      context.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabIndex: 0 },
        children: [],
      });
    },
  },
};

export default defineConfig({
  site: 'https://danielkindl.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    processor: satteri({ hastPlugins: [hastScrollableTables] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

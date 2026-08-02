import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Wraps prose tables in a focusable scroll container.
 *
 * `.prose table` used to carry `display: block` to get its own scrollbar, which
 * drops the table/row/cell roles assistive tech relies on. The wrapper restores
 * the semantics and makes the scroll region keyboard-reachable (WCAG 2.1.1) —
 * as static HTML, so it works without JS. `<pre>` needs no equivalent; Astro
 * already emits `tabindex="0"` on it.
 */
function rehypeScrollableTables() {
  const wrap = (node) => {
    if (!Array.isArray(node.children)) return;

    node.children = node.children.map((child) => {
      wrap(child);
      if (child.type !== 'element' || child.tagName !== 'table') return child;

      return {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabIndex: 0 },
        children: [child],
      };
    });
  };

  return (tree) => {
    wrap(tree);
  };
}

export default defineConfig({
  site: 'https://danielkindl.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    rehypePlugins: [rehypeScrollableTables],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

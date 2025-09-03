import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com', // TODO: replace with real domain
  base: '/blog',
  integrations: [mdx(), sitemap()],
});
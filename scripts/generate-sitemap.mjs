import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = process.cwd();
const distDir = path.resolve(projectRoot, 'dist');

const siteCfg = JSON.parse(await fs.readFile(path.resolve(projectRoot, 'site.config.json'), 'utf-8'));
const routes = JSON.parse(await fs.readFile(path.resolve(__dirname, 'prerender.routes.json'), 'utf-8'));

const siteUrl = (siteCfg.siteUrl || '').replace(/\/$/, '');
if (!siteUrl) {
  console.warn('[sitemap] siteUrl missing in site.config.json; writing sitemap with relative URLs.');
}

const now = new Date().toISOString();

function xmlEscape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

const urls = routes.map(r => {
  const loc = siteUrl ? siteUrl + r : r;
  const priority = r === '/' ? '1.0' : '0.6';
  return `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await fs.mkdir(distDir, { recursive: true });
await fs.writeFile(path.resolve(distDir, 'sitemap.xml'), xml, 'utf-8');
console.log('[sitemap] wrote dist/sitemap.xml');
console.log('[sitemap] completed successfully');
process.exit(0);

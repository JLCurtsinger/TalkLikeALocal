import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = process.cwd();
const distDir = path.resolve(projectRoot, 'dist');

// Discover all routes for sitemap (not just prerendered ones)
// Import the route discovery logic from discover-routes.mjs
const SOURCES = [
  { dir: 'src/data/states', base: 'states' },
  { dir: 'src/data/cultures', base: 'tribes' },
];

const VALID_EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.md', '.mdx', '.html']);

function toSlug(filename) {
  const name = filename.replace(/\.[^.]+$/, '');
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

async function listRoutes(rootDir, base) {
  try {
    const full = path.resolve(rootDir);
    const entries = await fs.readdir(full, { withFileTypes: true });
    const routes = [];

    for (const ent of entries) {
      if (ent.name.startsWith('.') || ent.name.startsWith('_')) continue;

      const fullPath = path.join(full, ent.name);

      if (ent.isDirectory()) {
        const subEntries = await fs.readdir(fullPath, { withFileTypes: true });
        for (const sub of subEntries) {
          if (sub.name.startsWith('.') || sub.name.startsWith('_')) continue;
          const ext = path.extname(sub.name);
          if (VALID_EXTS.has(ext)) {
            const slug = toSlug(sub.name);
            routes.push(`/${base}/${ent.name.toLowerCase()}/${slug}`);
          }
        }
      } else {
        const ext = path.extname(ent.name);
        if (!VALID_EXTS.has(ext)) continue;
        const slug = toSlug(ent.name);
        routes.push(`/${base}/${slug}`);
      }
    }

    return routes;
  } catch {
    return [];
  }
}

function dedupe(list) {
  return Array.from(new Set(list));
}

// Discover all routes for sitemap (not filtered)
const staticRoutes = [
  '/',
  '/cultural-terms',
  '/about',
  '/terms',
  '/privacy',
  '/support',
  '/impact',
  '/blog', // Blog index page
];

// Discover blog posts from the blog directory
async function discoverBlogPosts() {
  try {
    const blogPostsDir = path.resolve(projectRoot, 'blog/src/content/posts');
    const entries = await fs.readdir(blogPostsDir, { withFileTypes: true });
    const blogRoutes = [];
    
    for (const ent of entries) {
      if (ent.isFile() && ent.name.endsWith('.mdx')) {
        const slug = toSlug(ent.name);
        blogRoutes.push(`/blog/${slug}`);
      }
    }
    
    return blogRoutes;
  } catch (error) {
    console.warn('[sitemap] Could not discover blog posts:', error.message);
    return [];
  }
}

let discovered = [];
for (const src of SOURCES) {
  const routes = await listRoutes(src.dir, src.base);
  discovered = discovered.concat(routes);
}

const blogRoutes = await discoverBlogPosts();
const allRoutes = dedupe(staticRoutes.concat(discovered).concat(blogRoutes)).sort();

const siteCfg = JSON.parse(await fs.readFile(path.resolve(projectRoot, 'site.config.json'), 'utf-8'));

const siteUrl = (siteCfg.siteUrl || '').replace(/\/$/, '');
if (!siteUrl) {
  console.warn('[sitemap] siteUrl missing in site.config.json; writing sitemap with relative URLs.');
}

const now = new Date().toISOString();

function xmlEscape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

const urls = allRoutes.map(r => {
  const loc = siteUrl ? siteUrl + r : r;
  // Set priorities: homepage highest, blog posts medium-high, other pages medium
  let priority = '0.6';
  if (r === '/') {
    priority = '1.0';
  } else if (r.startsWith('/blog/')) {
    priority = '0.7';
  } else if (r === '/blog') {
    priority = '0.8';
  }
  return `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await fs.mkdir(distDir, { recursive: true });
await fs.writeFile(path.resolve(distDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`[sitemap] wrote dist/sitemap.xml with ${allRoutes.length} routes`);
console.log('[sitemap] completed successfully');
process.exit(0);

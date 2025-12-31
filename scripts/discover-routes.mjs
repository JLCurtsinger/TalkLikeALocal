import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('scripts/prerender.routes.json');

// Configure the directories you want to scan:
const SOURCES = [
  { dir: 'src/data/states', base: 'states' },
  { dir: 'src/data/cultures', base: 'tribes' },
];

// Acceptable page file extensions:
const VALID_EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.md', '.mdx', '.html']);

// Default critical routes allowlist (prerendered in CI)
const DEFAULT_CRITICAL_ROUTES = [
  '/',
  '/states/arizona',
  '/states/california',
  '/states/texas',
  '/states/florida',
  '/states/new-york',
  '/tribes/navajo',
  '/tribes/hopi',
  '/tribes/cherokee',
  '/cultural-terms',
];

// Helper: create a slug from a filename (strip ext, lowercase, spaces->hyphens)
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
        // Optional: support nested folders as /base/subdir (index.*) or /base/slug for leaf files
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
    // Directory missing is OK; return empty list
    return [];
  }
}

function dedupe(list) {
  return Array.from(new Set(list));
}

function filterRoutes(allRoutes, allowlist) {
  const allowlistSet = new Set(allowlist);
  return allRoutes.filter(route => allowlistSet.has(route));
}

async function main() {
  // Always include the homepage and static page routes
  const staticRoutes = [
    '/',
    '/cultural-terms',
    '/about',
    '/terms',
    '/privacy',
    '/support',
    '/impact',
  ];

  let discovered = [];
  for (const src of SOURCES) {
    const routes = await listRoutes(src.dir, src.base);
    discovered = discovered.concat(routes);
  }

  const allRoutes = dedupe(staticRoutes.concat(discovered)).sort();

  // Determine prerender mode
  const prerenderMode = process.env.PRERENDER_MODE || (process.env.NETLIFY === 'true' ? 'critical' : 'all');
  const isCriticalMode = prerenderMode === 'critical';

  let routesToPrerender = allRoutes;

  if (isCriticalMode) {
    // Check for PRERENDER_ROUTES override
    if (process.env.PRERENDER_ROUTES) {
      const overrideRoutes = process.env.PRERENDER_ROUTES.split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0);
      routesToPrerender = filterRoutes(allRoutes, overrideRoutes);
      console.log(`[routes] Using PRERENDER_ROUTES override: ${routesToPrerender.length} routes`);
    } else {
      // Use default critical allowlist
      routesToPrerender = filterRoutes(allRoutes, DEFAULT_CRITICAL_ROUTES);
      console.log(`[routes] Critical mode: filtering to ${routesToPrerender.length} critical routes`);
    }
  } else {
    console.log(`[routes] All mode: prerendering all ${allRoutes.length} routes`);
  }

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(routesToPrerender, null, 2), 'utf-8');
  console.log(`[routes] wrote ${OUT} with ${routesToPrerender.length} routes`);
}

main().then(() => {
  console.log('[discover-routes] completed successfully');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

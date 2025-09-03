// After Vite build, read dist/index.html, find <link rel="stylesheet" href="/assets/*.css">,
// concatenate those CSS files, and write a stable file at dist/styles.css.

import { readFile, writeFile } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

const distDir = resolve('dist');

async function findCssHrefs() {
  const html = await readFile(resolve(distDir, 'index.html'), 'utf8');
  const linkRe = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css)["'][^>]*>/gi;
  const hrefs = [];
  let m;
  while ((m = linkRe.exec(html))) {
    hrefs.push(m[1]);
  }
  // Keep only Vite assets (usually /assets/*.css)
  return hrefs.filter((h) => h.endsWith('.css'));
}

async function concatCss(files, outFile) {
  const out = createWriteStream(outFile);
  for (const href of files) {
    const p = resolve(distDir, href.replace(/^\//, ''));
    await pipeline(createReadStream(p), out, { end: false });
    out.write('\n/* ---- */\n');
  }
  out.end();
}

const hrefs = await findCssHrefs();
if (!hrefs.length) {
  console.warn('[expose-css] No CSS links found in dist/index.html');
  process.exit(0);
}
await concatCss(hrefs, resolve(distDir, 'styles.css'));
console.log(`[expose-css] Wrote dist/styles.css from: ${hrefs.join(', ')}`);

import { readFile } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

const distDir = resolve('dist');

async function findCssHrefs() {
  const html = await readFile(resolve(distDir, 'index.html'), 'utf8');
  const re = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css)["'][^>]*>/gi;
  const hrefs = [];
  let m;
  while ((m = re.exec(html))) hrefs.push(m[1]);
  return hrefs.filter(h => h.endsWith('.css'));
}

async function concatCss(hrefs, outFile) {
  const out = createWriteStream(outFile);
  for (const href of hrefs) {
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
console.log('[expose-css] completed successfully');
process.exit(0);
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();
const distDir = path.resolve(projectRoot, 'dist');
const previewPort = process.env.PRERENDER_PORT || '4173';
const baseUrl = `http://localhost:${previewPort}`;

async function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with code ${code}`))));
  });
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error('Preview server did not become ready in time');
}

function routeToOutPath(route) {
  if (route === '/' || route === '') return path.join(distDir, 'index.html');
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(distDir, clean, 'index.html');
}

async function killProcess(proc) {
  return new Promise((resolve) => {
    if (!proc || proc.killed) {
      resolve();
      return;
    }
    
    proc.on('exit', () => resolve());
    proc.kill('SIGTERM');
    
    // Force kill after 5 seconds if it doesn't exit gracefully
    setTimeout(() => {
      if (!proc.killed) {
        proc.kill('SIGKILL');
        resolve();
      }
    }, 5000);
  });
}

async function main() {
  await run('npm', ['run', 'build']);

  const previewProc = spawn('npx', ['vite', 'preview', '--port', previewPort, '--strictPort'], { stdio: 'inherit' });

  try {
    await waitForServer(`${baseUrl}/`);

    const routesPath = path.resolve(__dirname, 'prerender.routes.json');
    if (!(await fileExists(routesPath))) throw new Error('Missing scripts/prerender.routes.json');
    const routes = JSON.parse(await fs.readFile(routesPath, 'utf-8'));

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    for (const route of routes) {
      try {
        const url = `${baseUrl}${route}`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for Helmet-managed tags to show up in <head>
        // react-helmet-async adds data-rh="true" to managed tags
        await page.waitForSelector('head [data-rh="true"]', { timeout: 30000 }).catch(() => {});

        // Also wait until canonical matches the current route (best signal that GlobalSEO ran)
        const expectedCanonical = route === '/' 
          ? 'https://talklikealocal.org/' 
          : `https://talklikealocal.org${route.replace(/\/$/, '')}`;

        await page.waitForFunction(
          (href) => {
            const el = document.querySelector('head link[rel="canonical"]');
            return el && el.getAttribute('href') === href;
          },
          { timeout: 30000 },
          expectedCanonical
        ).catch(() => {});

        // Tiny grace period to let any queued Helmet updates flush
        await new Promise(resolve => setTimeout(resolve, 200));

        // now serialize the final HTML
        const html = await page.content();

        const outPath = routeToOutPath(route);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, html, 'utf-8');
        console.log(`[prerender] wrote ${outPath}`);
      } catch (err) {
        console.warn(`[prerender] failed for "${route}": ${err?.message || err}`);
      }
    }

    await browser.close();
  } finally {
    await killProcess(previewProc);
  }
}

main().then(() => {
  console.log('[prerender] completed successfully');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

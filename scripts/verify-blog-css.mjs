import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
async function exists(p){ try { await stat(p); return true; } catch { return false; } }
const ok = await exists(resolve('dist','styles.css'));
console.log(ok ? '[verify-blog-css] dist/styles.css present ✅' : '[verify-blog-css] dist/styles.css MISSING ❌');
console.log('[verify-blog-css] completed successfully');
process.exit(0);

import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const baseUrl = new URL(process.argv[2] ?? process.env.DEPLOY_URL ?? 'http://127.0.0.1:8787');
const directory = new URL('../dist/', import.meta.url);
const attempts = baseUrl.hostname.endsWith('.workers.dev') ? 30 : 5;
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': /(?:application|text)\/javascript/,
  '.png': 'image/png',
  '.svg': 'image/svg\\+xml',
};

async function verifyFile(path) {
  const expected = await readFile(new URL(path, directory));
  const url = new URL(path === 'index.html' ? '/' : `/${path}`, baseUrl);

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, 200, `Unexpected status for ${url}`);
      if (path === 'index.html') {
        const noindex = /\bnoindex\b/i.test(response.headers.get('x-robots-tag') ?? '');
        assert.equal(noindex, baseUrl.hostname.endsWith('.workers.dev'), 'Unexpected indexing policy');
      }
      const contentType = contentTypes[extname(path)];
      if (contentType) {
        assert.match(response.headers.get('content-type') ?? '', new RegExp(contentType));
      }
      const actual = Buffer.from(await response.arrayBuffer());
      assert.ok(actual.equals(expected), `Deployed content differs from the build: ${url}`);
      console.log(`PASS ${url.pathname}`);
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await setTimeout(2000);
    }
  }
}

async function verifyDirectory(relativePath = '') {
  for (const entry of await readdir(new URL(relativePath, directory), { withFileTypes: true })) {
    const path = join(relativePath, entry.name);
    if (entry.isDirectory()) {
      await verifyDirectory(`${path}/`);
    } else if (entry.isFile()) {
      if (path === 'index.html' || path === '_headers') continue;
      await verifyFile(path);
    }
  }
}

await verifyFile('index.html');
await verifyDirectory();
const missing = await fetch(new URL('/__wayf_smoke_missing__', baseUrl), {
  signal: AbortSignal.timeout(5000),
});
assert.equal(missing.status, 404, 'Unknown paths must return 404');
console.log('PASS unknown path returns 404');

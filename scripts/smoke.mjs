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
  '.xml': /(?:application|text)\/xml/,
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

async function withRetry(check) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await check();
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await setTimeout(2000);
    }
  }
}

async function verifyFile(path) {
  const expected = await readFile(new URL(path, directory));
  const url = new URL(path === 'index.html' ? '/' : `/${path}`, baseUrl);

  await withRetry(async () => {
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
    // Cloudflare can prepend managed crawler rules to the site's robots.txt.
    const matches = path === 'robots.txt' && baseUrl.hostname === 'wayf.cz'
      ? actual.toString('utf8').endsWith(expected.toString('utf8'))
      : actual.equals(expected);
    assert.ok(matches, `Deployed content differs from the build: ${url}`);
    console.log(`PASS ${url.pathname}`);
  });
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
await withRetry(async () => {
  const response = await fetch(new URL('/sitemap.xml', baseUrl), {
    redirect: 'manual',
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 200, 'Sitemap must be served directly without a redirect');
  assert.equal(response.headers.get('location'), null, 'Sitemap must not have a redirect target');
  const xml = await response.text();
  assert.match(xml, /<urlset\b/, 'Sitemap must contain page URLs');
  assert.match(xml, /<loc>https:\/\/wayf\.cz\/<\/loc>/, 'Sitemap must include the canonical homepage');
  assert.doesNotMatch(xml, /<sitemapindex\b/, 'Sitemap must not be an index');
});
console.log('PASS sitemap.xml serves page URLs directly');
for (const path of ['/__wayf_smoke_missing__', '/sitemap-index.xml', '/sitemap-0.xml']) {
  await withRetry(async () => {
    const response = await fetch(new URL(path, baseUrl), {
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(response.status, 404, `Removed or unknown path must return 404: ${path}`);
  });
  console.log(`PASS ${path} returns 404`);
}

if (baseUrl.hostname === 'wayf.cz') {
  const path = '/__wayf_https_check__?source=smoke&value=a%2Fb';
  await withRetry(async () => {
    const response = await fetch(`http://wayf.cz${path}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });
    assert.ok([301, 308].includes(response.status), 'HTTP must permanently redirect to HTTPS');
    assert.equal(response.headers.get('location'), `https://wayf.cz${path}`, 'HTTPS redirect must preserve path and query');
  });
  console.log('PASS HTTP permanently redirects to HTTPS');
}

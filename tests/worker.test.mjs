import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../src/worker.ts';

test('www permanently redirects every path to HTTPS apex with query intact', async () => {
  const env = { ASSETS: { fetch() { assert.fail('Redirect must run before assets'); } } };
  for (const protocol of ['http:', 'https:']) {
    for (const path of ['/', '/favicon.svg', '/sitemap.xml', '/missing/a%2Fb?source=smoke&value=a%2Fb&value=c+d']) {
      const response = await worker.fetch(new Request(`${protocol}//www.wayf.cz${path}`), env);
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('location'), `https://wayf.cz${path}`);
    }
  }
});

test('apex, preview and local requests retain the asset response', async () => {
  for (const origin of ['https://wayf.cz', 'https://pr-21-wayf-cz.pvpvpv.workers.dev', 'http://127.0.0.1:8787']) {
    for (const status of [200, 404]) {
      const request = new Request(`${origin}/page?value=a%2Fb`);
      const expected = new Response('asset', { status, headers: { 'x-robots-tag': 'noindex' } });
      const env = { ASSETS: { fetch(actual) {
        assert.equal(actual, request);
        return expected;
      } } };
      assert.equal(await worker.fetch(request, env), expected);
    }
  }
});

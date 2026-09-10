import assert from 'node:assert/strict';
import test from 'node:test';
import { renderSummary } from './lighthouse-summary.mjs';

const url = 'https://pr-3-wayf-cz.pvpvpv.workers.dev/';
const entry = { url, isRepresentativeRun: true,
  summary: { performance: 0.799, accessibility: 1, 'best-practices': 1, seo: 1 } };

test('flags scores below the actual threshold before rounding', () => {
  assert.match(renderSummary([entry], url), /⚠️ 80 \| 100 \| 100 \| 100/);
});

test('missing or corrupt reports cannot appear as passing results', () => {
  for (const manifest of [null, [], [{ ...entry, summary: {} }],
    [{ ...entry, summary: { ...entry.summary, performance: null } }],
    [{ ...entry, isRepresentativeRun: false }], [entry, entry]]) {
    assert.throws(() => renderSummary(manifest, url));
  }
  assert.throws(() => renderSummary([entry], 'https://wayf.cz/'));
});

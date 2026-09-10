import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import config from '../../lighthouserc.cjs';

const categories = [
  ['performance', 'Výkon'],
  ['accessibility', 'Přístupnost'],
  ['best-practices', 'Best practices'],
  ['seo', 'SEO'],
];

export function renderSummary(manifest, expectedUrl) {
  assert.ok(Array.isArray(manifest), 'Lighthouse manifest must be an array');
  const rows = manifest.filter((entry) => entry?.isRepresentativeRun === true);
  assert.equal(rows.length, 1, 'Expected one representative Lighthouse run');
  const row = rows[0];
  assert.equal(row.url, expectedUrl, 'Lighthouse measured an unexpected URL');
  const cells = categories.map(([key]) => {
    const score = row.summary?.[key];
    assert.ok(typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 1,
      `Missing or invalid Lighthouse score: ${key}`);
    const threshold = config.ci.assert.assertions[`categories:${key}`][1].minScore;
    return `${score < threshold ? '⚠️ ' : ''}${Math.round(score * 100)}`;
  });
  const thresholds = categories.map(([key, label]) =>
    `${label} ≥ ${Math.round(config.ci.assert.assertions[`categories:${key}`][1].minScore * 100)}`);
  return [
    '**Lighthouse — homepage, mobilní emulace, 1 běh**', '',
    '| Výkon | Přístupnost | Best practices | SEO |',
    '| --- | --- | --- | --- |',
    `| ${cells.join(' | ')} |`, '',
    `Informativní prahy: ${thresholds.join(', ')}. Nízké skóre neblokuje merge.`,
    'Audit indexovatelnosti je vynechaný, protože preview má záměrně noindex; tuto hlavičku ověřuje smoke.', '',
  ].join('\n');
}

if (import.meta.main) {
  const manifest = JSON.parse(await readFile('reports/lighthouse/manifest.json', 'utf8'));
  const markdown = renderSummary(manifest, config.ci.collect.url[0]);
  await mkdir('reports', { recursive: true });
  await writeFile('reports/lighthouse-summary.md', markdown);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  process.stdout.write(markdown);
}

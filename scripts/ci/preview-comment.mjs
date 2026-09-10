import { readFile, writeFile } from 'node:fs/promises';

const { PREVIEW_URL, HEAD_SHA, RUN_URL, PREVIEW_RESULT, LIGHTHOUSE_RESULT, ARTIFACT_URL } = process.env;
const lines = [
  '<!-- ci-preview -->',
  `### Review app · commit \`${HEAD_SHA.slice(0, 7)}\``, '',
];

if (PREVIEW_RESULT === 'success') {
  lines.push(`**Náhled: [${PREVIEW_URL}](${PREVIEW_URL})**`, 'Nasazení a smoke kontrola aktuálního buildu prošly.');
} else if (PREVIEW_RESULT === 'pending') {
  lines.push('Review app se připravuje. Předchozí náhled nemusí odpovídat tomuto commitu.');
} else {
  lines.push(`⚠️ Review app pro tento commit není ověřená (${PREVIEW_RESULT}). Předchozí náhled může být zastaralý.`);
}
lines.push('');

if (LIGHTHOUSE_RESULT === 'success') {
  try {
    lines.push(await readFile('reports/lighthouse-summary.md', 'utf8'));
  } catch {
    lines.push('⚠️ Lighthouse doběhl, ale souhrnný artifact není dostupný. Výsledky jsou v detailu CI.');
  }
} else if (LIGHTHOUSE_RESULT === 'pending') {
  lines.push('Lighthouse kontroly běží; skóre se doplní po jejich dokončení.');
} else {
  lines.push(`⚠️ Lighthouse nemá kompletní výsledek (${LIGHTHOUSE_RESULT}). Podrobnosti jsou v detailu CI.`);
}
lines.push('', `[Detail CI a reporty](${RUN_URL})`);
if (ARTIFACT_URL) lines.push(`[Stáhnout Lighthouse HTML/JSON reporty](${ARTIFACT_URL})`);
lines.push('', 'Preview je veřejné, má noindex a nemění produkční nasazení.');
await writeFile('comment.md', `${lines.join('\n')}\n`);

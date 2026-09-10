// Match dotidot-com: one mobile run, informative thresholds, local report storage.
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:8787';

module.exports = {
  ci: {
    collect: {
      url: [new URL('/', origin).href],
      numberOfRuns: 1,
      settings: {
        // Preview noindex is verified by smoke; production remains indexable.
        skipAudits: ['is-crawlable'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'reports/lighthouse' },
  },
};

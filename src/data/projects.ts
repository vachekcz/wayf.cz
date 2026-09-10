export const projects = [
  {
    name: 'Bertička',
    category: 'Jídlo',
    description: 'Jídelníček, recepty a přehled o tom, co jíš. Pomocník pro stravování podle tvých cílů.',
    url: 'https://berticka.com',
    domain: 'berticka.com',
    icon: 'food',
  },
  {
    name: 'Arnoldek',
    category: 'Pohyb',
    description: 'Osobní fitness pomocník pro plánování tréninků podle tvých cílů a vybavení.',
    url: 'https://arnoldek.com',
    domain: 'arnoldek.com',
    icon: 'movement',
    note: 'Používání vyžaduje přihlášení e-mailem.',
  },
  {
    name: 'Why We Decide',
    category: 'Sebepoznání',
    description: 'Morální dilemata pro lepší pochopení vlastního rozhodování. Objev motivace, které stojí za tvými volbami.',
    url: 'https://whywedecide.com',
    domain: 'whywedecide.com',
    icon: 'reflection',
    note: 'Web je ve výstavbě.',
  },
] as const;

export type Project = (typeof projects)[number];

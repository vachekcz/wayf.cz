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
    name: 'El Pip',
    category: 'Obsah',
    description: 'Nová videa z vybraných YouTube kanálů na jednom místě. Vybírej si obsah podle sebe.',
    url: 'https://elpip.com',
    domain: 'elpip.com',
    icon: 'video',
  },
  {
    name: 'Khakham',
    category: 'Na cestách',
    description: 'Najdi veřejné WC ve svém okolí. Mapa, filtry a navigace, když je potřebuješ.',
    url: 'https://khakham.com',
    domain: 'khakham.com',
    icon: 'location',
  },
] as const;

export type Project = (typeof projects)[number];

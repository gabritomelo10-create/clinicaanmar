// Conteúdo da marca ANMAR — textos do Guia "Plenitude", paleta oficial e
// arquivos publicados na pasta da marca no Google Drive (acesso público).

export const PALETTE = [
  { name: 'Marfim',  hex: '#F7F1E5', rgb: '247 · 241 · 229', cmyk: '3 · 4 · 7 · 0',     role: 'Base, respiro e luz.' },
  { name: 'Areia',   hex: '#DCD0B8', rgb: '220 · 208 · 184', cmyk: '12 · 13 · 24 · 0',  role: 'Linho, pedra e acolhimento.' },
  { name: 'Dourado', hex: '#B49A62', rgb: '180 · 154 · 98',  cmyk: '23 · 31 · 67 · 6',  role: 'O símbolo. Valor e calor.' },
  { name: 'Taupe',   hex: '#655B49', rgb: '101 · 91 · 73',   cmyk: '57 · 56 · 72 · 18', role: 'Assinatura, texto e firmeza.' },
];

export const PILLARS = [
  { n: '01', t: 'Deus',     d: 'Sentido e valores.',        icon: 'M32 6v52M14 22h36' },
  { n: '02', t: 'Saúde',    d: 'Base para a autonomia.',    icon: 'M32 54C10 40 6 26 14 17c6-7 14-5 18 2 4-7 12-9 18-2 8 9 4 23-18 37Z' },
  { n: '03', t: 'Família',  d: 'Vínculos e presença.',      icon: 'M22 26a8 8 0 1 0 0-.1M42 26a8 8 0 1 0 0-.1M8 54c2-10 8-15 14-15s12 5 14 15M28 54c2-10 8-15 14-15s12 5 14 15' },
  { n: '04', t: 'Trabalho', d: 'Realização e contribuição.', icon: 'M10 50 26 30l10 10 18-24M44 16h10v10' },
];

// Imagem pública do Drive → URL redimensionada pelo próprio Google.
export const driveImg = (id, w = 1600) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;
export const driveThumb = (id, w = 1600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
export const driveView = (id) => `https://drive.google.com/file/d/${id}/view`;
export const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview`;

export const CATEGORIES = [
  { id: 'all',       label: 'Todos' },
  { id: 'papelaria', label: 'Papelaria' },
  { id: 'uniformes', label: 'Uniformes' },
  { id: 'brindes',   label: 'Brindes' },
  { id: 'ambiente',  label: 'Ambiente' },
  { id: 'digital',   label: 'Digital' },
];

export const MOCKUPS = [
  { id: '19ro04rgEJWL4_TNFRMqjrgA-ZKu07r61', cat: 'papelaria', name: 'Cartão de visita',     spec: '90 × 50 mm · frente com camadas, verso taupe', featured: true },
  { id: '1OS0K6F0x5Xj4cipU2D7LnSfVcA2NO2yO', cat: 'papelaria', name: 'Papel timbrado',       spec: 'A4 · recorte restrito ao rodapé' },
  { id: '1UG4U157axqpPqqjUy3Fx_PRDxCmbLHTI', cat: 'papelaria', name: 'Envelope DL',          spec: '220 × 110 mm · marca na aba' },
  { id: '1niPjMKbsx6w7ueXxedThT14YjkSJDr0y', cat: 'papelaria', name: 'Pasta A4',             spec: '230 × 320 mm · recorte monumental', featured: true },
  { id: '1ffN3kqaaTwWK9rxnekBn5pjF6PDDYV0f', cat: 'papelaria', name: 'Crachá',               spec: '54 × 86 mm · institucional' },
  { id: '1Uhk9kUdUGxjC9v-l_ck1k6PxRl9zrE1n', cat: 'papelaria', name: 'Crachá · marca vertical', spec: '54 × 86 mm · assinatura longitudinal' },
  { id: '1TLYBRlCQG2W-TazlEepuoSUzlk21bZ5P', cat: 'papelaria', name: 'Cordão de crachá',     spec: '20 × 900 mm · sublimação taupe e marfim' },
  { id: '1N8lR5HQ05YDDwjKI_QFwA6Siim4MiJZC', cat: 'papelaria', name: 'Display de mesa',      spec: 'A6 · lâmina para suporte' },
  { id: '19AuRHVEOY6rNiUQPB56BvzJYuTPhnU4t', cat: 'papelaria', name: 'Adesivo',              spec: 'Ø 60 mm · corte circular' },
  { id: '1OoOhvNd0t_cgG-Wd17uE9dr4aoQB0soD', cat: 'papelaria', name: 'Caneta',               spec: 'Tampografia marfim sobre taupe' },
  { id: '1WZuHtZm17gFXCjQiO1NZsSWjKgNwtdPy', cat: 'papelaria', name: 'Caneta · marca vertical', spec: '7 × 45 mm · monograma e nome' },
  { id: '1QBJIGsGxDqXKv5EHGml671wX_GusadKe', cat: 'uniformes', name: 'Jaleco',               spec: 'Bordado no peito · 70 mm', featured: true },
  { id: '1mcJC5-hGiFk1q6tmcquYSoo5WvwxbEUV', cat: 'uniformes', name: 'Scrub',                spec: 'Bordado no peito · 70 mm' },
  { id: '1xo7J3KtbRSRcpYxh7g6R-PhGqm3jbSpM', cat: 'uniformes', name: 'Bordado',              spec: 'Símbolo reduzido · 35 mm' },
  { id: '1vhAmCkMpadPbIcumnjVpVQIUqbvCexFg', cat: 'brindes',   name: 'Caderno A5',           spec: 'Pattern tonal, sem relevo', featured: true },
  { id: '1DnIIEb7mJyRFg4l9lx6R19KI3H5mGQIp', cat: 'brindes',   name: 'Ecobag',               spec: 'Aplicação 200 × 220 mm · tecido marfim' },
  { id: '1N9Wsba94oCWtKMXXG0B3WjMzMjXXf7DF', cat: 'brindes',   name: 'Garrafa',              spec: 'Área frontal 60 × 85 mm' },
  { id: '1xCqEYvxy7dSx3FXkJUgIPocG0vXAJp-P', cat: 'brindes',   name: 'Sacola',               spec: 'Aplicação 160 × 180 mm' },
  { id: '1MS-OwjG19pmPS35nEVydu-g1WT4r_JHe', cat: 'ambiente',  name: 'Fachada',              spec: 'Letra-caixa 1000 mm · película 4000 × 500 mm', featured: true },
  { id: '1XfG_m-WmmAsbgU8hq9f2UBCkK6RDvilf', cat: 'ambiente',  name: 'Recepção',             spec: 'Painel 2400 × 2800 mm · logo 800 mm', featured: true },
  { id: '1ZOefw1030mqX8EtG68Bbu0chRLXYfe0Y', cat: 'ambiente',  name: 'Placas',               spec: '200 × 80 mm · recepção, consultório, atendimento' },
  { id: '1zNeoR0LazGRuEjHwtgS5R7NXeBhk7b5d', cat: 'ambiente',  name: 'Totem',                spec: '650 × 2200 mm' },
  { id: '1qCznIn9E1XboqPtvsviQAWlqmpEWZh6h', cat: 'ambiente',  name: 'Painel do estande',    spec: '4000 × 2500 mm' },
  { id: '1x6KYVKsjQ2M0NEiApeCK0p1wG10fbrZ-', cat: 'ambiente',  name: 'Expositor',            spec: 'Frente 800 × 800 mm · lateral 450 × 800 mm' },
  { id: '1CMbST6x71YHpP-nHhoJhEC4fRgViHHhH', cat: 'digital',   name: 'Site',                 spec: 'Proposta visual da home' },
  { id: '1Usau0Cr0_EPwcPKrvA8T5StbicDU7Bsx', cat: 'digital',   name: 'Stories',              spec: '1080 × 1920 px · modelos editáveis' },
  { id: '1fgHsUpHflnk9gLtKkLW3oEHul7uDrTQR', cat: 'digital',   name: 'Posts',                spec: '1080 × 1350 px · modelos editáveis' },
];

export const PATTERNS = [
  { id: '1wLMPiRrH83Ykd7c5Hg67fsHUhQCPaJVq', name: 'Recorte Monumental', d: 'O símbolo ampliado e recortado pelo formato. Escala que impõe presença.' },
  { id: '1E84qU4yDgUmZ19xmJfEbipJf6VgCrRc-', name: 'Camadas Translúcidas', d: 'As curvas se sobrepõem em transparência — tempo, histórias e cuidado em camadas.' },
  { id: '1IQ6ubEXE2b5sPToBiISlnHrVUKoVMQc2', name: 'Tonal Fundo Escuro', d: 'Tom sobre tom, para superfícies sóbrias e acabamentos nobres.' },
];

export const PHOTOS = {
  hero: '1dHza-m1neKVgICu0DM5gnqdh9OeRYa6n',
  textura: '1tM50y1sFn45S9FhiG9KAiynwuylOSg8V',
  fundoTaupe: '1BK-I1Pm5PT6yWEmuj-sisFuDBYO0rHPX',
  referencia: '15DVBBjQ8KKuxgj7CWnWxQ6TtNQDODw5Q',
  siteDesktop: '1jvUx8rap7q_jFlV1n3XvDC5n8zZaKLyS',
  perfil: '1J9G9ordrsZOakMEKBLKN0hBa1Z1Y-PWr',
};

export const STORIES = ['12GN9bhbbbsV3TGYRGZSbKFuS5wonkxKi', '13DOFwyqlYd0CMBD-rcfAsnVuPx5vyPO4', '1OGqe5MNYPqFh2nXbdKdcOvcYKy7zhiKS'];
export const POSTS = ['1yhn5ywOilsi-LzhmxCiIsSEACKnBQwyD', '15BCrSYL_snV3DtoQJnZpw3jvUzVdDRsk', '1ymxrx_s1rnCbR6R_qDdVCcWBqPQ3LgNY'];
export const HIGHLIGHTS = [
  { id: '1lOKRdn-mBestgm9cZ_KhinMd9070vBSO', name: 'Clínica' },
  { id: '1q-u7Ys1xckIjtqGr5JHFRRCxKzSMRjYN', name: 'Cuidado' },
  { id: '1XVjkDZACMinCuo4HaNrKB6NCZRP9ODT0', name: 'Longevidade' },
  { id: '1FxfF9kCGkYIXxpOSkxiNcqarRmkdC5bX', name: 'Plenitude' },
  { id: '1Afz545c9pH11SLMlQOL-LNYpM3S08lgV', name: 'Equipe' },
  { id: '15SDZiCSRoHBKkeEnaLmjn9bZEEW_H6ih', name: 'Dúvidas' },
  { id: '1acLsHStfeLXwptn0Q-i1mnhSV7xhiTYw', name: 'Contato' },
];

export const VIDEOS = [
  { id: '1l9dZJ62w8VJl15fUZpqXRg1QKAcnEnpu', name: 'Letras que formam a marca', d: 'As letras se transformam até desenhar a assinatura.' },
  { id: '1egnoNRrqGOuGg23_7awjXP6nA4Pw94Xx', name: 'Logo com morphing de texto', d: 'Transição entre símbolo e nome.' },
  { id: '1MGoCej9qvuk-4rofI0AjGVJOCN1ATKF_', name: 'Revelação com câmera', d: 'Abertura para redes sociais.' },
];

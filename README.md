# ANMAR · Brandbook interativo

Apresentação interativa da marca **Clínica ANMAR — “Plenitude”**, feita a partir do Guia da Marca e dos arquivos da pasta oficial no Google Drive.

## Seções

1. **Herói 3D** — o símbolo AM extrudado em dourado metálico (Three.js), com luz que segue o mouse, partículas em profundidade (bokeh) e rotação por arraste.
2. **Manifesto** — o texto acende palavra a palavra conforme a rolagem.
3. **O conceito** — sequência fixada na rolagem: *Ângelo* + *Marina* → **ANMAR** → **AMAR** → o símbolo se desenha.
4. **Construção do símbolo** — grade, guias, contorno, preenchimento e assinatura, passo a passo.
5. **Essência** — os quatro pilares (Deus, Saúde, Família, Trabalho) em cards com inclinação 3D e luz no hover.
6. **Assinatura** — versões principal, negativa, monocromática e símbolo, com área de proteção e download do SVG.
7. **Paleta** — Marfim, Areia, Dourado e Taupe (HEX, RGB, CMYK); clique para copiar.
8. **Tipografia** — Baskerville e Inter, com testador ao vivo.
9. **Texturas** — pattern “Camadas Translúcidas” gerado em tempo real a partir do símbolo (paralaxe com o mouse) + os patterns oficiais.
10. **Showroom 3D** — mockups refeitos em 3D: cartão de visita (vira), caderno (abre), garrafa (gira), crachá e cordão (balança e vira) e fachada letra-caixa (acende a iluminação noturna).
11. **Aplicações** — carrossel horizontal com os mockups em destaque e galeria completa (27 mockups oficiais) com filtros e lightbox.
12. **Digital** — stories em celular 3D, destaques, feed e a proposta do site num notebook.
13. **Marca em movimento** — as animações da marca (vídeos do Drive).

## Como rodar

Os scripts usam módulos ES, então o site precisa ser servido por HTTP (abrir o `index.html` direto do disco não funciona):

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Também funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Arquivos

- `index.html`, `css/style.css` — estrutura e estilo.
- `js/main.js` — interações, rolagem suave (Lenis) e animações (GSAP + ScrollTrigger).
- `js/hero3d.js`, `js/showroom.js`, `js/three-common.js`, `js/textures.js` — cenas 3D (Three.js).
- `js/brand-paths.js` — vetores oficiais do símbolo e da assinatura (extraídos de `Logo_principal_EDITAVEL.svg`).
- `js/data.js` — paleta, pilares e IDs dos arquivos do Drive.
- `assets/` — logos em SVG.

## Observações

- Os mockups, patterns e peças digitais são carregados diretamente da pasta do Google Drive, que está compartilhada como “qualquer pessoa com o link”. Se o compartilhamento for removido, as imagens dão lugar a um marcador com o símbolo.
- Bibliotecas por CDN: Three.js 0.160, GSAP 3.12.5, Lenis 1.1.13 e Google Fonts (Libre Baskerville como substituta web da Baskerville, e Inter).
- Respeita `prefers-reduced-motion`.

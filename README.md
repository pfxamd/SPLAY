# SPLAY — Experimental Type Foundry

A complete, independent typographic concept website for **pfxamd**. An original graphic world, experimental variable typography, 12 interactive poster studies and a live poster-making workshop.

## What's inside

- 10 static routes, including 3 dedicated interactive type specimens.
- A cursor-responsive typographic hero and distinct editorial compositions.
- **SHIFT** — an experiment with Anybody (width and weight).
- **FLUX** — an experiment with Recursive (casual, mono, weight and slant).
- **INK** — an experiment with Fraunces (softness, weight, optical size and wonky forms).
- A live editable type playground, with custom per-axis controls and randomized experiments.
- 12 authored typographic poster compositions: Impact, Echo, Fold and Drift.
- An interactive browser-only poster studio with size, family, axis, composition and palette controls.
- PNG export (1080×1350, 2400×3000, 1920×1080), Undo/Redo and shareable links.
- Responsive layouts, keyboard-aware controls, no tracking, no accounts and reduced-motion support.
- No photography, external JS runtimes or third-party design templates.

## Run locally

Node.js 22+ recommended. No install and no build are required.

```sh
npm run dev
```

Open **http://127.0.0.1:8078/SPLAY/**.

Run focused static checks:

```sh
npm run check
```

The complete prerendered website is committed under `docs/`. Pages, styles and interaction code run directly in the browser without a JS bundler.

## Publish (manual opt-in)

The live GitHub Pages site uses **Deploy from a branch → main → /docs**. Pushing main publishes automatically. No custom workflow or manual Actions dispatch is required. Fonts and the favicon are served from the verified central R2 library; original binaries remain outside docs in `source-media/`.

## Original work and typeface credits

SPLAY, SHIFT, FLUX and INK are **names of original visual experiments**, not derivative font products. The fonts themselves are from independent designers, credited below and on `/credits/`.

| Typeface | Designer | Source | License |
| --- | --- | --- | --- |
| Anybody | Tyler Finck / Etcetera Type Co. | https://github.com/Etcetera-Type-Co/Anybody | SIL OFL 1.1 |
| Recursive | Stephen Nixon / Arrow Type | https://github.com/arrowtype/recursive | SIL OFL 1.1 |
| Fraunces | Phaedra Charles & Flavia Zimbardi / Undercase Type | https://github.com/undercasetype/Fraunces | SIL OFL 1.1 |

Original font license notices are included in `licenses/`. Actual bundled fonts come from the source projects: Google Fonts for Anybody/Fraunces and the Recursive project's official English-basic variable-font WOFF2 subset.

## Important implementation notes

- All site code is client-side and static; edited text stays in the visitor's browser.
- Share links encode editable poster design parameters in the URL. No upload or remote storage occurs.
- PNG export uses browser Canvas typography with the actual loaded font families. Browser Canvas support for custom nonstandard variable-font axes is inconsistent: exports reproduce the overall art direction, but exact glyph-axis interpolation may differ from the DOM preview on some browsers. There is no claim of print-production certification.
- The sample poster gallery and site are a fictional concept studio, not an online typeface store.
- The dedicated mobile experience uses regular scrolling, accessible buttons and touch-friendly controls; pointer motion is optional.

## Structure

```
docs/                 Static pages and browser-ready site
docs/assets/site.css  Authored art direction and layouts
docs/assets/site.js   Interaction engine, specimens and poster maker
source-media/         Original variable fonts and favicon (outside publication)
tools/serve.mjs       Local /SPLAY/ test server
tools/check.mjs       Focused route/assets/source validation
licenses/             Original font license notices
```

© 2026 SPLAY — Designed & developed by [pfxamd](https://www.pfxamd.com).

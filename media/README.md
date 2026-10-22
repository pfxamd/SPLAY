# Central SPLAY assets

This project has no photographs: its original visual assets are three variable fonts and the SVG favicon. Their byte-identical copies are served from `https://media.pfxamd.com/pfxamd/concepts/splay/`.

Original binaries remain in `source-media/`, outside the deployed docs folder. Original license notices stay in `licenses/` and attribution stays on the credits page. The manifest records original archive paths, new source paths, byte sizes and SHA-256; verification records matching public HTTPS downloads. R2 CORS permits cross-origin font loading.

Only font URLs in CSS and favicon URLs in HTML changed. All CSS rules, font descriptors, page markup, authored posters, JavaScript and PNG export logic remain unchanged. The existing branch-based Pages configuration automatically publishes main/docs after pushing; no Actions workflow is manually started or added.

Upload and verify new originals before switching URLs. Run `npm run check`, test all three font families and PNG export. No Cloudflare credentials are stored in this repository.

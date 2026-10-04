# BMG Website V2

Static refactor of the BMG Myanmar website following the agreed
Information Architecture, sitemap and naming convention.

## Structure
- `/` Home (`index.html`)
- `/services/` + 5 service pages (music-distribution, youtube-monetization,
  content-id-protection, music-video-distribution, publishing-administration)
- `/artists/` index + `artist-profile.html` (template, populated with Project K), example-artist.html, example-band.html. Future per-artist URLs like `/artists/project-k.html` follow the same naming rules.
- `/resources/` index + categories: spotify/, youtube/, copyright/, industry-insights/ with articles
- `/about/` index, partners.html, careers.html
- `/contact/` form page
- `/sitemap.html`, `/sitemap.xml`, `/robots.txt`, `/favicon.ico`
- Reserved areas (coming soon): `/academy/`, `/mmdb/`, `/copyright-center/`, `/artist-portal/`
- `/assets/css/` layered stylesheets: bootstrap.min.css → bmg.css → components.css → utilities.css
- `/assets/js/` navigation.js + app.js (deferred, no dependencies)

## Naming convention enforced
lowercase · hyphens · no spaces/underscores · no dates/versions in filenames ·
no "bmg" repetition in page filenames (the domain carries the brand).

## Notes
- `bootstrap.min.css` is a placeholder stub — drop in the official Bootstrap 5.3 minified build.
- Relative links work from every folder depth; navigation.js resolves active state path-wise.

## Canonical asset system (V2)
All V2 pages (`index.html` and every nested folder) use only:
`assets/css/{bootstrap.min,bmg,components,utilities}.css` and
`assets/js/{navigation,app}.js`, referenced with relative paths (`../` per folder depth).
- `bmg.css`: design tokens, reset, layout, header/nav. `components.css`: blocks, forms, tables, reveal. `utilities.css`: helpers (loaded last).
- `navigation.js`: accessible mobile nav (`aria-expanded`, Escape, outside click, focus return, body scroll lock via `body.nav-open`, close on link click / desktop breakpoint) and active-link detection that resolves each link against the current document URL (works at any folder depth and under a GitHub Pages sub-path). Section pages mark their parent link active.
- `app.js`: footer year, contact form, reveal-on-scroll. Reveal styles live in CSS; items are hidden only after JS adds `reveal-ready` to `<html>`, so content is visible without JS or with `prefers-reduced-motion`.
- Contact form: there is no backend, so the form validates and opens a `mailto:` draft to `hello@bmg.com.mm`, and says so. It never reports a message as sent. Replace the handler in `app.js` once an endpoint exists.

## Legacy pages: compatibility decision
`about.html`, `artists.html`, `blog.html`, `contact.html`, `faq.html`, `MVdistributionService.html`,
`mmrt-service.html`, `our-services.html` (Burmese content) still use the root `style.css` / `script.js`
plus CDN Font Awesome and AOS. A full migration was judged too risky (different markup, content and
styling, and URLs must stay unchanged), so they are kept **isolated**: they never load `assets/`, and V2
pages never load `style.css`/`script.js`. Their script was made safe (Escape closes the menu; the contact form
uses the same honest `mailto:` fallback). Known pre-existing gaps: `artists.html` and `mmrt-service.html`
reference images that are not in the repo, and several `href="#"` placeholders remain. Future work: migrate
these pages to V2 markup one at a time, then delete `style.css` and `script.js`.

## Local testing
No build step. Serve the folder statically and click through pages from root and nested folders:

    python3 -m http.server 8000   # then open http://localhost:8000/

Static checks used: `node --check` on each JS file, and a script that verifies every relative
`href`/`src` in all HTML files resolves to an existing file or folder `index.html`.

## Deployment assumptions
GitHub Pages serves the repository root (`.github/workflows/static.yml`). All links are relative, so the
site works at a domain root or a project sub-path. Canonical URLs point to `https://bmg.com.mm/`.

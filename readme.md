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
- `/assets/js/` app.js + navigation.js (deferred)

## Naming convention enforced
lowercase · hyphens · no spaces/underscores · no dates/versions in filenames ·
no "bmg" repetition in page filenames (the domain carries the brand).

## Notes
- `bootstrap.min.css` is a placeholder stub — drop in the official Bootstrap 5.3 minified build.
- Relative links work from every folder depth; navigation.js resolves active state path-wise.

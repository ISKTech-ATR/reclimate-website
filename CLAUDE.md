# CLAUDE.md

Marketing site for Reclimate (biochar carbon removal, Malaysia + Indonesia), replacing
the Wix site at reclimate.earth. Plain static HTML/CSS/JS — no framework, no build step,
no package.json. See README.md for the file map and design tokens.

## Deploy

Pushing to `main` deploys. GitHub Pages serves the repo root at
https://isktech-atr.github.io/reclimate-website/ and rebuilds in about a minute.
Check with `gh api repos/ISKTech-ATR/reclimate-website/pages/builds/latest --jq .status`.

Preview locally with `python -m http.server 4321` from the repo root.

## Rules that are easy to get wrong

**Content must be real.** Every fact, figure, photo, logo, name and date on this site
comes from Reclimate's own material or the source it cites. Do not invent statistics,
testimonials, team members, partners or press. If something is missing, leave a gap
and say so rather than filling it with plausible copy.

**Dates follow the actual publication date**, not whatever a secondary page claims.
(The Wix blog showed the wrong dates for both e27 articles; the site uses e27's.)

**Nav, contact block and footer are duplicated in all nine pages.** There is no
include system. Any change to them must be made in every `*.html` file — edit with a
script or a multi-file replace, then grep to confirm nothing was missed.

**Bump the cache version when CSS or JS changes.** Every page loads
`assets/styles.css?v=<hash>` and `assets/app.js?v=<hash>`. The hash is the first 8 hex
chars of md5(app.js bytes + styles.css bytes). If it isn't updated, visitors keep the
stale files. For a changed image, add or bump `?v=N` on that image's `src`.

**Logos are white-on-transparent.** Third-party marks in `assets/logos/` were keyed by
sampling the background colour from the corners and turning everything distant from it
opaque white. That flattens multi-colour marks — Shell's pecten became a blob — so
`award-shell.png` instead maps luminance into a 150–255 grey band to keep its ribs.
Check any new logo at 21px / 40% opacity on `#07120F` before using it.

**People's photos must be matched by name from the source**, never by position or
guess. The team headshots were paired from the About page's own DOM structure.

**`robots.txt` is `Disallow: /` on purpose** while this is a draft on github.io. Swap in
the commented production version only when the site moves to reclimate.earth.

**No form backend.** The contact block's chips build a `mailto:` to
info@reclimate.earth. Don't add a `<form>` that posts nowhere.

## Conventions

- Brand: forest green `#134F48`, terracotta `#A26028` (primary buttons), amber
  `#F8AB4A` (accent), ground `#07120F`. Poppins headings, Inter body, JetBrains Mono
  for uppercase eyebrow labels. Tokens live at the top of `assets/styles.css`.
- Layout vocabulary borrowed from zapdoslabs.com and inviscidai.com: mono eyebrow,
  one idea per section, two-tone paragraph (bright claim sentence then dimmed
  explanation), big statement left / explanation right.
- All asset paths are relative with no leading slash — the site lives under a
  subpath on github.io, so `/assets/...` would break.
- Scroll reveals use a rect sweep in `app.js`, not IntersectionObserver, and are
  throttled on a timestamp, not `requestAnimationFrame`. Both choices fix real bugs
  (content staying invisible after a fast scroll, or in a background tab) — keep them.
- `html { scroll-behavior: smooth }` freezes `window.scrollTo` in a hidden or
  headless tab. When testing scroll behaviour in automation, set
  `document.documentElement.style.scrollBehavior = 'auto'` first.

## Checks before pushing

```bash
# every local href/src resolves
python -c "import re,os,glob;print([f'{p} -> {m}' for p in glob.glob('*.html') for m in re.findall(r'(?:href|src)=\"([^\"]+)\"',open(p,encoding='utf-8').read()) if not m.startswith(('http','mailto:','#','data:')) and m.split('#')[0].split('?')[0] and not os.path.exists(m.split('#')[0].split('?')[0])] or 'all local refs OK')"

# app.js parses
node --check assets/app.js
```

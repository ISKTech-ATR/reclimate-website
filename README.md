# reclimate.earth

Static marketing site for Reclimate — biochar carbon removal across Southeast Asia.
No build step, no dependencies. Three files do the work.

```
index.html          home
biochar.html        what biochar is, market, standards
projects.html       portfolio overview, feedstocks, derisking
soil-and-flame.html   project GCSP1039 (Malaysia)
nusantara.html        project GCSP1288 (Indonesia)
work-with-us.html   the five stakeholder paths + platform
remove-co2.html     carbon credit buyers
about.html          story, values, team, advisors, partners, awards
news.html           articles + press
assets/styles.css   design system + layout
assets/app.js       typewriter, reveals, counters, tabs, ember canvas
assets/logo.png     brand mark (white, from reclimate.earth)
assets/favicon.png  mark on brand green
assets/og.png       1200×630 social card
assets/img/         project photography (hero, field band, project cards, team)
assets/logos/       award, certification and press marks, keyed to white
robots.txt, sitemap.xml
```

## Structure

Nine static pages. Nav, contact block and footer markup are repeated in each file
rather than injected by JS — better for SEO and it works with scripts off. They were
generated from one template, so if you change the nav, change it in all nine (a quick
find-and-replace, or regenerate).

`?v=<hash>` on the CSS and JS URLs is a content hash for cache-busting. Recompute it
when you change either file, or visitors keep the old copy.

## Run locally

```bash
python -m http.server 4321
```

Then open http://localhost:4321.

## Deploy

Vercel needs no config — drop the folder in, or:

```bash
npx vercel --prod
```

Netlify / Cloudflare Pages: publish directory `.`, build command empty.

## Design

Structure borrows from zapdoslabs.com and inviscidai.com: mono uppercase eyebrow
labels, one idea per section, a two-tone paragraph where the first sentence carries
the claim and the rest explains it, and a big-statement-left / explanation-right split.

Colour and type come from Reclimate's own brand, sampled off the live site:

| Token | Value | Use |
|---|---|---|
| `--green` | `#134F48` | brand forest green (glows, contours) |
| `--terra` | `#A26028` | primary buttons |
| `--amber` | `#F8AB4A` | accent — labels, counters, the pyrolysis step |
| `--bg` | `#07120F` | ground, the brand green taken to near-black |
| `--text` | `#F2F4EF` | off-white |

Poppins for headings and the wordmark (brand typeface), Inter for body,
JetBrains Mono for the small uppercase labels.

## Content

Copy is drawn from the live reclimate.earth — process temperatures, moisture
threshold, permanence benchmark, impact figures, awards and project names are
theirs.

### Images

All photography comes from reclimate.earth's own project pages, re-encoded for the
dark palette (desaturated ~0.8, darkened, cover-cropped, progressive JPEG):

| File | Where it came from | Used in |
|---|---|---|
| `hero.jpg` | aerial of a field being worked | hero background |
| `band-feedstock.jpg` | residue loaded at a site | field band 01 |
| `band-plantation.jpg` | plantation aerial | field band 02 |
| `band-mrv.jpg` | plant health sampling | field band 03 |
| `project-malaysia.jpg` | tractor and trailer, red soil | Soil and Flame card |
| `project-indonesia.jpg` | terraced smallholder farmland | Nusantara card |
| `team.jpg` | the team at Reclimate Site #1 | company section |
| `site.jpg` | team under the project banner | unused spare |

### Logos

`assets/logos/` holds award, certification and press marks pulled from the same
pages and keyed to white-on-transparent (background colour sampled from the
corners, everything a distance from it becomes opaque white). They render
greyscale at low opacity and brighten on hover.

- **awards** — Microsoft, Shell LiveWIRE, Startup World Cup, BEYOND Expo, Green Finance Alliance, MYStartup, Grow Asia
- **certifications** — Carbon Standards International, Artisan C-Sink, CERES, Sylvera, ICROA
- **press** — New Straits Times, The Edge, Harian Metro, Astro Awani, e27, Antara Sumbar, Quantum Commodity Intelligence

These are third-party trademarks. Reclimate has the standing to show them as a
recipient / certified party, but confirm each one still applies before launch.

## Contact

There is no form backend. The contact block instead uses interest chips that build a
`mailto:` to info@reclimate.earth with the subject and a pre-filled body — works with
no server. If you want a real form with lead capture, Formspree, Netlify Forms or a
Google Apps Script endpoint would each drop straight into that section.

## Before launch

- News articles link to e27's homepage, not the specific posts — I could not find
  the direct URLs. Replace both `href`s in `news.html`.
- Project IDs `GCSP1039` and `GCSP1288` are taken from the live project pages;
  confirm you want them public.
- Team headshot-to-name pairing was read from the live page's own DOM structure,
  not guessed — but it is worth one pass to be certain, since these are real people.
- Daily Express was dropped from the press row: its logo does not survive
  conversion to a single-colour mark.

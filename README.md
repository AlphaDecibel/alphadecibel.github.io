# alphadecibel.com

Marketing site for **Overtone by AlphaDecibel** — conversation intelligence for contact centers.

Static HTML/CSS/JS. No build step, no dependencies, no framework. Deploys to GitHub Pages as-is.

---

## Structure

```
.
├── index.html            home — full narrative scroller
├── platform/             the four engines, Scoring Studio, specs
├── solutions/            by role (agent/supervisor/QA/exec) and by industry
├── integrations/         telephony, WFM, CRM, BI, identity, API
├── security/             deployment models, data flow, PII, compliance
├── company/              story, timeline, values, team, careers
├── contact/              Formspree-backed contact + demo form
├── _disabled/            markup removed from the live site but kept for later
├── 404.html
├── CNAME                 www.alphadecibel.com
├── .nojekyll             skip Jekyll processing
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/site.css      design system — tokens, components, motion
    ├── js/site.js        nav, reveals, waveform, tabs, counters, form
    └── img/              favicon.svg, og.svg / og.png
```

Nav and footer markup is duplicated in each page on purpose — the site renders
with JavaScript disabled and crawls cleanly. If you change a nav link, change it
in all eight files (`grep -rl 'nav-links' .`).

---

## 1. Contact form — configured

The form in `contact/index.html` posts to Formspree:

```
https://formspree.io/f/mdeoaejw
```

**Confirm it once:** Formspree requires the form owner to verify the first
submission. Submit the live form yourself and click the confirmation link in the
email Formspree sends, otherwise later submissions are held.

Free tier is 50 submissions/month with an inbox and dashboard at formspree.io.
Spam is filtered server-side, and a honeypot field (`_gotcha`) is the first line
of defence. If the endpoint is ever unset, `site.js` shows a visible error telling
the visitor to email instead — it never silently drops a lead.

To change backends (Web3Forms, Getform, your own), just swap the `action`
attribute: `site.js` posts `FormData` with `Accept: application/json` and treats
any non-2xx as an error.

---

## 2. Deploy to GitHub Pages

Pages is already serving this repo from the default branch root.

**Settings → Pages** should show:
- Source: *Deploy from a branch*
- Branch: `main` / `(root)`

Every push to `main` republishes within a minute or two.

---

## 3. Point www.alphadecibel.com at it

**Live.** `CNAME` at the repo root holds `www.alphadecibel.com`, and GoDaddy DNS
points at GitHub Pages. `alphadecibel.github.io` now 301-redirects to the custom
domain.

Records in place at GoDaddy (the apex A records make the bare domain redirect to
`www`; the Zoho MX and SPF records must be left alone or email breaks):

| Type  | Name  | Value                                      |
|-------|-------|--------------------------------------------|
| CNAME | `www` | `<your-github-username>.github.io`          |
| A     | `@`   | `185.199.108.153`                           |
| A     | `@`   | `185.199.109.153`                           |
| A     | `@`   | `185.199.110.153`                           |
| A     | `@`   | `185.199.111.153`                           |
| AAAA  | `@`   | `2606:50c0:8000::153`                       |
| AAAA  | `@`   | `2606:50c0:8001::153`                       |
| AAAA  | `@`   | `2606:50c0:8002::153`                       |
| AAAA  | `@`   | `2606:50c0:8003::153`                       |

| CNAME | `www` | `alphadecibel.github.io` |

Certificate provisioning is automatic. **Enforce HTTPS** is enabled in
Settings → Pages.

---

## 4. Generate the OG image

`assets/img/og.svg` is the source. Social platforms don't render SVG, so export a PNG:

```bash
# any of these work
rsvg-convert -w 1200 -h 630 assets/img/og.svg -o assets/img/og.png
# or open og.svg in a browser at 1200×630 and screenshot it
```

Save it as `assets/img/og.png`. The meta tags already point there.

---

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Use a server rather than opening files directly — the absolute `/assets/...` paths
and directory URLs (`/platform/`) need one.

---

## Editing content

- **Design tokens** (colors, type scale, spacing) live at the top of `assets/css/site.css`
  under `:root`. Change a token, change it everywhere.
- **Fonts** are Bricolage Grotesque (display), Instrument Sans (body), IBM Plex Mono
  (data labels), loaded from Google Fonts in each page's `<head>`.
- **Animations** all respect `prefers-reduced-motion: reduce`. If you add motion,
  gate it the same way.
- **Invented content** is inventoried in `CLAIMS.md`. Read it before any real launch.
- **`_disabled/`** holds sections pulled from the live site. Right now that's the
  Leadership block from `company/` (hidden while in stealth). Each file says where
  to paste it back.

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

## 1. Wire up the contact form (2 minutes)

The form posts to [Formspree](https://formspree.io). Until you connect it, submitting
shows an error telling the visitor to email instead — it never silently drops a lead.

1. Create a free account at **formspree.io** and add a new form.
2. Copy the endpoint, which looks like `https://formspree.io/f/xdkoblqz`.
3. In `contact/index.html`, replace the placeholder:

   ```html
   <form ... action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

4. Submit the form once yourself — Formspree asks you to confirm the first submission.

Free tier is 50 submissions/month with an inbox and dashboard. Spam is filtered
server-side, and there's a honeypot field (`_gotcha`) in the markup as a first line.

**To use something else instead** (Web3Forms, Getform, your own endpoint): change the
`action` attribute. `assets/js/site.js` posts `FormData` with `Accept: application/json`
and treats any non-2xx as an error, which most form backends support.

---

## 2. Deploy to GitHub Pages

Pages is already serving this repo from the default branch root.

**Settings → Pages** should show:
- Source: *Deploy from a branch*
- Branch: `main` / `(root)`

Every push to `main` republishes within a minute or two.

---

## 3. Point www.alphadecibel.com at it

`CNAME` in this repo already contains `www.alphadecibel.com`. Add these records at
your DNS provider (the apex A/AAAA records make the bare domain redirect to `www`):

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

Then in **Settings → Pages → Custom domain**, enter `www.alphadecibel.com` and tick
**Enforce HTTPS** once the certificate provisions (usually under an hour, occasionally
up to 24).

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

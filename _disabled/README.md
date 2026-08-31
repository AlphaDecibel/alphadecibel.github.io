# Parked files

Markup and config removed from the live site, kept here so it's easy to restore.
GitHub Pages ignores this folder — nothing in here is served.

| File | Why it's parked | To restore |
|---|---|---|
| `CNAME` | Setting a custom domain makes GitHub 301-redirect `alphadecibel.github.io` to it. Until DNS for `www.alphadecibel.com` resolves, that would kill the preview URL. | Once DNS is live: `git mv _disabled/CNAME CNAME && git commit -m "Enable custom domain" && git push` |
| `leadership-section.html` | Hidden while in stealth. | Paste back into `company/index.html` before the `<!-- SEATTLE + INVESTORS -->` comment. |
| `backed-by-section.html` | Hidden while in stealth. | Paste back as the second child of the `.shell` in the Seattle section, and change that `.shell` back to `shell split split-top`. |

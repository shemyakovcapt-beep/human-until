# HUMAN, UNTIL. v2

A buildless, English browser game: four purchases within $100, followed by an affordable personal role reversal.

- Three sets rotate daily in UTC; challenges pin the exact set.
- Human, AI, and DIY choices; over-budget purchases are blocked.
- The personal mirror uses only a choice where hiring a human was affordable.
- Two-player pass-and-play hides the first result until the second is complete.
- Friend links compare the four shared purchases. Personal twists are reported separately because they may revisit different jobs.
- Solo receipts are saved locally per set for instant return-link comparisons. Visitors can clear them in How it works.
- Personal and comparison PNG export; native sharing, clipboard and X draft fallback.
- Embedded copies share the configured canonical site URL.
- Legacy six-choice links redirect to /v1/ without changing their encoded answers.
- docs/studio.html includes launch copy, posters and a 15-second silent vertical MP4 teaser.

No API keys, live AI calls, external assets, analytics or global statistics. All costs, tasks, times and scenarios are fictional. 

## Verification

Run node tests.mjs for exhaustive engine checks (456 valid final paths, 15 rejected budget paths, all same-set comparisons), malformed links and local assets. Additional environment-specific simulated-DOM checks exercised 24 full flows and 25 PNG exports, pass-and-play, local storage, sharing fallbacks, legacy links and iframe canonical links.

Real-browser visual QA and physical-device share sheets were unavailable in the build environment. This is not user-tested evidence of engagement or virality.

## Publication and portability

docs is the static output directory. No build step is required. On a new host, update the og:url, og:image, studio copy and poster-generator domain. The canonical URL is used by embedded copies. Keep the v1 folder to preserve prior links. Enable public access before docsributing a currently private site.

Run python make-posters.py with Pillow and FFmpeg to regenerate exact typographic assets.

## GitHub Pages setup

In Settings → Pages, choose Deploy from a branch, main, /docs, then Save.

Expected game URL after deployment: https://shemyakovcapt-beep.github.io/human-until/

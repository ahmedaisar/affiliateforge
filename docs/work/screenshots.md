# Screenshots (taken 18 Nov 2026, 07:21 UTC)

Taken with headless Chromium via Playwright 1.65.1 against `http://127.0.0.1:3000`.
No browser user or display server was used; this is the closest this host can get.

| File | Route | Width | Note |
|---|---|---|---|
| `front-door-1440.png` | `/` | 1440 | 28 KB |
| `stores-1440.png` | `/stores` | 1440 | re-shot 07:36 after the ESM + empty-state fixes; note there is also an *earlier* `app-stores-1440.png` taken before the React fetch resolved, showing an empty table — a genuinely useful negative: the app renders its empty state coherently |
| `niche-1440.png` | `/stores/resin-miniatures/niche` | 1440 | brief + evidence renders from `/api/.../brief` |
| `storefront-1440.png` | `/stores/resin-miniatures/preview` | 1440 | reader screen |
| `stores-390.png` | `/stores` | 390 | phone width |
| `front-door-390.png` | `/` | 390 | phone width |

Checks performed on them: PNG signature and declared dimensions read back from the
files (1440×1100 seeds; fullPage heights vary); all HTTP responses 200; no console
error other than the expected Vite HMR debug lines. **The pixels have not been looked
at by a person** — this host has no display; the owner's read is the acceptance step.

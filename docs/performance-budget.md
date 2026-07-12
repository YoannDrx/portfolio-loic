# Performance budget

- Public albums page initial transfer: less than 2 MB on a cold mobile load.
- Album cover source: WebP/AVIF, maximum 1200 × 1200, less than 250 KB.
- Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- No YouTube, Spotify or SoundCloud iframe or remote thumbnail before media consent.
- Only the actual LCP image may be preloaded; off-screen grids remain lazy-loaded.

Vercel Speed Insights is mounted in the root layout. Review field data after every visual or media-heavy release.

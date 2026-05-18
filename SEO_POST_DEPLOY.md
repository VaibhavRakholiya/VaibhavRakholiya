# Post-deploy SEO checklist

After pushing to GitHub Pages (`https://vaibhavrakholiya.github.io/`), complete these steps so the site ranks for **Vaibhav Rakholiya**.

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) (site is already verified via meta tag).
2. Go to **Sitemaps** → submit: `https://vaibhavrakholiya.github.io/sitemap.xml`
3. Go to **URL Inspection** → request indexing for:
   - `https://vaibhavrakholiya.github.io/`
   - `https://vaibhavrakholiya.github.io/projects.html`

## Profile backlinks (same URL everywhere)

Add `https://vaibhavrakholiya.github.io/` as your website on:

- **GitHub** — Profile → Website field → `https://vaibhavrakholiya.github.io/`
- **LinkedIn** — Featured or Contact → `https://vaibhavrakholiya.github.io/`
- **Upwork** — Portfolio / website field (add your full Upwork freelancer URL when ready)

Use the exact spelling **Vaibhav Rakholiya** on every profile.

## Optional: Bing Webmaster Tools

1. Sign in at [Bing Webmaster](https://www.bing.com/webmasters).
2. Add the site and submit the same sitemap URL.

## Monitor

- Search Google for: `site:vaibhavrakholiya.github.io`
- In Search Console → **Performance**, filter queries containing `Vaibhav Rakholiya`
- Allow 1–4 weeks for ranking to stabilize after indexing

## Update when you have your Upwork URL

Replace the generic Upwork link in `index.html` hero socials and add the URL to the `sameAs` array in the JSON-LD block on the homepage.

# Publishing News

News cards on all three homepages and listing pages come from `news/news.json`. Article bodies remain hand-written HTML so each activity can have its own text and photographs without a build step.

## Add a news item

1. Confirm the event details and permission to publish all photographs. Remove any placeholder notice; do not publish unconfirmed people, awards, funders, or partnerships as fact.
2. Optimize a cover image to roughly 1200 × 630 pixels and place it in `images/news/`. Add descriptive gallery images there as needed; keep files reasonably small for mobile visitors.
3. Copy an existing file in `news/articles/` to a new lowercase, date-prefixed filename such as `2026-10-02-research-seminar.html`.
4. Update the article title, date, type, details, text, image paths, alt text, gallery buttons, canonical URL, Open Graph fields, and Twitter card fields. All article paths to root assets begin with `../../`.
5. Add one object to `news/news.json` using the documented fields: `id`, ISO `date`, `type`, root-relative `cover`, `featured`, and `en`/`cn`/`sc` objects containing `title`, `summary`, and `url`.
6. Use one of these types, by the group's role: `talk` (the group goes and presents), `meeting` (the group organizes the meeting), `visit` (scholars who come to the group, or another exchange that is not primarily the group's own presentation), or `other` (publications and anything that is not a talk, meeting, or visit). Each type should have at least one item. Keep summaries to one or two sentences. Set `featured` to `true` for homepage eligibility.
7. If a Traditional or Simplified Chinese translation is unavailable, omit that language object (or leave its title empty). `js/news.js` automatically falls back to the complete English title, summary, and URL.
8. If a translated article page is added, use a clear suffix such as `_cn.html` or `_sc.html`, update that language's `url` in `news.json`, set the correct `<html lang>`, metadata, Giscus `data-lang`, back link, and article language-switch links.
9. Preview through a local web server, not by double-clicking the HTML file, because browsers commonly block `fetch()` from `file://`. From the repository root, for example, run `python -m http.server 8000`, then check homepage → listing → article → back in all languages and at mobile width.
10. Commit the article, images, and `news.json` together. After GitHub Pages deploys, test the canonical live URL, Copy link, LinkedIn, email, WeChat hint, image lightbox, and social preview image.

The homepage renderer contains the same three current items as a silent fallback. This keeps the block populated when `news.json` cannot load (especially under `file://`). Whenever items change, update the small `fallbackItems` array near the top of `js/news.js` as well.

## Enable Giscus comments

Giscus is deliberately not active yet; every article contains the required `giscus_container` plus a commented script.

1. In `tantan-hku/tantan-hku.github.io`, open **Settings → General → Features** and enable **Discussions**.
2. Open the repository's **Discussions** tab and create or choose a category named **Announcements** (or use **General/Discussions** if preferred).
3. Install/authorize the [Giscus GitHub App](https://github.com/apps/giscus) for `tantan-hku/tantan-hku.github.io`.
4. Visit [giscus.app](https://giscus.app), enter `tantan-hku/tantan-hku.github.io`, choose **Discussion title contains page pathname**, select the category, theme **Light**, and the article language.
5. Copy the generated `data-repo-id` and `data-category-id`.
6. In each article, replace both `TODO` values in the commented Giscus script. Confirm `data-repo="tantan-hku/tantan-hku.github.io"`, the chosen `data-category`, `data-theme="light"`, and `data-lang` (`en`, `zh-TW`, or `zh-CN`).
7. Remove only the surrounding `<!--` and `-->` comment markers, publish, and verify that the discussion is created on the first comment. Never commit an active script with placeholder IDs.

## Path reference

- Root pages load `news/news.css` and `js/news.js`.
- Listing pages use `data-root=".."`.
- Article pages use `../../` for repository-root assets.
- JSON image and article URLs are always repository-root-relative without a leading slash, so the site works at `https://tantan-hku.github.io/`.

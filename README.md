# Christoph Hirche's academic website

Personal Jekyll website, published at <https://christophhirche.github.io/ChristophHirche/>.
The live branch is `gh-pages`. Review changes in a pull request before merging.

## Editing guide

| Content | Edit here |
| --- | --- |
| Biography, research, vacancies, event pages | `_pages/` |
| Publications and homepage selection | `_data/publications.yml` |
| News | `_data/news.yml` (newest first) |
| Talk recordings | `_data/talks.yml` |
| Navigation | `_data/navigation.yml` |
| Scholar, ORCID and social profiles | `_data/social.yml` |
| Layout and reusable markup | `_layouts/`, `_includes/` |
| Styling | `css/main.css` |
| Google Analytics property and public URL | `_config.yml` |

Content belongs in pages and data files; rendering loops belong in includes.
Keep a page's `permalink` when renaming its source file. Existing image and download
paths are intentionally retained for compatibility. The personal wedding page and
Lyon–Singapore meeting archive retain their original addresses.

## Local build

Use Ruby 3.3, Bundler, and Python 3.12 (only needed for the checks). Windows also
needs the RubyInstaller MSYS2 development toolchain for Jekyll's native gems.

```sh
bundle install
bundle exec jekyll serve --safe
```

Open <http://127.0.0.1:4000/ChristophHirche/>. Do not add `JEKYLL_ENV=production`
when previewing. The pinned Jekyll and Markdown versions follow the
[GitHub Pages dependency versions](https://pages.github.com/versions/).
The lockfile supports Linux and Windows; update it deliberately with dependency changes.

## Verification and deployment

```sh
bundle exec jekyll build --safe --strict_front_matter
python scripts/check_site.py _site --baseurl /ChristophHirche
bundle exec jekyll build --safe --strict_front_matter --baseurl ''
python scripts/check_site.py _site --baseurl ''
node scripts/check_analytics.js
ruby scripts/check_content.rb _site
node scripts/check_talks.js
```

The `Verify website` workflow builds preview and production versions of both URL configurations on pull requests and
saves a downloadable `website-preview` artifact. It has read-only repository
permissions and **does not deploy**. The existing GitHub Pages deployment remains
responsible for publishing `gh-pages` after a reviewed merge.

The checker covers all 11 preserved page URLs, local links and assets, fragment
targets, image alternatives, basic document landmarks, accidentally escaped HTML,
and analytics inclusion. Content checks ensure every data record and published DOI
reaches the rendered pages. Analytics guards and click-to-load players are tested
without network calls. Node.js is only needed for those small checks. Check keyboard focus,
mobile layout, and content accuracy in a browser too; these checks are not a full
accessibility audit.

## Publications

Each record has a stable `id`, `title`, `authors`, `year`, `date`, `type`, and
`citation`. Store the DOI identifier in `doi` and the arXiv identifier in `arxiv`;
templates construct their links. `scholar_id` records the matched Scholar entry for
maintenance and is not displayed. `selected_order` controls the homepage selection
(the first six); `highlight: 1`, `image`, and `description` retain an illustrated
summary. `conference_version` can link an additional proceedings version without
duplicating a journal record. Separately titled conference papers remain distinct.

Keep records newest first within each year. Use the journal volume year, conference
year, or first arXiv posting year for preprints/theses. `date` records the known
publication or posting date, preserving partial precision when only a month is known.
The full bibliography is grouped by `year`; titles and author order follow primary
metadata. Update status only after checking a publisher record; an arXiv identifier
or DOI alone does not establish peer-reviewed publication. See the audit for the
Scholar reconciliation and citation corrections.

## Talk recordings

Edit `_data/talks.yml`; keep existing `anchor` values when changing titles. `url`
is the permanent recording page. For `provider: YouTube`, `video` is the 11-character
video ID; for `provider: BIRS`, it is the MP4 URL exposed by the official BIRS player.
Dates are optional when only the event year has been verified.

Talk cards use local styling rather than remote thumbnails. No video, iframe, or
third-party player request is made before the visitor chooses **Play here**. YouTube
uses its privacy-enhanced embed domain; BIRS uses a native video player. Once loaded,
the provider receives the playback request. The recording-page link remains usable
if scripting, playback, or embedding is unavailable. No third-party player library is needed.

## Analytics and social links

The existing GA4 property `G-N71H8YPM4R` is configured in `_config.yml`. This public
measurement ID is not a password. Set `analytics.google_id` to an empty string to
disable analytics. The script only loads on a production build on the configured
host, respects Do Not Track and Global Privacy Control, and disables advertising
personalization signals. Review previews and localhost never send analytics.

The Twitter widget and external icon fonts have been removed. Social profiles are
ordinary labelled links, including the supplied LinkedIn profile. Add a Bluesky
profile to `_data/social.yml` when its exact URL is confirmed. Individual public
posts can be embedded if needed; avoid adding a feed service just to display a link.

## Attribution and next phases

Original layout by [Allan Lab](https://allanlab.org/aboutwebsite.html). The funding
acknowledgement is retained. See [the audit and phased plan](docs/site-audit.md)
for the cleanup rationale, content sources, and remaining work.


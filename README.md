# Christoph Hirche's academic website

Personal Jekyll website, published at <https://christophhirche.github.io/ChristophHirche/>.
The live branch is `gh-pages`. Review changes in a pull request before merging.

## Editing guide

| Content | Edit here |
| --- | --- |
| Biography, research, group opportunities, event pages | `_pages/` |
| Publications and homepage selection | `_data/publications.yml` |
| News | `_data/news.yml` (newest first) |
| Talk recordings | `_data/talks.yml` |
| Current and previous research funding | `_data/funding.yml` |
| Group members and institute profile links | `_data/group.yml` |
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
node scripts/check_publications.js
```

The `Verify website` workflow builds preview and production versions of both URL configurations on pull requests and
saves a downloadable `website-preview` artifact. It has read-only repository
permissions and **does not deploy**. The existing GitHub Pages deployment remains
responsible for publishing `gh-pages` after a reviewed merge.

The checker covers all 11 preserved page URLs, local links and assets, fragment
targets, image alternatives, basic document landmarks, accidentally escaped HTML,
and analytics inclusion. Content checks ensure every data record and published DOI
reaches the rendered pages. Analytics guards, click-to-load players, and publication filters are tested
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

Publication search matches words in titles and author names, ignoring case and
accents. Type and year filters combine with the search and use existing record
metadata; no extra tagging is needed. Controls are in
`_includes/publication-filters.html`, and `assets/js/publications.js` filters the
rendered bibliography locally. It makes no search-service requests and uses no
library. Without JavaScript, the complete bibliography and year links remain
available. The search example uses a topic rather than a named coauthor.

## Talk recordings

Edit `_data/talks.yml`; keep existing `anchor` values when changing titles. `url`
is the permanent recording page. For `provider: YouTube`, `video` is the 11-character
video ID. For `provider: BIRS`, omit `video` and link to the official recording page.
For `provider: YPetz`, `video` is the MP4 linked from the workshop programme.
Set `embed: false` when a YouTube owner disables embedding, as for QIP 2024.
Dates are optional when only the event year has been verified.

Talk cards use local styling rather than remote thumbnails. No video, iframe, or
third-party player request is made before the visitor chooses **Play here**. YouTube
uses its privacy-enhanced embed domain; YPetz uses the browser's native video controls.
Once loaded, the host receives the playback request. BIRS prevents its video files
from playing on other websites, so those cards
offer **Watch on BIRS** instead. QIP 2024 opens on YouTube because its owner has disabled
embedding. Recording-page links remain usable if scripting,
playback, or embedding is unavailable. No third-party player library is needed.

## Research and funding

The introduction lives in `_pages/research.md`. Edit project descriptions, award
identifiers, acknowledgements, and official links in `_data/funding.yml`;
`_includes/funding-projects.html` renders the cards. Keep project `id` values stable
to preserve links to individual projects. Descriptions support Markdown; the other
fields are plain text. Move a completed project from `current` to `previous` and
record its actual end date when confirmed. Keep the footer's short funding summary
in sync with current support. The former Marie Curie fellowship and EU acknowledgement
remain in **Previous funding**. See the audit for source records and date conventions.

Official logos are stored locally in `images/funding/`. Set `image`, `image_alt`,
and the original `image_width`/`image_height` in the funding record. The `logo`
field selects a small display size; CSS preserves the artwork's aspect ratio.
Logo sources and DFG's publication guidance are recorded in the audit. Keep the
original artwork and its clear space when replacing these assets.

## Group

The **Group** navigation entry keeps the existing `/team/` address. Edit names,
brief research interests or project labels, and institute profile links in
`_data/group.yml`. `_pages/team.md` contains the introduction and student-project
links; `_includes/group-members.html` renders the cards. Verify membership against
the institute's **Professor Hirches Gruppe** section, not its full staff list.
The public profiles do not establish doctoral/postdoctoral job titles, so those
roles are not inferred. Keep contact details on the linked institute profiles.

Maintain position availability, collaboration invitations, and Bachelor/Master
thesis opportunities in **Working with us** in `_pages/team.md`. The former
Vacancies tab is removed. `_pages/openings.md` preserves `/vacancies` and forwards
immediately to `/team/#working-with-us`, with a normal fallback link for visitors
whose browser does not redirect. The shared head handles its `redirect_to` field
without an extra plugin, points canonical metadata to the Group page, and omits
analytics on the forwarding page to avoid counting an additional page view.

Member portraits are served locally from `images/group/`. All four Group cards
use institute portraits; Christoph's homepage portrait is unchanged. Each card
uses the same research-interest label. Preserve image proportions and record
new portrait sources in the audit when replacing them.

## Analytics and social links

The existing GA4 property `G-N71H8YPM4R` is configured in `_config.yml`. This public
measurement ID is not a password. Set `analytics.google_id` to an empty string to
disable analytics. The script only loads on a production build on the configured
host, respects Do Not Track and Global Privacy Control, and disables advertising
personalization signals. Review previews and localhost never send analytics.
Compatibility forwarding pages also omit the analytics loader.

The Twitter widget and external icon fonts have been removed. Social profiles are
ordinary labelled links, including the supplied LinkedIn profile. Add a Bluesky
profile to `_data/social.yml` when its exact URL is confirmed. Individual public
posts can be embedded if needed; avoid adding a feed service just to display a link.

## Attribution and next phases

Original layout by [Allan Lab](https://allanlab.org/aboutwebsite.html). Current and
previous funding acknowledgements appear on the research page. See [the audit and phased plan](docs/site-audit.md)
for the cleanup rationale, content sources, and remaining work.


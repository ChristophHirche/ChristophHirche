# Site audit and phased plan

Audit date: 11 October 2026. Starting commit:
`bf462e45e195820f34a8d0a038d72ac21dd95439` on `gh-pages`.

## Findings

| Area | Baseline finding | First phase response |
| --- | --- | --- |
| Structure | 173 tracked files; 74 in `_sass`, including a duplicate variables file; 12 layout files with many identical wrappers | Small shared layouts and includes; remove vendor source and unused wrappers |
| Build | Gemfile requires Jekyll >=3.6.3, while lockfile holds Jekyll 3.1.2 and Bundler 1.11.2 | Pin Pages-compatible Jekyll 3.10.0 and Markdown versions; regenerate the lockfile |
| Theme/plugins | `jekyll-theme-minimal` configured despite custom templates; unused local Markdown plugin | Remove both; use supported sitemap gem |
| Navigation | Fixed Bootstrap bar; mobile menu depends on jQuery 1.11.3 and Bootstrap JS | Always available, wrapping navigation, active page state, skip link, visible focus |
| Styling | Full Bootstrap/Bootswatch Sass, glyphicons, external icon-font libraries | One plain CSS file using system fonts and responsive grid/flex layouts |
| Content | Repeated publication lists and long Liquid loops inside Markdown; stale fellowship tense; placeholder config email | Structured publications/talks, reusable includes, localized wording correction, preserve obfuscated public contact text |
| Social | Embedded Twitter timeline and icon-only profile links | Remove widget and icon libraries; labelled links; add the supplied LinkedIn URL |
| Analytics | GA4 tag repeated in shared and wedding heads | Retain existing property through a single configurable include; disable in previews and respect browser privacy signals |
| Accessibility | Missing document language, main landmark, portrait/logo alternatives; skipped heading levels | Add semantics, alt text, logical headings, responsive assets, keyboard focus |
| Archives | Unlinked wedding/event URLs, inherited lab gallery and commented-out lab staff data | Keep real archive URLs; retire inherited gallery with a useful landing page; remove unused lab data |
| Deployment | Latest successful run is `pages build and deployment`, from `gh-pages`, 10 April 2026 | Keep deployment unchanged; add a separate build/check workflow with no deployment permission |

The deployed page and [successful Pages run](https://github.com/ChristophHirche/ChristophHirche/actions/runs/24250343931)
were checked. Branch deployment is evidenced by that run; Pages administration
settings were not exposed by the connector. No custom Actions workflow existed in
the starting tree. Do not switch publishing source as part of this change.

This is a static site: no visitor accounts, backend login flow, or application tokens
were found in the templates. The GA measurement ID is public. GitHub controls repository
access and deployment; verification uses the temporary Actions token with `contents: read`.

## Lean structure

```text
_pages/             page text and stable permalinks
_data/              publications, talks, news, navigation, profile links, gallery list
_layouts/           default, page, home, wedding
_includes/          shared page components and rendering loops
css/main.css        responsive styling
assets/js/          optional production analytics and click-to-load recordings
images/, downloads/ existing public asset URLs
scripts/            URL contract and build checks (excluded from the site)
docs/               maintenance notes (excluded from the site)
.github/workflows/  verification only
_config.yml         URL, metadata, analytics, supported build options
Gemfile[.lock]      pinned build dependencies
```

Moving `images/` and `downloads/` just for visual tidiness would break existing public
asset links. Keep their URLs. The duplicate `images/adap.png` and both favicon paths
are retained for this reason. Removing vendor files reduces the checkout, not old Git
history. Large existing wedding photos dominate its byte size and remain intact.

## Phases

1. **Foundation and restrained refresh (this PR).** Remove unused/vendor files,
   separate content from templates, preserve all 11 page URLs, repair the build,
   modernize typography/navigation and basic accessibility, remove the Twitter widget,
   retain configurable Google Analytics, reconcile the complete Scholar bibliography,
   add the July 2026 BIRS recording and click-to-load players, and link thesis projects.
   Gate: both base-path builds, URL checks, browser inspection, and owner review.
2. **Research content.** Expand the research page into three or four concise themes
   (information measures and testing; communication/channel capacities; privacy;
   learning and noisy quantum processing), each with selected papers and open questions.
   Add teaching/supervision and a dated CV if supplied. Confirm claims and appointments
   before publication. Keep preprints, journal articles, and proceedings distinct.
3. **Useful researcher features.** Add curated topic/year filters and BibTeX downloads
   once the bibliography has consistent dates and statuses. Add a news RSS feed and
   optional selected Bluesky/LinkedIn posts if wanted. Add code/slides links per paper
   when the correct public repositories/assets are identified.
4. **Asset and release review.** Confirm whether old downloadable recruitment PDFs
   still serve a purpose before deleting any public URL. Generate smaller responsive
   gallery derivatives while preserving originals. Review final desktop/mobile output,
   merge only with owner approval, then verify the Pages deployment and analytics.

## Content decisions and sources

The owner confirmed the current Junior Professor role at Hannover's Institute for
Information Processing and the vacancy/thesis wording. The existing obfuscated
contact text is retained because no replacement address was supplied. Personal/event
URLs are retained; inherited lab pages may be retired. Google Analytics is retained
following the owner's clarification. The LinkedIn profile URL was supplied directly;
the self-profile query parameter was removed.

The following additions were checked on 11 October 2026, including author identity:

| Paper | Classification | Primary evidence |
| --- | --- | --- |
| Quantum estimation, channel orders, and private capacity | arXiv preprint, 2026 | [arXiv:2610.03706](https://arxiv.org/abs/2610.03706) |
| Stochastic Neural Networks for Quantum Devices | Journal article, 2026 | [arXiv:2602.22241](https://arxiv.org/abs/2602.22241); [Quantum Machine Intelligence 8, 98](https://doi.org/10.1007/s42484-026-00438-w) |
| Quantum Doeblin Coefficients: Interpretations and Applications | Journal article, 2026 | [arXiv:2503.22823](https://arxiv.org/abs/2503.22823); [Quantum 10, 2115](https://quantum-journal.org/papers/q-2026-05-22-2115/) |
| Information Contraction under (ε, δ)-Differentially Private Mechanisms | arXiv preprint, 2026 | [arXiv:2601.16845](https://arxiv.org/abs/2601.16845) |
| Non-Linear Strong Data-Processing for Quantum Hockey-Stick Divergences | arXiv preprint, 2025 | [arXiv:2512.16778](https://arxiv.org/abs/2512.16778) |

The information-bottleneck highlight linked to the unrelated arXiv:1808.01498. Its
correct record is [arXiv:1810.03644](https://arxiv.org/abs/1810.03644), matching the
existing ISIT proceedings DOI. Whitespace in another DOI URL was removed.

The owner confirmed changing the pre-existing 10 January 2026 news item to
23 January 2026, matching the linked arXiv:2601.16845 submission date. Older
publication descriptions are preserved, not re-audited as theorem claims.

### Bibliography reconciliation, 11–12 October 2026

Expanded all entries on the owner's [Google Scholar profile](https://scholar.google.de/citations?user=wHih5p4AAAAJ&hl=en):
51 records. Matched titles and author identities against the [arXiv author list](https://arxiv.org/a/hirche_c_1.html),
individual arXiv records, and publisher-deposited [Crossref work metadata](https://www.crossref.org/documentation/retrieve-metadata/rest-api/).
DOIs and arXiv identifiers are retained in the data, together with each matched Scholar
entry ID. The site renders a local bibliography; it does not scrape Scholar at build
time or load a Scholar widget for visitors.

All 51 Scholar entries are represented: 38 published journal/conference entries,
11 preprints, and two theses. Every published entry has a DOI link. Two further
verified conference DOIs are attached to the corresponding journal records, rather
than listed twice: capacities/partial orders (ISIT 2022) and information combining
with quantum side information (ISIT 2018). Separately titled conference entries,
including the distributed-testing and Stein's-lemma papers, remain separate records
with their own author order. No guessed arXiv links were attached to those entries.

Corrections include the composite-testing journal year (2021), decoupling with
diagonal unitaries (2017), capacities/partial orders journal year (2023), the
amortized-channel paper's journal volume (110), the published pseudorandomness
title, and the information-combining author order. Typeset title artifacts from
Scholar/arXiv were normalized to plain Unicode. The incomplete Annales Henri
Poincaré volume/page metadata is not filled in speculatively.

Year convention: journal volume year; conference year; first arXiv posting year for
preprints and theses. The [GSI chapter](https://doi.org/10.1007/978-3-032-03918-7_12)
is grouped under GSI 2025: the ebook appeared in October 2025, while Springer lists
copyright 2026. The [official proceedings](https://link.springer.com/book/10.1007/978-3-032-03918-7)
confirm LNCS 16033 and pages 112–120. The master's thesis is grouped by its 2015
arXiv posting, not an inferred degree-award date. Publication status is a checked
snapshot, not a promise of an automatically current list.

### Talks, supervision, and design

The supplied [TNT student-projects page](https://www.tnt.uni-hannover.de/de/students/)
is now linked under Bachelor and Master theses. The owner confirmed the existing
vacancy wording; the link does not imply a newly advertised funded position.

Added [Conditional contraction coefficients and their applications to quantum networks](https://www.birs.ca/events/2026/5-day-workshops/26w5621/videos/watch/202607171033-Hirche.html),
17 July 2026, at the BIRS workshop *Additivity Problems in Quantum and Classical
Information Theory*. Title, date, 40-minute slot, and MP4 source were checked on
the official recording page. The existing 2024 BIRS MP4 was checked there as well.
All eight existing recording links and fragment identifiers are preserved.

The owner chose click-to-load players. Cards use local CSS previews, YouTube's
[privacy-enhanced embed domain](https://support.google.com/youtube/answer/171780?hl=en),
and native video for BIRS. Sources are attached only after a click. Original host
links remain available for blocked/unsupported playback and visitors without
JavaScript. Controls have labels, keyboard focus, responsive dimensions, and live
status messages. Captions and third-party player behavior depend on the recordings
provided by their hosts. No remote thumbnails, feed service, or player library was added.

The second visual pass adds subtle teal/copper accents, a small geometric name mark,
rounded cards and profile links, and clearer bibliography/talk metadata. System fonts
and lightweight CSS remain. The research-page body is intentionally unchanged in
this follow-up: the owner wants ideas first, aimed at researchers with an accessible
introduction. Proposed themes are information measures/testing, noisy channels and
networks, privacy, and learning/quantum algorithms; select and word these with the owner.

## Social alternatives

[Bluesky supports individual post embeds](https://www.bsky.social/about/blog/post-embeds-guide).
[LinkedIn supports eligible public post embeds](https://www.linkedin.com/help/linkedin/answer/a529065/embed-content-from-the-linkedin-feed?lang=en).
These documented options are selected-post embeds, not a direct replacement for a
rolling profile timeline. Prefer the local news list plus profile links for predictable
layout and maintenance. No Bluesky handle is assumed and no new feed provider is added.

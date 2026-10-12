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
_data/              publications, talks, funding, group, news, navigation, profile links, gallery list
_layouts/           default, page, home, wedding
_includes/          shared page components and rendering loops
css/main.css        responsive styling
assets/js/          optional analytics, recording players, and publication filters
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
   add the July 2026 BIRS recording and click-to-load players, link thesis projects,
   and organize research around current and previous funding.
   Gate: both base-path builds, URL checks, browser inspection, and owner review.
2. **Research detail.** Add group-specific contributions, selected papers, and open
   questions to the funded-project descriptions once the owner confirms those
   connections. Add teaching/supervision and a dated CV if supplied. Confirm claims
   and appointments before publication. Keep preprints, journal articles, and
   proceedings distinct.
3. **Useful researcher features.** Search, type, and year filters are implemented.
   Consider curated topic tags and BibTeX downloads next. Add a news RSS feed and
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
Information Theory*. Title, date, and 40-minute slot were checked on
the official recording page. The existing BIRS talk was confirmed as 7 March 2024.
All eight existing recording links and fragment identifiers are preserved.

The follow-up recording search added three more talks:

| Talk date | Recording | Verification |
| --- | --- | --- |
| 17 January 2024 | [Quantum Rényi and f-divergences from integral representations](https://www.youtube.com/watch?v=x0TIUxX5rz4) | QIP2024's official YouTube channel and the [IAQI conference archive](https://quantumdb.iaqi.org/conferences/QIP2024); jointly with Marco Tomamichel. This predates the March 2024 BIRS talk, but was explicitly requested. |
| 26 February 2026 | [Quantum Differential Privacy: Where are we at?](https://www.youtube.com/watch?v=py121nXbkzw) | Organizer's PSQI channel; identity/title confirmed in the recording's opening slide. The [FFCS programme](https://www.tu-braunschweig.de/ifn/forschung/veranstaltungen/2026-ffcs/schedule) places Hirche on day 4 in Braunschweig, under the provisional title “Quantum Information Theory”. Use the event date, not the August upload date. |
| 11 June 2026 | [New Frontiers for Contraction Coefficients](https://ypetz.filippo.info/schedule.php#hirche) | The official YPetz programme links the MP4 and confirms the title, speaker, and date; [workshop homepage](https://ypetz.filippo.info/) confirms Pisa, 2026. |

The [official QIP 2026 programme](https://app.onlineexpo.com/events/qip-2026/en/schedules/9f9349c5-a18a-45be-a1cd-aa3e1f890414)
confirms *Representations of f-Divergences and their role in Quantum Hypothesis
Testing*, 29 January 2026, in a merged 11:00–12:00 plenary slot. No public recording
was located on the programme, IAQI archive, or the video searches checked on
12 October 2026. This is not evidence that no recording exists. Do not add a guessed
video URL or present the programme link as a recording.

The owner chose click-to-load players. Cards use local CSS previews, YouTube's
[privacy-enhanced embed domain](https://support.google.com/youtube/answer/171780?hl=en),
native video for the YPetz recording, and a **Watch on BIRS** link for BIRS recordings. BIRS video files return HTTP 403
when requested with a localhost or the live site's referrer, while playback on the
official BIRS page works. Do not embed those direct MP4 URLs or bypass that restriction.
YouTube and YPetz sources are attached only after a click. Original host
links remain available for blocked/unsupported playback and visitors without
JavaScript. Controls have labels, keyboard focus, responsive dimensions, and live
status messages. Captions and third-party player behavior depend on the recordings
provided by their hosts. No remote thumbnails, feed service, or player library was added.
The QIP 2024 owner has disabled off-site embedding (confirmed in the actual player),
so that card also opens its host directly. The new FFCS and YPetz recordings both
played in the local preview. The data's `embed: false` switch supports this host policy
without removing a recording or displaying a known broken player.

The second visual pass adds subtle teal/copper accents, an owner-selected **|CH⟩** monogram,
rounded cards and profile links, and clearer bibliography/talk metadata. System fonts
and lightweight CSS remain.

### Research funding, 12 October 2026

The research page is aimed at researchers, with an accessible introduction close to
the original text. The owner requested a structure based on the grants supporting
the group and supplied all three current award identifiers. Descriptions summarize
the public project scopes; they do not assign unconfirmed work packages or papers
to the group.

| Funding | Primary source and scope |
| --- | --- |
| DFG 550206990 | [GEPRIS project record](https://gepris.dfg.de/project/550206990?lang=en): *Tracking information flow in quantum networks via new divergence measures*. Information contraction, entanglement/coherence, noisy circuits, communication, and learning. |
| BMFTR / QUICS, 13N17418 | [Official QUICS website](https://quics.gwdg.de/en/) and [GWDG project record](https://gwdg.de/en/projects/quics/quics/): quantum-computing service centre for SMEs, algorithms, realistic simulation, advice, and training. Award number supplied by the owner; use the current BMFTR name. |
| EXC 2123/2 QuantumFrontiers, 390837967 | [Official research overview](https://www.quantumfrontiers.de/en/research) and [funding acknowledgement](https://www.quantumfrontiers.de/en/research/publications): fundamental quantum physics, scalable systems, and precision measurement. |
| Previous MSCA / TITAN, 101025848 | [CORDIS](https://cordis.europa.eu/project/id/101025848): started 1 August 2021 and actually ended 31 January 2024. The separate 31 July 2024 end date is the original schedule; do not use it as the actual end. The owner confirmed the fellowship ended with the move to Hannover. |

Current project end dates and group-specific roles are not inferred from wider
programme periods. TITAN's collaborators, EU flag, and acknowledgement are retained
under **Previous funding**. The sitewide footer now points to current and previous
support instead of presenting the historical EU fellowship as current. The old
research page and project fragment URLs are preserved, as is the word-cloud asset
URL; the word cloud is no longer displayed. Project content is separate from its
shared card template in `_data/funding.yml`.

The three current-funding cards use original, locally served logos, downloaded
on 12 October 2026. Their proportions and colours are unchanged; intrinsic image
dimensions reserve space, and CSS controls the display size. No logo server is
contacted when visiting the page. The existing EU flag remains on the previous
fellowship card.

| Local asset | Official source |
| --- | --- |
| `images/funding/dfg-funded-by-en.gif` | Blue English funding wordmark, extracted unchanged from the [DFG funding-logo package](https://www.dfg.de/resource/blob/173984/dfg-logo-foerderung-international.zip), linked on the [DFG logo page](https://www.dfg.de/de/service/logo-corporate-design). |
| `images/funding/quics.png` | [QUICS logo](https://quics.gwdg.de/logos/quics_logo.png), used on the official project's homepage. |
| `images/funding/quantumfrontiers.png` | [QuantumFrontiers logo](https://www.quantumfrontiers.de/fileadmin/site-templates/logos/qf/QF-Logo-2024.png), used in the official site's header. |

DFG's [third-party logo guidance](https://www.dfg.de/resource/blob/172958/styleguide-dfg-logo-externe-websites.pdf)
requires the full wordmark, a plain background, and clear space. The English
“Funded by” variant is placed on white with extra padding. The guidance also says
third-party use should be agreed with DFG's press office before publication.
Before merging the draft, the owner should confirm that this use is already
covered or arrange that coordination. No press-office message has been sent.
Logo rights remain with the respective organisations; these assets are not
relicensed as original site artwork.

### Group and news, 12 October 2026

The Group tab preserves `/team/` and replaces its directory-only placeholder with
four profile cards. The [official staff directory](https://www.tnt.uni-hannover.de/de/staff/)
lists Muhammad Zain Ul Hassan, Janani Gomathi Rajagopal, and Oxana Shaya under
**Professor Hirches Gruppe**. Other institute groups are not imported.

Short research interests/project labels come from the individual profiles:
[Hirche](https://www.tnt.uni-hannover.de/de/staff/hirche/),
[Hassan](https://www.tnt.uni-hannover.de/de/staff/hassan/),
[Rajagopal](https://www.tnt.uni-hannover.de/de/staff/rajagopa/), and
[Shaya](https://www.tnt.uni-hannover.de/de/staff/shaya/).
The latter three profiles do not specify doctoral/postdoctoral employment roles;
the page uses the neutral label “Group member”. Telephone and office information
remain on the institute profiles to avoid another copy to maintain.

The owner chose the institute portrait for Hirche on the Group page only; the
homepage keeps its existing photograph. All four public portraits were downloaded
unchanged on 12 October 2026 from
`https://www.tnt.uni-hannover.de/staff/{hirche,hassan,rajagopa,shaya}/portrait.jpg`, as
linked by their profiles. All four are 600 × 800 JPEGs and are served locally from
`images/group/`. Photo rights remain with the original rights holders.
All cards use the same “Research interests” label and short noun phrases. Rajagopal's
entry reads “Information measures”, based on her listed project; no extra research
specialism or job title is inferred.

The new private-capacity news item uses **12 October 2026 as its announcement
date**, not a claimed submission date. It links two preprints already present
in the bibliography: [Quantum estimation, channel orders, and private capacity](https://arxiv.org/abs/2610.03706),
submitted 2 October 2026, and [The exact strong converse exponent for private
communication over quantum channels](https://arxiv.org/abs/2609.38144), submitted
29 September 2026 with Hao-Chung Cheng and Marco Tomamichel. Neither is labelled
as a journal publication.

### Publication filters, 12 October 2026

After trying a separate local demo, the owner requested its search feature on the
publications page. The implementation combines title/author search, publication
type, and year, using the existing 51 records. The neutral example is “quantum
channels”. Case and accents are normalized for matching; every query word must
occur in the title or author text. Empty years and their navigation links hide
together, and a labelled status reports the result count. Clear restores the full
list and returns focus to search.

The complete bibliography remains in the HTML. Controls are revealed only after
the small local script initializes, so visitors without JavaScript retain all
papers, DOI/arXiv links, and year navigation. No new package, remote search service,
search-query tracking, or topic tags are introduced. A dependency-free behavior
check covers combined filtering, accented names, empty results, reset, and form
submission prevention; the rendered page is also checked in the browser.

### News milestones and opportunities, 12 October 2026

The owner approved two additional news items to fill the January–October gap.
They are dated by the underlying publication/talk milestone, not the day these
website entries were added:

- **22 May 2026:** [Quantum Doeblin Coefficients: Interpretations and Applications](https://doi.org/10.22331/q-2026-05-22-2115),
  published in *Quantum* 10, 2115, with Ian George, Theshani Nuradha, and Mark M. Wilde.
  The short description summarizes its computable tools for information loss in
  noisy quantum systems without claiming every coefficient in the paper is computable.
- **17 July 2026:** [BIRS recording](https://www.birs.ca/events/2026/5-day-workshops/26w5621/videos/watch/202607171033-Hirche.html)
  of “Conditional contraction coefficients and their applications to quantum networks”.
  The official recording page gives 17 July, 10:33–11:13. The news link opens the
  existing recording card on the site's Talks page.

Position availability, the invitation to collaborate, and Bachelor/Master thesis
opportunities now live under **Working with us** on Group. The confirmed “no open
positions” statement and TNT student-project link are retained. Vacancies is removed
from navigation, while `/vacancies` remains a compatibility page with an immediate
HTML refresh to `/team/#working-with-us` and a visible fallback link. The redirect
works without JavaScript and respects both supported base paths. Canonical metadata
points to `/team/`; no analytics loader runs on the forwarding page. The existing
URL checker now validates refresh destinations and their target fragments.

## Social alternatives

[Bluesky supports individual post embeds](https://www.bsky.social/about/blog/post-embeds-guide).
[LinkedIn supports eligible public post embeds](https://www.linkedin.com/help/linkedin/answer/a529065/embed-content-from-the-linkedin-feed?lang=en).
These documented options are selected-post embeds, not a direct replacement for a
rolling profile timeline. Prefer the local news list plus profile links for predictable
layout and maintenance. No Bluesky handle is assumed and no new feed provider is added.

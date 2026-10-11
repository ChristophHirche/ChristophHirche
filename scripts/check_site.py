"""Check the built site's URL contract, local links/assets, and basic semantics.

Usage: python scripts/check_site.py _site --baseurl /ChristophHirche
Uses only the Python standard library; does not contact external websites.
"""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.links, self.ids, self.errors = [], set(), []
        self.main = self.h1 = self.title = 0
        self.analytics = []
        self.recordings = self.bibliography_entries = 0
        self.media_sources = []
        self.lang = None
        self.feed(text)

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        classes = attrs.get('class', '').split()
        if 'talk-player' in classes: self.recordings += 1
        if 'bibliography-item' in classes: self.bibliography_entries += 1
        if tag in ('iframe', 'video', 'audio', 'source') and attrs.get('src'):
            self.media_sources.append(attrs['src'])
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'main': self.main += 1
        if tag == 'h1': self.h1 += 1
        if tag == 'title': self.title += 1
        if tag == 'script' and attrs.get('src', '').endswith('/assets/js/analytics.js'):
            self.analytics.append(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids: self.errors.append('Duplicate id: ' + attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'img' and 'alt' not in attrs: self.errors.append('Image is missing alt text')
        if tag == 'iframe' and not attrs.get('title'): self.errors.append('Iframe is missing a title')
        for attr in ['href', 'src']:
            if attr in attrs and attrs[attr] is not None:
                self.links.append(attrs[attr])
                if re.search(r'\s', attrs[attr]): self.errors.append('Whitespace in URL: ' + attrs[attr])


def check(destination, baseurl, contract, analytics='absent'):
    root = destination.resolve()
    errors, pages = [], {}
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in ('', '.html'): continue
        text = path.read_text(encoding='utf-8')
        if not re.search(r'<html\b', text, re.I): continue
        page = Page(text)
        pages[path.resolve()] = page
        for label, valid in [('language', bool(page.lang)), ('one main landmark', page.main == 1),
                             ('one h1', page.h1 == 1), ('one document title', page.title == 1)]:
            if not valid: page.errors.append('Expected ' + label)
        if '{{' in text or '{%' in text: page.errors.append('Unrendered Liquid markup')
        if page.recordings and page.media_sources:
            page.errors.append('Recordings must not have a media source before the visitor clicks')
        if re.search(r'&lt;(?:div|section|article|h[1-6]|img|ul|p)(?:&gt;|\s)', text):
            page.errors.append('HTML component was rendered as escaped text')
        if analytics == 'absent' and page.analytics:
            page.errors.append('Analytics must be absent from preview builds')
        if analytics == 'production':
            if len(page.analytics) > 1:
                page.errors.append('Duplicate production analytics loaders')
            elif page.analytics and not re.fullmatch(r'G-[A-Z0-9]+', page.analytics[0].get('data-measurement-id', '')):
                page.errors.append('Invalid analytics measurement ID')
        errors.extend(f'{path.relative_to(root)}: {err}' for err in page.errors)

    def resolve(urlpath):
        local = unquote(urlpath).lstrip('/')
        candidates = [root / local, root / local / 'index.html', root / (local + '.html')]
        return next((p.resolve() for p in candidates if p.is_file() and p.resolve().is_relative_to(root)), None)

    for route in json.loads(contract.read_text(encoding='utf-8')):
        target = resolve(route)
        if target not in pages: errors.append('Missing preserved page URL: ' + route)
    for path, page in pages.items():
        rel = '/' + path.relative_to(root).as_posix()
        page_url = 'https://christophhirche.github.io' + baseurl + rel
        for link in page.links:
            if not link: continue
            url = urlsplit(urljoin(page_url, link))
            if url.scheme not in ('http', 'https') or url.netloc != 'christophhirche.github.io': continue
            if baseurl and url.path != baseurl and not url.path.startswith(baseurl + '/'):
                errors.append(f'{rel}: URL escapes project base path: {link}')
                continue
            target = resolve(url.path[len(baseurl):])
            if target is None: errors.append(f'{rel}: Missing local link/asset: {link}')
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f'{rel}: Missing anchor: {link}')
    if not pages: errors.append('No built HTML pages found')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} pages; preserved URLs, internal links/assets, anchors, and basic HTML semantics ({baseurl or "/"}).')
    print(f'Analytics loaders: {sum(len(page.analytics) for page in pages.values())}; mode: {analytics}.')
    print(f'Bibliography entries: {sum(page.bibliography_entries for page in pages.values())}; click-to-load recordings: {sum(page.recordings for page in pages.values())}.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--baseurl', default='/ChristophHirche')
    parser.add_argument('--analytics', choices=['absent', 'production'], default='absent')
    args = parser.parse_args()
    check(args.destination, args.baseurl.rstrip('/'), Path(__file__).with_name('url-contract.json'), args.analytics)

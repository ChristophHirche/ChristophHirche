// Exercise filtering behavior without a browser or third-party test dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../assets/js/publications.js'), 'utf8');

function fixture(initialQuery = '') {
  const specs = [
    ['comparison-preprint', 'Quantum channel comparison', 'Zoë Example', 'Preprint', '2026'],
    ['comparison-journal', 'Quantum channel comparison', 'René Example', 'Journal article', '2025'],
    ['privacy-journal', 'Privacy of quantum channels', 'Alice Example', 'Journal article', '2026'],
    ['learning-thesis', 'Quantum learning', 'Bob Example', 'Master’s thesis', '2024']
  ];
  const rows = specs.map(([id, title, authors, type, year]) => ({
    id, hidden: false, dataset: {type, year},
    querySelector: selector => ({textContent: selector === 'h3' ? title : authors})
  }));
  const sections = ['2026', '2025', '2024'].map(year => ({
    hidden: false,
    getAttribute: () => 'year-' + year,
    querySelectorAll: () => rows.filter(row => row.dataset.year === year)
  }));
  const links = Object.fromEntries(['2026', '2025', '2024'].map(year => [year, {hidden: false}]));
  const query = {value: initialQuery, focus() { this.focused = true; }};
  const type = {value: ''};
  const year = {value: ''};
  const clear = {addEventListener(event, action) { this[event] = action; }};
  const form = {
    hidden: true, events: {},
    querySelector: selector => ({'[name="query"]': query, '[name="type"]': type, '[name="year"]': year, button: clear})[selector],
    addEventListener(event, action) { this.events[event] = action; },
    reset() { query.value = ''; type.value = ''; year.value = ''; }
  };
  const list = {
    querySelectorAll: selector => selector === '.bibliography-item' ? rows : sections,
    querySelector: selector => links[selector.match(/year-(\d+)/)[1]]
  };
  const status = {hidden: true, textContent: ''};
  const empty = {hidden: true};
  const document = {
    querySelector: () => form,
    getElementById: id => ({'publication-results': list, 'publication-status': status, 'publication-empty': empty})[id]
  };
  assert.equal(rows.filter(row => !row.hidden).length, 4, 'All papers are available before scripting');
  vm.runInNewContext(script, {document});
  return {query, type, year, form, clear, status, empty, sections, links, visible: () => rows.filter(row => !row.hidden).map(row => row.id)};
}

const page = fixture();
assert.equal(page.form.hidden, false);
assert.equal(page.status.hidden, false);
assert.equal(page.status.textContent, '4 of 4 publications shown');
page.query.value = '  COMPARISON quantum  ';
page.form.events.input();
assert.deepEqual(page.visible(), ['comparison-preprint', 'comparison-journal']);
page.type.value = 'Preprint';
page.year.value = '2026';
page.form.events.change();
assert.deepEqual(page.visible(), ['comparison-preprint'], 'Text, type and year must intersect');
assert.equal(page.links['2025'].hidden, true);
assert.equal(page.links['2026'].hidden, false);
page.year.value = '2024';
page.form.events.change();
assert.deepEqual(page.visible(), []);
assert.equal(page.empty.hidden, false);
assert.equal(page.status.textContent, '0 of 4 publications shown');
assert.ok(page.sections.every(section => section.hidden));
assert.ok(Object.values(page.links).every(link => link.hidden));
page.clear.click();
assert.equal(page.visible().length, 4);
assert.equal(page.empty.hidden, true);
assert.equal(page.query.focused, true);
assert.equal(page.type.value, '');
assert.equal(page.year.value, '');
assert.ok(page.sections.every(section => !section.hidden));
assert.ok(Object.values(page.links).every(link => !link.hidden));
page.query.value = 'RENE';
page.form.events.input();
assert.deepEqual(page.visible(), ['comparison-journal'], 'Author search ignores accents and case');
page.query.value = 'zoe';
page.form.events.input();
assert.deepEqual(page.visible(), ['comparison-preprint']);
page.query.value = ' \t ';
page.form.events.input();
assert.equal(page.visible().length, 4);
let prevented = false;
page.form.events.submit({preventDefault() { prevented = true; }});
assert.equal(prevented, true, 'Pressing Enter must not navigate or submit a search');
assert.deepEqual(fixture('rene').visible(), ['comparison-journal'], 'Initial restored input is applied');
console.log('PASS: combined filters, accented author names, year navigation, no results, reset, and local-only form behavior.');

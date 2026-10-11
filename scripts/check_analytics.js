// Exercise analytics guards without contacting Google or a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/analytics.js'), 'utf8');

function run({host = 'christophhirche.github.io', id = 'G-N71H8YPM4R', privacy = {}} = {}) {
  const inserted = [];
  const window = {location: {hostname: host}};
  const context = {
    window,
    navigator: privacy,
    document: {
      currentScript: {dataset: {measurementId: id, siteHost: 'christophhirche.github.io'}},
      createElement: () => ({}),
      head: {appendChild: tag => inserted.push(tag)}
    }
  };
  vm.runInNewContext(source, context);
  return {inserted, window};
}

const live = run();
assert.equal(live.inserted.length, 1);
assert.equal(live.inserted[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-N71H8YPM4R');
assert.equal(live.inserted[0].async, true);
assert.equal(live.window.dataLayer[1][0], 'config');
assert.equal(live.window.dataLayer[1][1], 'G-N71H8YPM4R');
assert.equal(live.window.dataLayer[1][2].allow_google_signals, false);
assert.equal(live.window.dataLayer[1][2].allow_ad_personalization_signals, false);
for (const scenario of [
  {host: 'localhost'}, {host: '127.0.0.1'}, {host: 'preview.example.org'},
  {id: ''}, {id: 'not-a-measurement-id'},
  {privacy: {doNotTrack: '1'}}, {privacy: {globalPrivacyControl: true}}
]) {
  const result = run(scenario);
  assert.equal(result.inserted.length, 0, JSON.stringify(scenario));
  assert.equal(result.window.dataLayer, undefined, JSON.stringify(scenario));
}
assert.equal(run({privacy: {doNotTrack: '0', globalPrivacyControl: false}}).inserted.length, 1);
console.log('PASS: analytics host, configuration, and browser privacy guards; no network requests.');

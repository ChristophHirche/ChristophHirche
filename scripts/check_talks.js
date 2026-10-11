// Check that no third-party player is created until a visitor activates it.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../assets/js/talks.js'), 'utf8');

function recording(provider, video) {
  const button = {hidden: true, addEventListener(event, action, options) {
    assert.equal(event, 'click');
    assert.equal(options.once, true);
    this.activate = action;
  }};
  const status = {textContent: ''};
  const container = {
    dataset: {provider, video, title: 'A recorded research talk'},
    parentElement: {querySelector: () => status},
    querySelector: () => button,
    replaceChildren(player) { this.player = player; },
  };
  return {container, button, status};
}

async function main() {
  const youtube = recording('youtube', 'THx61mXKlBQ');
  const birs = recording('birs', 'https://videos.birs.ca/2026/26w5621/202607171033-Hirche.mp4');
  const invalid = [
    recording('youtube', '<invalid>'),
    recording('birs', 'http://videos.birs.ca/talk.mp4'),
    recording('birs', 'https://videos.birs.ca.evil.example/talk.mp4'),
    recording('birs', 'https://videos.birs.ca:8080/talk.mp4'),
    recording('birs', 'https://user:password@videos.birs.ca/talk.mp4'),
    recording('birs', 'javascript:alert(1)'),
    recording('unknown', 'https://example.com/talk.mp4'),
  ];
  const entries = [youtube, birs, ...invalid];
  const created = [];
  const document = {
    querySelectorAll: () => entries.map(entry => entry.container),
    createElement(tag) {
      const player = {tag, handlers: {},
        setAttribute(key, value) { this[key] = value; },
        addEventListener(event, action) { this.handlers[event] = action; },
        focus() { this.focused = true; },
        play() { return Promise.reject(new Error('Playback requires controls')); },
      };
      created.push(player);
      return player;
    },
  };
  vm.runInNewContext(script, {document, URL});
  assert.equal(created.length, 0, 'Loading the page must not create a player');
  for (const entry of [youtube, birs]) assert.equal(entry.button.hidden, false);
  for (const entry of invalid) {
    assert.equal(entry.button.hidden, true);
    assert.equal(entry.button.activate, undefined);
  }
  youtube.button.activate();
  const frame = youtube.container.player;
  assert.equal(frame.tag, 'iframe');
  assert.equal(frame.src, 'https://www.youtube-nocookie.com/embed/THx61mXKlBQ?autoplay=1&rel=0');
  assert.equal(frame.title, youtube.container.dataset.title);
  assert.equal(frame.focused, true);
  assert.equal(frame.allowFullscreen, true);
  assert.equal(frame.referrerPolicy, 'strict-origin-when-cross-origin');
  assert.equal(birs.container.player, undefined, 'Other recordings remain unloaded');
  birs.button.activate();
  await Promise.resolve();
  const video = birs.container.player;
  assert.equal(video.tag, 'video');
  assert.equal(video.src, birs.container.dataset.video);
  assert.equal(video.controls, true);
  assert.equal(video.playsInline, true);
  assert.equal(video.preload, 'none');
  assert.equal(video['aria-label'], birs.container.dataset.title);
  assert.equal(video.focused, true);
  assert.match(birs.status.textContent, /watch on BIRS/);
  video.handlers.error();
  assert.match(birs.status.textContent, /could not load/);
  assert.equal(created.length, 2);
  console.log('PASS: click-to-load players, provider restrictions, accessible controls, focus, and playback fallback.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

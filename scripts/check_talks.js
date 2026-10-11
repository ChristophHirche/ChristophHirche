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

function main() {
  const youtube = recording('youtube', 'THx61mXKlBQ');
  const second = recording('youtube', '_jxQPPT2uo4');
  const ypetz = recording('ypetz', 'https://ypetz.filippo.info/talks/hirche/hirche.mp4');
  const invalid = [
    recording('youtube', '<invalid>'),
    recording('youtube', ''),
    recording('youtube', 'https://example.com/watch'),
    recording('birs', 'https://videos.birs.ca/2026/26w5621/202607171033-Hirche.mp4'),
    recording('ypetz', 'https://example.com/talk.mp4'),
    recording('ypetz', 'https://ypetz.filippo.info.example.com/talks/hirche/hirche.mp4'),
    recording('unknown', 'https://example.com/talk.mp4'),
  ];
  const entries = [youtube, second, ypetz, ...invalid];
  const created = [];
  const document = {
    querySelectorAll: () => entries.map(entry => entry.container),
    createElement(tag) {
      const player = {tag,
        setAttribute(name, value) { this[name] = value; },
        focus() { this.focused = true; },
      };
      created.push(player);
      return player;
    },
  };
  vm.runInNewContext(script, {document});
  assert.equal(created.length, 0, 'Loading the page must not create a player');
  for (const entry of [youtube, second, ypetz]) assert.equal(entry.button.hidden, false);
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
  assert.equal(frame.tabIndex, 0);
  assert.equal(frame.allowFullscreen, true);
  assert.equal(frame.referrerPolicy, 'strict-origin-when-cross-origin');
  assert.equal(second.container.player, undefined, 'Other recordings remain unloaded');
  assert.match(youtube.status.textContent, /Watch on YouTube link/);
  assert.equal(created.length, 1);
  ypetz.button.activate();
  const native = ypetz.container.player;
  assert.equal(native.tag, 'video');
  assert.equal(native.src, ypetz.container.dataset.video);
  assert.equal(native['aria-label'], ypetz.container.dataset.title);
  assert.equal(native.controls, true);
  assert.equal(native.playsInline, true);
  assert.equal(native.autoplay, true);
  assert.equal(native.focused, true);
  assert.match(ypetz.status.textContent, /Watch on YPetz link/);
  assert.equal(created.length, 2);
  console.log('PASS: click-to-load players, provider restrictions, accessible labels, focus, and fallback guidance.');
}
main();

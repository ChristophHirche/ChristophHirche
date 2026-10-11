// Create a player only after the visitor chooses to load that recording.
(() => {
  document.querySelectorAll('.talk-player').forEach(container => {
    const button = container.querySelector('button');
    const status = container.parentElement.querySelector('.player-status');
    const {provider, video, title} = container.dataset;
    let source;
    if (provider === 'youtube' && /^[\w-]{11}$/.test(video || '')) {
      source = 'https://www.youtube-nocookie.com/embed/' + video + '?autoplay=1&rel=0';
    } else if (provider === 'birs') {
      try {
        const url = new URL(video);
        if (url.origin === 'https://videos.birs.ca' && !url.username && !url.password && url.pathname.endsWith('.mp4')) source = url.href;
      } catch (_) { /* The original recording link remains available. */ }
    }
    if (!source || !button) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const player = document.createElement(provider === 'youtube' ? 'iframe' : 'video');
      player.className = 'recording-player';
      player.tabIndex = 0;
      if (provider === 'youtube') {
        player.title = title;
        player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
      } else {
        player.controls = true;
        player.playsInline = true;
        player.preload = 'none';
        player.setAttribute('aria-label', title);
        player.addEventListener('error', () => {
          status.textContent = 'The recording could not load here. Use the link to watch on BIRS.';
        });
      }
      player.src = source;
      container.replaceChildren(player);
      status.textContent = 'Recording loaded from ' + (provider === 'youtube' ? 'YouTube' : 'BIRS') + '.';
      player.focus();
      if (provider === 'birs') player.play().catch(() => {
        status.textContent = 'If playback does not start, use the video controls or the link to watch on BIRS.';
      });
    }, {once: true});
  });
})();

// Create a player only after the visitor chooses to load that recording.
(() => {
  document.querySelectorAll('.talk-player').forEach(container => {
    const button = container.querySelector('button');
    const status = container.parentElement.querySelector('.player-status');
    const {provider, video, title} = container.dataset;
    const youtube = provider === 'youtube' && /^[\w-]{11}$/.test(video || '');
    const ypetz = provider === 'ypetz' && /^https:\/\/ypetz\.filippo\.info\/talks\/[a-z-]+\/[a-z-]+\.mp4$/.test(video || '');
    if ((!youtube && !ypetz) || !button) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const player = document.createElement(youtube ? 'iframe' : 'video');
      player.className = 'recording-player';
      player.tabIndex = 0;
      player.title = title;
      if (youtube) {
        player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
        player.src = 'https://www.youtube-nocookie.com/embed/' + video + '?autoplay=1&rel=0';
      } else {
        player.setAttribute('aria-label', title);
        player.controls = true;
        player.playsInline = true;
        player.preload = 'none';
        player.autoplay = true;
        player.src = video;
      }
      container.replaceChildren(player);
      const host = youtube ? 'YouTube' : 'YPetz';
      status.textContent = 'Recording loaded from ' + host + '. If playback is unavailable, use the Watch on ' + host + ' link.';
      player.focus();
    }, {once: true});
  });
})();

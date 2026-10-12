// Keep the existing GA4 property, but never count localhost or review previews.
(() => {
  const script = document.currentScript;
  const id = script?.dataset.measurementId;
  if (!/^G-[A-Z0-9]+$/.test(id || "")) return;
  if (window.location.hostname !== script.dataset.siteHost) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === "1") return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(tag);
})();

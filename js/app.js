/* ===================================================================
   APP — entry point, global init
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* PWA is progressive enhancement — silently ignore on unsupported hosts */
    });
  });
}


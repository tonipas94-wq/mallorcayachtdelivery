/* Mallorca Yacht Delivery · Analítica (Google Analytics 4) con consentimiento previo.
   - GA4 solo se carga si el visitante pulsa «Aceptar». Sin consentimiento no se instala ninguna cookie.
   - Para activarlo, pegue su ID de medición (G-XXXXXXXXXX) en GA_ID. Mientras esté vacío, no hay banner ni analítica.
   - Eventos medidos: clic en WhatsApp, teléfono y email, pasos del cotizador y solicitud enviada (generate_lead). */
(() => {
  const GA_ID = '';
  const KEY = 'myd.consent.v1';
  const EN = (document.documentElement.lang || 'es').startsWith('en');
  const T = EN
    ? {msg: 'We use analytics cookies (Google Analytics) only if you accept them, to learn how the site is used and improve it.', more: 'Cookie policy', ok: 'Accept', no: 'Reject'}
    : {msg: 'Usamos cookies de analítica (Google Analytics) solo si las acepta, para saber cómo se usa la web y mejorarla.', more: 'Política de cookies', ok: 'Aceptar', no: 'Rechazar'};
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  let loaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  function load(){
    if (loaded || !GA_ID) return; loaded = true;
    window.gtag = gtag;
    gtag('consent', 'default', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted'});
    gtag('js', new Date()); gtag('config', GA_ID, {anonymize_ip: true});
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
  }
  /* API pública: window.mydTrack('evento', {parámetros}). No hace nada sin consentimiento. */
  window.mydTrack = (name, params = {}) => { if (loaded) gtag('event', name, params); };

  function banner(){
    if (document.getElementById('myd-cc')) return;
    const css = document.createElement('style');
    css.textContent = '#myd-cc{position:fixed;z-index:2000;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));max-width:560px;margin-inline:auto;display:grid;gap:12px;padding:16px 18px;border-radius:14px;background:#0B2340;color:#E7EEF5;border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 50px rgba(0,0,0,.35);font:14px/1.5 Inter,system-ui,sans-serif}#myd-cc a{color:#8CC0EE}#myd-cc div{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}#myd-cc button{font:600 14px Inter,system-ui,sans-serif;padding:10px 18px;border-radius:10px;cursor:pointer;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}#myd-cc button.ok{background:#fff;color:#0A1C30;border-color:#fff}';
    document.head.appendChild(css);
    const b = document.createElement('div'); b.id = 'myd-cc'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookies');
    b.innerHTML = `<p>${T.msg} <a href="/cookies/">${T.more}</a></p><div><button type="button" class="no">${T.no}</button><button type="button" class="ok">${T.ok}</button></div>`;
    b.querySelector('.ok').onclick = () => { set('granted'); b.remove(); load(); };
    b.querySelector('.no').onclick = () => { set('denied'); b.remove(); };
    document.body.appendChild(b);
  }
  function init(){
    if (!GA_ID) return;
    const c = get();
    if (c === 'granted') load(); else if (c !== 'denied') banner();
    /* Enlaces «Configurar cookies» (data-cookie-settings) para cambiar de opinión */
    document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')){ e.preventDefault(); try { localStorage.removeItem(KEY); } catch (_) {} banner(); } });
  }
  /* Clics de contacto */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return; const h = a.getAttribute('href');
    const where = a.closest('.fab') ? 'flotante' : a.closest('header') ? 'cabecera' : a.closest('.hero,.phero') ? 'portada' : a.closest('#q-done') ? 'cotizador' : a.closest('footer') ? 'pie' : 'contenido';
    if (h.startsWith('https://wa.me')) window.mydTrack('whatsapp_click', {ubicacion: where});
    else if (h.startsWith('tel:')) window.mydTrack('phone_click', {ubicacion: where});
    else if (h.startsWith('mailto:')) window.mydTrack('email_click', {ubicacion: where});
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

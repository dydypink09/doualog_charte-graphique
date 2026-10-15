/* DOUALOG — Sprite d'icônes (charte §05 : grille 24×24, trait 1,8, extrémités arrondies, aucun remplissage).
   Les 15 premières icônes reprennent la planche de la charte ; les suivantes sont dessinées dans le même style.
   Usage : <svg class="c-icon" aria-hidden="true"><use href="#i-eye"></use></svg> */
(function () {
  var I = {
    /* — Planche charte — */
    'dashboard':  '<path d="M4 11l8-7 8 7"/><path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9"/>',
    'dossiers':   '<path d="M3 7a1 1 0 011-1h5l2 2h9a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>',
    'transport':  '<path d="M14 17V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M15 17H9M19 17h1a1 1 0 001-1v-3.6a1 1 0 00-.2-.6l-2.7-3.4a1 1 0 00-.8-.4H14"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',   /* camion */
    'mandat':     '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="12" cy="10" r="2.2"/><path d="M8 16c0-1.8 1.8-3 4-3s4 1.2 4 3"/>',
    'clients':    '<path d="M17 20h5v-1a4 4 0 00-5.447-3.724M12 12a4 4 0 110-8 4 4 0 010 8zm-8 8v-1a4 4 0 014-4h8a4 4 0 014 4v1H4z"/>',
    'document':   '<path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8l-5-5z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    'mail':       '<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    'bell':       '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
    'rapport':    '<path d="M4 19V5a1 1 0 011-1h9l5 5v10a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M9 13h6M9 17h4"/>',
    'logout':     '<path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M13 20H6a1 1 0 01-1-1V5a1 1 0 011-1h7"/>',
    'sidebar':    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    'search':     '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    'controle':   '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    'valide':     '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/>',
    'check':      '<path d="M20 6L9 17l-5-5"/>',
    'kpi':        '<path d="M9 12h6m-6 4h6M7 8h10M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/>',
    /* — Complément, même style — */
    'eye':        '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'x':          '<path d="M18 6L6 18M6 6l12 12"/>',
    'plus':       '<path d="M12 5v14M5 12h14"/>',
    'chevron-down':  '<path d="M6 9l6 6 6-6"/>',
    'chevron-up':    '<path d="M18 15l-6-6-6 6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    'chevron-left':  '<path d="M15 6l-6 6 6 6"/>',
    'sort':       '<path d="M8 4v16M8 4L4 8M8 4l4 4M16 20V4M16 20l-4-4M16 20l4-4"/>',
    'filter':     '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>',
    'upload':     '<path d="M12 16V4m0 0l-4 4m4-4l4 4"/><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/>',
    'download':   '<path d="M12 4v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/>',
    'paperclip':  '<path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.6-8.6a3.3 3.3 0 014.7 4.7l-8.6 8.6a1.7 1.7 0 01-2.4-2.4L15.5 7.5"/>',
    'send':       '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4 18-7z"/>',
    'reply':      '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 016 6v4"/>',
    'forward':    '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 00-6 6v4"/>',
    'clock':      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'calendar':   '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    'user':       '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/>',
    'link':       '<path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1"/>',
    'external':   '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    'ship':       '<path d="M3 17l1.5 3h15L21 17"/><path d="M5 17V11h14v6"/><path d="M8 11V7h8v4M12 3v4"/>',
    'plane':      '<path d="M10.5 13.5L4 11l1.5-1.5 7 1L17 6a2 2 0 013 3l-4.5 4.5 1 7L15 22l-2.5-6.5L9 19v2.5L7.5 23 6 19l-4-1.5L3.5 16H6z"/>',
    'facture':    '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    'inbox':      '<path d="M3 13l2.5-8h13L21 13v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/><path d="M3 13h5l1.5 3h5L16 13h5"/>',
    'alert':      '<path d="M10.3 4.3L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z"/><path d="M12 10v4M12 17.5h.01"/>',
    'info':       '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    'maximize':   '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    'minimize':   '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
    'more':       '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    'lock':       '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    'refresh':    '<path d="M20 11a8 8 0 00-14.9-3.5M4 4v4h4"/><path d="M4 13a8 8 0 0014.9 3.5M20 20v-4h-4"/>',
    'edit':       '<path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    'pdf':        '<path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8l-5-5z"/><path d="M14 3v5h5"/><path d="M8.5 16v-4h1.3a1.2 1.2 0 010 2.4H8.5M13 12v4h1a2 2 0 000-4h-1"/>',
    'camera':     '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    'phone':      '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>',
    'key':        '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
    'package':    '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    'container':  '<rect x="2" y="6" width="20" height="12" rx="1"/><path d="M6 6v12M10 6v12M14 6v12M18 6v12"/>',
    'scale':      '<path d="M12 3v18M7 21h10"/><path d="M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0L5 7zM19 7l-3 7a3 3 0 006 0l-3-7z"/>',
    'arrow-right':'<path d="M5 12h14M13 6l6 6-6 6"/>',
    'settings':   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'
  };

  var out = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
  for (var k in I) {
    out += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</symbol>';
  }
  out += '</svg>';

  function inject() { document.body.insertAdjacentHTML('afterbegin', out); }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);

  window.DOUALOG_ICONS = Object.keys(I);
})();

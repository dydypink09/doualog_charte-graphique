/* DOUALOG — Charte graphique : interactions de la page (aucune dépendance) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pdf = /[?&]pdf\b/.test(location.search);   /* génération du PDF : aucune animation */
  var reduit = pdf || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (pdf) document.documentElement.classList.remove('js');
  function icon(n, cls) { return '<svg class="c-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"></use></svg>'; }

  /* ── Planche d'icônes : le sprite de l'application ─────────── */
  var noms = {
    dashboard: 'Tableau de bord', dossiers: 'Dossiers', transport: 'Transport', mandat: 'Mandats', clients: 'Clients',
    document: 'Documents', mail: 'Messagerie', bell: 'Notifications', rapport: 'Rapports', settings: 'Paramètres',
    logout: 'Déconnexion', search: 'Recherche', controle: 'Contrôle', valide: 'Validé', facture: 'Facture',
    ship: 'Maritime', plane: 'Aérien', container: 'Conteneur', 'package': 'Colis', eye: 'Ouvrir'
  };
  var liste = window.DOUALOG_ICONS || [];
  $('#icons').innerHTML = liste.map(function (n) { return '<div>' + icon(n) + (noms[n] || n) + '</div>'; }).join('');
  var nbIcons = $('#nb-icons');
  if (nbIcons && liste.length) { nbIcons.dataset.count = liste.length; nbIcons.textContent = liste.length; }

  /* ── Correspondance des statuts (reprise de data.js des maquettes) ── */
  var statuts = {
    dossier: [['En attente de documents', 'warning'], ['En cours de traitement', 'info'], ['Déclaration stockée', 'info'], ['Déclaration anticipée', 'special'],
      ['Contrôle physique en cours', 'warning'], ['Contrôle documentaire en cours', 'warning'], ['Info manquante', 'danger'], ['BAE obtenu', 'success'],
      ['BAS obtenu', 'success'], ['En facturation', 'special'], ['Facturé', 'success'], ['Livré', 'success'], ['Clôturé', 'neutral']],
    transport: [['Demande de transport envoyée', 'info'], ['À confirmer', 'warning'], ['Confirmé', 'info'], ['Camion affecté', 'info'],
      ['Chargement', 'info'], ['En route', 'info'], ['Livré', 'success'], ['Pas de livraison', 'neutral']],
    facture: [['En facturation', 'special'], ['Facture émise', 'info'], ['Partiellement réglé', 'warning'], ['Réglé', 'success']]
  };
  Object.keys(statuts).forEach(function (fam) {
    $('#map-' + fam).innerHTML = statuts[fam].map(function (s) {
      return '<tr><td><span class="c-badge c-badge--' + s[1] + '">' + s[0] + '</span></td></tr>';
    }).join('');
  });

  /* ── Sommaire et navigation latérale ───────────────────────── */
  var chapitres = $$('.ch-art[data-n]');
  $('#toc').innerHTML = chapitres.map(function (s) {
    return '<li><a href="#' + s.id + '"><span class="n">' + s.dataset.n + '</span>' + s.dataset.titre + '<span class="arr">' + icon('arrow-right', 'c-icon--sm') + '</span></a></li>';
  }).join('');
  $('#rail').innerHTML = chapitres.map(function (s) {
    return '<li><a href="#' + s.id + '" data-id="' + s.id + '"><i></i>' + s.dataset.n + '<span>' + s.dataset.titre + '</span></a></li>';
  }).join('');
  var liensRail = $$('#rail a');

  /* Progression de lecture, couverture dépassée, chapitre courant */
  var barre = $('#progress'), hero = $('.ch-hero');
  function surDefilement() {
    var h = document.documentElement.scrollHeight - innerHeight;
    barre.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    document.documentElement.classList.toggle('is-past-hero', scrollY > hero.offsetHeight * .7);
    var courant = null;
    chapitres.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * .4) courant = s.id; });
    liensRail.forEach(function (a) { a.classList.toggle('is-current', a.dataset.id === courant); });
  }
  addEventListener('scroll', surDefilement, { passive: true });
  addEventListener('resize', surDefilement);
  surDefilement();

  /* ── Apparition au défilement, en cascade par groupe ───────── */
  $$('.ch-reveal').forEach(function (el) {
    var freres = $$('.ch-reveal', el.parentNode);
    el.style.setProperty('--i', Math.max(0, freres.indexOf(el)));
  });
  if ('IntersectionObserver' in window) {
    var vue = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); vue.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.ch-reveal').forEach(function (el) { vue.observe(el); });
  } else {
    $$('.ch-reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
  addEventListener('beforeprint', function () {
    $$('.ch-reveal').forEach(function (el) { el.classList.add('is-in'); });
    $$('.ch-hero__count b').forEach(function (b) { b.textContent = b.dataset.count; });
  });

  /* ── Compteurs de la couverture ────────────────────────────── */
  if (!reduit) {
    $$('.ch-hero__count b').forEach(function (b) {
      var fin = +b.dataset.count || +b.textContent, t0 = null, d = 1100;
      b.textContent = '0';
      setTimeout(function () {
        requestAnimationFrame(function pas(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
          b.textContent = Math.round(fin * e);
          if (p < 1) requestAnimationFrame(pas);
        });
      }, 2000);
    });
  }

  /* ── Copier une couleur ────────────────────────────────────── */
  var toast = $('#toast'), toastT;
  function annoncer(html) {
    toast.innerHTML = html; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  function copier(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    var t = document.createElement('textarea'); t.value = txt; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) { /* le code reste affiché à l'écran */ }
    t.remove(); return Promise.resolve();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-copy]'); if (!el) return;
    var c = el.dataset.copy;
    copier(c).then(function () { annoncer('<i style="background:' + c + '"></i>Copié : ' + c); },
      function () { annoncer('Code : ' + c); });
  });

  /* ── Vérificateur de contraste ─────────────────────────────── */
  var palette = [
    ['Bleu nuit', '#123259'], ['Bleu marine', '#0C2C5E'], ['Orange DOUALOG', '#F99A00'], ['Orange texte', '#9A5800'],
    ['Texte fort', '#101828'], ['Texte courant', '#344054'], ['Texte secondaire', '#5D6676'], ['Discret', '#98A2B3'],
    ['Fond de travail', '#F4F5F7'], ['Blanc', '#FFFFFF'], ['Orange très clair', '#FFF5E0'],
    ['Succès', '#2E8347'], ['Bloquant', '#B23327']
  ];
  var fg = $('#ct-fg'), bg = $('#ct-bg');
  var opts = palette.map(function (p) { return '<option value="' + p[1] + '">' + p[0] + ' · ' + p[1] + '</option>'; }).join('');
  fg.innerHTML = opts; bg.innerHTML = opts;
  fg.value = '#0C2C5E'; bg.value = '#F99A00';
  function lum(hex) {
    var v = [1, 3, 5].map(function (i) {
      var c = parseInt(hex.substr(i, 2), 16) / 255;
      return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
    });
    return .2126 * v[0] + .7152 * v[1] + .0722 * v[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function verdict(ok, lib) {
    return '<li>' + lib + '<span class="c-badge c-badge--' + (ok ? 'success' : 'danger') + '">' + (ok ? 'Conforme' : 'Refusé') + '</span></li>';
  }
  function majContraste() {
    var r = ratio(fg.value, bg.value);
    var p = $('#ct-preview'); p.style.color = fg.value; p.style.background = bg.value;
    $('#ct-ratio').textContent = r.toFixed(1).replace('.', ',') + ':1';
    $('#ct-checks').innerHTML = verdict(r >= 4.5, 'Texte courant (AA)') + verdict(r >= 3, 'Grand titre, icône') + verdict(r >= 7, 'Renforcé (AAA)');
  }
  fg.addEventListener('change', majContraste); bg.addEventListener('change', majContraste);
  $('#ct-swap').addEventListener('click', function () { var t = fg.value; fg.value = bg.value; bg.value = t; majContraste(); });
  majContraste();

  /* ── Essai de la typographie ───────────────────────────────── */
  var ttTexte = $('#tt-text'), ttTaille = $('#tt-size'), ttOut = $('#tt-out');
  function majType() {
    ttOut.textContent = ttTexte.value || 'DOUALOG';
    ttOut.style.fontSize = ttTaille.value + 'px';
    $('#tt-size-out').textContent = ttTaille.value + ' px';
  }
  ttTexte.addEventListener('input', majType); ttTaille.addEventListener('input', majType);
  $$('.ch-tester [data-w]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.ch-tester [data-w]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      ttOut.style.fontWeight = b.dataset.w;
    });
  });
  majType();

  /* ── Avant / après ─────────────────────────────────────────── */
  var ba = $('#ba');
  function echelle() { ba.style.setProperty('--k', ba.clientWidth / 1200); }
  if ('ResizeObserver' in window) new ResizeObserver(echelle).observe(ba); else addEventListener('resize', echelle);
  echelle();
  $('.ch-ba__range', ba).addEventListener('input', function (e) { ba.style.setProperty('--pos', e.target.value + '%'); });

  /* ── Démo de la courbe ─────────────────────────────────────── */
  var track = $('#track');
  $('#track-btn').addEventListener('click', function () { track.classList.toggle('is-on'); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e, o) {
      if (e[0].isIntersecting) { setTimeout(function () { track.classList.add('is-on'); }, 300); o.disconnect(); }
    }, { threshold: .6 }).observe(track);
  }

  /* ── Un dossier, du premier email à la clôture ─────────────── */
  var etapes = [
    { l: 'Réception', fin: 'done', d: '29/09', s: ['En cours de traitement', 'info'], ev: 'Email du client reçu : dossier créé, accusé de réception envoyé.' },
    { l: 'Déclaration stockée', fin: 'done', d: '01/10', s: ['Déclaration stockée', 'info'], ev: 'Déclaration enregistrée auprès de la douane.' },
    { l: 'Anticipé', fin: 'special', d: '03/10', s: ['Déclaration anticipée', 'special'], ev: 'Déclaration déposée avant l\'arrivée du navire MSC Ilaria.' },
    { l: 'Contrôle douane', fin: 'done', d: '08/10', s: ['Contrôle physique en cours', 'warning'], ev: 'Contrôle physique au terminal : conforme.' },
    { l: 'BAE', fin: 'done', d: '09/10', s: ['BAE obtenu', 'success'], ev: 'Bon à enlever obtenu.' },
    { l: 'BAS', fin: 'done', d: '12/10', s: ['BAS obtenu', 'success'], ev: 'Bon à sortir obtenu : la facturation est lancée.' },
    { l: 'Transport', fin: 'done', d: '14/10', s: ['En facturation', 'special'], ev: 'Camion de Normandie Fret Express affecté, conteneur en route.' },
    { l: 'Livraison', fin: 'done', d: '', s: ['Livré', 'success'], ev: 'Marchandise livrée chez Agrofertil Normandie.' },
    { l: 'Clôture', fin: 'done', d: '', s: ['Clôturé', 'neutral'], ev: 'Facture réglée : dossier clôturé.' }
  ];
  var wf = $('#pl-wf'), badge = $('#pl-badge'), evt = $('#pl-event'), lecture = null;
  function rendre(k) {   /* k = étape en cours ; k >= longueur : tout est terminé */
    wf.innerHTML = etapes.map(function (s, i) {
      var etat = i < k ? s.fin : (i === k ? 'current' : 'todo');
      return '<li class="c-wf__step c-wf__step--' + etat + '"><span class="c-wf__node"></span><span class="c-wf__label">' + s.l + '</span><span class="c-wf__date">' + (i <= k ? s.d : '') + '</span></li>';
    }).join('');
    var e = etapes[Math.min(k, etapes.length - 1)];
    badge.className = 'c-badge c-badge--' + e.s[1]; badge.textContent = e.s[0];
    evt.innerHTML = icon(k >= etapes.length ? 'valide' : 'clock', 'c-icon--sm') + (e.d ? '<b>' + e.d + '</b> · ' : '') + e.ev;
    evt.classList.remove('is-new'); void evt.offsetWidth; evt.classList.add('is-new');
  }
  function jouer() {
    clearInterval(lecture);
    var k = 0; rendre(0);
    if (reduit) { rendre(etapes.length); return; }
    lecture = setInterval(function () {
      k++; rendre(k);
      if (k >= etapes.length) clearInterval(lecture);
    }, 1100);
  }
  rendre(etapes.length);   /* état final par défaut (impression, sans script d'animation) */
  $('#pl-btn').addEventListener('click', jouer);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { jouer(); o.disconnect(); } }, { threshold: .5 }).observe($('#player'));
  }

  /* ── Composants en action ──────────────────────────────────── */
  var shell = $('#shell'), btnShell = $('#shell-toggle');
  function basculerMenu() {
    var ferme = shell.classList.toggle('is-nav-ferme');
    btnShell.lastChild.textContent = ferme ? 'Déplier le menu' : 'Replier le menu';
  }
  btnShell.addEventListener('click', basculerMenu);
  $('[data-shell-toggle]', shell).addEventListener('click', basculerMenu);

  $$('#stats .c-stat').forEach(function (b) {
    b.addEventListener('click', function () { $$('#stats .c-stat').forEach(function (x) { x.classList.toggle('is-active', x === b); }); });
  });

  $$('#chips .c-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('#chips .c-chip').forEach(function (x) { x.classList.toggle('is-active', x === c); });
      var n = 0;
      $$('#rows tr').forEach(function (tr) {
        var ok = tr.dataset.f.split(' ').indexOf(c.dataset.f) > -1;
        tr.hidden = !ok; tr.classList.remove('is-in');
        if (ok) { tr.style.setProperty('--i', n++); void tr.offsetWidth; tr.classList.add('is-in'); }
      });
    });
  });

  var modal = $('#modal'), avantModal = null;
  function ouvrirModal() { avantModal = document.activeElement; modal.hidden = false; $('#m1').focus(); }
  function fermerModal() { modal.hidden = true; if (avantModal) avantModal.focus(); }
  $('#open-modal').addEventListener('click', ouvrirModal);
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) fermerModal(); });

  /* ── Écrans dans l'ordinateur ──────────────────────────────── */
  var macImg = $('#mac-img');
  $$('#mac-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#mac-tabs button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      macImg.classList.add('is-swap');
      setTimeout(function () { macImg.src = b.dataset.src; macImg.alt = b.textContent + ' — DOUALOG'; macImg.classList.remove('is-swap'); }, 160);
    });
  });

  /* ── Validation de la charte (Netlify Forms) ───────────────── */
  var form = $('#approve-form'), fait = $('#approve-done'), err = $('#ap-err');
  function afficherValide(v) {
    form.hidden = true; fait.hidden = false;
    $('#approve-who').textContent = 'Par ' + v.nom + (v.fonction ? ', ' + v.fonction : '') + ', le ' + v.date + '.';
  }
  try {
    var deja = JSON.parse(localStorage.getItem('doualog-charte-validation') || 'null');
    if (deja && deja.version === '2.0') afficherValide(deja);
  } catch (e) { /* stockage indisponible : le formulaire reste affiché */ }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var donnees = new FormData(form);
    var maintenant = new Date();
    var v = { version: '2.0', nom: donnees.get('nom'), fonction: donnees.get('fonction'),
      date: maintenant.toLocaleDateString('fr-FR') + ' à ' + maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    donnees.append('date', v.date);
    var bouton = $('button[type=submit]', form); bouton.disabled = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(donnees).toString() })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        try { localStorage.setItem('doualog-charte-validation', JSON.stringify(v)); } catch (e2) { /* sans mémoire locale */ }
        afficherValide(v);
      })
      .catch(function () {
        err.hidden = false;
        err.textContent = 'La validation n\'a pas pu être envoyée. Vérifiez la connexion, ou ouvrez la charte depuis son adresse en ligne.';
      })
      .then(function () { bouton.disabled = false; });
  });

  /* ── Mode présentation (P, flèches, Échap) ─────────────────── */
  var slides = $$('[data-slide]'), barPres = $('#pres-bar'), idx = 0, enPres = false;
  function montrer(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, j) { s.classList.toggle('is-current', j === idx); if (j === idx) s.scrollTop = 0; });
    $('#pres-num').textContent = (idx + 1) + ' / ' + slides.length;
    $$('.ch-reveal', slides[idx]).forEach(function (el) { el.classList.add('is-in'); });
  }
  function presentation(on) {
    var visible = 0;   /* mesuré avant de masquer les sections */
    if (on) slides.forEach(function (s, j) { if (s.getBoundingClientRect().top < innerHeight / 2) visible = j; });
    enPres = on;
    document.documentElement.classList.toggle('is-pres', on);
    barPres.hidden = !on;
    if (on) {
      montrer(visible);
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    } else {
      slides.forEach(function (s) { s.classList.remove('is-current'); });
      if (document.fullscreenElement) document.exitFullscreen();
      slides[idx].scrollIntoView({ block: 'start' });
    }
  }
  $$('[data-pres]').forEach(function (b) { b.addEventListener('click', function () { presentation(true); }); });
  $('#pres-prev').addEventListener('click', function () { montrer(idx - 1); });
  $('#pres-next').addEventListener('click', function () { montrer(idx + 1); });
  $('#pres-exit').addEventListener('click', function () { presentation(false); });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && enPres) presentation(false); });

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') { fermerModal(); return; }
    var champ = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
    if (champ || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'p' || e.key === 'P') { presentation(!enPres); e.preventDefault(); return; }
    if (!enPres) return;
    if (e.key === 'Escape') presentation(false);
    else if (['ArrowRight', 'PageDown', ' '].indexOf(e.key) > -1) { montrer(idx + 1); e.preventDefault(); }
    else if (['ArrowLeft', 'PageUp'].indexOf(e.key) > -1) { montrer(idx - 1); e.preventDefault(); }
  });
})();

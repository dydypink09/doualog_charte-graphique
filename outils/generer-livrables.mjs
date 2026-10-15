// DOUALOG — génère les livrables téléchargeables de la charte :
//   documents/DOUALOG_Charte-graphique_v2.0.pdf  (impression de charte.html, A4 paysage)
//   documents/DOUALOG_Kit-de-marque_v2.0.zip     (logos, palette .ase / CSS / JSON, police, charte PDF)
//   documents/DOUALOG_Cahier-des-charges_v1.0.pdf, _Perimetre-V1_v1.0.pdf, _Roles-et-droits_v1.0.pdf, _Roadmap.pdf
//   documents/DOUALOG_Dossier-projet.zip   (tous les PDF numérotés + kit de marque : à remettre au client)
// puis écrit le nombre de pages et les tailles dans les pages ([data-meta]).
//
// Usage (depuis la racine du dépôt) : node outils/generer-livrables.mjs
// Prérequis : Windows avec Microsoft Edge (ou variable EDGE=chemin vers Chrome / Edge), PowerShell pour le ZIP.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KIT = join(RACINE, 'documents');
const PDF = join(KIT, 'DOUALOG_Charte-graphique_v2.0.pdf');
const ZIP = join(KIT, 'DOUALOG_Kit-de-marque_v2.0.zip');
const NAVIGATEUR = process.env.EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const mo = (octets) => (octets / 1048576).toFixed(1).replace('.', ',') + ' Mo';
const pagesTxt = (fichier) => { const n = nbPages(fichier); return n + (n > 1 ? " pages" : " page"); };
const nbPages = (fichier) => (readFileSync(fichier, 'latin1').match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
mkdirSync(KIT, { recursive: true });

// Documents du projet imprimés en PDF A4 portrait : [page, fichier PDF, clé data-meta]
const DOCUMENTS = [
  ['cahier-des-charges.html', 'DOUALOG_Cahier-des-charges_v1.0.pdf', 'cdc'],
  ['perimetre-v1.html', 'DOUALOG_Perimetre-V1_v1.0.pdf', 'perimetre'],
  ['roles-droits.html', 'DOUALOG_Roles-et-droits_v1.0.pdf', 'roles'],
  ['roadmap_doualog.html', 'DOUALOG_Roadmap.pdf', 'roadmap']
];
// Dossier complet remis au client : un ZIP avec tous les PDF, numérotés dans l'ordre de lecture, et le kit de marque
const DOSSIER_ZIP = join(KIT, 'DOUALOG_Dossier-projet.zip');
const ORDRE_DOSSIER = [
  ['DOUALOG_Cahier-des-charges_v1.0.pdf', '01_Cahier-des-charges.pdf'],
  ['DOUALOG_Perimetre-V1_v1.0.pdf', '02_Perimetre-de-la-V1.pdf'],
  ['DOUALOG_Roles-et-droits_v1.0.pdf', '03_Roles-et-droits.pdf'],
  ['DOUALOG_Roadmap.pdf', '04_Roadmap.pdf'],
  ['DOUALOG_Charte-graphique_v2.0.pdf', '05_Charte-graphique.pdf'],
  ['DOUALOG_Kit-de-marque_v2.0.zip', '06_Kit-de-marque.zip']
];
function zipper(source, cible) {
  rmSync(cible, { force: true });
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${source}' -DestinationPath '${cible}' -CompressionLevel Optimal`], { stdio: 'inherit' });
}
function dossierProjet() {
  const travail = join(tmpdir(), 'doualog-dossier');
  const dossier = join(travail, 'DOUALOG_Dossier-projet');
  rmSync(travail, { recursive: true, force: true });
  mkdirSync(dossier, { recursive: true });
  for (const [source, nom] of ORDRE_DOSSIER) copyFileSync(join(KIT, source), join(dossier, nom));
  writeFileSync(join(dossier, 'LISEZMOI.txt'), [
    'DOUALOG Control Tower — Dossier projet (octobre 2026)',
    '',
    '01  Cahier des charges        La plateforme complète, en 17 sections (validé).',
    '02  Périmètre de la V1         Ce que fait la première version, ce qui vient plus tard (à valider).',
    '03  Rôles et droits            Qui voit et fait quoi, profil par profil (à valider).',
    '04  Roadmap                    Les phases et les dates clés jusqu\'à la mise en production.',
    '05  Charte graphique           L\'identité de la plateforme : logo, couleurs, typographie, composants.',
    '06  Kit de marque              Logos, palette de couleurs, police : pour vos supports.',
    '',
    'Version en ligne, toujours à jour : le portail du projet.'
  ].join('\r\n'));
  zipper(dossier, DOSSIER_ZIP);
  rmSync(travail, { recursive: true, force: true });
  console.log(`Dossier projet : ${mo(statSync(DOSSIER_ZIP).size)}`);
}
function imprimer(page, sortie) {
  execFileSync(NAVIGATEUR, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=10000',
    `--print-to-pdf=${sortie}`, pathToFileURL(join(RACINE, page)).href + '?pdf'
  ], { stdio: 'ignore', timeout: 180000 });
}

async function generer() {
// 0. Documents du projet ─────────────────────────────────────────
for (const [page, fichier] of DOCUMENTS) {
  imprimer(page, join(KIT, fichier));
  console.log(`${fichier} : ${nbPages(join(KIT, fichier))} pages`);
}

// 1. PDF ─────────────────────────────────────────────────────────
imprimer('charte.html', PDF);
const pages = nbPages(PDF);
console.log(`PDF : ${pages} pages, ${mo(statSync(PDF).size)}`);

// 2. Kit de marque ───────────────────────────────────────────────
const travail = join(tmpdir(), 'doualog-kit');
const dossier = join(travail, 'DOUALOG_Kit-de-marque_v2.0');
rmSync(travail, { recursive: true, force: true });
for (const d of ['01_Logos', '02_Couleurs', '03_Police', '04_Charte']) mkdirSync(join(dossier, d), { recursive: true });

const img = (f) => join(RACINE, 'assets', 'img', f);
const logos = {
  'DOUALOG_logo-couleur.png': 'logo.png',
  'DOUALOG_logo-blanc.png': 'logo-blanc-menu.png',
  'DOUALOG_logo-complet-blanc.png': 'logo-doualog-blanc.png',
  'DOUALOG_monogramme-couleur.png': 'logo-monogramme.png',
  'DOUALOG_monogramme-blanc.png': 'logo-monogramme-blanc-menu.png',
  'DOUALOG_favicon.png': 'favicon.png'
};
for (const [cible, source] of Object.entries(logos)) copyFileSync(img(source), join(dossier, '01_Logos', cible));

const couleurs = [
  ['Identité', [['Bleu nuit', '#123259'], ['Orange DOUALOG', '#F99A00'], ['Bleu marine', '#0C2C5E']]],
  ['Orange', [['Orange survol', '#E68E00'], ['Orange texte', '#9A5800'], ['Orange très clair', '#FFF5E0'], ['Fond actif', '#EAF0F8']]],
  ['Neutres', [['Fond de travail', '#F4F5F7'], ['Blanc', '#FFFFFF'], ['Gris en-tête', '#F8F9FB'], ['Filet', '#E4E7EC'],
    ['Texte fort', '#101828'], ['Texte courant', '#344054'], ['Texte secondaire', '#5D6676'], ['Discret', '#98A2B3']]],
  ['Statuts', [['Succès', '#2E8347'], ['Info', '#2F63AE'], ['Vigilance', '#B04B1B'], ['Bloquant', '#B23327'], ['Spécifique', '#6A4FD1'], ['Neutre', '#5B564A']]],
  ['Indicateurs', [['Indicateur bleu', '#3B82F6'], ['Indicateur violet', '#8B5CF6'], ['Indicateur magenta', '#D946EF'],
    ['Indicateur vert', '#22C55E'], ['Indicateur orange', '#F99A00'], ['Indicateur rouge', '#EF4444']]]
];

// Palette Adobe (.ase) : groupes de couleurs RVB nommées
function ase(groupes) {
  const blocs = [];
  const nom = (t) => { const b = Buffer.alloc(2 + (t.length + 1) * 2); b.writeUInt16BE(t.length + 1, 0); for (let i = 0; i < t.length; i++) b.writeUInt16BE(t.charCodeAt(i), 2 + i * 2); return b; };
  const bloc = (type, corps) => { const t = Buffer.alloc(6); t.writeUInt16BE(type, 0); t.writeUInt32BE(corps.length, 2); return Buffer.concat([t, corps]); };
  for (const [groupe, liste] of groupes) {
    blocs.push(bloc(0xC001, nom(groupe)));
    for (const [n, hex] of liste) {
      const c = Buffer.alloc(4 + 12 + 2);
      c.write('RGB ', 0, 'ascii');
      [1, 3, 5].forEach((p, i) => c.writeFloatBE(parseInt(hex.substr(p, 2), 16) / 255, 4 + i * 4));
      c.writeUInt16BE(2, 16);   // couleur normale (ni globale, ni ton direct)
      blocs.push(bloc(0x0001, Buffer.concat([nom(n), c])));
    }
    blocs.push(bloc(0xC002, Buffer.alloc(0)));
  }
  const tete = Buffer.alloc(12); tete.write('ASEF', 0, 'ascii'); tete.writeUInt16BE(1, 4); tete.writeUInt16BE(0, 6); tete.writeUInt32BE(blocs.length, 8);
  return Buffer.concat([tete, ...blocs]);
}
writeFileSync(join(dossier, '02_Couleurs', 'DOUALOG_palette.ase'), ase(couleurs));

// Jetons Figma (format Tokens Studio) et liste texte
const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const jetons = { doualog: {} };
for (const [groupe, liste] of couleurs) {
  jetons.doualog[slug(groupe)] = Object.fromEntries(liste.map(([n, hex]) => [slug(n), { value: hex, type: 'color' }]));
}
jetons.doualog.typographie = {
  famille: { value: 'Inter', type: 'fontFamilies' },
  graisses: { normal: { value: '400', type: 'fontWeights' }, moyen: { value: '500', type: 'fontWeights' }, 'semi-gras': { value: '600', type: 'fontWeights' } }
};
jetons.doualog.angles = Object.fromEntries([['sm', 6], ['md', 8], ['lg', 12], ['xl', 16], ['pilule', 999]].map(([k, v]) => [k, { value: v + 'px', type: 'borderRadius' }]));
writeFileSync(join(dossier, '02_Couleurs', 'doualog-tokens.json'), JSON.stringify(jetons, null, 2));
copyFileSync(join(RACINE, 'assets', 'tokens.css'), join(dossier, '02_Couleurs', 'doualog-tokens.css'));
writeFileSync(join(dossier, '02_Couleurs', 'DOUALOG_palette.txt'),
  couleurs.map(([g, l]) => g + '\r\n' + l.map(([n, h]) => {
    const [r, v, b] = [1, 3, 5].map((p) => parseInt(h.substr(p, 2), 16));
    return `  ${n.padEnd(22)} ${h}   RVB ${r} ${v} ${b}`;
  }).join('\r\n')).join('\r\n\r\n') + '\r\n');

writeFileSync(join(dossier, '03_Police', 'LISEZMOI.txt'), [
  'Police DOUALOG : Inter (graisses 400, 500 et 600)',
  '',
  'Inter est une police libre (licence SIL Open Font License 1.1) : usage commercial autorisé.',
  'Téléchargement : https://fonts.google.com/specimen/Inter',
  'Sur le web : https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap',
  '',
  'Règles : casse normale (pas de majuscules pour les titres et libellés), chiffres tabulaires pour les dates et montants,',
  'aucune autre police dans l\'interface, les documents et les emails.'
].join('\r\n'));
copyFileSync(PDF, join(dossier, '04_Charte', 'DOUALOG_Charte-graphique_v2.0.pdf'));

writeFileSync(join(dossier, 'LISEZMOI.txt'), [
  'DOUALOG — Kit de marque, version 2.0 (octobre 2026)',
  '',
  '01_Logos      Logo couleur (fond clair), logo blanc (fond bleu nuit), logo complet blanc, monogrammes, favicon. PNG transparents.',
  '02_Couleurs   Palette Adobe (.ase : Illustrator, Photoshop, InDesign), variables CSS de l\'application,',
  '              jetons Figma (.json, extension Tokens Studio), liste des couleurs en HEX et RVB.',
  '03_Police     Inter : où la télécharger et comment l\'utiliser.',
  '04_Charte     La charte graphique complète en PDF.',
  '',
  'Rappels : le logo ne se déforme pas, ne se recolore pas et ne se pose jamais en blanc sur l\'orange.',
  'Bouton orange #F99A00 = texte bleu marine #0C2C5E. Un seul bouton orange par zone.',
  '',
  'Les versions vectorielles (SVG, PDF) du logo sont à demander au créateur du logo : seules les versions PNG existent à ce jour.'
].join('\r\n'));

rmSync(ZIP, { force: true });
execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${dossier}' -DestinationPath '${ZIP}' -CompressionLevel Optimal`], { stdio: 'inherit' });
rmSync(travail, { recursive: true, force: true });
console.log(`Kit : ${mo(statSync(ZIP).size)}`);

// 3. Dossier complet pour le client ──────────────────────────────
dossierProjet();

}

// 4. Tailles affichées sur les boutons ───────────────────────────
function ecrireTailles() {
  const metas = {
    pdf: `PDF · ${pagesTxt(PDF)} · ${mo(statSync(PDF).size)}`,
    kit: `ZIP · logos, couleurs, charte · ${mo(statSync(ZIP).size)}`,
    dossier: `ZIP · 5 PDF et le kit de marque · ${mo(statSync(DOSSIER_ZIP).size)}`
  };
  for (const [, fichier, cle] of DOCUMENTS) {
    const f = join(KIT, fichier);
    metas[cle] = `PDF · ${pagesTxt(f)} · ${mo(statSync(f).size)}`;
  }
  for (const page of ['charte.html', 'index.html', ...DOCUMENTS.map((d) => d[0])]) {
    const chemin = join(RACINE, page);
    if (!existsSync(chemin)) continue;
    let html = readFileSync(chemin, 'utf8');
    html = html.replace(/(<(\w+)[^>]*data-meta="([\w-]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, ouv, tag, cle, ferm) => metas[cle] ? ouv + metas[cle] + ferm : m);
    writeFileSync(chemin, html);
  }
  console.log('Tailles mises à jour :', metas);
}

// Deux passes : la charte imprimée affiche elle-même la taille du PDF et du kit
await generer(); ecrireTailles();
await generer(); ecrireTailles();

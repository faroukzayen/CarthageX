const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'js', 'manifest.js');
const imagesDir = path.join(rootDir, 'images');

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.()_-]/g, '');
}

function matchesName(manifestPathValue, filePath) {
  const manifestName = path.basename(manifestPathValue);
  const actualName = path.basename(filePath);
  return normalizeName(manifestName) === normalizeName(actualName);
}

function inferType(buffer) {
  if (buffer.length >= 12 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return 'jpg';
  }
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'png';
  }
  if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return 'webp';
  }
  return null;
}

function findStatus(item, scenarioId, optionIndex) {
  const absolutePath = path.join(rootDir, item);

  if (!fs.existsSync(absolutePath)) {
    return 'MANQUANT';
  }

  let stats;
  try {
    stats = fs.statSync(absolutePath);
  } catch (error) {
    return 'ILLISIBLE';
  }

  if (!stats.isFile() || stats.size === 0) {
    return stats.isFile() ? 'VIDE' : 'MANQUANT';
  }

  let buffer;
  try {
    buffer = fs.readFileSync(absolutePath);
  } catch (error) {
    return 'ILLISIBLE';
  }

  const expected = path.extname(absolutePath).slice(1).toLowerCase();
  const actual = inferType(buffer);
  const extensionMatches = expected === 'jpg' ? actual === 'jpg' : expected === actual;
  const nameMatches = matchesName(item, absolutePath);

  if (!extensionMatches || !nameMatches) {
    return 'NOM DIFFÉRENT';
  }

  return 'OK';
}

function loadManifest() {
  const source = fs.readFileSync(manifestPath, 'utf8');
  const sandbox = {
    window: {},
    console
  };

  vm.runInNewContext(source, sandbox);
  return sandbox.window.GAME_MANIFEST;
}

function run() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest introuvable : ${manifestPath}`);
  }

  const manifest = loadManifest();
  const scenarios = Object.entries(manifest.images || {});

  console.log(`Vérification des images — ${manifestPath}`);
  console.log(`Scénarios trouvés : ${scenarios.length}`);
  console.log('');

  const summary = { total: 0, ok: 0, missing: 0, empty: 0, unreadable: 0, nameMismatch: 0 };

  for (const [scenarioId, items] of scenarios) {
    const optionEntries = Array.isArray(items) ? items : [items];
    console.log(`Scénario ${scenarioId} (${optionEntries.length} option${optionEntries.length > 1 ? 's' : ''})`);

    if (optionEntries.length === 0) {
      console.log('  OK : aucun chemin défini');
      console.log('');
      continue;
    }

    optionEntries.forEach((item, index) => {
      const validPath = typeof item === 'string' ? item.trim() : '';
      const status = validPath ? findStatus(validPath, scenarioId, index) : 'MANQUANT';

      summary.total += 1;
      if (status === 'OK') summary.ok += 1;
      if (status === 'MANQUANT') summary.missing += 1;
      if (status === 'VIDE') summary.empty += 1;
      if (status === 'ILLISIBLE') summary.unreadable += 1;
      if (status === 'NOM DIFFÉRENT') summary.nameMismatch += 1;

      console.log(`  Option ${index + 1}: ${status} — ${validPath || '(aucun chemin)'}`);
    });

    console.log('');
  }

  console.log('RÉSUMÉ');
  console.log(`OK: ${summary.ok}`);
  console.log(`MANQUANT: ${summary.missing}`);
  console.log(`VIDE: ${summary.empty}`);
  console.log(`ILLISIBLE: ${summary.unreadable}`);
  console.log(`NOM DIFFÉRENT: ${summary.nameMismatch}`);
  console.log(`TOTAL: ${summary.total}`);

  process.exitCode = summary.missing + summary.empty + summary.unreadable + summary.nameMismatch > 0 ? 1 : 0;
}

run();

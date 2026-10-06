const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'images');
const outputFile = path.join(rootDir, 'js', 'manifest.js');

const KNOWN_SCENARIOS = {
  prologue: ['prologue', 'intro', 'carthage', 'serment'],
  s01: ['s01', '221', 'armee', 'acclam'],
  s02: ['s02', 'sagonte'],
  s03: ['s03', 'guerre', 'declar'],
  s04: ['s04', 'rhone'],
  s05: ['s05', 'alpes'],
  s06: ['s06', 'trebie'],
  s07: ['s07', 'arno', 'marais'],
  s08: ['s08', 'trasimene'],
  s09: ['s09', 'vallee', 'boeuf', 'torche'],
  s10: ['s10', 'cannes'],
  s11: ['s11', 'apres', 'maharbal', 'rome'],
  s12: ['s12', 'capoue'],
  s13: ['s13', 'rappel'],
  s14: ['s14', 'zama'],
  s15: ['s15', 'exil'],
  epilogue: ['epilogue', 'fin']
};

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function matchScenario(folderName) {
  const key = normalize(folderName);

  for (const [scenarioId, aliases] of Object.entries(KNOWN_SCENARIOS)) {
    if (aliases.some((alias) => key.includes(normalize(alias)))) {
      return scenarioId;
    }
  }

  return null;
}

function sortByName(fileList) {
  return [...fileList].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
}

function removeDuplicateSuffix(fileName) {
  return fileName.replace(/\s+\(\d+\)(\.[^.]+)$/i, '$1');
}

function deduplicateFiles(fileList) {
  const seen = new Set();

  return fileList.filter((file) => {
    const key = normalize(removeDuplicateSuffix(file));
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function main() {
  if (!fs.existsSync(imagesDir)) {
    throw new Error('Dossier images introuvable : ' + imagesDir);
  }

  const folders = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const manifest = {
    version: 1,
    images: {},
    audio: { ambiance: 'assets/audio/ambiance.mp3', narration: {} },
    fallback: {
      image: 'https://placehold.co/1600x900/0f172a/d8a54a?text=Hannibal',
      audio: null
    }
  };

  for (const folder of folders) {
    const scenarioId = matchScenario(folder);
    const folderPath = path.join(imagesDir, folder);
    const files = deduplicateFiles(
      fs.readdirSync(folderPath)
        .filter((file) => /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(file))
    );

    if (!scenarioId) {
      continue;
    }

    manifest.images[scenarioId] = sortByName(files).map((file) => path.join('images', folder, file).split(path.sep).join('/'));
  }

  const output = `window.GAME_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(outputFile, output, 'utf8');
  console.log('Manifest généré :', outputFile);
  console.log('Scénarios avec images :');
  for (const [scenarioId, images] of Object.entries(manifest.images)) {
    console.log(`${scenarioId}: ${images.length} image${images.length === 1 ? '' : 's'}`);
  }
}

function normalizeManifestImages(manifest) {
  const normalized = { ...manifest, images: {} };

  for (const [scenarioId, entries] of Object.entries(manifest.images || {})) {
    const values = Array.isArray(entries) ? entries : [entries];
    normalized.images[scenarioId] = values
      .filter((entry) => typeof entry === 'string' && entry.trim())
      .map((entry) => entry.trim());
  }

  return normalized;
}

function buildManifest() {
  if (!fs.existsSync(imagesDir)) {
    throw new Error('Dossier images introuvable : ' + imagesDir);
  }

  const folders = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const manifest = {
    version: 1,
    images: {},
    audio: { ambiance: 'assets/audio/ambiance.mp3', narration: {} },
    fallback: {
      image: 'https://placehold.co/1600x900/0f172a/d8a54a?text=Hannibal',
      audio: null
    }
  };

  for (const folder of folders) {
    const scenarioId = matchScenario(folder);
    const folderPath = path.join(imagesDir, folder);
    const files = deduplicateFiles(
      fs.readdirSync(folderPath)
        .filter((file) => /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(file))
    );

    if (!scenarioId) {
      continue;
    }

    manifest.images[scenarioId] = sortByName(files).map((file) => path.join('images', folder, file).split(path.sep).join('/'));
  }

  return manifest;
}

if (require.main === module) {
  main();
}

(function () {
  function imgSrc(path) {
    if (!path) {
      return '';
    }

    return String(path)
      .split('/')
      .map((segment) => {
        try {
          return encodeURI(decodeURIComponent(segment));
        } catch (error) {
          return encodeURI(segment);
        }
      })
      .join('/');
  }

  function preloadManifestImages() {
    const manifestImages = window.GAME_MANIFEST?.images || {};
    const entries = [];
    const failures = [];

    Object.entries(manifestImages).forEach(([scenarioId, paths]) => {
      const items = Array.isArray(paths) ? paths : [paths];
      items.filter(Boolean).forEach((pathValue) => {
        const image = new Image();
        const src = imgSrc(pathValue);
        image.onload = () => entries.push({ scenarioId, path: pathValue, status: 'OK' });
        image.onerror = () => failures.push({ scenarioId, path: pathValue });
        image.src = src;
      });
    });

    setTimeout(() => {
      const total = entries.length + failures.length;
      console.warn(`[Images] ${entries.length}/${total} OK, manquantes : ${failures.length ? failures.map((entry) => `${entry.scenarioId}: ${entry.path}`).join(', ') : 'aucune'}`);
      if (failures.length) {
        console.warn('[Images] Échecs de chargement', failures);
      }
    }, 1500);
  }

  if (typeof window !== 'undefined') {
    window.imgSrc = imgSrc;
    window.preloadManifestImages = preloadManifestImages;
    preloadManifestImages();
  }
})();

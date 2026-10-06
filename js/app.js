const gameApp = (() => {
  const appElement = document.getElementById('app');
  const startButton = document.getElementById('start-button');
  const data = window.GAME_DATA || { prologue: [], scenarios: [], epilogue: '' };
  const audioManager = window.AudioManager ? new window.AudioManager() : null;
  if (audioManager) {
    window.audioManager = audioManager;
  }

  const state = {
    started: false,
    currentScenarioIndex: 0,
    stage: 'intro',
    prologueStep: 0,
    choices: []
  };

  function getCurrentScenario() {
    return data.scenarios[state.currentScenarioIndex] || null;
  }

  function getHannibalOption(scenario) {
    if (!scenario) {
      return null;
    }
    return scenario.options.find((option) => option.hannibal) || null;
  }

  function getManifestImage(scenarioId, optionIndex) {
    const manifestImages = window.GAME_MANIFEST?.images?.[scenarioId] || [];
    return manifestImages[optionIndex] || 'https://placehold.co/1600x900/0f172a/d8a54a?text=Hannibal';
  }

  function getOptionImages(scenarioId, optionIndex) {
    const manifestImages = window.GAME_MANIFEST?.images?.[scenarioId] || [];
    const path = manifestImages[optionIndex];
    if (Array.isArray(path)) {
      return path.filter(Boolean);
    }
    return path ? [path] : [];
  }

  function syncCinemaSettings() {
    if (!window.Cinema || !audioManager) {
      return;
    }

    window.Cinema.settings.vol = audioManager.volume;
    window.Cinema.settings.rate = audioManager.rate;
    window.Cinema.settings.muted = audioManager.isMuted;
    window.Cinema.settings.subtitles = true;
  }

  function playCinemaSequence(chapters) {
    if (!window.Cinema) {
      console.error('[Cinema] non disponible : le jeu continue sans le diaporama.');
      return Promise.resolve();
    }

    syncCinemaSettings();
    audioManager?.cancel();
    return window.Cinema.playSequence(chapters);
  }

  function speakNarration(text) {
    if (!audioManager || !text) {
      return;
    }
    audioManager.speak(text);
  }

  function buildIntroScreen() {
    return `
      <section class="screen hero-panel" aria-labelledby="title-intro">
        <div>
          <p class="eyebrow">Jeu narratif</p>
          <h2 id="title-intro">Hannibal Barca</h2>
        </div>

        <p>
          À la fin du IIIe siècle avant J.-C., Carthage porte encore la blessure de la première guerre punique. Rome a gagné la mer, mais le nom d'Hannibal grandit déjà dans l'ombre des batailles et des serments.
        </p>

        <p>
          Tu n'es pas un observateur : tu incarnes Hannibal. Tu dois choisir, dans un monde de rivalités, de famine, de loyauté et de prestige, la voie qui fera entrer Carthage dans l'histoire ou dans l'oubli.
        </p>

        <div class="intro-grid">
          <article class="info-card">
            <h3>Le jeune chef</h3>
            <p>Fils d'Hamilcar Barca et né dans une famille de soldats, Hannibal grandit dans l'esprit d'une vengeance contre Rome.</p>
          </article>
          <article class="info-card">
            <h3>La menace</h3>
            <p>Rome domine la Méditerranée, mais Carthage garde la force de ses soldats, ses éléphants et son ambition.</p>
          </article>
          <article class="info-card">
            <h3>Le défi</h3>
            <p>Chaque décision influencera tes hommes, ton moral, tes vivres et tes alliances au fil des campagnes.</p>
          </article>
        </div>

        <div class="controls">
          <button class="primary-button" type="button" id="launch-game">Commencer l'aventure</button>
          <button class="secondary-button" type="button" id="play-prologue">Découvrir le prologue</button>
        </div>
      </section>
    `;
  }

  function buildPrologueScreen() {
    const slides = data.prologue || [];
    const current = slides[state.prologueStep] || slides[0] || { title: 'Prologue', text: 'Le récit commence.' };

    return `
      <section class="screen hero-panel" aria-labelledby="prologue-title">
        <div>
          <p class="eyebrow">Prologue</p>
          <h2 id="prologue-title">${current.title}</h2>
        </div>
        <p>${current.text}</p>
        <div class="controls">
          <button class="primary-button" type="button" id="continue-prologue">
            ${state.prologueStep >= slides.length - 1 ? 'Commencer' : 'Suivant'}
          </button>
          <button class="secondary-button" type="button" id="back-to-intro">Retour</button>
        </div>
      </section>
    `;
  }

  function buildScenarioOverview() {
    const scenario = getCurrentScenario();

    if (!scenario) {
      return '<section class="screen hero-panel"><p>Le scénario est introuvable.</p></section>';
    }

    return `
      <section class="screen hero-panel" aria-labelledby="scenario-title">
        <div class="timeline">
          <span>${scenario.year}</span>
          <span>Frise chronologique</span>
        </div>
        <div class="timeline-bar" aria-hidden="true">
          <div class="timeline-fill"></div>
        </div>

        <div>
          <p class="eyebrow">Scénario ${state.currentScenarioIndex + 1} / ${data.scenarios.length}</p>
          <h2 id="scenario-title">${scenario.title}</h2>
        </div>

        <p><strong>Auparavant…</strong> ${scenario.avant}</p>
        <p><strong>Contexte :</strong> ${scenario.contexte}</p>
        <p><strong>Objectif :</strong> ${scenario.objectif}</p>

        <div class="controls">
          <button class="primary-button" type="button" id="show-choices">Voir les choix</button>
        </div>
      </section>
    `;
  }

  function buildChoiceScreen() {
    const scenario = getCurrentScenario();
    if (!scenario) {
      return buildIntroScreen();
    }

    const shuffled = scenario.options
      .map((option, originalIndex) => ({ option, originalIndex }))
      .sort(() => Math.random() - 0.5);

    const choices = shuffled.map(({ option, originalIndex }) => `
      <button class="choice-button" type="button" data-index="${originalIndex}" aria-label="Choix ${originalIndex + 1} : ${option.texte}">
        <strong>Choix ${originalIndex + 1}</strong>
        <span>${option.texte}</span>
      </button>
    `).join('');

    return `
      <section class="screen hero-panel" aria-labelledby="choices-title">
        <div>
          <p class="eyebrow">Choix</p>
          <h2 id="choices-title">${scenario.title}</h2>
        </div>
        <div class="choice-grid">
          ${choices}
        </div>
      </section>
    `;
  }

  function buildResultScreen(scenario, selectedIndex) {
    const selected = scenario.options[selectedIndex];
    const hannibalOption = getHannibalOption(scenario);
    const why = window.WHY && window.WHY[scenario.id] ? window.WHY[scenario.id] : { pourquoi: 'Hannibal a choisi cette voie pour garder l’initiative.' };
    const imagePath = getManifestImage(scenario.id, selectedIndex);
    const hannibalImage = getManifestImage(scenario.id, scenario.options.findIndex((option) => option.hannibal));

    const isFaithful = selected.hannibal;
    const explanationText = isFaithful
      ? '<span class="status-badge status-good">Fidèle à l\'histoire</span>'
      : '<span class="status-badge status-bad">Autre voie (hypothèse)</span>';

    const alternateBlock = !selected.hannibal ? `
      <div class="result-panel alt-panel">
        <h3>Ce qu'Hannibal a vraiment fait</h3>
        <div class="result-visual" style="background-image: url('${hannibalImage}')"></div>
        <p>${hannibalOption.resultat}</p>
      </div>
    ` : '';

    return `
      <section class="screen hero-panel" aria-live="polite">
        <div class="result-head">
          <p class="eyebrow">Résultat</p>
          ${explanationText}
        </div>

        <h2>${scenario.title}</h2>

        <div class="result-visual" style="background-image: url('${imagePath}')"></div>

        <p><strong>Ton choix :</strong> ${selected.texte}</p>
        <p>${selected.resultat}</p>

        <div class="result-panel">
          <h3>Le choix d'Hannibal : ${hannibalOption.texte}</h3>
          <p><strong>Pourquoi ce choix ?</strong> ${why.pourquoi}</p>
          ${why.limite ? `<p><strong>Les limites de ce choix :</strong> ${why.limite}</p>` : ''}
        </div>

        ${alternateBlock}

        <div class="controls">
          <button class="primary-button" type="button" id="next-scenario">Suite</button>
        </div>
      </section>
    `;
  }

  function buildEpilogueScreen() {
    return `
      <section class="screen hero-panel" aria-live="polite">
        <p class="eyebrow">Épilogue</p>
        <h2>La fin d'un génie</h2>
        <p>${data.epilogue}</p>
        <div class="controls">
          <button class="primary-button" type="button" id="show-results">Voir les résultats</button>
        </div>
      </section>
    `;
  }

  function render() {
    const stageLabels = {
      intro: 'Accueil',
      prologue: 'Prologue',
      overview: 'Briefing',
      choices: 'Choix tactique',
      result: 'Résultat',
      epilogue: 'Épilogue',
      results: 'Bilan final'
    };

    appElement.dataset.stage = state.stage || 'intro';
    appElement.setAttribute('aria-label', stageLabels[state.stage] || 'Jeu');
    appElement.classList.remove('is-animated');

    if (!state.started) {
      appElement.innerHTML = buildIntroScreen();
      bindIntroEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'prologue') {
      appElement.innerHTML = buildPrologueScreen();
      bindPrologueEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'overview') {
      appElement.innerHTML = buildScenarioOverview();
      bindOverviewEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'choices') {
      appElement.innerHTML = buildChoiceScreen();
      bindChoiceEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'result') {
      const scenario = getCurrentScenario();
      const lastChoice = state.choices[state.choices.length - 1];
      const selectedIndex = lastChoice ? lastChoice.index : 0;
      appElement.innerHTML = buildResultScreen(scenario, selectedIndex);
      bindResultEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'epilogue') {
      appElement.innerHTML = buildEpilogueScreen();
      bindEpilogueEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

    if (state.stage === 'results') {
      const resultsHtml = window.ResultsAnalyzer ? window.ResultsAnalyzer.buildResultsHtml(data.scenarios, state.choices) : '<p>Résultats indisponibles.</p>';
      appElement.innerHTML = resultsHtml;
      bindResultsEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
    }
  }

  function bindIntroEvents() {
    const launchButton = document.getElementById('launch-game');
    const prologueButton = document.getElementById('play-prologue');

    launchButton?.addEventListener('click', () => {
      state.started = true;
      state.stage = 'overview';
      state.currentScenarioIndex = 0;
      state.prologueStep = 0;
      render();
    });

    prologueButton?.addEventListener('click', () => {
      state.started = true;
      state.stage = 'prologue';
      state.prologueStep = 0;
      render();
    });
  }

  function bindPrologueEvents() {
    const nextButton = document.getElementById('continue-prologue');
    const backButton = document.getElementById('back-to-intro');

    nextButton?.addEventListener('click', () => {
      const chapters = (data.prologue || []).map((entry) => ({
        title: entry.title,
        badge: null,
        images: [],
        text: entry.text
      }));
      const current = chapters[state.prologueStep];

      if (!current) {
        state.stage = 'overview';
        render();
        return;
      }

      playCinemaSequence([current]).then(() => {
        if (state.prologueStep < (data.prologue || []).length - 1) {
          state.prologueStep += 1;
          render();
          return;
        }
        state.stage = 'overview';
        render();
      });
    });

    backButton?.addEventListener('click', () => {
      state.started = false;
      state.stage = 'intro';
      state.prologueStep = 0;
      render();
    });
  }

  function bindOverviewEvents() {
    const nextButton = document.getElementById('show-choices');
    nextButton?.addEventListener('click', () => {
      state.stage = 'choices';
      render();
    });
  }

  function bindChoiceEvents() {
    const buttons = document.querySelectorAll('.choice-button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const originalIndex = Number(button.dataset.index);
        const scenario = getCurrentScenario();
        const chosen = scenario?.options[originalIndex];

        if (!scenario || !chosen) {
          return;
        }

        const choiceEntry = { id: scenario.id, index: originalIndex };
        state.choices.push(choiceEntry);

        const hIndex = scenario.options.findIndex((option) => option.hannibal);
        const selectedImages = getOptionImages(scenario.id, originalIndex);
        const chapters = [{
          title: chosen.texte,
          badge: chosen.hannibal
            ? { txt: 'Fidèle à l\'histoire', cls: 'ok' }
            : { txt: 'Autre voie (hypothèse)', cls: 'ko' },
          images: selectedImages,
          text: chosen.resultat
        }];

        if (!chosen.hannibal && hIndex >= 0) {
          chapters.push({
            title: 'Ce qu\'Hannibal a vraiment fait',
            badge: null,
            images: getOptionImages(scenario.id, hIndex),
            text: scenario.options[hIndex].resultat,
            cardMs: 1500
          });
        }

        playCinemaSequence(chapters).then(() => {
          state.stage = 'result';
          render();
        });
      });
    });
  }

  function bindResultEvents() {
    const nextButton = document.getElementById('next-scenario');
    nextButton?.addEventListener('click', () => {
      const scenario = getCurrentScenario();
      const isLastScenario = state.currentScenarioIndex >= data.scenarios.length - 1;

      if (isLastScenario) {
        state.currentScenarioIndex = 0;
        state.stage = 'epilogue';
        render();
        return;
      }

      state.currentScenarioIndex += 1;
      state.stage = 'overview';
      render();
    });
  }

  function bindEpilogueEvents() {
    const showResultsButton = document.getElementById('show-results');
    showResultsButton?.addEventListener('click', () => {
      const epilogueChapter = {
        title: 'La fin d\'un génie',
        badge: null,
        images: [],
        text: data.epilogue
      };

      playCinemaSequence([epilogueChapter]).then(() => {
        state.stage = 'results';
        render();
      });
    });
  }

  function bindResultsEvents() {
    const replayButton = document.getElementById('replay-game');
    const readSummaryButton = document.getElementById('read-summary');
    const printButton = document.getElementById('print-results');

    replayButton?.addEventListener('click', () => {
      state.started = true;
      state.currentScenarioIndex = 0;
      state.stage = 'overview';
      state.choices = [];
      render();
    });

    readSummaryButton?.addEventListener('click', () => {
      const summary = window.ResultsAnalyzer ? window.ResultsAnalyzer.getVerdict(data.scenarios, state.choices) : '';
      speakNarration(summary);
    });

    printButton?.addEventListener('click', () => {
      window.print();
    });
  }

  startButton?.addEventListener('click', () => {
    state.started = true;
    state.currentScenarioIndex = 0;
    state.stage = 'overview';
    render();
  });

  render();
  return { render };
})();

if (typeof window !== 'undefined') {
  window.gameApp = gameApp;
}

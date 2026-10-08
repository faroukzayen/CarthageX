const gameApp = (() => {
  const appElement = document.getElementById('app');
  const startButton = document.getElementById('start-button');
  const data = window.GAME_DATA || { prologue: [], scenarios: [], epilogue: '' };
  const audioManager = window.AudioManager ? new window.AudioManager() : null;

  function safeAssetUrl(url) {
    return window.imgSrc ? window.imgSrc(url) : String(url || '');
  }
  if (audioManager) {
    window.audioManager = audioManager;
  }

  const state = {
    started: false,
    currentScenarioIndex: 0,
    stage: 'welcome',
    prologueStep: 0,
    choices: []
  };

  function getCurrentScenario() {
    return data.scenarios[state.currentScenarioIndex] || null;
  }

  function getTimelineProgress() {
    const scenarios = data.scenarios || [];
    if (scenarios.length < 2) {
      return 0;
    }

    return (state.currentScenarioIndex / (scenarios.length - 1)) * 100;
  }

  function getHannibalOption(scenario) {
    if (!scenario) {
      return null;
    }
    return scenario.options.find((option) => option.hannibal) || null;
  }

  function getManifestImage(scenarioId, optionIndex) {
    const manifestImages = window.GAME_MANIFEST?.images?.[scenarioId] || [];
    const value = manifestImages[optionIndex] || 'https://placehold.co/1600x900/0f172a/d8a54a?text=Hannibal';
    return safeAssetUrl(value);
  }

  function getOptionImages(scenarioId, optionIndex) {
    const manifestImages = window.GAME_MANIFEST?.images?.[scenarioId] || [];
    const path = manifestImages[optionIndex];
    const list = Array.isArray(path) ? path : path ? [path] : [];
    return list.filter(Boolean).map((item) => safeAssetUrl(item));
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

  function buildWelcomeScreen() {
    const backgroundImage = 'images/hannibal.jpg';

    return `
      <section class="welcome-screen" style="background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.52)), url('${backgroundImage}')" aria-labelledby="title-welcome">
        <canvas id="embers" aria-hidden="true"></canvas>
        <div class="welcome-content">
          <p class="welcome-kicker">247 – 183 av. J.-C.</p>
          <h1 id="title-welcome" class="welcome-title">Le Cerveau de Carthage</h1>
          <p class="welcome-subtitle">Traversez les Alpes. Défiez Rome. Changez l'histoire.</p>
          <div class="home-metrics" aria-label="Informations du jeu">
            <span>15 décisions historiques</span>
          </div>
          <button class="primary-button welcome-button" type="button" id="launch-game">Commencer la campagne</button>
        </div>
      </section>
    `;
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

    const timelineProgress = getTimelineProgress();

    return `
      <section class="screen hero-panel" aria-labelledby="scenario-title">
        <div class="timeline">
          <span>${scenario.year}</span>
          <span>Épisode ${state.currentScenarioIndex + 1}/${data.scenarios.length}</span>
        </div>
        <div class="timeline-bar" aria-hidden="true">
          <div class="timeline-fill" style="width: ${timelineProgress}%"></div>
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
        <div class="choices-header">
          <div>
            <p class="eyebrow">Choix</p>
            <h2 id="choices-title">${scenario.title}</h2>
          </div>
          <button class="secondary-button maharbal-toggle" type="button" aria-expanded="false" aria-controls="maharbal-panel">
            <span class="maharbal-icon" aria-hidden="true">
              <img src="images/maharbal-logo.svg" alt="Logo Maharbal" />
            </span>
            <span class="maharbal-toggle-label">L’assistant Maharbal</span>
          </button>
        </div>
        <div class="choice-grid">
          ${choices}
        </div>

        <aside class="maharbal-panel" id="maharbal-panel" hidden>
          <div class="maharbal-header">
            <div class="maharbal-avatar" aria-label="Icône Maharbal">M</div>
            <div>
              <p class="eyebrow">Conseiller militaire</p>
              <h3>Maharbal</h3>
            </div>
          </div>
          <p class="maharbal-intro">Je examine le contexte, puis je te donne les avantages, les limites et les risques.</p>
          <form class="maharbal-form" id="maharbal-form">
            <label for="maharbal-question">Pose-moi une question</label>
            <textarea id="maharbal-question" rows="3" placeholder="Que me conseille-tu ? Quel est le sens de l’embuscade ?"></textarea>
            <div class="maharbal-actions">
              <button class="primary-button" type="submit" id="maharbal-submit">Demander son avis</button>
              <button class="secondary-button" type="button" id="clear-maharbal">Effacer</button>
            </div>
            <div class="maharbal-quick-actions" aria-label="Questions rapides">
              <button class="small-button" type="button" data-quick-question="Pour et contre des options">Pour et contre des options</button>
              <button class="small-button" type="button" data-quick-question="Explique-moi un mot">Explique-moi un mot</button>
              <button class="small-button" type="button" data-quick-question="Rappelle la situation">Rappelle la situation</button>
            </div>
          </form>
          <div class="maharbal-response" id="maharbal-response" role="status" aria-live="polite">
            <span class="maharbal-response-label">Réponse de Maharbal</span>
            <p>Pose une question sur le choix, un mot ou un lieu de cette campagne.</p>
          </div>
        </aside>
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

    const resultVisual = (src, title) => `
      <div class="result-visual" data-image="${src}" data-title="${title}" role="img" aria-label="${title}">
        <span>${title}</span>
      </div>
    `;

    const alternateBlock = !selected.hannibal ? `
      <div class="result-panel alt-panel">
        <h3>Ce qu'Hannibal a vraiment fait</h3>
        ${resultVisual(hannibalImage, hannibalOption.texte)}
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
        ${resultVisual(imagePath, selected.texte)}

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
      welcome: 'Introduction',
      intro: 'Accueil',
      prologue: 'Prologue',
      overview: 'Briefing',
      choices: 'Choix tactique',
      result: 'Résultat',
      epilogue: 'Épilogue',
      results: 'Bilan final'
    };

    document.body.classList.toggle('home-active', state.stage === 'welcome');
    appElement.dataset.stage = state.stage || 'welcome';
    appElement.setAttribute('aria-label', stageLabels[state.stage] || 'Jeu');
    appElement.classList.remove('is-animated');

    if (state.stage === 'welcome') {
      appElement.innerHTML = buildWelcomeScreen();
      bindIntroEvents();
      requestAnimationFrame(() => appElement.classList.add('is-animated'));
      return;
    }

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
    const panel = document.getElementById('maharbal-panel');
    const toggle = document.querySelector('.maharbal-toggle');
    const form = document.getElementById('maharbal-form');
    const input = document.getElementById('maharbal-question');
    const response = document.getElementById('maharbal-response');
    const submitButton = document.getElementById('maharbal-submit');
    const scenario = getCurrentScenario();
    const scenarioId = scenario?.id || '';
    const advisor = window.MaharbalAdvisor ? window.MaharbalAdvisor.createAdvisor(scenario) : null;
    const askWorker = window.MaharbalClient?.askMaharbal;

    function renderMaharbalText(text) {
      response.innerHTML = `<p>${String(text || '').replace(/\n/g, '<br>')}</p>`;
    }

    function setSubmitting(isSubmitting) {
      submitButton?.toggleAttribute('disabled', isSubmitting);
      submitButton.textContent = isSubmitting ? 'Maharbal réfléchit…' : 'Demander son avis';
    }

    async function askBackend(question) {
      if (!askWorker || !scenarioId) {
        return null;
      }

      return askWorker(scenarioId, question);
    }

    function renderQuickActions(actions) {
      const actionButtons = actions.map((action) => `
        <button class="secondary-button maharbal-action" type="button" data-action="${action.id}">
          ${action.label}
        </button>
      `).join('');

      response.insertAdjacentHTML('beforeend', `<div class="maharbal-quick-actions">${actionButtons}</div>`);

      response.querySelectorAll('.maharbal-action').forEach((button) => {
        button.addEventListener('click', () => {
          const action = actions.find((entry) => entry.id === button.dataset.action);
          if (!action) {
            return;
          }

          input.value = action.value;
          form.requestSubmit();
        });
      });
    }

    function renderMaharbalError(message) {
      renderMaharbalText(`${message} Je reprends donc une réponse locale.`);
    }

    toggle?.addEventListener('click', () => {
      const isHidden = panel?.hasAttribute('hidden');
      panel?.toggleAttribute('hidden', !isHidden);
      toggle.setAttribute('aria-expanded', String(isHidden));
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!input || !response) {
        return;
      }

      const question = input.value.trim();
      if (!question) {
        renderMaharbalText('Pose une question, et je te donnerai mon avis.');
        return;
      }

      setSubmitting(true);
      response.innerHTML = '<p>Je rassemble les éléments historiques…</p>';

      try {
        let answer = '';

        try {
          answer = await askBackend(question);
          if (!answer) {
            answer = advisor ? advisor.answer(question) : '';
          }
        } catch (error) {
          console.warn('[Maharbal] relay indisponible, utilisation du conseiller local.', error);
          if (!advisor) {
            renderMaharbalText('Le conseiller local et le serveur distant sont indisponibles.');
            return;
          }
          answer = advisor.answer(question);
        }

        renderMaharbalText(answer);

        if (advisor && /Je ne vois pas ce terme ou ce lieu clairement\./.test(answer)) {
          response.querySelectorAll('.maharbal-action').forEach((button) => button.remove());
          renderQuickActions(advisor.getQuickActions());
        }
      } finally {
        setSubmitting(false);
      }
    });

    document.querySelectorAll('[data-quick-question]').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.dataset.quickQuestion || '';
        form.requestSubmit();
      });
    });

    document.getElementById('clear-maharbal')?.addEventListener('click', () => {
      input.value = '';
      response.innerHTML = '<p>Pose une question sur le choix, un mot ou un lieu de cette campagne.</p>';
      input.focus();
    });

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const originalIndex = Number(button.dataset.index);
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
    document.querySelectorAll('.result-visual').forEach((visual) => {
      const src = visual.dataset.image || '';
      const title = visual.dataset.title || '';
      const image = new Image();

      image.onload = () => {
        visual.style.backgroundImage = `url("${src}")`;
        visual.classList.remove('result-visual-fallback');
        visual.querySelector('span')?.remove();
      };

      image.onerror = () => {
        visual.classList.add('result-visual-fallback');
        visual.setAttribute('aria-label', title);
        const label = visual.querySelector('span');
        if (label) {
          label.textContent = title;
        }
      };

      image.src = src;
    });

    const nextButton = document.getElementById('next-scenario');
    nextButton?.addEventListener('click', () => {
      const scenario = getCurrentScenario();
      const isLastScenario = state.currentScenarioIndex >= data.scenarios.length - 1;

      if (isLastScenario) {
        state.currentScenarioIndex = 0;
        state.stage = 'epilogue';
        window.MaharbalClient?.maharbalHistory.splice(0);
        render();
        return;
      }

      state.currentScenarioIndex += 1;
      state.stage = 'overview';
      window.MaharbalClient?.maharbalHistory.splice(0);
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
      window.MaharbalClient?.maharbalHistory.splice(0);
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

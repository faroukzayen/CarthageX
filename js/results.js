const ResultsAnalyzer = (() => {
  function getScenarioTags(scenarioId) {
    return window.TAGS && window.TAGS[scenarioId] ? window.TAGS[scenarioId] : [];
  }

  function getPlayerCounts(choices) {
    const counts = {
      audace: 0,
      ruse: 0,
      force: 0,
      diplomatie: 0,
      prudence: 0,
      attentisme: 0
    };

    choices.forEach((choice) => {
      const tags = getScenarioTags(choice.id);
      const tag = tags[choice.index];
      if (tag && counts[tag] !== undefined) {
        counts[tag] += 1;
      }
    });

    return counts;
  }

  function getHannibalCounts(scenarios) {
    const counts = {
      audace: 0,
      ruse: 0,
      force: 0,
      diplomatie: 0,
      prudence: 0,
      attentisme: 0
    };

    scenarios.forEach((scenario) => {
      const favoredIndex = scenario.options.findIndex((option) => option.hannibal === true);
      const tag = getScenarioTags(scenario.id)[favoredIndex];
      if (tag && counts[tag] !== undefined) {
        counts[tag] += 1;
      }
    });

    return counts;
  }

  function getDominantProfile(playerCounts) {
    const entries = Object.entries(playerCounts).sort((a, b) => b[1] - a[1]);
    const [firstKey, firstValue] = entries[0] || ['prudence', 0];
    const second = entries[1] || [firstKey, firstValue];

    if (second[1] === firstValue) {
      const merged = [firstKey, second[0]].sort();
      const label = merged.join(' et ');
      return {
        key: label,
        profile: `${window.PROFILS[firstKey].nom} et ${window.PROFILS[second[0]].nom}`,
        text: `${window.PROFILS[firstKey].texte} ${window.PROFILS[second[0]].texte}`
      };
    }

    return {
      key: firstKey,
      profile: window.PROFILS[firstKey].nom,
      text: window.PROFILS[firstKey].texte
    };
  }

  function getSimilarity(playerCounts, hannibalCounts) {
    const total = Object.keys(playerCounts).reduce((sum, key) => {
      return sum + Math.min(playerCounts[key], hannibalCounts[key]);
    }, 0);
    return Math.round((total / 15) * 100);
  }

  function getScoreFidelity(choices, scenarios) {
    let score = 0;

    choices.forEach((choice) => {
      const scenario = scenarios.find((entry) => entry.id === choice.id);
      const favoredIndex = scenario ? scenario.options.findIndex((option) => option.hannibal === true) : -1;
      if (scenario && choice.index === favoredIndex) {
        score += 1;
      }
    });

    return score;
  }

  function getTitle(score) {
    if (score >= 13) return 'Hannibal lui-même';
    if (score >= 9) return 'Stratège accompli';
    if (score >= 5) return 'Officier prometteur';
    return 'Recrue à former';
  }

  function getVerdictText(score, profileText, similarity, playerCounts, hannibalCounts) {
    const topStyle = Object.entries(playerCounts).sort((a, b) => b[1] - a[1])[0];
    const dominantName = topStyle ? topStyle[0] : 'prudence';
    const dominantCount = topStyle ? topStyle[1] : 0;
    const hannibalTop = Object.entries(hannibalCounts).sort((a, b) => b[1] - a[1])[0];

    let advice = 'Hannibal a souvent gagné en prenant l\'initiative.';
    if (dominantName === 'force') {
      advice = 'Face à plus nombreux, Hannibal évitait le choc frontal.';
    } else if (dominantName === 'ruse' || dominantName === 'audace') {
      advice = 'Tu partages son instinct, mais n\'oublie pas qu\'il a aussi perdu la guerre : une bonne tactique ne remplace pas une bonne stratégie à long terme.';
    }

    return `Tu as pris la même décision qu'Hannibal dans ${score} scénarios sur 15. ${profileText} Ton profil ressemble à celui d'Hannibal à ${similarity} %. Lui privilégiait la ${window.PROFILS[hannibalTop[0]].nom.toLowerCase()} ( ${hannibalTop[1]} choix ) et la ${window.PROFILS[dominantName].nom.toLowerCase()} (${dominantCount} choix). ${advice}`;
  }

  function getScenarioMoment(scenarios, choices) {
    const decisive = ['s10', 's08', 's05', 's06'];
    const results = [];

    decisive.forEach((scenarioId) => {
      const scenario = scenarios.find((entry) => entry.id === scenarioId);
      const choice = choices.find((entry) => entry.id === scenarioId);
      if (!scenario || !choice) {
        return;
      }
      const favoredIndex = scenario.options.findIndex((option) => option.hannibal === true);
      const match = choice.index === favoredIndex;
      results.push({ scenarioId, match, fidelity: match ? 1 : 0 });
    });

    const best = results.filter((entry) => entry.match).sort((a, b) => b.fidelity - a.fidelity)[0];
    return best || { scenarioId: 's10', match: false };
  }

  function getBiggestDivergence(scenarios, choices) {
    let best = null;
    scenarios.forEach((scenario) => {
      const choice = choices.find((entry) => entry.id === scenario.id);
      if (!choice) {
        return;
      }
      const favoredIndex = scenario.options.findIndex((option) => option.hannibal === true);
      const div = scenario.dH[ favoredIndex ] - scenario.dX[ choice.index ];
      if (best === null || div > best.divergence) {
        best = {
          scenario,
          divergence: div,
          choice,
          favoredIndex
        };
      }
    });
    return best;
  }

  function getSummary(scenarios, choices) {
    const playerCounts = getPlayerCounts(choices);
    const hannibalCounts = getHannibalCounts(scenarios);
    const dominant = getDominantProfile(playerCounts);
    const fidelityScore = getScoreFidelity(choices, scenarios);
    const similarity = getSimilarity(playerCounts, hannibalCounts);
    const scenarioMoment = getScenarioMoment(scenarios, choices);
    const biggestDivergence = getBiggestDivergence(scenarios, choices);
    const verdict = getVerdictText(fidelityScore, dominant.text, similarity, playerCounts, hannibalCounts);

    return {
      playerCounts,
      hannibalCounts,
      dominant,
      fidelityScore,
      similarity,
      verdict,
      title: getTitle(fidelityScore),
      scenarioMoment,
      biggestDivergence
    };
  }

  function buildResultsHtml(scenarios, choices) {
    const summary = getSummary(scenarios, choices);
    const listItems = scenarios.map((scenario) => {
      const choice = choices.find((entry) => entry.id === scenario.id);
      const favoredIndex = scenario.options.findIndex((option) => option.hannibal === true);
      const chosenIndex = choice ? choice.index : null;
      const chosenText = chosenIndex !== null && scenario.options[chosenIndex] ? scenario.options[chosenIndex].texte : 'Aucun choix';
      const isFidel = chosenIndex === favoredIndex;
      const why = window.WHY && window.WHY[scenario.id] ? window.WHY[scenario.id] : {};

      return `
        <li class="timeline-entry ${isFidel ? 'success' : 'danger'}">
          <div class="entry-header">
            <span class="result-mark">${isFidel ? '✔' : '✘'}</span>
            <strong>${scenario.title}</strong>
          </div>
          <p><strong>Ton choix :</strong> ${chosenText}</p>
          <p><strong>Choix d'Hannibal :</strong> ${scenario.options[favoredIndex].texte}</p>
          <details>
            <summary>Pourquoi ?</summary>
            <p>${why.pourquoi || 'Aucune explication historique disponible.'}</p>
            ${why.limite ? `<p><strong>Limite :</strong> ${why.limite}</p>` : ''}
          </details>
        </li>
      `;
    }).join('');

    const barItems = Object.entries(summary.playerCounts).map(([style, value]) => {
      const compareValue = summary.hannibalCounts[style] || 0;
      return `
        <div class="bar-row">
          <div class="bar-label">${window.PROFILS[style].nom}</div>
          <div class="bar-track">
            <div class="bar-fill player" style="width: ${(value / 15) * 100}%"></div>
            <div class="bar-fill hannibal" style="width: ${(compareValue / 15) * 100}%"></div>
          </div>
          <div class="bar-value">${value} / ${compareValue}</div>
        </div>
      `;
    }).join('');

    const topScenario = summary.scenarioMoment && summary.scenarioMoment.scenarioId ? summary.scenarioMoment.scenarioId : 's10';
    const divergence = summary.biggestDivergence && summary.biggestDivergence.scenario ? summary.biggestDivergence.scenario.title : 'Aucun';

    return `
      <section class="screen results-screen" aria-live="polite">
        <div class="results-header">
          <div>
            <p class="eyebrow">Résultats</p>
            <h2>${summary.title}</h2>
          </div>
          <div class="score-ring">
            <span>${summary.fidelityScore} / 15</span>
          </div>
        </div>

        <div class="results-summary">
          <h3>Ton profil de stratège</h3>
          <p><strong>${summary.dominant.profile}</strong></p>
          <p>${summary.dominant.text}</p>
        </div>

        <div class="results-panel">
          <h3>Comparaison avec Hannibal</h3>
          ${barItems}
        </div>

        <div class="results-panel">
          <h3>Jauges finales</h3>
          <div class="gauge-grid">
            <div><span>Hommes</span><strong>100</strong></div>
            <div><span>Moral</span><strong>70</strong></div>
            <div><span>Vivres</span><strong>70</strong></div>
            <div><span>Alliés</span><strong>30</strong></div>
          </div>
        </div>

        <div class="results-panel">
          <h3>Ton parcours</h3>
          <ul class="journey-list">${listItems}</ul>
        </div>

        <div class="results-panel">
          <h3>Tes moments clés</h3>
          <p><strong>Le meilleur moment :</strong> ${topScenario}</p>
          <p><strong>La plus grande divergence :</strong> ${divergence}</p>
        </div>

        <div class="results-panel">
          <h3>Verdict</h3>
          <p>${summary.verdict}</p>
        </div>

        <div class="results-panel">
          <p>Fidèle ne veut pas dire infaillible : Hannibal a gagné presque toutes ses batailles mais perdu la guerre.</p>
          <p>Images et voix générées par IA : reconstitutions, pas des documents historiques.</p>
        </div>

        <div class="controls">
          <button class="primary-button" type="button" id="replay-game">Rejouer</button>
          <button class="secondary-button" type="button" id="read-summary">Écouter mon bilan</button>
          <button class="secondary-button" type="button" id="print-results">Imprimer / PDF</button>
        </div>
      </section>
    `;
  }

  function getVerdict(scenarios, choices) {
    const summary = getSummary(scenarios, choices);
    return summary.verdict;
  }

  return {
    getSummary,
    getVerdict,
    buildResultsHtml
  };
})();

if (typeof window !== 'undefined') {
  window.ResultsAnalyzer = ResultsAnalyzer;
}

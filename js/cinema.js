/* js/cinema.js : diaporama plein écran synchronisé avec la narration (voix du navigateur) */
(function () {
  const PLACEHOLDER = "radial-gradient(circle at 50% 40%, #4a3320, #000)";
  const S = { vol: 1, rate: 1, muted: false, subtitles: true }; // à relier aux réglages existants (étape 6)
  let root, layers = [], activeLayer = 0, run = null, paused = false, hideTimer;
  const bad = new Set();

  /* ---------- fonctions pures ---------- */
  function splitCues(text, minCues) {
    let cues = (String(text).match(/[^.!?…]+[.!?…]+["»”]?|[^.!?…]+$/g) || [String(text)])
      .map(s => s.trim()).filter(Boolean);
    while (cues.length < minCues) {
      let best = -1, bestLen = 0;
      cues.forEach((c, i) => {
        const p = c.search(/[,;:]\s/);
        if (p > 12 && c.length - p > 12 && c.length > bestLen) { best = i; bestLen = c.length; }
      });
      if (best < 0) break;
      const c = cues[best], p = c.search(/[,;:]\s/) + 1;
      cues.splice(best, 1, c.slice(0, p).trim(), c.slice(p).trim());
    }
    return cues;
  }
  function cueImages(cues, n) {
    const total = cues.reduce((a, c) => a + c.length + 1, 0) || 1;
    let acc = 0;
    return cues.map(c => { const f = acc / total; acc += c.length + 1; return Math.min(n - 1, Math.floor(f * n)); });
  }

  /* ---------- interface ---------- */
  function build() {
    if (root) return;
    root = document.createElement("div");
    root.id = "cinema"; root.hidden = true;
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Récit");
    root.innerHTML = `
      <div class="cin-layer"></div><div class="cin-layer"></div>
      <div class="cin-title"><div><span class="cin-badge"></span><h2></h2></div></div>
      <p class="cin-sub" aria-live="polite"></p>
      <div class="cin-bar"><i></i></div>
      <div class="cin-ctrl">
        <button type="button" data-a="pause" aria-label="Pause">⏸</button>
        <button type="button" data-a="next" aria-label="Phrase suivante">⏭</button>
        <button type="button" data-a="mute" aria-label="Son">🔊</button>
        <button type="button" data-a="skip" aria-label="Passer">Passer ✕</button>
      </div>`;
    document.body.appendChild(root);
    layers = [...root.querySelectorAll(".cin-layer")];
    root.querySelector(".cin-ctrl").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      ({ pause: togglePause, next: nextCue, mute: toggleMute, skip: abort })[b.dataset.a]();
    });
    root.addEventListener("pointermove", wake);
    root.addEventListener("pointerdown", wake);
  }
  function wake() {
    const c = root.querySelector(".cin-ctrl");
    c.classList.remove("hide"); clearTimeout(hideTimer);
    hideTimer = setTimeout(() => c.classList.add("hide"), 3000);
  }
  function onKey(e) {
    if (!run) return;
    if (e.code === "Space") { e.preventDefault(); togglePause(); }
    else if (e.key === "ArrowRight") nextCue();
    else if (e.key === "Escape" || e.key.toLowerCase() === "s") abort();
    else if (e.key.toLowerCase() === "m") toggleMute();
  }
  function subtitle(t) { root.querySelector(".cin-sub").textContent = S.subtitles ? t : ""; }
  function safeAssetUrl(url) {
    return window.imgSrc ? window.imgSrc(url) : String(url || '');
  }
  function preload(list) {
    const failed = [];
    list.forEach(src => {
      if (!src) return;
      const im = new Image();
      const safe = safeAssetUrl(src);
      im.onload = () => {};
      im.onerror = () => {
        bad.add(src);
        failed.push({ src, scenario: 'cinema' });
      };
      im.src = safe;
    });
    if (failed.length) {
      console.warn('[Images] Cinéma — chargement impossible', failed);
    }
  }
  function showImage(src) {
    const next = layers[1 - activeLayer], prev = layers[activeLayer];
    const safe = src ? safeAssetUrl(src) : '';
    const useFallback = !src || bad.has(src);
    next.style.backgroundImage = useFallback ? PLACEHOLDER : `url("${safe}")`;
    next.classList.remove("kb", "alt", "on"); void next.offsetWidth;
    next.classList.add("kb", "on"); if (Math.random() < 0.5) next.classList.add("alt");
    prev.classList.remove("on");
    activeLayer = 1 - activeLayer;
  }
  function open() {
    build(); root.hidden = false; document.body.style.overflow = "hidden";
    const rq = root.requestFullscreen || root.webkitRequestFullscreen;
    if (rq) { try { const p = rq.call(root); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    wake(); document.addEventListener("keydown", onKey);
    root.querySelector(".cin-ctrl button").focus();
  }
  function close() {
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    paused = false;
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    root.hidden = true; document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    root.querySelector(".cin-sub").textContent = "";
    layers.forEach(l => l.classList.remove("on", "kb", "alt"));
    if (run && run.opener && run.opener.focus) run.opener.focus();
  }

  /* ---------- contrôles ---------- */
  function abort() { if (run) { run.aborted = true; try { speechSynthesis.cancel(); } catch (e) {} } }
  function nextCue() { if (run) { run.nextRequested = true; try { speechSynthesis.cancel(); } catch (e) {} } }
  function togglePause() {
    paused = !paused;
    try { paused ? speechSynthesis.pause() : speechSynthesis.resume(); } catch (e) {}
    root.querySelector('[data-a="pause"]').textContent = paused ? "▶" : "⏸";
  }
  function toggleMute() {
    S.muted = !S.muted;
    root.querySelector('[data-a="mute"]').textContent = S.muted ? "🔇" : "🔊";
    if (S.muted) { try { speechSynthesis.cancel(); } catch (e) {} }
    if (window.AudioManager && window.audioManager) {
      window.audioManager.isMuted = S.muted;
    }
  }

  /* ---------- temps et voix ---------- */
  const sleep = ms => new Promise(r => {
    let left = ms;
    const t = setInterval(() => {
      if (!run || run.aborted || run.nextRequested) { clearInterval(t); r(); return; }
      if (!paused) left -= 100;
      if (left <= 0) { clearInterval(t); r(); }
    }, 100);
  });
  function speakCue(text, onStart) {
    return new Promise(resolve => {
      const est = Math.max(2500, text.split(/\s+/).length / 2.8 * 1000);
      const synth = window.speechSynthesis;
      let done = false, started = false, wd;
      const finish = () => { if (!done) { done = true; clearTimeout(wd); resolve(); } };
      const fallback = () => {
        if (started) return; started = true; onStart();
        try { synth && synth.cancel(); } catch (e) {}
        sleep(est).then(finish);
      };
      wd = setTimeout(fallback, 1500);
      if (!synth || S.muted) { clearTimeout(wd); return fallback(); }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR"; u.rate = S.rate; u.volume = S.vol;
      const v = synth.getVoices().find(v => /^fr/i.test(v.lang)); if (v) u.voice = v;
      u.onstart = () => { if (!started) { started = true; clearTimeout(wd); onStart(); } };
      u.onend = finish; u.onerror = finish;
      synth.speak(u);
    });
  }

  /* ---------- séquence ---------- */
  async function titleCard(ch) {
    const t = root.querySelector(".cin-title");
    root.querySelector("h2").textContent = ch.title || "";
    const b = root.querySelector(".cin-badge");
    b.textContent = ch.badge ? ch.badge.txt : ""; b.className = "cin-badge " + (ch.badge ? ch.badge.cls : "");
    t.classList.add("on");
    await sleep(ch.cardMs || 1800);
    t.classList.remove("on");
  }
  async function playChapter(ch) {
    const imgs = (ch.images && ch.images.length) ? ch.images : [null];
    preload(imgs);
    const cues = splitCues(ch.text || "", imgs.length);
    const map = cueImages(cues, imgs.length);
    let shown = 0;
    showImage(imgs[0]);
    root.querySelector(".cin-bar i").style.width = "0%";
    if (ch.title) { run.nextRequested = false; await titleCard(ch); }
    for (let i = 0; i < cues.length && !run.aborted; i++) {
      run.nextRequested = false;
      await speakCue(cues[i], () => {
        if (map[i] !== shown) { shown = map[i]; showImage(imgs[shown]); }
        subtitle(cues[i]);
        root.querySelector(".cin-bar i").style.width = ((i + 1) / cues.length * 100) + "%";
      });
    }
    if (!run.aborted) { run.nextRequested = false; await sleep(900); }
  }
  function playSequence(chapters) {
    if (run) return run.promise;
    run = { aborted: false, nextRequested: false, opener: document.activeElement };
    open();
    run.promise = (async () => {
      try { for (const ch of chapters) { if (run.aborted) break; await playChapter(ch); } }
      catch (e) { console.error("[Cinema] erreur", e); }
      finally { close(); run = null; }
    })();
    return run.promise;
  }

  window.Cinema = { playSequence, splitCues, cueImages, settings: S, abort };
})();

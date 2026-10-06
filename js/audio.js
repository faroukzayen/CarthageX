class AudioManager {
  constructor() {
    this.speechSynthesisSupported = 'speechSynthesis' in window;
    this.voice = null;
    this.isMuted = false;
    this.volume = 0.7;
    this.rate = 1;
    this.pitch = 1;
    this.currentUtterance = null;
  }

  getVoice() {
    if (!this.speechSynthesisSupported) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => /fr/i.test(voice.lang) && /france|fr-fr/i.test(voice.lang));

    if (preferred) {
      return preferred;
    }

    return voices.find((voice) => /fr/i.test(voice.lang)) || voices[0] || null;
  }

  speak(text, options = {}) {
    if (!this.speechSynthesisSupported || this.isMuted) {
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = options.voice || this.getVoice();
    const rate = options.rate ?? this.rate;
    const pitch = options.pitch ?? this.pitch;

    utterance.voice = voice;
    utterance.lang = voice ? voice.lang : 'fr-FR';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = this.volume;
    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  cancel() {
    if (this.speechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.cancel();
    }
    return this.isMuted;
  }
}

if (typeof window !== 'undefined') {
  window.AudioManager = AudioManager;
}

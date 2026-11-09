// ASTROBASE: Junior Astronaut Mission Trainer
// Synthesized Web Audio Engine (Zero external audio dependencies)

class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = "sine", duration = 0.1, gainVal = 0.15) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  click() {
    this.playTone(800, "sine", 0.04, 0.08);
  }

  toggle() {
    this.playTone(1200, "triangle", 0.05, 0.06);
  }

  success() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sine", 0.18, 0.12);
      }, idx * 60);
    });
  }

  upgrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "triangle", 0.22, 0.15);
      }, idx * 75);
    });
  }

  warning() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(400, "sawtooth", 0.15, 0.12);
    setTimeout(() => {
      this.playTone(300, "sawtooth", 0.25, 0.14);
    }, 120);
  }

  danger() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [220, 196, 174, 130].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sawtooth", 0.2, 0.18);
      }, idx * 90);
    });
  }

  dayAdvance() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      setTimeout(() => {
        this.playTone(1046.5, "triangle", 0.25, 0.1);
      }, 350);
    } catch (e) {
      console.warn("Audio warp error:", e);
    }
  }

  gameComplete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77],
      [783.99, 987.77, 1174.66, 1567.98]
    ];
    chords.forEach((chord, step) => {
      setTimeout(() => {
        chord.forEach(f => this.playTone(f, "sine", 0.35, 0.1));
      }, step * 180);
    });
  }
}

window.astroAudio = new SpaceAudioEngine();


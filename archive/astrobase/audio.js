// ASTROBASE: Junior Astronaut Mission Trainer
// Professional Synthesized Space Audio Engine (Zero external audio file dependencies)

class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
    this.volume = 0.8;
    this.sfxVolume = 0.8;
    this.ambientVolume = 0.35;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // SFX Gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Ambient Drone Gain
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setAmbientVolume(val) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Realistic space ambient soundscape (EVA helmet life support drone + cosmic solar wind)
  startAmbientDrone() {
    if (this.isAmbientPlaying || this.muted) return;
    try {
      this.init();
      if (!this.ctx || !this.ambientGain) return;

      const now = this.ctx.currentTime;

      // Low frequency rumble (suit life support pump)
      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, now); // 55Hz (A1)

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = "lowpass";
      filter1.frequency.setValueAtTime(140, now);

      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.4, now);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.ambientGain);
      osc1.start(now);

      // Ethereal space harmony pad (Deep space mystery)
      const osc2 = this.ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110, now); // 110Hz (A2)

      const filter2 = this.ctx.createBiquadFilter();
      filter2.type = "bandpass";
      filter2.frequency.setValueAtTime(220, now);
      filter2.Q.setValueAtTime(3.0, now);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, now); // slow breath sweep
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(80, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter2.frequency);
      lfo.start(now);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.18, now);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(this.ambientGain);
      osc2.start(now);

      this.ambientNodes = [osc1, osc2, lfo];
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  stopAmbientDrone() {
    this.ambientNodes.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
  }

  playTone(freq, type = "sine", duration = 0.1, gainVal = 0.15) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  click() {
    this.playTone(900, "sine", 0.04, 0.08);
  }

  hover() {
    this.playTone(1400, "triangle", 0.02, 0.03);
  }

  toggle() {
    this.playTone(1200, "triangle", 0.05, 0.06);
  }

  interact() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [659.25, 880].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sine", 0.08, 0.1);
      }, idx * 60);
    });
  }

  // Apollo Quindar Tone (Houston comms beep)
  quindarTone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(2524, "sine", 0.12, 0.09); // exact Apollo intro tone frequency
  }

  footstep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Crunchy lunar regolith dust step
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch(e) {}
  }

  jump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Suit thruster / lunar push off
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch(e) {}
  }

  airlockHiss() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      whiteNoise.start();
    } catch(e) {}
  }

  success() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
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
    this.playTone(480, "sawtooth", 0.18, 0.14);
    setTimeout(() => {
      this.playTone(360, "sawtooth", 0.22, 0.16);
    }, 120);
  }

  danger() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [260, 220, 180, 140].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sawtooth", 0.25, 0.2);
      }, idx * 80);
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
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.4);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.45);

      setTimeout(() => {
        this.playTone(1046.5, "triangle", 0.25, 0.12);
      }, 400);
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

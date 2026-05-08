let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  audioContext = audioContext ?? new AudioContextClass();

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

export function playSuccessSound() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  master.connect(context.destination);

  const notes = [
    { frequency: 659.25, start: 0, duration: 0.16 },
    { frequency: 880, start: 0.09, duration: 0.2 },
    { frequency: 1318.51, start: 0.18, duration: 0.18 },
  ];

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.26, now + note.start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.03);
  });
}

export function playUnlockSound() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.07, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
  master.connect(context.destination);

  const clickOscillator = context.createOscillator();
  const clickGain = context.createGain();
  clickOscillator.type = "triangle";
  clickOscillator.frequency.setValueAtTime(220, now);
  clickOscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.055);
  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  clickOscillator.connect(clickGain);
  clickGain.connect(master);
  clickOscillator.start(now);
  clickOscillator.stop(now + 0.1);

  const notes = [
    { frequency: 523.25, start: 0.08, duration: 0.13 },
    { frequency: 659.25, start: 0.15, duration: 0.15 },
    { frequency: 987.77, start: 0.24, duration: 0.2 },
  ];

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.2, now + note.start + 0.016);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.03);
  });
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

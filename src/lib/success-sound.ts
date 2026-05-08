let audioContext: AudioContext | null = null;

export function playSuccessSound() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  audioContext = audioContext ?? new AudioContextClass();

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  const now = audioContext.currentTime;
  const master = audioContext.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  master.connect(audioContext.destination);

  const notes = [
    { frequency: 659.25, start: 0, duration: 0.16 },
    { frequency: 880, start: 0.09, duration: 0.2 },
    { frequency: 1318.51, start: 0.18, duration: 0.18 },
  ];

  notes.forEach((note) => {
    const oscillator = audioContext!.createOscillator();
    const gain = audioContext!.createGain();

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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

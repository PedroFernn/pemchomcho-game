// ============ AUDIO: Motor de música y efectos 8-bits (Web Audio API) ============
// NOTES (frecuencias), play8BitNote/play8BitNoise (síntesis), playSFX (efectos
// de golpe/crítico/click), BGM_TRACKS (partituras de cada pista), ENEMY_TRANSPOSE
// (variación de tono por enemigo) y setBGM (reproductor con loop). Para afinar
// la música o añadir una pista nueva, este es el único archivo que hace falta tocar.
// Sin dependencias de otros módulos.

// ---------- MOTOR MÚSICA Y SFX 8-BITS (Web Audio API) ----------
let audioCtx = null;
let isMuted = false;
let bgmTimer = null;
let bgmStep = 0;
let currentTrackKey = null;
let bgmTranspose = 1;

const NOTES = {
  C2:65.41, D2:73.42, E2:82.41, F2:87.31, G2:98.00, A2:110.00, B2:123.47,
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
  OFF: 0
};

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function play8BitNote(freq, dur, type='square', vol=0.08) {
  if (isMuted || !audioCtx || freq <= 0) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch(e){}
}

function play8BitNoise(dur, vol=0.06, isSnare=false) {
  if (isMuted || !audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = isSnare ? 'highpass' : 'lowpass';
    filter.frequency.value = isSnare ? 1200 : 350;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch(e){}
}

function playSFX(type) {
  initAudio();
  if (isMuted) return;
  if (type === 'hit') {
    play8BitNoise(0.12, 0.12, true);
    play8BitNote(NOTES.C3, 0.1, 'sawtooth', 0.12);
  } else if (type === 'crit') {
    play8BitNoise(0.2, 0.15, true);
    play8BitNote(NOTES.G4, 0.15, 'square', 0.15);
    setTimeout(() => play8BitNote(NOTES.C5, 0.2, 'square', 0.15), 50);
  } else if (type === 'click') {
    play8BitNote(NOTES.E5, 0.04, 'square', 0.06);
  } else if (type === 'block') {
    play8BitNote(NOTES.G3, 0.08, 'triangle', 0.15);
    play8BitNote(NOTES.C3, 0.12, 'square', 0.12);
  } else if (type === 'magic') {
    [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5].forEach((n, i) => {
      setTimeout(() => play8BitNote(n, 0.08, 'square', 0.08), i * 35);
    });
  } else if (type === 'victory') {
    const song = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5];
    song.forEach((n, i) => {
      setTimeout(() => play8BitNote(n, 0.2, 'square', 0.12), i * 140);
    });
  }
}

const BGM_TRACKS = {
  title: {
    bpm: 125,
    bass: [NOTES.C3, NOTES.C3, NOTES.G2, NOTES.G2, NOTES.A2, NOTES.A2, NOTES.F2, NOTES.G2],
    lead: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.G4, NOTES.E4, NOTES.D4],
    drums: [1, 0, 2, 0, 1, 0, 2, 1]
  },
  battle: {
    bpm: 158, epic:true,
    bass: [NOTES.A2, NOTES.A2, NOTES.C3, NOTES.A2, NOTES.D3, NOTES.A2, NOTES.C3, NOTES.E3],
    lead: [NOTES.A4, NOTES.A4, NOTES.C5, NOTES.A4, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.C5, NOTES.A4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.G4],
    drums: [2, 1, 2, 1, 2, 1, 2, 2]
  },
  disco: {
    bpm: 140, epic:true,
    bass: [NOTES.E2, NOTES.E2, NOTES.G2, NOTES.E2, NOTES.A2, NOTES.E2, NOTES.B2, NOTES.E2],
    lead: [NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.E4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.F5, NOTES.E5, NOTES.C5, NOTES.A4, NOTES.F4],
    drums: [1, 1, 2, 1, 1, 1, 2, 2]
  },
  shop: {
    bpm: 88, chill:true, leadType:'sine', volScale:0.85,
    bass: [NOTES.C3, NOTES.G2, NOTES.A2, NOTES.E2, NOTES.F2, NOTES.C3, NOTES.F2, NOTES.G2],
    lead: [NOTES.E4, NOTES.G4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.C5, NOTES.G4, NOTES.E4],
    drums: [0, 0, 0, 0, 0, 0, 0, 0]
  },
  defeat: {
    bpm: 66, sad:true, leadType:'sine', volScale:0.75,
    bass: [NOTES.A2, NOTES.A2, NOTES.F2, NOTES.F2, NOTES.G2, NOTES.G2, NOTES.E2, NOTES.E2],
    lead: [NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4, NOTES.C4],
    drums: [0, 0, 0, 0, 0, 0, 0, 0]
  }
};

// Ligera variación de tono por enemigo (0=Miaudre,1=Croakzilla,2=Cuervox,3=Drácupollo,4=Lobeats,5=Discoperro)
const ENEMY_TRANSPOSE = [0, -2, 3, -3, 0, 2];

function setBGM(trackKey, semitoneShift=0) {
  initAudio();
  const variantKey = trackKey + ':' + semitoneShift;
  if (currentTrackKey === variantKey) return;
  currentTrackKey = variantKey;
  bgmStep = 0;
  bgmTranspose = Math.pow(2, semitoneShift / 12);
  if (bgmTimer) clearInterval(bgmTimer);
  if (!trackKey || !BGM_TRACKS[trackKey]) return;

  const track = BGM_TRACKS[trackKey];
  const stepTime = (60 / track.bpm / 2) * 1000;
  const leadType = track.leadType || 'square';
  const vol = track.volScale || 1;

  bgmTimer = setInterval(() => {
    if (isMuted || !audioCtx) return;
    const bNote = track.bass[bgmStep % track.bass.length];
    if (bNote) play8BitNote(bNote * bgmTranspose, stepTime / 1000 * 0.85, 'triangle', 0.1 * vol);

    const lNote = track.lead[bgmStep % track.lead.length];
    if (lNote) play8BitNote(lNote * bgmTranspose, stepTime / 1000 * 0.75, leadType, 0.06 * vol);

    if (bgmStep % 2 === 0 && lNote) {
      play8BitNote(lNote * bgmTranspose * 1.5, 0.04, leadType, 0.025 * vol);
    }

    const drum = track.drums[bgmStep % track.drums.length];
    if (drum === 1) play8BitNoise(0.05, 0.05, false);
    else if (drum === 2) play8BitNoise(0.07, 0.06, true);

    if (track.epic && bgmStep % 8 === 0) {
      play8BitNote(NOTES.C2 * bgmTranspose, 0.28, 'sawtooth', 0.13);
      play8BitNoise(0.22, 0.11, false);
    }

    bgmStep++;
  }, stepTime);
}

document.getElementById('audio-toggle').addEventListener('click', () => {
  initAudio();
  isMuted = !isMuted;
  document.getElementById('audio-toggle').textContent = isMuted ? '🔇 MÚSICA OFF' : '🔊 MÚSICA ON';
});

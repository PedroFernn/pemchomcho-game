// ============ AUDIO: Motor Chiptune Profesional (Web Audio API) ============

let audioCtx = null;
let masterGain = null;
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
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Reproduce notas con envolventes ADSR y opción de Vibrato / Pitch Bend
function play8BitNote(freq, dur, type = 'square', vol = 0.08, time = null, options = {}) {
  if (isMuted || !audioCtx || freq <= 0) return;
  try {
    const startTime = time || audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Pitch Bend (Glide)
    if (options.glideTo) {
      osc.frequency.exponentialRampToValueAtTime(options.glideTo, startTime + dur);
    }

    // Vibrato Chiptune (LFO)
    if (options.vibrato) {
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(6, startTime); // 6 Hz vibrato
      lfoGain.gain.setValueAtTime(freq * 0.02, startTime); // Profundidad
      lfo.connect(osc.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + dur);
    }

    // ADSR Envelope
    const attack = options.attack || 0.008;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(vol, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + dur);
  } catch (e) {}
}

// Arpegio Chiptune Ultrarrápido (simula acordes de 3 notas en un solo canal)
function playArpChord(chordNotes, dur, type = 'square', vol = 0.06, time = null) {
  if (isMuted || !audioCtx || !chordNotes || chordNotes.length === 0) return;
  const startTime = time || audioCtx.currentTime;
  const noteDuration = 0.04; // 40ms por nota del arpegio
  const iterations = Math.floor(dur / (noteDuration * chordNotes.length));

  let offset = 0;
  for (let i = 0; i < iterations * chordNotes.length; i++) {
    const note = chordNotes[i % chordNotes.length];
    if (note > 0) {
      play8BitNote(note * bgmTranspose, noteDuration * 0.9, type, vol, startTime + offset, { attack: 0.002 });
    }
    offset += noteDuration;
  }
}

// Sintetizador de Batería Chiptune Completa
function play8BitDrum(type, time = null) {
  if (isMuted || !audioCtx) return;
  try {
    const startTime = time || audioCtx.currentTime;

    if (type === 1) { // KICK (Bombo pesado)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, startTime);
      osc.frequency.exponentialRampToValueAtTime(25, startTime + 0.09);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.09);

    } else if (type === 2) { // SNARE (Tarola con impacto)
      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, startTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start(startTime);

      // Tono sutil debajo del ruido para dar golpe
      play8BitNote(NOTES.C3, 0.05, 'triangle', 0.1, startTime);

    } else if (type === 3) { // HI-HAT (Platillo)
      const bufferSize = audioCtx.sampleRate * 0.04;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5000, startTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start(startTime);
    }
  } catch (e) {}
}

function playSFX(type) {
  initAudio();
  if (isMuted) return;

  const now = audioCtx.currentTime;
  if (type === 'hit') {
    play8BitDrum(2, now);
    play8BitNote(NOTES.G3, 0.1, 'sawtooth', 0.15, now, { glideTo: NOTES.C2 });
  } else if (type === 'crit') {
    play8BitDrum(2, now);
    play8BitNote(NOTES.C4, 0.06, 'square', 0.15, now);
    play8BitNote(NOTES.G4, 0.06, 'square', 0.15, now + 0.05);
    play8BitNote(NOTES.C5, 0.2, 'square', 0.18, now + 0.1, { vibrato: true });
  } else if (type === 'click') {
    play8BitNote(NOTES.E5, 0.02, 'square', 0.04, now);
  } else if (type === 'block') {
    play8BitNote(NOTES.C4, 0.08, 'triangle', 0.18, now, { glideTo: NOTES.G2 });
  } else if (type === 'magic') {
    playArpChord([NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4, NOTES.C5], 0.25, 'sine', 0.08, now);
  } else if (type === 'victory') {
    playArpChord([NOTES.C4, NOTES.E4, NOTES.G4], 0.15, 'square', 0.1, now);
    playArpChord([NOTES.G4, NOTES.B4, NOTES.D5], 0.15, 'square', 0.1, now + 0.15);
    play8BitNote(NOTES.C5, 0.4, 'square', 0.15, now + 0.3, { vibrato: true });
  }
}

// PARTITURAS POLIFÓNICAS ENRIQUECIDAS
const BGM_TRACKS = {
  title: {
    bpm: 120,
    bass: [NOTES.C3, NOTES.C3, NOTES.G2, NOTES.G2, NOTES.A2, NOTES.A2, NOTES.F2, NOTES.G2],
    lead: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.G4, NOTES.E4, NOTES.D4],
    harmony: [NOTES.G3, NOTES.C4, NOTES.E4, NOTES.C4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.D4, NOTES.F4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.C4, NOTES.B3],
    drums: [1, 3, 2, 3, 1, 3, 2, 3]
  },
  battle: {
    bpm: 152, epic: true,
    bass: [NOTES.A2, NOTES.A2, NOTES.C3, NOTES.A2, NOTES.D3, NOTES.A2, NOTES.C3, NOTES.E3],
    lead: [NOTES.A4, NOTES.A4, NOTES.C5, NOTES.A4, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.C5, NOTES.A4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.G4],
    harmony: [NOTES.C4, NOTES.C4, NOTES.E4, NOTES.C4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.E4, NOTES.C4, NOTES.C4, NOTES.E4, NOTES.C4, NOTES.E4, NOTES.D4, NOTES.B3],
    arps: [
      [NOTES.A3, NOTES.C4, NOTES.E4], [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.D4, NOTES.F4, NOTES.A4], [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.E4, NOTES.G4, NOTES.B4]
    ],
    drums: [1, 3, 2, 3, 1, 1, 2, 3]
  },
  disco: {
    bpm: 135, epic: true,
    bass: [NOTES.E2, NOTES.E2, NOTES.G2, NOTES.E2, NOTES.A2, NOTES.E2, NOTES.B2, NOTES.E2],
    lead: [NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.E4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.F5, NOTES.E5, NOTES.C5, NOTES.A4, NOTES.F4],
    harmony: [NOTES.B3, NOTES.E4, NOTES.G4, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.B3, NOTES.C4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.F4, NOTES.C4],
    drums: [1, 2, 1, 2, 1, 2, 1, 2]
  },
  shop: {
    bpm: 88, chill: true, leadType: 'sine', volScale: 0.85,
    bass: [NOTES.C3, NOTES.G2, NOTES.A2, NOTES.E2, NOTES.F2, NOTES.C3, NOTES.F2, NOTES.G2],
    lead: [NOTES.E4, NOTES.G4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.C5, NOTES.G4, NOTES.E4],
    harmony: [NOTES.G3, NOTES.E4, NOTES.E4, NOTES.C4, NOTES.C4, NOTES.E4, NOTES.C4, NOTES.B3],
    drums: [1, 0, 0, 0, 2, 0, 0, 0]
  },
  defeat: {
    bpm: 66, sad: true, leadType: 'sine', volScale: 0.75,
    bass: [NOTES.A2, NOTES.A2, NOTES.F2, NOTES.F2, NOTES.G2, NOTES.G2, NOTES.E2, NOTES.E2],
    lead: [NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4, NOTES.C4],
    harmony: [NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.A3, NOTES.A3, NOTES.B3, NOTES.G3],
    drums: [0, 0, 0, 0, 0, 0, 0, 0]
  }
};

const ENEMY_TRANSPOSE = [0, -2, 3, -3, 0, 2];

function setBGM(trackKey, semitoneShift = 0) {
  initAudio();
  const variantKey = trackKey + ':' + semitoneShift;
  if (currentTrackKey === variantKey) return;
  currentTrackKey = variantKey;
  bgmStep = 0;
  bgmTranspose = Math.pow(2, semitoneShift / 12);

  if (bgmTimer) clearInterval(bgmTimer);
  if (!trackKey || !BGM_TRACKS[trackKey]) return;

  const track = BGM_TRACKS[trackKey];
  const stepDuration = (60 / track.bpm / 2);
  const leadType = track.leadType || 'square';
  const vol = track.volScale || 1;

  bgmTimer = setInterval(() => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    // 1. Canal de Bajo
    const bNote = track.bass[bgmStep % track.bass.length];
    if (bNote) {
      play8BitNote(bNote * bgmTranspose, stepDuration * 0.85, 'triangle', 0.14 * vol, now);
    }

    // 2. Canal de Lead 1 (Melodía Principal con Vibrato en notas largas)
    const lNote = track.lead[bgmStep % track.lead.length];
    if (lNote) {
      play8BitNote(lNote * bgmTranspose, stepDuration * 0.8, leadType, 0.08 * vol, now, { vibrato: true });
    }

    // 3. Canal de Lead 2 (Armonía Secundaria en onda 'pulse/sawtooth')
    if (track.harmony) {
      const hNote = track.harmony[bgmStep % track.harmony.length];
      if (hNote) {
        play8BitNote(hNote * bgmTranspose, stepDuration * 0.7, 'sawtooth', 0.04 * vol, now);
      }
    }

    // 4. Arpegios de Fondo (Si la pista tiene acordes asignados)
    if (track.arps) {
      const chord = track.arps[bgmStep % track.arps.length];
      if (chord) {
        playArpChord(chord, stepDuration, 'square', 0.03 * vol, now);
      }
    }

    // 5. Canal de Percusión (1: Kick, 2: Snare, 3: Hi-Hat)
    const drum = track.drums[bgmStep % track.drums.length];
    if (drum) play8BitDrum(drum, now);

    // Acento Épico
    if (track.epic && bgmStep % 8 === 0) {
      play8BitNote(NOTES.C2 * bgmTranspose, 0.25, 'sawtooth', 0.1 * vol, now, { glideTo: NOTES.C1 });
    }

    bgmStep++;
  }, stepDuration * 1000);
}

document.getElementById('audio-toggle').addEventListener('click', () => {
  initAudio();
  isMuted = !isMuted;
  document.getElementById('audio-toggle').textContent = isMuted ? '🔇 MÚSICA OFF' : '🔊 MÚSICA ON';
});

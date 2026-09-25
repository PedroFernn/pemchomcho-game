// ============ MINIGAMES: Golpe Certero, Billar, Trileros, Carrera y Memory ============
let mgT = 0, mgActive = false, mgAttempts = 0, mgResult = '';

// ---------- Menú Selección de Minijuegos ----------
function drawMinigamesMenu() {
  B(10, 14, W - 20, 110, '#28173d');
  g.textAlign = 'center'; g.font = "bold 11px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🎮 SALA DE MINIJUEGOS', W / 2, 28);
  g.font = "7px 'Courier New',monospace"; g.fillStyle = '#d8cce8';
  g.fillText('🎯 Golpe Certero — detén la barra en la zona dorada.', W / 2, 42);
  g.fillText('🎱 Billar de Huntleo — apunta y emboca en una tronera.', W / 2, 54);
  g.fillText('🎲 Trileros de Tammybb — encuentra el vaso con su peso.', W / 2, 66);
  g.fillText('🏃 Carrera Táctica — esquiva obstáculos a toda velocidad.', W / 2, 78);
  g.fillText('🃏 Memoria Pixel — encuentra los pares de cartas.', W / 2, 90);
  g.textAlign = 'left';

  // Dibujar al personaje EN FRENTE (Z-index superior)
  const p = chars[sel];
  p.draw(30, 166);

  drawDialog();
}

// ---------- Minijuego 1: Golpe Certero ----------
function drawMinigameTiming(dt) {
  if (mgActive) mgT += dt;

  B(10, 14, W - 20, 90, '#28173d');
  g.textAlign = 'center'; g.font = "bold 10px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🎯 GOLPE CERTERO', W / 2, 26);
  g.font = "7px 'Courier New',monospace"; g.fillStyle = '#d8cce8';
  g.fillText('Intento ' + Math.min(mgAttempts + 1, 3) + '/3 — Detén la barra en la zona dorada', W / 2, 38);

  const bx = 28, by = 50, bw = W - 56, bh = 10;
  R(bx - 1, by - 1, bw + 2, bh + 2, K); R(bx, by, bw, bh, '#3a2650');
  R(Math.round(bx + bw * .65), by, Math.round(bw * .20), bh, '#e0b040');
  R(Math.round(bx + bw * .85), by, Math.round(bw * .15), bh, '#5cff9d');
  const pos = (Math.sin(mgT * 4.2) + 1) / 2;
  R(Math.round(bx + pos * bw) - 1, by - 3, 2, bh + 6, '#ffffff');

  g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#fff2a0';
  g.fillText(mgResult, W / 2, 80);
  g.textAlign = 'left';

  // Dibujo en capa frontal
  chars[sel].draw(30, 166);
}

function startMinigame() { mgAttempts = 0; mgActive = false; mgResult = 'Presiona Lanzar para empezar'; state = 'mg_timing'; updateUI(); }
function startMgRound() { mgActive = true; mgT = Math.random() * 6; mgResult = ''; updateUI(); }
function stopMgRound() {
  mgActive = false;
  const pos = (Math.sin(mgT * 4.2) + 1) / 2;
  let gained = 5, label = 'Flojo...';
  if (pos > 0.85) { gained = 40; label = '¡PERFECTO!'; playSFX('crit'); }
  else if (pos > 0.65) { gained = 20; label = '¡Bien!'; playSFX('hit'); }
  else { playSFX('click'); }
  points += gained; mgAttempts++;
  mgResult = label + ' +' + gained + ' Pts';
  updateUI();
}

// ---------- Minijuego 2: Billar de Huntleo ----------
function huntleoBall(cx, cy, r) {
  ball(cx, cy, r, '#242028'); ball(cx, cy, r - 2, '#4a4650');
  R(cx - r + 2, cy - 1, r * 2 - 4, r - 2, '#eef0f4');
  R(cx - r, cy - r - 1, 4, 4, '#242028'); R(cx + r - 3, cy - r - 1, 4, 4, '#242028');
  R(cx - 3, cy - 3, 2, 2, '#151015'); R(cx + 1, cy - 3, 2, 2, '#151015');
  R(cx - 1, cy, 2, 2, '#c8402b');
}
let poolPhase = 'aim', poolAngle = 0, poolAttempts = 0, poolResult = '', poolAnimT = 0, poolSank = false;
let poolBall = { x: 0, y: 0 }, poolOutcome = null;
const POOL_CX = 160, POOL_CY = 90, POOL_TX = 24, POOL_TY = 44, POOL_TW = 272, POOL_TH = 88;
const POOL_POCKETS = [[POOL_TX, POOL_TY], [POOL_TX + POOL_TW, POOL_TY], [POOL_TX, POOL_TY + POOL_TH], [POOL_TX + POOL_TW, POOL_TY + POOL_TH]];

function startPoolGame() {
  poolAttempts = 0; poolPhase = 'aim'; poolAngle = 0; poolResult = 'Presiona ¡Golpear! para lanzar';
  poolBall = { x: POOL_CX, y: POOL_CY }; state = 'mg_pool'; updateUI();
}
function strikePool() {
  poolPhase = 'shoot'; poolAnimT = 0;
  const ang = poolAngle * Math.PI / 180; let best = null;
  POOL_POCKETS.forEach(([px, py]) => {
    const pa = Math.atan2(py - POOL_CY, px - POOL_CX);
    let diff = Math.abs(pa - ang); if (diff > Math.PI) diff = 2 * Math.PI - diff;
    const deg = diff * 180 / Math.PI;
    if (!best || deg < best.deg) best = { px, py, deg };
  });
  poolOutcome = best; updateUI();
}
function finishPoolShot() {
  poolPhase = 'result'; poolAttempts++;
  let gained = 5, label = '¡Rebotó en la banda!'; poolSank = false;
  if (poolOutcome.deg < 8) {
    gained = 45; label = '¡EMBOCADA PERFECTA!'; playSFX('crit'); poolSank = true;
    burstAt(poolOutcome.px, poolOutcome.py, '#ffd25e', 12, 50); triggerFlash('#ffe066', .12);
  } else if (poolOutcome.deg < 20) {
    gained = 22; label = '¡Buena tronera!'; playSFX('hit'); poolSank = true;
    burstAt(poolOutcome.px, poolOutcome.py, '#78b0ff', 8, 38);
  } else { playSFX('click'); poolBall = { x: POOL_CX, y: POOL_CY }; }
  points += gained; poolResult = label + ' +' + gained + ' Pts'; updateUI();
}
function drawMinigamePool(dt) {
  B(10, 10, W - 20, 138, '#123321');
  g.textAlign = 'center'; g.font = "bold 10px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🎱 BILLAR: BOLA DE HUNTLEO', W / 2, 22);
  g.font = "7px 'Courier New',monospace"; g.fillStyle = '#d8cce8';
  g.fillText('Intento ' + Math.min(poolAttempts + 1, 3) + '/3 — Apunta hacia una tronera', W / 2, 32);

  R(POOL_TX - 4, POOL_TY - 4, POOL_TW + 8, POOL_TH + 8, '#5a3a20');
  R(POOL_TX, POOL_TY, POOL_TW, POOL_TH, '#0f5c33');
  POOL_POCKETS.forEach(([px, py]) => ball(px, py, 8, '#050505'));

  if (poolPhase === 'aim') {
    poolAngle = (poolAngle + dt * 95) % 360;
    const ang = poolAngle * Math.PI / 180;
    g.strokeStyle = '#fff'; g.lineWidth = 1; g.beginPath();
    g.moveTo(POOL_CX, POOL_CY); g.lineTo(POOL_CX + Math.cos(ang) * 34, POOL_CY + Math.sin(ang) * 34); g.stroke();
  } else if (poolPhase === 'shoot') {
    poolAnimT += dt * 2.2;
    const tt = Math.min(1, poolAnimT);
    if (poolOutcome.deg < 20) {
      poolBall.x = POOL_CX + (poolOutcome.px - POOL_CX) * tt; poolBall.y = POOL_CY + (poolOutcome.py - POOL_CY) * tt;
    } else {
      const ang = poolAngle * Math.PI / 180, bounce = Math.sin(tt * Math.PI) * 26;
      poolBall.x = POOL_CX + Math.cos(ang) * bounce; poolBall.y = POOL_CY + Math.sin(ang) * bounce;
    }
    if (tt >= 1) finishPoolShot();
  }
  if (!(poolPhase === 'result' && poolSank)) huntleoBall(poolBall.x, poolBall.y, 9);

  g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#fff2a0';
  g.fillText(poolResult, W / 2, 142); g.textAlign = 'left';

  // Dibujo en capa frontal
  chars[2].draw(30, 166);
}

// ---------- Minijuego 3: Trileros ----------
function drawCup(x, y, lifted) {
  const yy = lifted ? y - 16 : y;
  R(x - 15, yy - 2, 30, 3, '#e8b860'); R(x - 13, yy, 26, 15, '#c9922e'); R(x - 15, yy + 14, 30, 4, '#8a5a1e');
}
function drawCoin(x, y) {
  ball(x, y, 6, K); ball(x, y, 5, '#e0b040');
  g.fillStyle = '#8a5a10'; g.font = "bold 7px 'Courier New',monospace"; g.textAlign = 'center';
  g.fillText('$', x, y + 2); g.textAlign = 'left';
}
let shellPhase = 'reveal', shellT = 0, shellCoinSlot = 0, shellAttempts = 0, shellResult = '', shellPick = -1;
const SHELL_X = [90, 160, 230], SHELL_Y = 100;

function startShellGame() {
  shellAttempts = 0; shellPhase = 'reveal'; shellT = 0;
  shellCoinSlot = Math.floor(Math.random() * 3); shellResult = ''; shellPick = -1;
  state = 'mg_shell'; updateUI();
}
function pickShellCup(idx) {
  shellPick = idx; shellPhase = 'result'; shellAttempts++;
  let gained;
  if (idx === shellCoinSlot) {
    gained = 35; shellResult = '¡Encontraste el peso! +' + gained + ' Pts'; playSFX('crit');
    burstAt(SHELL_X[idx], SHELL_Y, '#e0b040', 12, 45); triggerFlash('#ffe066', .12);
  } else { gained = 8; shellResult = 'No era ese vaso... +' + gained + ' Pts'; playSFX('click'); }
  points += gained; updateUI();
}
function drawMinigameShell(dt) {
  B(10, 10, W - 20, 138, '#28173d');
  g.textAlign = 'center'; g.font = "bold 10px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🎲 TRILEROS: EL PESO DE TAMMYBB', W / 2, 22);
  g.font = "7px 'Courier New',monospace"; g.fillStyle = '#d8cce8';
  g.fillText('Intento ' + Math.min(shellAttempts + 1, 3) + '/3', W / 2, 32);

  shellT += dt;
  if (shellPhase === 'reveal') {
    drawCoin(SHELL_X[shellCoinSlot], SHELL_Y);
    SHELL_X.forEach((sx, i) => drawCup(sx, SHELL_Y, i === shellCoinSlot));
    g.fillText('Recuerda dónde está...', W / 2, 142);
    if (shellT > 1.1) { shellPhase = 'shuffle'; shellT = 0; updateUI(); }
  } else if (shellPhase === 'shuffle') {
    const jit = Math.sin(shellT * 22) * 4;
    SHELL_X.forEach((sx, i) => drawCup(sx + jit * (i - 1), SHELL_Y, false));
    g.fillStyle = '#fff2a0'; g.fillText('¡Revolviendo los vasos!', W / 2, 142);
    if (shellT > 1.3) { shellCoinSlot = Math.floor(Math.random() * 3); shellPhase = 'guess'; shellT = 0; updateUI(); }
  } else if (shellPhase === 'guess') {
    SHELL_X.forEach((sx, i) => drawCup(sx, SHELL_Y, false));
    g.fillText('¿Dónde está el peso? Elige un vaso.', W / 2, 142);
  } else if (shellPhase === 'result') {
    SHELL_X.forEach((sx, i) => {
      if (i === shellCoinSlot) drawCoin(sx, SHELL_Y);
      drawCup(sx, SHELL_Y, i === shellCoinSlot || i === shellPick);
    });
    g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#fff2a0'; g.fillText(shellResult, W / 2, 142);
  }
  g.textAlign = 'left';

  // Dibujo en capa frontal
  chars[1].draw(30, 166, t * 2);
}

// ---------- NUEVO MINIJUEGO 4: Carrera Táctica ----------
let racePos = 1, raceObs = [], raceTimer = 0, raceScore = 0, raceActive = false, raceResult = '';

function startRaceGame() {
  racePos = 1; raceObs = []; raceTimer = 10; raceScore = 0; raceActive = true; raceResult = '';
  state = 'mg_race'; updateUI();
}
function moveRace(dir) {
  if (!raceActive) return;
  racePos = Math.max(0, Math.min(2, racePos + dir));
  playSFX('click');
}
function drawMinigameRace(dt) {
  B(10, 10, W - 20, 138, '#1e1a29');
  g.textAlign = 'center'; g.font = "bold 10px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🏃 CARRERA TÁCTICA', W / 2, 22);

  if (raceActive) {
    raceTimer -= dt;
    if (Math.random() < dt * 3) {
      raceObs.push({ lane: Math.floor(Math.random() * 3), y: 35 });
    }
    // Mover obstáculos
    raceObs.forEach(o => o.y += dt * 80);
    // Colisión
    raceObs = raceObs.filter(o => {
      if (o.y > 115 && o.y < 130 && o.lane === racePos) {
        raceScore = Math.max(0, raceScore - 5);
        playSFX('hit');
        burstAt(80 + o.lane * 80, 120, '#ff385c', 6, 20);
        return false;
      }
      if (o.y >= 135) {
        raceScore += 10;
        return false;
      }
      return true;
    });

    if (raceTimer <= 0) {
      raceActive = false;
      points += raceScore;
      raceResult = '¡Tiempo agotado! Ganaste +' + raceScore + ' Pts';
      playSFX('crit');
      updateUI();
    }
  }

  // Pistas
  for (let i = 0; i < 3; i++) {
    const lx = 50 + i * 80;
    R(lx, 35, 60, 95, '#2c223b');
    R(lx - 2, 35, 2, 95, '#5c4878');
  }

  // Dibujar obstáculos
  raceObs.forEach(o => {
    R(65 + o.lane * 80, o.y, 30, 10, '#e02838');
  });

  // Jugador corriendo
  chars[sel].draw(65 + racePos * 80, 120, t * 8);

  g.font = "bold 8px 'Courier New',monospace"; g.fillStyle = '#5cff9d';
  g.fillText('Tiempo: ' + Math.max(0, Math.ceil(raceTimer)) + 's | Puntos: ' + raceScore, W / 2, 32);
  g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#fff2a0';
  g.fillText(raceActive ? 'Usa ◀ ▶ para cambiar de carril' : raceResult, W / 2, 140);
  g.textAlign = 'left';
}

// ---------- NUEVO MINIJUEGO 5: Memoria Pixel ----------
let cards = [], cardFlipped = [], cardMatched = [], memoryTimer = 0, memoryActive = false, memoryResult = '';
const CARD_SYMBOLS = ['⚔️', '🛡️', '🧪', '💎', '🔥', '👑'];

function startMemoryGame() {
  let deck = [...CARD_SYMBOLS, ...CARD_SYMBOLS].sort(() => Math.random() - .5);
  cards = deck; cardFlipped = []; cardMatched = []; memoryTimer = 0; memoryActive = true; memoryResult = 'Encuentra las parejas';
  state = 'mg_memory'; updateUI();
}
function flipCard(idx) {
  if (!memoryActive || cardFlipped.includes(idx) || cardMatched.includes(idx) || cardFlipped.length >= 2) return;
  cardFlipped.push(idx); playSFX('click');
  if (cardFlipped.length === 2) {
    const [a, b] = cardFlipped;
    if (cards[a] === cards[b]) {
      cardMatched.push(a, b);
      cardFlipped = [];
      playSFX('hit');
      if (cardMatched.length === cards.length) {
        memoryActive = false;
        const pts = Math.max(10, 50 - Math.floor(memoryTimer * 2));
        points += pts;
        memoryResult = '¡VICTORIA! +' + pts + ' Pts';
        playSFX('crit');
      }
    } else {
      setTimeout(() => { cardFlipped = []; updateUI(); }, 800);
    }
  }
  updateUI();
}
function drawMinigameMemory(dt) {
  if (memoryActive) memoryTimer += dt;
  B(10, 10, W - 20, 138, '#1e1728');
  g.textAlign = 'center'; g.font = "bold 10px 'Courier New',monospace"; g.fillStyle = '#ffd25e';
  g.fillText('🃏 MEMORIA PIXEL', W / 2, 22);

  const startX = 60, startY = 38, colW = 36, rowH = 32;
  cards.forEach((sym, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    const cx = startX + col * colW, cy = startY + row * rowH;
    const isUp = cardFlipped.includes(i) || cardMatched.includes(i);
    R(cx, cy, 30, 26, isUp ? '#4a3266' : '#8a5a1e');
    R(cx + 1, cy + 1, 28, 24, isUp ? '#2d1f42' : '#c9922e');
    if (isUp) {
      g.font = "12px sans-serif";
      g.fillText(sym, cx + 15, cy + 18);
    } else {
      g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#5a3a10';
      g.fillText('?', cx + 15, cy + 16);
    }
  });

  g.font = "bold 9px 'Courier New',monospace"; g.fillStyle = '#fff2a0';
  g.fillText(memoryResult, W / 2, 140);
  g.textAlign = 'left';

  // Dibujo en capa frontal
  chars[sel].draw(20, 166);
}

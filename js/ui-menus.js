// ============ UI-MENUS: Pantallas de menú, selección y diálogo ============
// tri (indicador de selección), drawSlot (tarjeta de personaje), wrapText,
// drawDialog (caja de texto inferior), drawTitle, drawConfirm, drawChosen
// y drawMainMenu. Usa core.js, sprites.js (vía chars[]) y data.js.

function tri(cx, y, c) {
  R(cx - 3, y, 7, 1, c);
  R(cx - 2, y + 1, 5, 1, c);
  R(cx - 1, y + 2, 3, 1, c);
  R(cx, y + 3, 1, 1, c);
}

function drawSlot(c, i) {
  const isSel = (i === sel && state === 'select');
  const cx = c.x + 13;
  const bob = Math.sin(t * 1.6 + i * 2) * 1.3;

  g.save();
  g.globalAlpha = isSel ? 0.9 : 0.32;
  ball(cx, FY + 4, isSel ? 22 : 15, c.glow);
  g.globalAlpha = 1;

  R(cx - 19, FY + 3, 38, 2, K);

  g.globalAlpha = (state === 'select') ? (isSel ? 1 : 0.5) : 1;
  if (c.draw.length === 3) {
    c.draw(c.x, FY + bob, t * 2.1 + i * 1.7);
  } else {
    c.draw(c.x, FY + bob);
  }
  g.restore();

  if (isSel) {
    const by = FY - 60 + Math.sin(t * 5) * 3;
    tri(cx, by, '#fff2a0');
  }
}

function wrapText(str, x, y, maxW, lh, font) {
  if (!str) return;
  g.font = font;
  g.fillStyle = '#2d1e30';
  g.textAlign = 'left';
  const words = str.split(' ');
  let line = '', ly = y;

  for (const w of words) {
    const test = line + w + ' ';
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, ly);
      line = w + ' ';
      ly += lh;
    } else {
      line = test;
    }
  }
  g.fillText(line, x, ly);
}

// ---------- Interfaz de Diálogo ----------
function drawDialog() {
  g.save();
  B(5, 169, W - 10, 52, '#f6ecd8');

  if (state === 'battle' || state === 'shop') {
    wrapText(msg, 11, 184, W - 22, 10, "8px 'Courier New',monospace");
    g.restore();
    return;
  }

  const c = chars[sel];
  if (!c) {
    g.restore();
    return;
  }

  if (state === 'select' || state === 'confirm' || state === 'chosen') {
    g.textAlign = 'left';
    g.font = "bold 9px 'Courier New',monospace";
    g.fillStyle = K;
    g.fillText(c.name, 11, 181);

    g.font = "7px 'Courier New',monospace";
    g.fillStyle = '#8a5a2a';
    g.fillText(c.sub, 11, 191);

    wrapText(c.desc, 11, 201, 170, 8, "7px 'Courier New',monospace");

    const st = [
      { label: 'ATK', val: c.stats.atk, col: '#c8402b' },
      { label: 'DEF', val: c.stats.def, col: '#4a6fa5' },
      { label: 'VID', val: c.stats.hp,  col: '#48a962' },
      { label: 'VEL', val: c.stats.vel, col: '#e0b040' }
    ];

    st.forEach((s, i) => {
      const sy = 173 + i * 11;
      g.font = "bold 7px 'Courier New',monospace";
      g.fillStyle = K;
      g.fillText(s.label, 188, sy + 6);

      R(208, sy, 98, 7, '#d9cebe');
      R(208, sy, 98, 1, K);
      R(208, sy + 6, 98, 1, K);
      R(208, sy, 1, 7, K);
      R(305, sy, 1, 7, K);

      const fillW = Math.round((s.val / 100) * 96);
      if (fillW > 0) R(209, sy + 1, fillW, 5, s.col);
    });
  } else {
    wrapText(msg, 11, 185, W - 22, 10, "8px 'Courier New',monospace");
  }
  g.restore();
}

function drawTitle() {
  g.save();
  g.textAlign = 'center';
  g.font = "bold 10px 'Courier New',monospace";
  g.fillStyle = '#fff2a0';
  g.fillText('ELIGE A TU COMPAÑERO', W / 2, 16);
  g.restore();
}

function drawConfirm() {
  g.save();
  g.globalAlpha = 0.6;
  R(0, 0, W, 168, '#000');
  g.globalAlpha = 1;

  const c = chars[sel];
  B(36, 58, W - 72, 44, '#f6ecd8');

  g.textAlign = 'center';
  g.fillStyle = K;
  g.font = "bold 8px 'Courier New',monospace";
  g.fillText('¿ELIGES A', W / 2, 76);

  g.font = "bold 9px 'Courier New',monospace";
  g.fillText(c.name + '?', W / 2, 90);
  g.restore();
}

function drawChosen(dt) {
  g.save();
  g.globalAlpha = 0.78;
  R(0, 0, W, 168, '#150a20');
  g.globalAlpha = 1;

  const c = chars[sel];
  const cx = 160;
  const cy = 118;

  // Renderizado aislado del personaje en la confirmación
  g.save();
  g.translate(cx, cy);
  g.scale(1.5, 1.5);
  if (c.draw.length === 3) {
    c.draw(-13, 0, t * 2.1);
  } else {
    c.draw(-13, 0);
  }
  g.restore();

  // Partículas
  if (Math.random() < 0.5) {
    sparkles.push({
      x: cx + (Math.random() - 0.5) * 80,
      y: 50 + Math.random() * 50,
      vy: -18 - Math.random() * 22,
      l: 1,
      col: Math.random() < 0.5 ? '#ffe066' : '#ff9fc0'
    });
  }

  sparkles.forEach(s => {
    s.y += s.vy * dt;
    s.l -= dt * 0.7;
    g.globalAlpha = Math.max(0, s.l);
    R(s.x, s.y, 2, 2, s.col);
  });
  
  sparkles = sparkles.filter(s => s.l > 0);

  g.globalAlpha = 1;
  g.textAlign = 'center';
  g.font = "bold 11px 'Courier New',monospace";
  g.fillStyle = (Math.sin(t * 6) > 0) ? '#fff2a0' : '#ffd25e';
  g.fillText('¡ADELANTE, ' + c.name + '!', W / 2, 24);
  
  g.restore();
}

// ---------- Menú Principal ----------
function drawMainMenu(dt) {
  g.save();
  chars.forEach((c, i) => {
    const bob = Math.sin(t * 1.6 + i * 2) * 2;
    if (c.draw.length === 3) {
      c.draw(c.x, FY + bob, t * 2 + i * 1.7);
    } else {
      c.draw(c.x, FY + bob);
    }
  });

  g.textAlign = 'center';
  g.font = "bold 20px 'Courier New',monospace";
  g.fillStyle = K;
  g.fillText('PEMCHOMCHO', W / 2 + 1, 45);

  g.fillStyle = (Math.sin(t * 4) > 0) ? '#ffe066' : '#ff9fc0';
  g.fillText('PEMCHOMCHO', W / 2, 44);

  g.font = "bold 7px 'Courier New',monospace";
  g.fillStyle = '#d8cce8';
  g.fillText('COMBATE TÁCTICO CON COMPAÑEROS', W / 2, 57);
  g.restore();

  drawDialog();
}

// ============ BIOMES: Fondos Animados y Efectos de Escenario ============

const biomeParticles = Array.from({length: 35}, () => ({
  x: Math.random() * W, y: Math.random() * H,
  s: 1 + Math.random() * 2, vx: (Math.random() - .5) * 15, vy: 10 + Math.random() * 20,
  ph: Math.random() * 10
}));

function drawBiomeBackground(biome, dt) {

  // 1. PRADERA
  if (biome === 'pradera') {
    const skyGradient = ['#120824', '#26113b', '#4d1e52', '#823861', '#bc5765', '#e88974', '#f7bd83'];
    skyGradient.forEach((c, i) => R(0, i * 20, W, 21, c));

    ball(160, 130, 36, '#ffe29d'); ball(160, 130, 28, '#ffffff');

    g.globalAlpha = 0.35;
    for (let i = 0; i < 5; i++) {
      const cx = mod(i * 85 + t * 6, W + 80) - 40, cy = 15 + i * 14;
      ball(cx, cy, 20, '#ffffff'); ball(cx + 14, cy - 5, 15, '#ffffff'); ball(cx - 14, cy + 3, 13, '#ffffff');
    }
    g.globalAlpha = 1.0;

    for (let x = 0; x < W; x += 2) {
      const h1 = 110 + Math.sin(x * 0.012 + 0.5) * 22;
      R(x, h1, 2, H - h1, '#2b1338');
      const h2 = 126 + Math.sin(x * 0.025 + 1.2) * 14;
      R(x, h2, 2, H - h2, '#1b2426');
    }

    R(0, 140, W, 86, '#19381e'); R(0, 140, W, 3, '#4f943c'); R(0, 143, W, 2, '#2d6322');

    for (let i = 0; i < 22; i++) {
      const gx = mod(i * 23 + i * 5, W);
      R(gx, 146 + (i % 5) * 6, 2, 3, '#336e28');
      if (i % 2 === 0) R(gx + 1, 145 + (i % 5) * 6, 2, 2, i % 4 === 0 ? '#ffe054' : '#ff5e97');
    }

    biomeParticles.forEach(p => {
      p.y -= dt * 10; if (p.y < 20) p.y = H;
      p.x += Math.sin(t * 2 + p.ph) * 0.5;
      g.globalAlpha = 0.2 + 0.7 * Math.abs(Math.sin(t * 3 + p.ph));
      ball(p.x, p.y, 1.5, '#ffee73');
    });
    g.globalAlpha = 1.0;
  }

  // 2. BOSQUE MÍSTICO (Miaudre)
  else if (biome === 'bosque_mistico') {
    const sky = ['#05020f', '#0d061f', '#180a33', '#270e4a', '#1e0a3d', '#0f0421'];
    sky.forEach((c, i) => R(0, i * 28, W, 29, c));

    g.globalAlpha = 0.2; ball(240, 42, 36, '#d1a3ff'); g.globalAlpha = 1.0;
    ball(240, 42, 22, '#f0d9ff'); ball(238, 40, 20, '#ffffff');

    for (let i = 0; i < 5; i++) {
      const tx = i * 70 - 15;
      R(tx + 18, 70, 12, 70, '#100721');
      ball(tx + 24, 60, 26, '#1c0c38'); ball(tx + 24, 55, 18, '#2a1154');
    }

    R(0, 140, W, 86, '#120821'); R(0, 140, W, 3, '#6e2fb8');

    g.globalAlpha = 0.25;
    for (let i = 0; i < 4; i++) {
      const fx = mod(t * 18 + i * 90, W + 100) - 50, fy = 132 + i * 11;
      ball(fx, fy, 28, '#b83bde'); ball(fx + 35, fy - 4, 22, '#e03bca');
    }
    g.globalAlpha = 1.0;
  }

  // 3. PANTANO TÓXICO (Croakzilla)
  else if (biome === 'pantano_toxico') {
    const sky = ['#030d06', '#081c0d', '#0f2e15', '#16451e', '#0c2e13', '#051408'];
    sky.forEach((c, i) => R(0, i * 28, W, 29, c));

    [25, 130, 265].forEach((hx, i) => {
      R(hx + 2, 85, 10, 55, '#122615');
      ball(hx + 7, 82, 22, i % 2 === 0 ? '#38f578' : '#ffe033');
      ball(hx + 7, 80, 16, '#ffffff');
    });

    R(0, 140, W, 86, '#081c0c'); R(0, 140, W, 3, '#25f56b');
    for (let i = 0; i < W; i += 6) {
      const h = Math.sin(i * 0.12 + t * 4) * 2.5;
      R(i, 140 + h, 6, 2, '#38f578');
    }

    biomeParticles.forEach(p => {
      p.y -= dt * 22; if (p.y < 125) p.y = H;
      p.x += Math.sin(t * 3 + p.ph) * 0.6;
      g.globalAlpha = 0.7;
      ball(p.x, p.y, 1 + Math.round(p.s * 1.2), '#38f578');
    });
    g.globalAlpha = 1.0;
  }

  // 4. CUMBRE TORMENTOSA (Cuervox)
  else if (biome === 'cumbre_tormentosa') {
    const sky = ['#05070f', '#0c1021', '#141a33', '#1e2747', '#0f1426', '#060812'];
    sky.forEach((c, i) => R(0, i * 28, W, 29, c));

    if (Math.random() < 0.035) {
      R(0, 0, W, H, 'rgba(200, 225, 255, 0.25)');
      const lx = 80 + Math.random() * 160;
      R(lx, 0, 3, 135, '#ffffff'); R(lx - 4, 40, 6, 3, '#ffffff');
    }

    for (let x = 0; x < W; x += 4) {
      const h = 105 + Math.abs(Math.sin(x * 0.022)) * 38;
      R(x, h, 4, H - h, '#101424');
    }

    R(0, 140, W, 86, '#151b2e'); R(0, 140, W, 3, '#576a94');

    biomeParticles.forEach(p => {
      p.y += dt * 260; p.x -= dt * 90;
      if (p.y > H) { p.y = 0; p.x = Math.random() * W + 60; }
      g.globalAlpha = 0.55;
      R(p.x, p.y, 1, 5, '#99c2ff');
    });
    g.globalAlpha = 1.0;
  }

  // 5. CRIPTA GÓTICA (Drácupollo)
  else if (biome === 'cripta_gotica') {
    R(0, 0, W, H, '#0f0614');

    for (let i = 0; i < 4; i++) {
      const ax = i * 82 + 10;
      R(ax, 18, 54, 115, '#1e0c29');
      ball(ax + 27, 42, 22, '#5e173b'); ball(ax + 27, 42, 16, '#e09800');
      R(ax + 26, 18, 2, 105, '#0f0614');
    }

    R(0, 140, W, 86, '#180a21'); R(0, 140, W, 3, '#8a2b43');
    for (let i = 0; i < W; i += 22) R(i, 140, 1, 86, '#0a030f');

    [35, 285].forEach(tx => {
      R(tx, 78, 4, 22, '#3b2214');
      const fs = 3 + Math.sin(t * 14) * 2;
      ball(tx + 2, 74, fs, '#ff4500'); ball(tx + 2, 72, fs * 0.6, '#ffee33');
    });

    biomeParticles.forEach(p => {
      p.y -= dt * 16; if (p.y < 20) p.y = 140;
      p.x += Math.sin(t * 4 + p.ph) * 0.6;
      g.globalAlpha = 0.75;
      R(p.x, p.y, 1.5, 1.5, '#ff385c');
    });
    g.globalAlpha = 1.0;
  }

  // 6. CLUB CYBERPUNK / SYNTHWAVE (Lobeats y Discoperro)
  else if (biome === 'club_cyberpunk') {
    const sky = ['#080112', '#140224', '#26033d', '#420666', '#690b9e', '#080112'];
    sky.forEach((c, i) => R(0, i * 28, W, 29, c));

    for (let i = 0; i < 22; i++) {
      const eh = 12 + Math.abs(Math.sin(t * 9 + i * 0.4)) * 42;
      R(i * 14 + 6, 122 - eh, 9, eh, i % 2 === 0 ? '#00e5ff' : '#ff0077');
    }

    R(0, 135, W, 91, '#080112'); R(0, 135, W, 2, '#00e5ff');
    for (let i = 0; i < W; i += 16) R(i, 135, 1, 91, '#ff0077');
    for (let y = 135; y < H; y += 7) R(0, y, W, 1, '#00e5ff');

    biomeParticles.forEach(p => {
      p.y -= dt * 18; if (p.y < 20) p.y = H;
      p.x += Math.cos(t * 3 + p.ph) * 0.8;
      g.globalAlpha = 0.85;
      R(p.x, p.y, 2, 2, p.ph > 5 ? '#00ffff' : '#ff00ea');
    });
    g.globalAlpha = 1.0;
  }

  // 7. TEMPLO DORADO / DOJO
  else if (biome === 'templo_dorado') {
    const sky = ['#120904', '#291406', '#452208', '#6b360b', '#964e0e', '#c46a16'];
    sky.forEach((c, i) => R(0, i * 28, W, 29, c));

    R(25, 48, 270, 9, '#2e0b05'); R(15, 57, 290, 4, '#170402');
    R(55, 22, 210, 9, '#2e0b05'); R(45, 31, 230, 4, '#170402');

    R(0, 140, W, 86, '#331908'); R(0, 140, W, 3, '#f0b830');
    for (let i = 0; i < W; i += 22) R(i, 140, 2, 86, '#1f0d03');

    [38, 282].forEach(lx => {
      R(lx, 58, 1, 22, '#f0b830');
      ball(lx, 82, 8, '#ff2a4b'); ball(lx, 82, 5, '#ffee44');
    });

    biomeParticles.forEach(p => {
      p.y += dt * 26; p.x += Math.sin(t * 2 + p.ph) * 14 * dt;
      if (p.y > H) { p.y = 0; p.x = Math.random() * W; }
      g.globalAlpha = 0.85;
      R(p.x, p.y, 2, 2, '#ffb3cc');
    });
    g.globalAlpha = 1.0;
  }
}

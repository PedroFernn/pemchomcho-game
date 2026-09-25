// ============ CORE: Canvas, contexto y primitivas de dibujo ============
// Base que usan TODOS los demás módulos: cvs/g (canvas y contexto 2D),
// W/H (resolución interna 320x226), FY (línea de piso), K (color de tinta),
// mod() (módulo positivo) y los primitivos pixel-art R (rectángulo),
// B (rectángulo con borde) y ball (círculo). También declara "t" (reloj
// del juego, actualizado cada frame en main.js).
// Sin dependencias — debe cargarse PRIMERO.

const cvs = document.getElementById('c'),
      g = cvs.getContext('2d'),
      W = 320,
      H = 226,
      FY = 166,
      K = '#2d1e30';

const mod = (a, n) => ((a % n) + n) % n;

// Reloj global con respaldo por si main.js aún no lo sincronizó
if (typeof window.t === 'undefined') window.t = 0;

// Restablece el escalado y la opacidad en cada iteración del bucle principal
const resetCtx = () => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.scale(2, 2);
  g.globalAlpha = 1.0;
};

// Configuración inicial de escala
resetCtx();

// Primitivas de dibujo blindadas contra valores NaN o undefined
const R = (x, y, w, h, c) => {
  const nx = Number(x) || 0,
        ny = Number(y) || 0,
        nw = Number(w) || 0,
        nh = Number(h) || 0;
  const x0 = Math.round(nx), y0 = Math.round(ny);
  g.fillStyle = c || K;
  g.fillRect(x0, y0, Math.round(nx + nw) - x0, Math.round(ny + nh) - y0);
};

const B = (x, y, w, h, c) => {
  R(x - 1, y - 1, w + 2, h + 2, K);
  R(x, y, w, h, c);
};

const ball = (x, y, r, c) => {
  const rad = Math.max(0, Math.round(r) || 0);
  for (let d = -rad; d <= rad; d++) {
    const w = Math.round(Math.sqrt(Math.max(0, rad * rad - d * d)));
    R(x - w, y + d, w * 2, 1, c);
  }
};

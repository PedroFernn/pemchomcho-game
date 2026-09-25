# PEMCHOMCHO — Combate Táctico

Juego original en un solo archivo, ahora dividido en módulos para que sea
más fácil de editar. Para jugar, solo abre `index.html` en tu navegador
(o súbelo a un hosting estático) — no necesita build ni servidor especial.

## Estructura

```
index.html          Marcado HTML: canvas, botones, y el orden de carga de los scripts
css/
  style.css         Todos los estilos (colores, layout, botones)
js/
  core.js           Canvas, contexto y primitivas de dibujo (R, B, ball)  — SIN dependencias
  audio.js          Música y efectos de sonido 8-bits (Web Audio API)
  fx.js             Partículas, destellos y animación de golpes de combate
  sprites.js        Arte pixel de los 3 compañeros y los 6 enemigos
  data.js           Stats, movimientos y economía (chars[], enemies[], puntos)
  biomes.js         Los 7 fondos animados (pradera, templo, pantano, etc.)
  ui-menus.js       Pantallas de menú, selección de personaje y diálogo
  minigames.js      Golpe Certero, Billar de Huntleo y Trileros de Tammybb
  battle.js         Lógica de turnos, tienda y escena de combate
  main.js           Bucle principal y arranque — SIEMPRE se carga al final
```

## Cómo editar algo común

- **Cambiar un texto de ayuda o botón** → `js/main.js` (objeto `HINTS`, función `updateUI`)
- **Balancear daño/HP/movimientos de un personaje** → `js/data.js`
- **Añadir o ajustar un minijuego** → `js/minigames.js`
- **Cambiar el diseño pixel de un personaje** → `js/sprites.js`
- **Ajustar la música o añadir una pista nueva** → `js/audio.js`
- **Retocar colores o layout de botones** → `css/style.css`

## Por qué está así (y no como módulos ES6)

Los archivos se cargan como scripts clásicos (`<script src="...">`, sin
`type="module"`), así que **todos comparten el mismo ámbito global**: una
variable o función definida en `core.js` está disponible en `main.js` sin
necesidad de `import`/`export`. Esto mantiene el código idéntico al
original (mismas variables, mismas funciones) y evita tener que reescribir
todo el juego. La única regla importante es el **orden de carga** en
`index.html` — `main.js` siempre va al final porque es quien arranca el
juego y depende de que todo lo demás ya esté definido.

Nota: por esta razón (múltiples archivos), esta versión ya no se puede
publicar como una sola página de Artifact autocontenida — se usa
abriéndola localmente o subiéndola a cualquier hosting estático
(GitHub Pages, Netlify, etc.) manteniendo la misma estructura de carpetas.

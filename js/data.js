// ============ DATA: Progresión, personajes y enemigos ============
// points/pBonusAtk/pStartShield (economía de la tienda), chars[] (los 3
// compañeros jugables con sus stats y movimientos) y enemies[] (los 6
// rivales con su bioma, stats y movimientos). Las funciones draw: hacen
// referencia a sprites.js. Para balancear el juego o añadir un personaje
// nuevo, este es el archivo a editar.

// ---------- Sistema de Economía y Tienda ----------
let points = 0;
let pBonusAtk = 1.0;
let pStartShield = 0;

// ---------- DATOS DE PERSONAJES ----------
const chars=[
  {
    name:'LORD NEKITO',
    sub:'Alta defensa y resistencia',
    desc:'tiene mas Alcohol que sangre, nadie sabe como ni quiere saberlo.',
    x:50,glow:'#8fb4ff',
    stats:{atk:80,def:85,hp:80,maxMp:50,vel:60},
    moves:[
      {name:'Golpe Borracho',pow:1.0,acc:95,cost:0,kind:'ATK',icon:'⚔️',col:'#78b0ff',desc:'Ataque físico directo.'},
      {name:'Escudo Virgen',pow:0,acc:100,cost:15,kind:'BLOCK',icon:'🛡️',col:'#9370db',desc:'Absorbe daño y otorga +35 Escudo.'},
      {name:'caguamero (Parry)',pow:0.8,acc:100,cost:20,kind:'PARRY',icon:'⚔️',col:'#ffd25e',desc:'Niega todo daño y contraataca.'},
      {name:'Cargar Alcohol',pow:0,acc:100,cost:-30,kind:'RECHARGE',icon:'⚡',col:'#48a962',desc:'Genera +30 MP para ataques.'}
    ],
    draw:(x,fy,p)=>knight(x,fy,p)
  },
  {
    name:'TAMMYBB',
    sub:'Guardiana del peso infinito',
    desc:'Nunca aceptes el peso que te ofrece o una maldicion te seguira',
    x:146,glow:'#ff9fc0',
    stats:{atk:95,def:35,hp:45,maxMp:60,vel:90},
    moves:[
      {name:'Robo Rápido',pow:1.0,acc:95,cost:0,kind:'ATK',icon:'🪙',col:'#ffd25e',desc:'Ataque veloz e imprevisto.'},
      {name:'Cobertura Agil',pow:0,acc:100,cost:15,kind:'COVER',icon:'💨',col:'#3070b0',desc:'Reduce precisión enemiga 40%.'},
      {name:'Moneda Maldita',pow:1.2,acc:85,cost:25,kind:'DEBUFF',icon:'🔮',col:'#d060f0',desc:'Aturde al enemigo por 1 turno.'},
      {name:'Cargar Tamales',pow:0,acc:100,cost:-30,kind:'RECHARGE',icon:'⚡',col:'#48a962',desc:'Recupera +30 MP inmediatamente.'}
    ],
    draw:(x,fy,p)=>girl(x,fy,p)
  },
  {
    name:'HUNTLEO',
    sub:'Perro en taza tonoto',
    desc:'Potente tanque, si te pide dinero daselo',
    x:244,glow:'#ffd25e',
    stats:{atk:65,def:90,hp:100,maxMp:40,vel:30},
    moves:[
      {name:'Reaccion',pow:1.0,acc:95,cost:0,kind:'ATK',icon:'🦴',col:'#ff7878',desc:'Ataque básico de mandíbula.'},
      {name:'Ojo Biónico',pow:1.5,acc:85,cost:25,kind:'ATK',icon:'👁️',col:'#ff4040',desc:'Disparo láser de alta potencia.'},
      {name:'Aullido Hambre',pow:0,acc:100,cost:20,kind:'BUFF',icon:'🔥',col:'#e0b040',desc:'Siguiente ataque: +50% daño y Crítico.'},
      {name:'Cargar Enchiladas',pow:0,acc:100,cost:-30,kind:'RECHARGE',icon:'⚡',col:'#48a962',desc:'Genera +30 MP para técnicas.'}
    ],
    draw:(x,fy)=>dog(x,fy)
  }
];

const enemies=[
  {
    name:'MIAUDRE',biome:'bosque_mistico',stats:{atk:60,def:50,hp:65,maxMp:30,vel:65},
    moves:[
      {name:'Zarpazo',pow:1.0,acc:95,cost:0,kind:'ATK'},
      {name:'Bola de Pelo',pow:1.3,acc:80,cost:15,kind:'ATK'}
    ],
    draw:cat
  },
  {
    name:'CROAKZILLA',biome:'pantano_toxico',stats:{atk:72,def:40,hp:75,maxMp:40,vel:48},
    moves:[
      {name:'Lengüetazo',pow:1.0,acc:95,cost:0,kind:'ATK'},
      {name:'Salto Aplastante',pow:1.4,acc:75,cost:20,kind:'ATK'}
    ],
    draw:frog
  },
  {
    name:'CUERVOX',biome:'cumbre_tormentosa',stats:{atk:85,def:58,hp:90,maxMp:50,vel:78},
    moves:[
      {name:'Picotazo',pow:1.0,acc:95,cost:0,kind:'ATK'},
      {name:'Clavado en Picada',pow:1.45,acc:80,cost:25,kind:'ATK'}
    ],
    draw:crow
  },
  {
    name:'VAMPI POLLO',biome:'cripta_gotica',stats:{atk:78,def:42,hp:95,maxMp:40,vel:72},
    moves:[
      {name:'Picotazo Nocturno',pow:1.0,acc:95,cost:0,kind:'ATK'},
      {name:'Mirada Hipnótica',pow:0,acc:85,cost:25,kind:'DEBUFF'}
    ],
    draw:vampChicken
  },
  {
    name:'LOBEATS',biome:'club_cyberpunk',stats:{atk:88,def:55,hp:105,maxMp:45,vel:80},
    moves:[
      {name:'Zarpazo al Ritmo',pow:1.0,acc:95,cost:0,kind:'ATK'},
      {name:'Subidón de Bajos',pow:0,acc:100,cost:20,kind:'BUFF'}
    ],
    draw:wolfDJ
  },
  {
    name:'DISCOPERRO',biome:'club_cyberpunk',stats:{atk:82,def:60,hp:115,maxMp:35,vel:55},
    moves:[
      {name:'Mordisco Funky',pow:1.05,acc:95,cost:0,kind:'ATK'},
      {name:'Giro Discotequero',pow:0,acc:100,cost:15,kind:'BLOCK'}
    ],
    draw:afroDog
  }
];

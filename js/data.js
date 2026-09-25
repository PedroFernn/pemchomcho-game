// ============ DATA: Progresión, personajes y enemigos ============
// points/pBonusAtk/pStartShield (economía de la tienda), chars[] (los 3
// compañeros jugables con sus stats y movimientos) y enemies[] (los 6
// rivales con su bioma, stats y movimientos). Las funciones draw: hacen
// referencia a sprites.js. Cada move puede llevar "anim" (string o null):
// identifica qué animación personalizada usar en fx.js (ver ANIM_CONFIG
// en fx.js); si es null/undefined, fx.js cae al render genérico por "kind".
// Para balancear el juego o añadir un personaje nuevo, este es el archivo
// a editar.

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
    weakness:'electrico',
    resistance:'fuego',
    stats:{atk:80,def:85,hp:80,maxMp:50,vel:60},
    moves:[
      {name:'Golpe Borracho',pow:1.0,acc:95,cost:0,kind:'ATK',element:'fisico',icon:'⚔️',col:'#78b0ff',desc:'Ataque físico directo.',anim:'beer_bottle'},
      {name:'Escudo Virgen',pow:0,acc:100,cost:15,kind:'BLOCK',element:'neutral',icon:'🛡️',col:'#9370db',desc:'Absorbe daño y otorga +35 Escudo.',anim:null},
      {name:'caguamero (Parry)',pow:0.8,acc:100,cost:20,kind:'PARRY',element:'agua',icon:'⚔️',col:'#ffd25e',desc:'Niega todo daño y contraataca con agua.',anim:null},
      {name:'Cargar Alcohol',pow:0,acc:100,cost:-30,kind:'RECHARGE',element:'neutral',icon:'⚡',col:'#48a962',desc:'Genera +30 MP para ataques.',anim:'beer_drink'}
    ],
    draw:(x,fy,p)=>knight(x,fy,p)
  },
  {
    name:'TAMMYBB',
    sub:'Guardiana del peso infinito',
    desc:'Nunca aceptes el peso que te ofrece o una maldicion te seguira',
    x:146,glow:'#ff9fc0',
    weakness:'fuego',
    resistance:'oscuridad',
    stats:{atk:95,def:35,hp:45,maxMp:60,vel:90},
    moves:[
      {name:'Robo Rápido',pow:1.0,acc:95,cost:0,kind:'ATK',element:'oscuridad',icon:'🪙',col:'#ffd25e',desc:'Ataque veloz e imprevisto de oscuridad.',anim:'coin_dark'},
      {name:'Cobertura Agil',pow:0,acc:100,cost:15,kind:'COVER',element:'neutral',icon:'💨',col:'#3070b0',desc:'Reduce precisión enemiga 40%.',anim:null},
      {name:'Moneda Maldita',pow:1.2,acc:85,cost:25,kind:'DEBUFF',element:'oscuridad',icon:'🔮',col:'#d060f0',desc:'Aturde al enemigo por 1 turno.',anim:'coin_dark'},
      {name:'Cargar Tamales',pow:0,acc:100,cost:-30,kind:'RECHARGE',element:'neutral',icon:'⚡',col:'#48a962',desc:'Recupera +30 MP inmediatamente.',anim:'food_eat'}
    ],
    draw:(x,fy,p)=>girl(x,fy,p)
  },
  {
    name:'HUNTLEO',
    sub:'Perro en taza tonoto',
    desc:'Potente tanque, si te pide dinero daselo',
    x:244,glow:'#ffd25e',
    weakness:'agua',
    resistance:'planta',
    stats:{atk:65,def:90,hp:100,maxMp:40,vel:30},
    moves:[
      {name:'Reaccion',pow:1.0,acc:95,cost:0,kind:'ATK',element:'fisico',icon:'🦴',col:'#ff7878',desc:'Ataque básico de mandíbula.',anim:'bone_throw'},
      {name:'Ojo Biónico',pow:1.5,acc:85,cost:25,kind:'ATK',element:'fuego',icon:'👁️',col:'#ff4040',desc:'Disparo láser térmico de alta potencia.',anim:'laser_beam'},
      {name:'Aullido Hambre',pow:0,acc:100,cost:20,kind:'BUFF',element:'neutral',icon:'🔥',col:'#e0b040',desc:'Siguiente ataque: +50% daño y Crítico.',anim:null},
      {name:'Cargar Enchiladas',pow:0,acc:100,cost:-30,kind:'RECHARGE',element:'neutral',icon:'⚡',col:'#48a962',desc:'Genera +30 MP para técnicas.',anim:'food_eat'}
    ],
    draw:(x,fy)=>dog(x,fy)
  }
];

const enemies=[
  {
    name:'MIAUDRE',biome:'bosque_mistico',
    weakness:'fuego',resistance:'agua',
    stats:{atk:60,def:50,hp:65,maxMp:30,vel:65},
    moves:[
      {name:'Zarpazo',pow:1.0,acc:95,cost:0,kind:'ATK',element:'fisico',anim:'claw_slash'},
      {name:'Bola de Pelo',pow:1.3,acc:80,cost:15,kind:'ATK',element:'planta',anim:'hairball'}
    ],
    draw:cat
  },
  {
    name:'CROAKZILLA',biome:'pantano_toxico',
    weakness:'electrico',resistance:'agua',
    stats:{atk:72,def:40,hp:75,maxMp:40,vel:48},
    moves:[
      {name:'Lengüetazo',pow:1.0,acc:95,cost:0,kind:'ATK',element:'agua',anim:'dirty_water'},
      {name:'Salto Aplastante',pow:1.4,acc:75,cost:20,kind:'ATK',element:'fisico',anim:'body_slam'}
    ],
    draw:frog
  },
  {
    name:'CUERVOX',biome:'cumbre_tormentosa',
    weakness:'fuego',resistance:'planta',
    stats:{atk:85,def:58,hp:90,maxMp:50,vel:78},
    moves:[
      {name:'Picotazo',pow:1.0,acc:95,cost:0,kind:'ATK',element:'fisico',anim:'feather_slash'},
      {name:'Clavado en Picada',pow:1.45,acc:80,cost:25,kind:'ATK',element:'electrico',anim:'lightning_bolt'}
    ],
    draw:crow
  },
  {
    name:'VAMPI POLLO',biome:'cripta_gotica',
    weakness:'fuego',resistance:'oscuridad',
    stats:{atk:78,def:42,hp:95,maxMp:40,vel:72},
    moves:[
      {name:'Picotazo Nocturno',pow:1.0,acc:95,cost:0,kind:'ATK',element:'oscuridad',anim:'dark_bite'},
      {name:'Mirada Hipnótica',pow:0,acc:85,cost:25,kind:'DEBUFF',element:'oscuridad',anim:null}
    ],
    draw:vampChicken
  },
  {
    name:'LOBEATS',biome:'club_cyberpunk',
    weakness:'agua',resistance:'electrico',
    stats:{atk:88,def:55,hp:105,maxMp:45,vel:80},
    moves:[
      {name:'Zarpazo al Ritmo',pow:1.0,acc:95,cost:0,kind:'ATK',element:'electrico',anim:'sonic_wave'},
      {name:'Subidón de Bajos',pow:0,acc:100,cost:20,kind:'BUFF',element:'neutral',anim:null}
    ],
    draw:wolfDJ
  },
  {
    name:'DISCOPERRO',biome:'club_cyberpunk',
    weakness:'oscuridad',resistance:'fuego',
    stats:{atk:82,def:60,hp:115,maxMp:35,vel:55},
    moves:[
      {name:'Mordisco Funky',pow:1.05,acc:95,cost:0,kind:'ATK',element:'fuego',anim:'fire_bite'},
      {name:'Giro Discotequero',pow:0,acc:100,cost:15,kind:'BLOCK',element:'neutral',anim:null}
    ],
    draw:afroDog
  }
];

// ============ BATTLE: Lógica de combate corregida y con afinidad elemental ============
// Nota: playMoveFX() recibe mv.anim / em.anim (definido en data.js) como
// último argumento, para que fx.js sepa qué animación personalizada
// dibujar (ver ANIM_CONFIG en fx.js).

let sel=0,state='main',sparkles=[];
let enemyIdx=0;
let playerHP=0,playerMP=0,dispPHP=0,dispPMP=0;
let enemyHP=0,enemyMP=0,dispEHP=0,dispEMP=0;
let playerHit=0,enemyHit=0,resolving=false,msg='';

let partyState = [];

let pStatus={shield:0,parry:false,cover:0,buffAtk:1.0,buffCrit:false,stunned:false};
let eStatus={shield:0,parry:false,cover:0,buffAtk:1.0,buffCrit:false,stunned:false};

// Estado de animación de sprite (idle/hit/victory/defeat) por bando, con
// temporizador para volver a 'idle' tras el parpadeo de golpe recibido.
let pAnimState='idle', eAnimState='idle';
let pAnimTimer=0, eAnimTimer=0;
let resultBurstDone=false;

function resetPartyState(){
  partyState = chars.map(c => ({ hp: c.stats.hp, mp: c.stats.maxMp }));
}

function syncPartyState(){
  if(partyState[sel]){
    partyState[sel].hp = playerHP;
    partyState[sel].mp = playerMP;
  }
}

function drawShopScene(){
  const p=chars[sel];
  p.draw(50,166);
  
  B(10,20,W-20,135,'#28173d');
  g.textAlign='center';g.font="bold 11px 'Courier New',monospace";g.fillStyle='#ffd25e';
  g.fillText('🏪 TIENDA DE BONUS TÁCTICOS',W/2,38);
  
  g.font="bold 9px 'Courier New',monospace";g.fillStyle='#5cff9d';
  g.fillText('PUNTOS ACUMULADOS: '+points+' PTS',W/2,52);

  g.font="8px 'Courier New',monospace";g.fillStyle='#d8cce8';
  g.fillText('HP actual: '+playerHP+' / '+p.stats.hp+' HP | MP actual: '+playerMP+' / '+p.stats.maxMp+' MP',W/2,68);
  g.fillText('Bono ATK Permanente: +'+Math.round((pBonusAtk-1)*100)+'% | Escudo Inicial: '+pStartShield,W/2,80);

  g.textAlign='left';
  drawDialog();
}

function hpBar(x,y,w,cur,max,curMp,maxMp,shield,label){
  g.font="7px 'Courier New',monospace";g.fillStyle=K;g.textAlign='left';
  g.fillText(label+(shield>0?` [🛡️${shield}]`:''),x,y-3);
  
  R(x-1,y-1,w+2,7,K);R(x,y,w,5,'#d9cebe');
  const ratio=Math.max(0,cur)/max,fw=Math.round(w*ratio);
  const col=ratio>.5?'#48a962':ratio>.2?'#e0b040':'#c8402b';
  if(fw>0)R(x,y,fw,5,col);
  
  R(x-1,y+7,w+2,4,K);R(x,y+8,w,2,'#203050');
  const mpRatio=Math.max(0,curMp)/maxMp,mfw=Math.round(w*mpRatio);
  if(mfw>0)R(x,y+8,mfw,2,'#30a0ff');
}

function bannerText(txt){
  g.globalAlpha=.65;R(0,60,W,26,'#000');g.globalAlpha=1;
  g.textAlign='center';g.font="bold 9px 'Courier New',monospace";g.fillStyle='#ffd25e';
  g.fillText(txt,W/2,77);g.textAlign='left';
}

function drawBattleScene(dt){
  dispPHP+=(playerHP-dispPHP)*Math.min(1,dt*6);
  dispEHP+=(enemyHP-dispEHP)*Math.min(1,dt*6);
  dispPMP+=(playerMP-dispPMP)*Math.min(1,dt*6);
  dispEMP+=(enemyMP-dispEMP)*Math.min(1,dt*6);

  if(playerHit>0)playerHit=Math.max(0,playerHit-dt*60);
  if(enemyHit>0)enemyHit=Math.max(0,enemyHit-dt*60);
  
  const p=chars[sel],e=enemies[enemyIdx];
  const pShake=playerHit>0?Math.round((Math.random()-.5)*6):0;
  const eShake=enemyHit>0?Math.round((Math.random()-.5)*6):0;

  // Temporizador del parpadeo de golpe ('hit'): vuelve a 'idle' al terminar
  if(pAnimTimer>0){ pAnimTimer=Math.max(0,pAnimTimer-dt); if(pAnimTimer<=0) pAnimState='idle'; }
  if(eAnimTimer>0){ eAnimTimer=Math.max(0,eAnimTimer-dt); if(eAnimTimer<=0) eAnimState='idle'; }

  // Resultado del combate: fuerza pose de victoria/derrota en cada bando
  if(state==='victory' || state==='champion'){
    pAnimState='victory'; eAnimState='defeat';
    if(!resultBurstDone){resultBurstDone=true;burstAt(65,140,'#ffd25e',14,50);}
  } else if(state==='defeat'){
    pAnimState='defeat'; eAnimState='victory';
    if(!resultBurstDone){resultBurstDone=true;burstAt(213,80,'#5b4a78',14,50);}
  } else if(state==='battle_switch'){
    pAnimState='defeat';
  }

  e.draw(200+eShake,104,eAnimState);
  p.draw(50+pShake,166,pAnimState);

  if(pStatus.parry) { ball(63,140,16,'#ffd25e33'); }
  if(pStatus.shield>0) { ball(63,140,18,'#5b4a7844'); }
  if(eStatus.shield>0) { ball(213,80,18,'#5b4a7844'); }

  B(6,12,112,28,'#f6ecd8');
  hpBar(13,22,96,dispEHP,e.stats.hp,dispEMP,e.stats.maxMp,eStatus.shield,e.name+' '+(enemyIdx+1)+'/'+enemies.length);
  
  B(198,120,118,28,'#f6ecd8');
  hpBar(205,130,102,dispPHP,p.stats.hp,dispPMP,p.stats.maxMp,pStatus.shield,p.name);
  
  drawDialog();

  if(state==='victory')bannerText('¡Ganaste el combate!');
  else if(state==='defeat')bannerText('Tu equipo fue derrotado...');
  else if(state==='champion')bannerText('¡'+p.name+' es campeón!');
}

function resetCombatStates(){
  pStatus={shield:pStartShield,parry:false,cover:0,buffAtk:1.0,buffCrit:false,stunned:false};
  eStatus={shield:0,parry:false,cover:0,buffAtk:1.0,buffCrit:false,stunned:false};
  pAnimState='idle'; eAnimState='idle';
  pAnimTimer=0; eAnimTimer=0;
  resultBurstDone=false;
}

function startBattle(){
  enemyIdx=0;
  resetPartyState();
  playerHP=partyState[sel].hp; playerMP=partyState[sel].mp;
  enemyHP=enemies[0].stats.hp; enemyMP=enemies[0].stats.maxMp;
  dispPHP=playerHP; dispEHP=enemyHP; dispPMP=playerMP; dispEMP=enemyMP;
  resetCombatStates();
  msg='¡Un '+enemies[0].name+' salvaje apareció!';
  state='battle'; updateUI();
}

function nextFight(){
  enemyIdx++;
  partyState.forEach((st, i) => {
    st.hp = Math.min(chars[i].stats.hp, st.hp + Math.round(chars[i].stats.hp * 0.35));
    st.mp = chars[i].stats.maxMp;
  });
  playerHP = partyState[sel].hp;
  playerMP = partyState[sel].mp;
  enemyHP = enemies[enemyIdx].stats.hp; enemyMP = enemies[enemyIdx].stats.maxMp;
  dispEHP = enemyHP; dispEMP = enemyMP;
  resetCombatStates();
  msg = '¡Un ' + enemies[enemyIdx].name + ' salvaje apareció!';
  state = 'battle'; updateUI();
}

function retryFight(){
  resetPartyState();
  playerHP = partyState[sel].hp; playerMP = partyState[sel].mp;
  enemyHP = enemies[enemyIdx].stats.hp; enemyMP = enemies[enemyIdx].stats.maxMp;
  dispPHP = playerHP; dispEHP = enemyHP; dispPMP = playerMP; dispEMP = enemyMP;
  resetCombatStates();
  msg = chars[sel].name + ' reintenta el combate.';
  state = 'battle'; updateUI();
}

function restartAll(){
  sel=0;enemyIdx=0;points=0;pBonusAtk=1.0;pStartShield=0;
  sparkles=[];activeFX=[];particles=[];floatingTexts=[];
  mgActive=false;mgAttempts=0;mgResult='';
  state='main';updateUI();
}

function switchPartner(targetIdx){
  if(resolving || targetIdx === sel || partyState[targetIdx].hp <= 0) return;
  
  syncPartyState();
  sel = targetIdx;
  playerHP = partyState[sel].hp;
  playerMP = partyState[sel].mp;
  
  pStatus = {shield: pStartShield, parry: false, cover: 0, buffAtk: 1.0, buffCrit: false, stunned: false};
  pAnimState = 'idle'; pAnimTimer = 0;

  msg = `¡Entra ${chars[sel].name}!`;
  spawnFloatText(65, 140, '¡CAMBIO!', '#30a0ff', 1.2);
  playSFX('magic');

  resolving = true;
  state = 'battle';
  updateUI();

  const e = enemies[enemyIdx];
  const validEMoves = e.moves.filter(m => m.cost <= enemyMP);
  const em = validEMoves.length > 0 ? validEMoves[Math.floor(Math.random() * validEMoves.length)] : e.moves[0];
  enemyMP = Math.min(e.stats.maxMp, Math.max(0, enemyMP - em.cost));

  setTimeout(() => {
    if(eStatus.stunned){
      eStatus.stunned = false;
      msg += ` ${e.name} está aturdido y no atacó.`;
      resolving = false;
      updateUI();
      return;
    }
    playMoveFX(em.name, em.kind, false, () => {
      if(em.kind === 'ATK'){
        applyDamage(false, em, e, chars[sel]);
      } else if(em.kind === 'BUFF'){
        eStatus.buffAtk = 1.5; eStatus.buffCrit = true;
        msg = `${e.name} prepara un ataque cargado.`;
      } else if(em.kind === 'BLOCK'){
        eStatus.shield += 35;
        msg = `${e.name} levantó un escudo (+35).`;
      }
      
      syncPartyState();

      if(playerHP <= 0){
        const alive = partyState.some(p => p.hp > 0);
        if(!alive){
          msg = `¡Todo tu equipo fue derrotado! Puntos: ${points}`;
          state = 'defeat';
        } else {
          msg = `${chars[sel].name} cayó. ¡Cambia de compañero!`;
          state = 'battle_switch';
        }
      } else {
        playerMP = Math.min(chars[sel].stats.maxMp, playerMP + 10);
        syncPartyState();
      }
      
      resolving = false;
      updateUI();
    }, em.col, em.anim);
  }, 600);
}

function applyDamage(isPlayerAttacking, mv, atkr, defr){
  const attackerStatus = isPlayerAttacking ? pStatus : eStatus;
  const defenderStatus = isPlayerAttacking ? eStatus : pStatus;
  const targetPos = isPlayerAttacking ? {x:213,y:80} : {x:65,y:140};

  if(defenderStatus.parry){
    defenderStatus.parry=false;
    spawnFloatText(targetPos.x,targetPos.y-10,'¡PARRY!','#ffd25e',1.2);
    playSFX('block');
    msg=(isPlayerAttacking?defr.name:atkr.name)+' paró el ataque y contraataca!';
    const counterDmg=Math.round(atkr.stats.atk*0.4);
    if(isPlayerAttacking){playerHP=Math.max(0,playerHP-counterDmg);}
    else{playerHP=Math.max(0,playerHP-counterDmg);}
    syncPartyState();
    return;
  }

  const totalAcc = mv.acc - defenderStatus.cover;
  defenderStatus.cover=0;
  if(Math.random()*100 >= totalAcc){
    spawnFloatText(targetPos.x,targetPos.y-10,'¡FALLÓ!','#b0b0b0');
    msg=atkr.name+' usó '+mv.name+'... ¡pero falló!';
    return;
  }

  // --- MODIFICADOR DE AFINIDAD ELEMENTAL ---
  let elementalMultiplier = 1.0;
  if (mv.element && defr.weakness === mv.element) {
    elementalMultiplier = 1.5;
  } else if (mv.element && defr.resistance === mv.element) {
    elementalMultiplier = 0.5;
  }

  let rawDmg = ((atkr.stats.atk * mv.pow) - (defr.stats.def * 0.25)) * elementalMultiplier;
  if(isPlayerAttacking) rawDmg *= pBonusAtk;
  rawDmg *= attackerStatus.buffAtk;
  attackerStatus.buffAtk = 1.0;

  let isCrit = Math.random() < 0.12 || attackerStatus.buffCrit;
  attackerStatus.buffCrit = false;
  if(isCrit) rawDmg *= 1.5;

  let finalDmg = Math.max(3, Math.round(rawDmg + (Math.random()*4-2)));

  if(defenderStatus.shield > 0){
    if(defenderStatus.shield >= finalDmg){
      defenderStatus.shield -= finalDmg;
      spawnFloatText(targetPos.x,targetPos.y-12,`🛡️ BLOQUEADO (-${finalDmg})`,'#a0a0ff',0.9);
      finalDmg = 0;
    } else {
      finalDmg -= defenderStatus.shield;
      spawnFloatText(targetPos.x,targetPos.y-12,`🛡️ ROTO (-${defenderStatus.shield})`,'#a0a0ff',0.9);
      defenderStatus.shield = 0;
    }
  }

  if(finalDmg > 0){
    if(isPlayerAttacking){ enemyHP=Math.max(0,enemyHP-finalDmg); enemyHit=14; eAnimState='hit'; eAnimTimer=0.35; }
    else { playerHP=Math.max(0,playerHP-finalDmg); playerHit=14; pAnimState='hit'; pAnimTimer=0.35; }

    syncPartyState();

    screenShake = isCrit ? 8 : 4;
    if(isCrit) { triggerFlash('#fff2a0'); playSFX('crit'); }
    else { playSFX('hit'); }

    if (elementalMultiplier > 1.0) {
      spawnFloatText(targetPos.x, targetPos.y - 24, '¡SUPER EFECTIVO!', '#ffd25e', 1.1);
    } else if (elementalMultiplier < 1.0) {
      spawnFloatText(targetPos.x, targetPos.y - 24, 'POCO EFECTIVO', '#808080', 1.0);
    }

    spawnFloatText(targetPos.x,targetPos.y-12,isCrit?`¡CRÍTICO! -${finalDmg}`:`-${finalDmg}`,isCrit?'#ffd25e':'#ff4d4d',isCrit?1.25:1);
    msg = atkr.name + ' usó ' + mv.name + '! ' + 
          (elementalMultiplier > 1.0 ? '¡Super efectivo! ' : '') + 
          (elementalMultiplier < 1.0 ? 'Poco efectivo. ' : '') + 
          (isCrit ? '¡Golpe Crítico! ' : '') + '-' + finalDmg + ' HP';
  }
}

function startTurn(moveIdx){
  if(resolving)return;
  
  const p=chars[sel], e=enemies[enemyIdx];
  const pm=p.moves[moveIdx];

  if(pm.cost > 0 && playerMP < pm.cost){
    msg='¡No tienes suficiente Energía (MP)!';
    updateUI();return;
  }

  resolving=true;
  
  playerMP = Math.min(p.stats.maxMp, Math.max(0, playerMP - pm.cost + 8));
  enemyMP = Math.min(e.stats.maxMp, enemyMP + 5);
  syncPartyState();
  
  const validEMoves = e.moves.filter(m=>m.cost<=enemyMP);
  const em = validEMoves.length > 0 ? validEMoves[Math.floor(Math.random()*validEMoves.length)] : e.moves[0];
  enemyMP = Math.min(e.stats.maxMp, Math.max(0, enemyMP - em.cost));

  const order = p.stats.vel >= e.stats.vel ? [['p',pm],['e',em]] : [['e',em],['p',pm]];
  let stepIdx=0;

  function step(){
    syncPartyState();
    if(stepIdx>=order.length||playerHP<=0||enemyHP<=0){
      resolving=false;
      if(enemyHP<=0){
        const reward = 100 + (enemyIdx + 1) * 25;
        points += reward;
        msg = `¡Victoria! Ganaste +${reward} Pts. Puntos acumulados: ${points}`;
        playSFX('victory');
        state=(enemyIdx===enemies.length-1)?'champion':'victory';
      }
      else if(playerHP<=0){
        const alive = partyState.some(st => st.hp > 0);
        if(!alive){
          msg = `Fuiste derrotado. Puntos acumulados: ${points}`;
          state='defeat';
        } else {
          msg = `${chars[sel].name} cayó. ¡Selecciona otro compañero!`;
          state='battle_switch';
        }
      }
      updateUI();return;
    }

    const [who,mv]=order[stepIdx++];
    const isPlayer=(who==='p');
    const atkr=isPlayer?p:e;
    const defr=isPlayer?e:p;
    const selfStatus = isPlayer ? pStatus : eStatus;
    const selfPos = isPlayer ? {x:65,y:140} : {x:213,y:80};

    if(selfStatus.stunned){
      selfStatus.stunned=false;
      msg=atkr.name+' está ¡ATURDIDO! y pierde el turno.';
      spawnFloatText(selfPos.x,selfPos.y-10,'¡STUN!','#d060f0',1.2);
      setTimeout(step,800);
      return;
    }

    msg=atkr.name+' usa '+mv.name+'!';

    playMoveFX(mv.name,mv.kind,isPlayer,()=>{
      if(mv.kind==='ATK'){
        applyDamage(isPlayer,mv,atkr,defr);
      }
      else if(mv.kind==='BLOCK'){
        selfStatus.shield += 35;
        spawnFloatText(selfPos.x,selfPos.y-10,'+35 ESCUDO','#5b4a78',1.1);
        msg=atkr.name+' asume postura defensiva (+35 Escudo).';
      }
      else if(mv.kind==='PARRY'){
        selfStatus.parry = true;
        spawnFloatText(selfPos.x,selfPos.y-10,'¡POSTURA PARRY!','#ffd25e',1.1);
        msg=atkr.name+' prepara un contraataque (Parry activo).';
      }
      else if(mv.kind==='COVER'){
        selfStatus.cover = 40;
        spawnFloatText(selfPos.x,selfPos.y-10,'+40% EVASIÓN','#3070b0',1.1);
        msg=atkr.name+' mejora su posicionamiento (+40% Evasión).';
      }
      else if(mv.kind==='RECHARGE'){
        if(isPlayer) { playerMP = Math.min(p.stats.maxMp, playerMP + 35); syncPartyState(); }
        else enemyMP = Math.min(e.stats.maxMp, enemyMP + 35);
        spawnFloatText(selfPos.x,selfPos.y-10,'+35 MP','#30a0ff',1.1);
        msg=atkr.name+' recarga sus puntos de energía (+35 MP).';
      }
      else if(mv.kind==='BUFF'){
        selfStatus.buffAtk = 1.5;
        selfStatus.buffCrit = true;
        spawnFloatText(selfPos.x,selfPos.y-10,'¡ATQ & CRÍT. BUFF!','#e0b040',1.1);
        msg=atkr.name+' concentra poder para el próximo ataque.';
      }
      else if(mv.kind==='DEBUFF'){
        if(isPlayer) eStatus.stunned = true;
        else pStatus.stunned = true;
        const targetPos = isPlayer ? {x:213,y:80} : {x:65,y:140};
        spawnFloatText(targetPos.x,targetPos.y-10,'¡ATURDIDO!','#d060f0',1.2);
        msg=atkr.name+' aturde a '+defr.name+' por 1 turno.';
      }

      setTimeout(step,mv.kind==='ATK'?980:820);
    },mv.col,mv.anim);
  }

  step();
}

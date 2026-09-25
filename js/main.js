// ============ MAIN: Bucle principal y control de UI ============

// ============ MAIN: Bucle principal y control de UI ============

function frame(){
  // 1. Limpieza y reset de contexto obligatorio en cada frame
  resetCtx();

  const now = performance.now() / 1000;
  const dt = Math.min(.05, now - t);
  t = now;
  
  if (screenShake > 0) {
    g.save();
    g.translate((Math.random() - .5) * screenShake, (Math.random() - .5) * screenShake);
    screenShake = Math.max(0, screenShake - dt * 20);
  }

  let currentBiome = 'pradera';
  if (state === 'minigames' || state === 'mg_timing' || state === 'mg_pool' || state === 'mg_shell' || state === 'shop') {
    currentBiome = 'templo_dorado';
  } else if (state === 'battle' || state === 'battle_switch' || state === 'victory' || state === 'defeat' || state === 'champion') {
    currentBiome = enemies[enemyIdx].biome;
  }

  drawBiomeBackground(currentBiome, dt);

  if (state === 'main') {
    drawMainMenu(dt);
  } else if (state === 'select' || state === 'confirm' || state === 'chosen') {
    if (state !== 'chosen') { drawTitle(); chars.forEach((c, i) => drawSlot(c, i)); }
    drawDialog();
    if (state === 'confirm') drawConfirm();
    if (state === 'chosen') drawChosen(dt);
  } else if (state === 'minigames') {
    drawMinigamesMenu();
  } else if (state === 'mg_timing') {
    drawMinigameTiming(dt);
  } else if (state === 'mg_pool') {
    drawMinigamePool(dt);
  } else if (state === 'mg_shell') {
    drawMinigameShell(dt);
  } else if (state === 'shop') {
    drawShopScene();
  } else {
    drawBattleScene(dt);
  }

  renderFX(dt);

  if (screenShake > 0) g.restore();

  requestAnimationFrame(frame);
}
frame();

const btn1=document.getElementById('btn1'),btn2=document.getElementById('btn2'),
      btn3=document.getElementById('btn3'),btn4=document.getElementById('btn4'),
      hintEl=document.getElementById('hint'),controlsEl=document.getElementById('controls');

const HINTS={
  main:'Elige la Torre de Lucha para la aventura o prueba los Minijuegos.',
  select:'Usa ◀ ▶ o toca a cada personaje para verlo, Elegir para confirmar.',
  confirm:'Confirma tu elección.',
  chosen:'¡Prepárate para el combate!',
  minigames:'Pon a prueba tus reflejos y gana Puntos extra.',
  mg_timing:'Detén la barra justo en la zona dorada o verde.',
  mg_pool:'Espera el ángulo justo y presiona ¡Golpear! para embocar a Huntleo.',
  mg_shell:'Sigue el vaso con el peso de Tammybb y elige el correcto.',
  battle:'Selecciona tus acciones tácticas o cambia de compañero.',
  battle_switch:'Selecciona un compañero con HP disponible.',
  shop:'Intercambia tus puntos por mejoras y ventajas tácticas.',
  victory:'¡Excelente pelea! Ve a la tienda de bonus o continúa.',
  defeat:'¿Caíste? Usa tus puntos en la tienda para volver más fuerte.',
  champion:'¡Has vencido a todos los campeones!'
};

function updateUI(){
  hintEl.textContent=HINTS[state];
  
  const goBtn = document.getElementById('shop-continue');
  if (goBtn && state !== 'shop') {
    goBtn.style.display = 'none';
  }

  let switchBtn = document.getElementById('btn-switch-partner');
  if(!switchBtn){
    switchBtn = document.createElement('button');
    switchBtn.id = 'btn-switch-partner';
    switchBtn.style.marginTop = '8px';
    switchBtn.style.width = '100%';
    switchBtn.style.maxWidth = '640px';
    controlsEl.after(switchBtn);
  }

  if(state === 'battle'){
    switchBtn.style.display = 'block';
    switchBtn.className = 'controls-select';
    switchBtn.innerHTML = '<button style="width:100%; background:#28173d; border:1px solid #78b0ff; color:#78b0ff; padding:8px; font-weight:bold; cursor:pointer;">🔄 Cambiar Compañero</button>';
    switchBtn.disabled = resolving;
    switchBtn.onclick = () => {
      playSFX('click');
      state = 'battle_switch';
      updateUI();
    };
  } else {
    switchBtn.style.display = 'none';
  }

  if(state==='main' || state==='select' || state==='confirm' || state==='chosen') {
    setBGM('title');
  } else if(state==='minigames' || state==='mg_timing' || state==='mg_pool' || state==='mg_shell' || state==='shop') {
    setBGM('shop');
  } else if(state==='battle' || state==='battle_switch') {
    const shift = ENEMY_TRANSPOSE[enemyIdx] || 0;
    if (enemyIdx >= 4) setBGM('disco', shift);
    else setBGM('battle', shift);
  } else if(state==='defeat') {
    setBGM('defeat');
  }

  if(state==='select'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='none';
    btn1.innerHTML='◀';btn2.innerHTML='Elegir';btn3.innerHTML='▶';
    btn1.disabled=false;btn2.disabled=false;btn3.disabled=false;
    btn1.onclick=()=>{playSFX('click');sel=mod(sel-1,3)};
    btn3.onclick=()=>{playSFX('click');sel=mod(sel+1,3)};
    btn2.onclick=()=>{playSFX('click');state='confirm';updateUI()};
  }else if(state==='confirm'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='';btn3.style.display='';btn2.style.display='none';btn4.style.display='none';
    btn1.innerHTML='NO';btn3.innerHTML='SÍ';
    btn1.onclick=()=>{playSFX('click');state='select';updateUI()};
    btn3.onclick=()=>{playSFX('click');state='chosen';sparkles=[];updateUI()};
  }else if(state==='chosen'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='none';btn3.style.display='none';btn2.style.display='';btn4.style.display='none';
    btn2.innerHTML='¡A luchar!';
    btn2.onclick=()=>{playSFX('click');startBattle()};
  }else if(state==='main'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='';btn2.style.display='';btn3.style.display='none';btn4.style.display='none';
    btn1.disabled=false;btn2.disabled=false;
    btn1.innerHTML='⚔️ Torre de Lucha';
    btn2.innerHTML='🎮 Minijuegos';
    btn1.onclick=()=>{playSFX('click');msg='';state='select';updateUI();};
    btn2.onclick=()=>{playSFX('click');state='minigames';updateUI();};
  }else if(state==='minigames'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='';
    btn1.disabled=false;btn2.disabled=false;btn3.disabled=false;btn4.disabled=false;
    btn1.innerHTML='◀ Volver';
    btn2.innerHTML='🎯 Golpe Certero';
    btn3.innerHTML='🎱 Billar: Huntleo';
    btn4.innerHTML='🎲 Trileros: Tammybb';
    btn1.onclick=()=>{playSFX('click');state='main';updateUI();};
    btn2.onclick=()=>startMinigame();
    btn3.onclick=()=>startPoolGame();
    btn4.onclick=()=>startShellGame();
  }else if(state==='mg_timing'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='none';btn3.style.display='none';btn4.style.display='none';btn2.style.display='';
    btn2.disabled=false;
    if(mgActive){ btn2.innerHTML='¡DETENER!'; btn2.onclick=()=>stopMgRound(); }
    else if(mgAttempts>=3){ btn2.innerHTML='Volver a Minijuegos'; btn2.onclick=()=>{playSFX('click');state='minigames';updateUI();}; }
    else{ btn2.innerHTML='🎯 Lanzar'; btn2.onclick=()=>startMgRound(); }
  }else if(state==='mg_pool'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='none';btn3.style.display='none';btn4.style.display='none';btn2.style.display='';
    btn2.disabled=false;
    if(poolPhase==='aim'){ btn2.innerHTML='🎱 ¡Golpear!'; btn2.onclick=()=>{playSFX('click');strikePool();}; }
    else if(poolPhase==='shoot'){ btn2.innerHTML='Golpeando...'; btn2.disabled=true; }
    else if(poolAttempts>=3){ btn2.innerHTML='Volver a Minijuegos'; btn2.onclick=()=>{playSFX('click');state='minigames';updateUI();}; }
    else{ btn2.innerHTML='Otro Golpe'; btn2.onclick=()=>{playSFX('click');poolPhase='aim';poolAngle=0;poolResult='';updateUI();}; }
  }else if(state==='mg_shell'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    if(shellPhase==='guess'){
      btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='none';
      btn1.disabled=false;btn2.disabled=false;btn3.disabled=false;
      btn1.innerHTML='Vaso Izq.';btn2.innerHTML='Vaso Centro';btn3.innerHTML='Vaso Der.';
      btn1.onclick=()=>{playSFX('click');pickShellCup(0);};
      btn2.onclick=()=>{playSFX('click');pickShellCup(1);};
      btn3.onclick=()=>{playSFX('click');pickShellCup(2);};
    }else if(shellPhase==='result'){
      btn1.style.display='none';btn3.style.display='none';btn4.style.display='none';btn2.style.display='';
      btn2.disabled=false;
      if(shellAttempts>=3){ btn2.innerHTML='Volver a Minijuegos'; btn2.onclick=()=>{playSFX('click');state='minigames';updateUI();}; }
      else{ btn2.innerHTML='Otra Ronda'; btn2.onclick=()=>{playSFX('click');startShellGame();}; }
    }else{
      btn1.style.display='none';btn2.style.display='none';btn3.style.display='none';btn4.style.display='none';
    }
  }else if(state==='battle'){
    controlsEl.className='controls';
    const p=chars[sel];
    btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='';
    
    const m=[p.moves[0],p.moves[1],p.moves[2],p.moves[3]];
    [btn1,btn2,btn3,btn4].forEach((btn,idx)=>{
      const mv=m[idx];
      btn.className='btn-move';
      btn.style.setProperty('--move-col', mv.col);
      
      let costClass = 'cost-free';
      let costTxt = '0 MP';
      if(mv.cost > 0) {
        costClass = 'cost-consume';
        costTxt = `-${mv.cost} MP`;
      } else if(mv.cost < 0) {
        costClass = 'cost-gain';
        costTxt = `+${Math.abs(mv.cost)} MP`;
      }

      const powPct = Math.round(Math.min(1, mv.pow/1.5)*100);
      const accCol = mv.acc>=90?'#5cff9d':mv.acc>=75?'#ffd25e':'#ff7878';

      btn.innerHTML = `
        <div class="btn-move-header">
          <span class="btn-move-name">${mv.icon} ${mv.name}</span>
          <span class="btn-move-cost ${costClass}">${costTxt}</span>
        </div>
        <div class="btn-move-stats">
          <span class="btn-move-type" style="background:${mv.col};">${mv.kind}</span>
          <span class="stat-chip">
            <span class="stat-label">PWR</span>
            <span class="stat-bar"><span class="stat-fill" style="width:${powPct}%;background:${mv.col};"></span></span>
          </span>
          <span class="stat-chip">
            <span class="stat-label">ACC</span>
            <span class="stat-bar"><span class="stat-fill" style="width:${mv.acc}%;background:${accCol};"></span></span>
          </span>
        </div>
        <div class="btn-move-desc">${mv.desc}</div>
      `;
      btn.disabled=resolving || (mv.cost > 0 && playerMP < mv.cost) || playerHP <= 0;
      btn.onclick=()=>startTurn(idx);
    });
  }else if(state==='battle_switch'){
    controlsEl.className='controls-select';
    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='';

    chars.forEach((c, idx) => {
      const btn = [btn1, btn2, btn3][idx];
      const st = partyState[idx];
      const isCurrent = (idx === sel);
      const isDead = (st.hp <= 0);

      btn.innerHTML = `
        <div style="font-weight:bold; font-size:11px;">${c.name} ${isCurrent ? '⚡(En Combate)' : ''}</div>
        <div style="font-size:9px; margin-top:2px; color:${isDead?'#ff4d4d':isCurrent?'#ffd25e':'#5cff9d'};">
          ${isDead ? '💀 DERROTADO' : `HP: ${st.hp}/${c.stats.hp} | MP: ${st.mp}/${c.stats.maxMp}`}
        </div>
      `;
      btn.disabled = resolving || isCurrent || isDead;
      btn.onclick = () => switchPartner(idx);
    });

    btn4.innerHTML = '◀ Volver';
    btn4.disabled = (playerHP <= 0);
    btn4.onclick = () => {
      playSFX('click');
      state = 'battle';
      updateUI();
    };
  }else if(state==='shop'){
    controlsEl.className='controls';
    btn1.style.display='';btn2.style.display='';btn3.style.display='';btn4.style.display='';
    
    const p=chars[sel];
    const shopItems=[
      {
        name:'Poción Vida', cost:40, col:'#48a962', icon:'🧪', desc:'+35 HP inmediatos.',
        buy:()=>{ points-=40; playerHP=Math.min(p.stats.hp, playerHP+35); syncPartyState(); msg='Compraste +35 HP.'; playSFX('magic'); }
      },
      {
        name:'Carga MP', cost:30, col:'#30a0ff', icon:'🧪', desc:'+30 MP inmediatos.',
        buy:()=>{ points-=30; playerMP=Math.min(p.stats.maxMp, playerMP+30); syncPartyState(); msg='Compraste +30 MP.'; playSFX('magic'); }
      },
      {
        name:'Fuerza Perm.', cost:70, col:'#e0b040', icon:'⚔️', desc:'+15% ATK permanente.',
        buy:()=>{ points-=70; pBonusAtk+=0.15; msg='¡Ataque aumentado +15%! '; playSFX('magic'); }
      },
      {
        name:'Escudo Base', cost:50, col:'#9370db', icon:'🛡️', desc:'+25 Escudo cada combate.',
        buy:()=>{ points-=50; pStartShield+=25; msg='Escudo inicial aumentado a +'+pStartShield+'.'; playSFX('block'); }
      }
    ];

    [btn1,btn2,btn3,btn4].forEach((btn,idx)=>{
      const item=shopItems[idx];
      btn.className='btn-move';
      btn.style.setProperty('--move-col', item.col);
      
      btn.innerHTML = `
        <div class="btn-move-header">
          <span class="btn-move-name">${item.icon} ${item.name}</span>
          <span class="btn-move-cost cost-consume">${item.cost} PTS</span>
        </div>
        <div class="btn-move-body">
          <span>${item.desc}</span>
        </div>
      `;
      btn.disabled = points < item.cost;
      btn.onclick=()=>{
        item.buy();
        updateUI();
      };
    });

    let shopGoBtn = document.getElementById('shop-continue');
    if(!shopGoBtn){
      shopGoBtn = document.createElement('button');
      shopGoBtn.id = 'shop-continue';
      shopGoBtn.style.marginTop = '10px';
      shopGoBtn.style.width = '100%';
      shopGoBtn.style.maxWidth = '640px';
      controlsEl.after(shopGoBtn);
    }
    shopGoBtn.style.display = 'block';
    shopGoBtn.className = 'controls-select';
    shopGoBtn.innerHTML = playerHP <= 0 ? '<button style="width:100%">Reintentar Pelea</button>' : '<button style="width:100%">Siguiente Combate ➔</button>';
    shopGoBtn.onclick=()=>{
      playSFX('click');
      shopGoBtn.style.display='none';
      if(playerHP <= 0) retryFight();
      else nextFight();
    };

  }else if(state==='victory'||state==='defeat'||state==='champion'){
    controlsEl.className='controls-select';

    [btn1,btn2,btn3,btn4].forEach(b=>{b.className='';});
    btn1.style.display='none';btn3.style.display='none';btn4.style.display='none';btn2.style.display='';
    btn2.disabled=false;
    
    if(state==='victory'){
      btn1.style.display='';
      btn1.innerHTML='🏪 Tienda de Bonus';
      btn1.onclick=()=>{ playSFX('click'); state='shop'; updateUI(); };

      btn2.innerHTML='Siguiente combate ➔';
      btn2.onclick=()=>{ playSFX('click'); nextFight(); };
    }else if(state==='defeat'){
      if(points >= 30){
        btn1.style.display='';
        btn1.innerHTML='🏪 Tienda de Bonus ('+points+' Pts)';
        btn1.onclick=()=>{ playSFX('click'); state='shop'; updateUI(); };
      }
      btn2.innerHTML='Reintentar';
      btn2.onclick=()=>{ playSFX('click'); retryFight(); };
    }else if(state==='champion'){
      btn2.innerHTML='Jugar de nuevo';
      btn2.onclick=()=>{ playSFX('click'); restartAll(); };
    }
  }
}
updateUI();

cvs.addEventListener('mousemove',e=>{
  const rect=cvs.getBoundingClientRect();
  mousePos.x=(e.clientX-rect.left)/rect.width*W;
  mousePos.y=(e.clientY-rect.top)/rect.height*H;
});

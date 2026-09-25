// ============ FX: Partículas, destellos y animaciones de golpe ============
// Estado visual global (mousePos, activeFX, particles, floatingTexts,
// screenShake, flashAlpha/Color), ANIM_CONFIG (vincula el "anim" de cada
// move en data.js con su tipo de render: projectile/melee/onsite/beam/
// wave/bolt y su función de dibujo en sprites.js), spawnParticle/
// spawnFloatText/triggerFlash, burstAt (ráfaga de partículas) y
// renderFX/playMoveFX (animación de los movimientos de combate). Usa
// R/ball de core.js, los draw* de sprites.js y playSFX de audio.js.

// ---------- Posiciones y Estados Globales FX ----------
let mousePos={x:0,y:0};
let activeFX=[];
let particles=[];
let floatingTexts=[];
let screenShake=0;
let flashAlpha=0,flashColor='#fff';


// ---------- Vínculo Datos → Animación ----------
// Traduce el string "anim" de cada move (definido en data.js) al tipo de
// renderizado e ícono a usar. Si un move no tiene "anim" (o el string no
// aparece aquí), renderFX cae al comportamiento genérico por "kind"
// (ver el switch más abajo), así que añadir animaciones nuevas nunca rompe
// los movimientos existentes.
const ANIM_CONFIG = {
  // -- proyectiles con arco: viajan de origen a objetivo con trayectoria curva
  beer_bottle:    {type:'projectile',draw:(x,y,r)=>drawBeerBottle(x,y,r),spin:true, burst:'#e0b040'},
  coin_gold:      {type:'projectile',draw:(x,y,r)=>drawCoin(x,y,'#ffd25e',r),spin:true, burst:'#ffd25e'},
  coin_dark:      {type:'projectile',draw:(x,y,r)=>drawCoin(x,y,'#c060f0',r),spin:true, burst:'#c060f0'},
  bone_throw:     {type:'projectile',draw:(x,y,r)=>drawBone(x,y,r),spin:true, burst:'#f0ead6'},
  hairball:       {type:'projectile',draw:(x,y)=>drawHairball(x,y),spin:false, burst:'#8a2a1a'},
  dirty_water:    {type:'projectile',draw:(x,y)=>drawWaterDrop(x,y,'#5a7a3a'),spin:false, burst:'#5a7a3a'},
  // -- ataques cuerpo a cuerpo: el objeto aparece directo sobre el objetivo
  claw_slash:     {type:'melee',draw:(x,y)=>drawClawMarks(x,y), burst:'#e8e8e8'},
  feather_slash:  {type:'melee',draw:(x,y)=>drawFeather(x,y), burst:'#a0a8b8'},
  dark_bite:      {type:'melee',draw:(x,y)=>drawFang(x,y,'#601020'), burst:'#a83050'},
  fire_bite:      {type:'melee',draw:(x,y)=>drawFang(x,y,'#ff5020'), burst:'#ff5020'},
  body_slam:      {type:'melee',draw:(x,y)=>{ball(x,y,10,'#1e3d1b');ball(x,y,6,'#8ee053');}, burst:'#8ee053'},
  // -- animaciones en el sitio: el atacante hace su cosa sin proyectil
  beer_drink:     {type:'onsite',draw:(x,y)=>drawBeerBottle(x,y), burst:'#e0b040'},
  food_eat:       {type:'onsite',draw:(x,y)=>drawFoodItem(x,y,'#c8402b'), burst:'#48a962'},
  // -- rayos y ondas: trazo continuo entre origen y objetivo
  laser_beam:     {type:'beam', col:'#ff4040', burst:'#ff4040'},
  sonic_wave:     {type:'wave', col:'#00e5ff', burst:'#ff0077'},
  lightning_bolt: {type:'bolt', col:'#ffee66', burst:'#ffee66'}
};

function spawnParticle(x,y,vx,vy,color,size,life){
  particles.push({x,y,vx,vy,color,size,life,maxLife:life});
}
function spawnFloatText(x,y,text,color,scale=1){
  floatingTexts.push({x,y,text,color,scale,vy:-22,life:1.1});
}
function triggerFlash(col='#ffffff',dur=0.15){
  flashColor=col;flashAlpha=dur;
}

// ---------- FX Visuales ----------
function burstAt(x,y,color,n,spread){
  for(let i=0;i<n;i++){
    const ang=Math.random()*Math.PI*2,sp=(spread*.4)+Math.random()*spread;
    spawnParticle(x,y,Math.cos(ang)*sp,Math.sin(ang)*sp,color,1+Math.round(Math.random()),.35+Math.random()*.25);
  }
}

function renderFX(dt){
  activeFX.forEach(fx=>{
    fx.timer+=dt;
    const progress=Math.min(1,fx.timer/fx.dur);
    const {sx,sy,tx,ty,kind}=fx;

    // ---- Animación personalizada (data.js -> anim -> ANIM_CONFIG) ----
    const cfg = fx.anim ? ANIM_CONFIG[fx.anim] : null;
    if(cfg){
      if(cfg.type==='projectile'){
        const p=progress;
        const cx=sx+(tx-sx)*p, cy=sy+(ty-sy)*p-Math.sin(p*Math.PI)*26;
        const rot=cfg.spin?p*Math.PI*4:0;
        if(p<0.92) cfg.draw(cx,cy,rot);
        if(!fx.burst && p>0.85){
          fx.burst=true;burstAt(tx,ty,cfg.burst,10,42);playSFX('hit');
        }
      }
      else if(cfg.type==='melee'){
        if(progress<0.35){
          g.globalAlpha=.4+progress*.6;ball(sx,sy,4+progress*10,'#ffffff');g.globalAlpha=1;
        } else if(progress<0.75){
          cfg.draw(tx,ty);
        } else {
          if(!fx.burst){fx.burst=true;burstAt(tx,ty,cfg.burst,10,45);triggerFlash('#ffffff',.07);playSFX('hit');}
          const p=(progress-0.75)/0.25;
          g.globalAlpha=Math.max(0,1-p);ball(tx,ty,6+p*14,'#ffffff');g.globalAlpha=1;
        }
      }
      else if(cfg.type==='onsite'){
        if(progress<0.7){
          const bob=Math.sin(progress*Math.PI)*4;
          cfg.draw(sx,sy-bob);
          if(Math.random()<.4)spawnParticle(sx+(Math.random()-.5)*12,sy-8,0,-20,cfg.burst,1,.35);
        }
        if(!fx.burst && progress>0.6){fx.burst=true;playSFX('magic');}
      }
      else if(cfg.type==='beam'){
        if(progress<0.75){
          const p=Math.min(1,progress/0.25);
          g.globalAlpha=p;
          g.strokeStyle=cfg.col;g.lineWidth=4;
          g.beginPath();g.moveTo(sx,sy);g.lineTo(tx,ty);g.stroke();
          g.strokeStyle='#ffffff';g.lineWidth=1.5;
          g.beginPath();g.moveTo(sx,sy);g.lineTo(tx,ty);g.stroke();
          g.globalAlpha=1;
          if(Math.random()<.6)spawnParticle(tx+(Math.random()-.5)*10,ty+(Math.random()-.5)*10,(Math.random()-.5)*20,(Math.random()-.5)*20,cfg.col,1,.25);
        }
        if(!fx.burst && progress>0.55){fx.burst=true;burstAt(tx,ty,cfg.burst,12,50);triggerFlash('#fff2a0',.1);playSFX('crit');}
      }
      else if(cfg.type==='wave'){
        for(let i=0;i<3;i++){
          const wp=Math.min(1,progress+i*0.15);
          const cx=sx+(tx-sx)*wp, cy=sy+(ty-sy)*wp;
          g.globalAlpha=Math.max(0,.6-wp*.5);
          ball(cx,cy,4+wp*10,cfg.col);
        }
        g.globalAlpha=1;
        if(!fx.burst && progress>0.8){fx.burst=true;burstAt(tx,ty,cfg.burst,10,42);playSFX('hit');}
      }
      else if(cfg.type==='bolt'){
        if(progress<0.6){
          const p=progress/0.6, steps=6, segH=(ty-40-sy)/steps;
          g.strokeStyle=cfg.col;g.lineWidth=2;g.globalAlpha=p;
          g.beginPath();g.moveTo(tx,ty-60);
          let px=tx;
          for(let i=1;i<=steps*p;i++){px+= (i%2===0?6:-6); g.lineTo(px, ty-60+segH*i);}
          g.stroke();g.globalAlpha=1;
        }
        if(!fx.burst && progress>0.55){fx.burst=true;burstAt(tx,ty,cfg.burst,12,48);triggerFlash('#ffee66',.1);playSFX('hit');}
      }

      if(progress>=1 && !fx.hitTriggered){fx.hitTriggered=true;if(fx.onHit)fx.onHit();}
      return; // ya renderizado por ANIM_CONFIG: no caer al switch genérico de abajo
    }

    // ---- Render genérico (sin "anim" en data.js): comportamiento original por kind ----
    if(kind==='ATK'){
      if(progress<0.3){
        const p=progress/0.3;
        g.globalAlpha=.35+p*.4;
        ball(sx,sy,4+p*7,'#ffffff');
        g.globalAlpha=1;
        if(Math.random()<.5)spawnParticle(sx+(Math.random()-.5)*10,sy+(Math.random()-.5)*10,0,-8,'#ffffff',1,.25);
      }
      else if(progress<0.7){
        const p=(progress-0.3)/0.4;
        const cx=sx+(tx-sx)*p, cy=sy+(ty-sy)*p;
        g.strokeStyle='#ffffff';g.lineWidth=3;
        g.beginPath();g.moveTo(cx-9,cy-9);g.lineTo(cx+9,cy+9);g.stroke();
        g.strokeStyle=fx.col||'#ffd25e';g.lineWidth=1.5;
        g.beginPath();g.moveTo(cx-9,cy+9);g.lineTo(cx+9,cy-9);g.stroke();
        spawnParticle(cx,cy,(Math.random()-.5)*14,(Math.random()-.5)*14,fx.col||'#ffe066',1,.3);
      }
      else{
        if(!fx.burst){
          fx.burst=true;burstAt(tx,ty,'#ffe066',12,55);triggerFlash('#ffffff',.08);
          playSFX('hit');
        }
        const p=(progress-0.7)/0.3;
        g.globalAlpha=Math.max(0,1-p);
        ball(tx,ty,6+p*16,'#ffffff');
        g.globalAlpha=1;
      }
    }
    else if(kind==='BLOCK'){
      const p=progress;
      g.globalAlpha=.9-p*.3;
      ball(sx,sy,16+p*10,'#5b4a7866');ball(sx,sy,9+p*6,'#78b0ff88');
      g.globalAlpha=1;
      if(!fx.burst&&p>0.4){fx.burst=true;burstAt(sx,sy,'#9370db',8,35);playSFX('block')}
    }
    else if(kind==='PARRY'){
      g.globalAlpha=1-progress*.3;
      ball(sx,sy,14+progress*14,'#ffd25e88');
      g.globalAlpha=1;
      if(!fx.burst&&progress>0.35){fx.burst=true;burstAt(sx,sy,'#ffd25e',10,45);playSFX('block')}
    }
    else if(kind==='RECHARGE'){
      for(let i=0;i<3;i++){
        const r=6+((progress+i*.25)%1)*22;
        g.globalAlpha=.5*(1-((progress+i*.25)%1));
        ball(sx,sy,Math.max(1,Math.round(r)),'#30a0ff');
      }
      g.globalAlpha=1;
      if(Math.random()<.6)spawnParticle(sx+(Math.random()-.5)*16,sy+10,(Math.random()-.5)*6,-30,'#30a0ff',1,.4);
      if(!fx.burst){fx.burst=true;playSFX('magic')}
    }
    else if(kind==='BUFF'){
      g.globalAlpha=.75;
      ball(sx,sy,14+Math.sin(progress*Math.PI)*8,'#e0b04066');
      g.globalAlpha=1;
      if(Math.random()<.5)spawnParticle(sx+(Math.random()-.5)*18,sy+(Math.random()-.5)*18,0,-24,'#ffd25e',1,.4);
      if(!fx.burst){fx.burst=true;playSFX('magic')}
    }
    else if(kind==='DEBUFF'){
      const p=progress;
      g.globalAlpha=.7;
      ball(tx,ty,12+p*10,'#d060f055');
      g.globalAlpha=1;
      if(!fx.burst&&p>0.5){fx.burst=true;burstAt(tx,ty,'#d060f0',10,40);playSFX('magic')}
    }
    else if(kind==='COVER'){
      for(let i=0;i<3;i++){
        g.globalAlpha=.35-i*.1;
        R(sx-6-i*6,sy-1,10,2,'#3070b0');
      }
      g.globalAlpha=1;
      if(Math.random()<.5)spawnParticle(sx-8,sy+(Math.random()-.5)*10,-24,0,'#78c8ff',1,.3);
    }

    if(progress>=1 && !fx.hitTriggered){
      fx.hitTriggered=true;
      if(fx.onHit)fx.onHit();
    }
  });
  activeFX=activeFX.filter(fx=>fx.timer<fx.dur);

  particles.forEach(p=>{
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    g.globalAlpha=Math.max(0,p.life/p.maxLife);
    R(p.x,p.y,p.size,p.size,p.color);
  });
  g.globalAlpha=1;
  particles=particles.filter(p=>p.life>0);

  floatingTexts.forEach(ft=>{
    ft.y+=ft.vy*dt;ft.life-=dt;
    g.globalAlpha=Math.max(0,ft.life);
    g.font="bold "+Math.round(9*ft.scale)+"px 'Courier New',monospace";
    g.textAlign='center';
    g.fillStyle=K;g.fillText(ft.text,ft.x+1,ft.y+1);
    g.fillStyle=ft.color;g.fillText(ft.text,ft.x,ft.y);
  });
  g.globalAlpha=1;
  floatingTexts=floatingTexts.filter(ft=>ft.life>0);

  if(flashAlpha>0){
    g.globalAlpha=Math.min(0.6,flashAlpha);
    R(0,0,W,H,flashColor);
    g.globalAlpha=1;
    flashAlpha-=dt;
  }
}

function playMoveFX(moveName,kind,isPlayer,onHitCallback,col,anim){
  const sPos = isPlayer ? {x:65,y:140} : {x:213,y:80};
  const tPos = isPlayer ? {x:213,y:80} : {x:65,y:140};
  const dur = kind==='ATK' ? 0.62 : 0.5;

  activeFX.push({
    type:moveName, kind:kind, col:col, anim:anim||null, sx:sPos.x, sy:sPos.y, tx:tPos.x, ty:tPos.y,
    timer:0, dur:dur, hitTriggered:false, burst:false, onHit:onHitCallback
  });
}

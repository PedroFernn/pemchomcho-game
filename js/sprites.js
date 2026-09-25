// ============ SPRITES: Arte pixel de compañeros, enemigos y proyectiles ============
// Funciones de dibujo: knight, girl, dog (compañeros) y cat, frog, crow,
// vampChicken, wolfDJ, afroDog (enemigos). Más abajo: drawBeerBottle, drawCoin,
// drawBone, drawHairball, drawWaterDrop, drawClawMarks, drawFeather, drawFang,
// drawFoodItem — objetos/proyectiles de ataque referenciados por ANIM_CONFIG
// en fx.js. Usa R/B/ball/K/t de core.js. Para cambiar el diseño de un
// personaje o proyectil, edita su función aquí.

// ---------- COMPAÑEROS DE EQUIPO ----------
function knight(x,fy,p){
  p = (p !== undefined) ? p : (typeof t !== 'undefined' ? t * 2 : 0);
  const b=Math.round(Math.abs(Math.sin(p))*2),s=Math.sin(p)>0,y=fy-b,l1=s?2:0,l2=s?0:2;
  const tan='#e8c690',cr='#fff0dc',go='#f2d06b';
  B(x+7,y-6-l1,5,6,'#5b4a78');B(x+15,y-6-l2,5,6,'#5b4a78');
  B(x+4,y-16,19,10,'#d9c8f0');R(x+4,y-9,19,2,'#8a5a2a');B(x+12,y-10,4,4,go);
  B(x+8,y-19,11,5,go);R(x+11,y-18,1,3,K);R(x+13,y-18,1,3,K);R(x+15,y-18,1,3,K);
  B(x-1,y-18,8,8,go);R(x,y-16,5,4,'#c0281f');R(x+1,y-15,3,2,'#151015');
  B(x+20,y-18,8,8,go);
  B(x+3,y-35,6,5,tan);B(x+18,y-35,6,5,tan);R(x+5,y-34,2,3,cr);R(x+20,y-34,2,3,cr);
  B(x+4,y-31,19,13,tan);R(x+7,y-24,13,5,cr);R(x+2,y-30,3,13,'#e9d3a0');R(x+22,y-30,3,13,'#e9d3a0');
  R(x+8,y-27,3,3,K);R(x+17,y-27,3,3,K);R(x+12,y-24,3,1,'#f28a9a');
  B(x+19,y-23,9,17,'#fff6e0');R(x+22,y-22,3,15,'#e0b840');R(x+20,y-19,7,2,'#e0b840');R(x+23,y-14,1,2,K);
  for(let i=0;i<12;i++)R(x+2+i,y-10+i*.8+(s?1:0),2,2,'#b8c8d4');
  R(x,y-11,4,3,go);
}

function girl(x,fy,p){
  p = (p !== undefined) ? p : (typeof t !== 'undefined' ? t * 2 : 0);
  const b=Math.round(Math.abs(Math.sin(p))*2),s=Math.sin(p)>0,y=fy-b,w='#efe9f2',l1=s?2:0,l2=s?0:2,a=s?1:-1;
  B(x+6,y-4-l1,4,4,w);B(x+13,y-4-l2,4,4,w);
  B(x+1,y-16+a,4,9,w);B(x+18,y-16-a,4,9,w);
  B(x+5,y-16,13,6,'#3a3234');B(x+4,y-10,15,8,'#f7889b');R(x+5,y-6,13,1,'#fff');R(x+10,y-9,4,3,'#e8cf68');
  B(x+1,y-35,6,6,'#565868');B(x+16,y-35,6,6,'#565868');R(x+3,y-34,2,3,'#bfb2d4');R(x+18,y-34,2,3,'#bfb2d4');
  B(x+2,y-31,19,14,w);R(x,y-26,3,12,w);R(x+20,y-26,3,12,w);R(x+4,y-29,2,8,'#a0129a');
  R(x+7,y-25,3,3,K);R(x+14,y-25,3,3,K);R(x+11,y-21,3,2,'#f9a0a0');
  R(x+18,y-30,4,2,'#c5d93a');R(x+19,y-28,2,8,'#c5d93a');R(x+17,y-33,3,3,'#e8377c');
  const cx=x+25,cy=y-11-a;
  ball(cx,cy,7,K);ball(cx,cy,6,'#d8dce4');ball(cx,cy,4,'#e0b040');
  R(cx-1,cy-2,2,4,'#a87a18');R(cx-3,cy-1,2,2,'#a87a18');R(cx+1,cy-1,2,2,'#a87a18');R(cx-1,cy-3,2,1,'#a87a18');R(cx-2,cy+2,4,1,'#a87a18');
  R(cx-5,cy-3,1,2,'#f4f6fa');
}

function dog(x,fy){
  const T=.9,u=(t%T)/T,air=u<.7,h=air?Math.sin(Math.PI*u/.7)*16:0,y=Math.round(fy-h),s=air?0:1,e=air?-2:0,
        W2='#fff',go='#e8c040',hy=y+s,ey=hy+e;
  g.globalAlpha=.55;R(x+2+h/6,fy,20-h/3,2,'#f08a20');g.globalAlpha=1;
  for(let r=0;r<27;r++){
    const q=r/26,row=y-26+r,hw=Math.round(12*Math.sqrt(Math.max(0,1-Math.pow((q-.62)/(q<.62?.66:.42),2)))),
          c=r<14?'#3a3640':r==14?'#5a5666':r==15?'#2b2731':'#c8402b';
    R(x+12-hw-1,row,1,1,K);R(x+12+hw,row,1,1,K);R(x+12-hw,row,hw*2,1,c);
    if(r>1&&r<14)R(x+14-hw,row,hw*2-4,1,'#1e1a24');
    if(r>16){R(x+13-hw,row,2,1,'#e0755a');R(x+10+hw,row,2,1,'#a83220')}
  }
  const gr='#8a2a1a';
  R(x+4,y-9,4,1,gr);R(x+15,y-9,5,1,gr);R(x+6,y-7,7,1,gr);R(x+13,y-5,6,1,gr);R(x+8,y-3,8,1,gr);R(x+7,y-1,10,1,'#6e1e14');
  R(x+2,y-30,7,1,go);R(x+3,y-29,6,1,'#c89a20');R(x+5,y-28,4,1,'#a87a18');
  R(x+15,y-30,7,1,go);R(x+15,y-29,6,1,'#c89a20');R(x+15,y-28,4,1,'#a87a18');
  R(x+9,y-31,6,4,go);R(x+10,y-30,1,2,K);R(x+13,y-30,1,2,K);R(x+10,y-27,4,1,go);R(x+11,y-27,1,1,K);
  const ER=[[2,2],[1,3],[1,3],[1,3],[1,3],[1,3],[2,2]];
  ER.forEach(([st,w],i)=>{const r=ey-20+i;[0,1].forEach(m=>{const a=m?24-st-w:st;R(x+a-1,r,w+2,1,K);R(x+a,r-1,w,1,K)})});
  ER.forEach(([st,w],i)=>{const r=ey-20+i;[0,1].forEach(m=>R(x+(m?24-st-w:st),r,w,1,W2))});
  R(x+2,ey-19,1,4,'#f9c8d0');R(x+21,ey-19,1,4,'#f9c8d0');
  R(x+6,y-14,12,4,W2);
  const HW=[8,12,14,14,14,14,14,14,12,10];
  HW.forEach((w,i)=>{const r=ey-23+i;R(x+12-w/2-1,r,w+2,1,K);R(x+12-w/2,r-1,w,1,K)});R(x+7,ey-13,10,1,K);
  HW.forEach((w,i)=>R(x+12-w/2,ey-23+i,w,1,W2));B(x+10,ey-25,4,2,W2);
  B(x+6,y-12,3,4,W2);B(x+15,y-12,3,4,W2);R(x+7,y-10,1,2,'#d8d0e0');R(x+16,y-10,1,2,'#d8d0e0');
  R(x+7,ey-21,1,3,'#e88a94');
  R(x+8,ey-19,3,3,'#2a1a20');R(x+9,ey-20,1,1,'#2a1a20');R(x+9,ey-16,1,1,'#2a1a20');
  const sv='#8f96a8';R(x+13,ey-20,3,1,sv);R(x+12,ey-19,5,3,sv);R(x+13,ey-16,3,1,sv);R(x+13,ey-19,3,3,'#e02020');R(x+14,ey-18,1,1,'#a01010');R(x+12,ey-18,1,1,'#6a7080');R(x+16,ey-18,1,1,'#6a7080');
  R(x+11,ey-15,2,1,'#5a3a3a');R(x+10,ey-14,1,1,'#8a3a4a');R(x+13,ey-14,1,1,'#8a3a4a');R(x+11,ey-14,2,2,'#f28a9a');
  R(x+6,ey-16,2,2,'#f7b6b6');R(x+16,ey-16,2,2,'#f7b6b6');
}

// ---------- ENEMIGOS ----------
function cat(x,fy){
  const b=Math.sin(t*3)*2, cx=x+13, cy=fy-22+b;
  g.globalAlpha=0.4; R(x+2,fy+1,22,2,K); g.globalAlpha=1.0;
  for(let i=0;i<7;i++){
    const tx=x+22+i*3.2+Math.sin(t*5+i)*2, ty=fy-6+b-i*2.2;
    R(tx,ty,3,3,i%2===0?'#e05080':'#281d38');
  }
  B(x+4,fy-14+b,18,12,'#281d38'); R(x+6,fy-12+b,14,10,'#181024');
  R(x+5,fy-2+b,4,4,'#181024'); R(x+17,fy-2+b,4,4,'#181024');
  R(x+5,fy+1+b,1,2,'#fff'); R(x+8,fy+1+b,1,2,'#fff');
  R(x+17,fy+1+b,1,2,'#fff'); R(x+20,fy+1+b,1,2,'#fff');
  B(x+5,fy-14+b,16,3,'#9e2b2b'); R(x+12,fy-15+b,2,5,'#ff385c'); R(x+12,fy-14+b,1,2,'#ffffff');
  R(x+6,fy-12+b,1,2,'#ffd25e'); R(x+19,fy-12+b,1,2,'#ffd25e');
  ball(cx,cy,14,'#281d38'); ball(cx,cy,12,'#1c132b');
  R(cx-11,cy-16,6,8,'#1c132b'); R(cx+5,cy-16,6,8,'#1c132b');
  R(cx-9,cy-14,3,5,'#e05080'); R(cx+6,cy-14,3,5,'#e05080');
  R(cx-7,cy-3,5,5,'#ffd25e'); R(cx+2,cy-3,5,5,'#ffd25e');
  R(cx-5,cy-2,1,4,K); R(cx+4,cy-2,1,4,K);
  R(cx-6,cy-6,2,7,'#ff385c');
  R(cx-1,cy+3,2,2,'#e05080');
  R(cx-3,cy+5,2,2,'#fff'); R(cx+1,cy+5,2,2,'#fff');
  R(cx-14,cy+1,5,1,'#78b0ff'); R(cx-15,cy+4,5,1,'#78b0ff');
  R(cx+9,cy+1,5,1,'#78b0ff'); R(cx+10,cy+4,5,1,'#78b0ff');
}

function frog(x,fy){
  const b=Math.sin(t*2.5)*1.5, cx=x+13, cy=fy-18+b;
  g.globalAlpha=0.5; R(x-2,fy+1,30,3,K); g.globalAlpha=1.0;
  B(x+1,fy-13+b,24,13,'#1e3d1b'); R(x+4,fy-11+b,18,11,'#8ee053');
  B(x-4,fy-8+b,6,10,'#1e3d1b'); B(x+24,fy-8+b,6,10,'#1e3d1b');
  R(x-5,fy+1+b,3,2,'#e0b040'); R(x+28,fy+1+b,3,2,'#e0b040');
  ball(cx,cy-2,15,'#1e3d1b');
  ball(cx-8,cy-6,3,'#00e5a3'); ball(cx+8,cy-6,3,'#00e5a3'); ball(cx,cy-10,2,'#00e5a3');
  ball(cx-9,cy-11,5,'#122b15'); ball(cx+9,cy-11,5,'#122b15');
  R(cx-10,cy-12,3,3,'#ff9900'); R(cx+8,cy-12,3,3,'#ff9900');
  R(cx-9,cy-12,1,3,K); R(cx+9,cy-12,1,3,K);
  R(cx-10,cy+2,20,3,K);
  R(cx-8,cy+1,2,2,'#fff'); R(cx+6,cy+1,2,2,'#fff');
  R(cx-4,cy+3,2,2,'#fff'); R(cx+2,cy+3,2,2,'#fff');
  if(Math.sin(t*4)>0.6) R(cx-6,cy+6,2,3,'#00e5a3');
}

function crow(x,fy){
  const b=Math.sin(t*4)*3, wing=Math.cos(t*6)*4, cx=x+13, cy=fy-24+b;
  g.globalAlpha=0.3; R(x+3,fy+2,20,2,K); g.globalAlpha=1.0;
  B(x-10,cy-8+wing,12,16,'#383b48'); R(x-8,cy-6+wing,8,12,'#60667a');
  B(x+24,cy-8-wing,12,16,'#383b48'); R(x+22,cy-6-wing,8,12,'#60667a');
  R(x-12,cy+4+wing,3,5,'#a0a8b8'); R(x+35,cy+4-wing,3,5,'#a0a8b8');
  B(x+6,fy-14+b,14,14,'#191820'); R(x+8,fy-12+b,10,10,'#2a2835');
  R(x+8,fy,2,4,'#a0a8b8'); R(x+16,fy,2,4,'#a0a8b8');
  R(x+6,fy+3,5,1,'#a0a8b8'); R(x+15,fy+3,5,1,'#a0a8b8');
  ball(cx,cy,13,'#191820');
  B(cx-2,cy+1,16,6,'#d8dce4'); R(cx+2,cy+2,10,3,'#a0a8b8');
  R(cx+12,cy+3,4,2,'#e0b040');
  B(cx-5,cy-3,6,6,'#222'); R(cx-4,cy-2,4,4,'#ff2040'); R(cx-3,cy-1,1,1,'#ffffff');
  if(Math.sin(t*8)>0.5) R(cx-10+Math.random()*26,cy-12+Math.random()*20,2,2,'#60667a');
}

function vampChicken(x,fy){
  const b=Math.sin(t*3.2)*2.5, cx=x+13, cy=fy-22+b;
  g.globalAlpha=.4; R(x+2,fy+1,22,2,K); g.globalAlpha=1;
  const capeSway = Math.sin(t*4)*2;
  B(x-8,cy-8+capeSway,12,18,'#1c0f24'); R(x-6,cy-6+capeSway,8,14,'#601020');
  B(x+22,cy-8-capeSway,12,18,'#1c0f24'); R(x+20,cy-6-capeSway,8,14,'#601020');
  B(x+4,fy-14+b,18,13,'#28182d'); R(x+6,fy-12+b,14,9,'#3d2444');
  R(x+6,fy-1+b,3,3,'#d8a020'); R(x+17,fy-1+b,3,3,'#d8a020');
  R(x+5,fy+2+b,5,1,K); R(x+16,fy+2+b,5,1,K);
  B(x+2,cy-4,22,6,'#a01828'); R(x+4,cy-3,18,4,'#e02838');
  ball(cx,cy-6,11,'#28182d'); ball(cx,cy-6,9,'#ded8cb');
  R(cx-5,cy-18,3,6,'#c81830'); R(cx-1,cy-20,3,8,'#ff2848'); R(cx+3,cy-18,3,6,'#c81830');
  B(cx-6,cy-9,4,5,K); R(cx-5,cy-8,2,3,'#ff1030'); R(cx-5,cy-8,1,1,'#fff');
  B(cx+2,cy-9,4,5,K); R(cx+3,cy-8,2,3,'#ff1030'); R(cx+3,cy-8,1,1,'#fff');
  B(cx-3,cy-3,7,5,'#e0a020'); R(cx-1,cy-1,3,2,'#b07810');
  R(cx-3,cy+1,2,4,'#ffffff'); R(cx+2,cy+1,2,4,'#ffffff');
  if(Math.sin(t*6)>0.2){
    R(cx-12+Math.sin(t*5)*6,cy-15+Math.cos(t*3)*8,2,2,'#ff2848');
    R(cx+10+Math.cos(t*4)*6,cy-10+Math.sin(t*5)*8,2,2,'#ff2848');
  }
}

function wolfDJ(x,fy){
  const b=Math.sin(t*3)*2, cx=x+13, cy=fy-22+b;
  g.globalAlpha=.4; R(x+2,fy+1,22,2,K); g.globalAlpha=1;
  B(x+3,fy-16+b,20,15,'#1b2030'); R(x+5,fy-14+b,16,11,'#2c354d');
  const neonCol = Math.sin(t*8)>0 ? '#00e5ff' : '#ff0077';
  R(x+5,fy-11+b,16,2,neonCol); R(x+9,fy-14+b,2,11,'#151924');
  B(x+1,fy-6+b,5,5,'#606878'); B(x+20,fy-6+b,5,5,'#606878');
  ball(cx,cy-2,12,'#485063'); ball(cx,cy-2,10,'#6a748c');
  B(cx-5,cy+1,10,7,'#8894ab'); R(cx-2,cy+2,4,3,K);
  B(cx-10,cy-16,5,9,'#384052'); R(cx-9,cy-14,3,6,'#f598a8');
  B(cx+5,cy-16,5,9,'#384052'); R(cx+6,cy-14,3,6,'#f598a8');
  B(cx-8,cy-7,16,6,'#101018'); R(cx-7,cy-6,14,4,neonCol);
  for(let i=0;i<5;i++){
    const h=1+Math.round(Math.abs(Math.sin(t*10+i))*3);
    R(cx-6+i*3,cy-3-h+1,2,h,'#ffffff');
  }
  B(cx-13,cy-10,6,10,'#15151e'); R(cx-12,cy-8,4,6,neonCol);
  B(cx+7,cy-10,6,10,'#15151e'); R(cx+8,cy-8,4,6,neonCol);
  B(cx-10,cy-18,20,3,'#15151e');
  if(Math.sin(t*7)>0){
    g.strokeStyle=neonCol;g.lineWidth=1;
    g.strokeRect(cx-16,cy-14,32,24);
  }
}

// ---------- OBJETOS Y PROYECTILES DE ATAQUE (usados por fx.js/ANIM_CONFIG) ----------
// Todos reciben coordenadas de CENTRO y son pequeños (8-16px) para mantener
// el estilo pixel-art del resto del juego. Usan solo R/B/ball de core.js,
// más g.save/translate/rotate para los que giran en vuelo.

function drawBeerBottle(x,y,rot){
  g.save();
  g.translate(Math.round(x),Math.round(y));
  g.rotate(rot||0);
  R(-2,-9,4,3,'#e8c690');
  R(-1,-11,2,3,'#8a5a1e');
  R(-3,-6,6,11,'#3a6b1e');
  R(-2,-4,4,2,'#f0e8c8');
  R(-3,2,6,3,'#2a4d15');
  g.restore();
}

function drawCoin(x,y,col,rot){
  const sq = Math.max(1,Math.abs(Math.cos(rot||0)));
  ball(x,y,6,K);
  ball(x,y,Math.max(1,Math.round(5*sq)),col||'#ffd25e');
  if(sq>0.5){
    g.fillStyle=K;g.font="bold 6px 'Courier New',monospace";g.textAlign='center';
    g.fillText(col==='#ffd25e'?'$':'☠',Math.round(x),Math.round(y)+2);
    g.textAlign='left';
  }
}

function drawBone(x,y,rot){
  g.save();
  g.translate(Math.round(x),Math.round(y));
  g.rotate(rot||0);
  R(-6,-1,12,2,'#f0ead6');
  ball(-6,-2,2,'#f0ead6');ball(-6,2,2,'#f0ead6');
  ball(6,-2,2,'#f0ead6');ball(6,2,2,'#f0ead6');
  g.restore();
}

function drawHairball(x,y){
  ball(x,y,5,'#5a1a10');ball(x,y,4,'#8a2a1a');
  R(x-3,y-2,2,1,'#c85a3a');R(x+1,y+1,2,1,'#c85a3a');R(x-1,y-3,1,1,'#c85a3a');
}

function drawWaterDrop(x,y,col){
  const c=col||'#5a7a3a';
  ball(x,y+1,4,c);
  R(x-1,y-6,2,6,c);
  R(x-2,y,1,1,'#dff0c8');
}

function drawClawMarks(x,y){
  g.strokeStyle='#ffffff';g.lineWidth=2;
  for(let i=0;i<3;i++){
    g.beginPath();
    g.moveTo(x-9+i*6,y-9);
    g.lineTo(x-3+i*6,y+9);
    g.stroke();
  }
}

function drawFeather(x,y,rot){
  g.save();
  g.translate(Math.round(x),Math.round(y));
  g.rotate(rot||0);
  R(-1,-7,2,12,'#e8ecf2');
  R(-4,-5,3,2,'#a0a8b8');R(1,-3,3,2,'#a0a8b8');
  R(-4,-1,3,2,'#a0a8b8');R(1,1,3,2,'#a0a8b8');
  R(-4,3,3,2,'#a0a8b8');
  g.restore();
}

function drawFang(x,y,col){
  const c=col||'#601020';
  R(x-3,y-5,2,9,c);
  R(x+1,y-5,2,9,c);
  R(x-4,y-6,8,2,c);
}

function drawFoodItem(x,y,col){
  ball(x,y+3,6,'#8a5a1e');
  ball(x,y+1,5,col||'#c8402b');
  if(Math.sin(t*8)>0){R(x-1,y-7,2,3,'#d8d8d8');R(x+2,y-8,1,3,'#d8d8d8');}
}

function afroDog(x,fy){
  const b=Math.sin(t*3.5)*2.5, cx=x+13, cy=fy-20+b;
  g.globalAlpha=.4; R(x+2,fy+1,22,2,K); g.globalAlpha=1;
  B(x+3,fy-15+b,20,14,'#5c1d6e'); R(x+5,fy-13+b,16,10,'#8a2db5');
  R(x+10,fy-15+b,6,7,'#f5cb42'); R(x+12,fy-10+b,2,3,'#ffffff');
  B(x,fy-12+b,4,8,'#c48b52'); R(x,fy-14+b,4,3,'#5c1d6e');
  B(x+22,fy-6+b,5,5,'#c48b52');
  ball(cx,cy-2,10,'#c48b52'); B(cx-4,cy+1,8,6,'#e8be90');
  R(cx-2,cy+1,4,3,K); R(cx-3,cy+5,6,1,'#c83050');
  ball(cx,cy-12,16,'#1a120c');
  ball(cx-5,cy-15,11,'#2c2017'); ball(cx+5,cy-15,11,'#2c2017');
  ball(cx,cy-18,10,'#3d2d20');
  R(cx-8,cy-22,3,2,'#ffffff'); R(cx+6,cy-20,2,2,'#ffffff');
  R(cx+9,cy-22,2,8,'#f5cb42'); R(cx+8,cy-24,4,3,'#f5cb42');
  B(cx-8,cy-6,7,6,'#101010'); R(cx-7,cy-5,5,4,'#f5cb42');
  B(cx+1,cy-6,7,6,'#101010'); R(cx+2,cy-5,5,4,'#f5cb42');
  R(cx-1,cy-5,2,2,'#101010'); R(cx-6,cy-4,2,2,'#ffffff'); R(cx+3,cy-4,2,2,'#ffffff');
  if(Math.sin(t*5)>0){
    R(cx-15+Math.sin(t*8)*4,cy-8,3,3,'#00ffff');
    R(cx+13+Math.cos(t*8)*4,cy-14,3,3,'#ff00ea');
  }
}

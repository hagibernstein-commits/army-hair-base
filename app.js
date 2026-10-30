(function(){
'use strict';
var KEY='armyhair.v1.save';
var S=null,cur='title',main=document.getElementById('main'),top=document.getElementById('top'),nav=document.getElementById('nav');
var fmt=function(n){return Math.floor(n).toLocaleString('he-IL');};
var $=function(id){return document.getElementById(id);};
function load(){try{var j=localStorage.getItem(KEY);if(j){var o=JSON.parse(j);if(o&&o.v===1)return o;}}catch(e){}return null;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
/* sound */
var AC=null;
function tone(f,t,d,ty,v,f2){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+t;o.type=ty||'square';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v||.06,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d+.02);}catch(e){}}
function snd(k){if(S&&!S.sound)return;
 if(k==='coin'){tone(988,0,.08,'square',.05);tone(1319,.07,.15,'square',.05);}
 else if(k==='build'){tone(110,0,.15,'sawtooth',.1,60);tone(440,.12,.1,'square',.05);tone(660,.2,.15,'square',.05);}
 else if(k==='buy'){tone(523,0,.08);tone(784,.08,.12);}
 else if(k==='lvl'){[523,659,784,1047].forEach(function(f,i){tone(f,i*.09,.14,'triangle',.08);});}
 else if(k==='shoot0'){tone(700,0,.06,'square',.025,200);}
 else if(k==='shoot1'){tone(300,0,.07,'sawtooth',.02,100);}
 else if(k==='boom'){tone(120,0,.25,'sawtooth',.09,30);}
 else if(k==='air'){tone(900,0,.5,'sawtooth',.06,60);tone(90,.3,.4,'sawtooth',.1,30);}
 else if(k==='heal'){tone(600,0,.1,'sine',.08);tone(900,.1,.2,'sine',.08);}
 else if(k==='ko1'){tone(400,0,.12,'triangle',.05,120);}
 else if(k==='ko0'){tone(300,0,.25,'triangle',.07,80);}
 else if(k==='win'){[523,523,523,784,659,784,1047].forEach(function(f,i){tone(f,i*.14,.2,'square',.06);});}
 else if(k==='lose'){[392,330,262,196].forEach(function(f,i){tone(f,i*.2,.3,'triangle',.08);});}
 else if(k==='err'){tone(150,0,.2,'square',.06);}
}
function toast(msg,x,y){var d=document.createElement('div');d.className='fl';d.textContent=msg;d.style.left=(x||innerWidth/2-40)+'px';d.style.top=(y||innerHeight/2)+'px';document.body.appendChild(d);setTimeout(function(){d.remove();},1000);}
function modal(html){closeModal();var m=document.createElement('div');m.className='modal';m.id='modal';m.innerHTML='<div class="sheet">'+html+'</div>';m.addEventListener('click',function(e){if(e.target===m)closeModal();});document.body.appendChild(m);m.querySelector('.sheet').scrollTop=0;return m;}
function closeModal(){var m=$('modal');if(m)m.remove();}
function confirmBox(msg,yes,cb){var m=modal('<div class="center"><h2>'+msg+'</h2><div class="row" style="justify-content:center"><button class="btn red" id="cy">'+yes+'</button><button class="btn" id="cn">ביטול</button></div></div>');$('cy').onclick=function(){closeModal();cb();};$('cn').onclick=closeModal;}
function go(s){cur=s;closeModal();render();main.scrollTop=0;window.scrollTo(0,0);}
function mineSprite(t){return SP.mine(t);}
function topbar(){
 if(cur==='title'||cur==='battle'){top.style.display='none';return;}
 top.style.display='flex';
 top.innerHTML='<div class="money">₪ <span id="mny">'+fmt(S.money)+'</span><div class="inc">+'+E.income(S).toFixed(1)+' ₪ בשנייה · '+E.RANKS[E.rank(S)][0]+' '+(E.isNight()?'🌙':'☀️')+'</div></div><button class="ib" id="bmute">'+(S.sound?'🔊':'🔇')+'</button><button class="ib" id="bset">⚙️</button>';
 $('bmute').onclick=function(){S.sound=!S.sound;save();topbar();};$('bset').onclick=function(){go('settings');};
}
function navbar(){
 if(cur==='title'||cur==='battle'){nav.style.display='none';return;}
 nav.style.display='flex';
 var it=[['base','🏕️','הבסיס'],['army','🪖','החיילים'],['map','🗺️','המפה'],['ops','🎖️','מבצעים'],['settings','⚙️','עוד']];
 nav.innerHTML=it.map(function(x){return '<button data-go="'+x[0]+'" class="'+(cur===x[0]?'on':'')+'"><b>'+x[1]+'</b>'+x[2]+'</button>';}).join('');
}
function render(){
 stopBattleLoop(cur==='battle');
 main.className='';
 topbar();navbar();
 ({title:rTitle,base:rBase,army:rArmy,map:rMap,settings:rSettings,battle:rBattle,ops:rOps})[cur]();
 main.scrollTop=0;
}
/* ---------- title ---------- */
var pickD='normal';
function rTitle(){
 var has=!!load();
 main.className='noscroll';
 main.innerHTML='<div class="title">'+mineSprite('rifle')+'<h1>מפקד הפאה</h1><div>בנה בסיס, גייס צבא, אמן ושדרג והשתלט על כל המפה!</div>'+
 (has?'<button class="btn green" id="bcont" style="font-size:22px;padding:12px 30px">▶ המשך משחק</button><div>או התחל מחדש:</div>':'')+
 '<div>רמת קושי:</div><div class="dif">'+Object.keys(E.DIFF).map(function(k){return '<button data-d="'+k+'" class="'+(pickD===k?'on':'')+'">'+E.DIFF[k].n+'</button>';}).join('')+'</div>'+
 '<button class="btn" id="bnew" style="font-size:20px;padding:10px 24px">'+(has?'משחק חדש (מוחק את הישן)':'התחל משחק!')+'</button></div>';
 var c=$('bcont');if(c)c.onclick=function(){S=load();E.tick(S,Date.now());S.shop=S.shop||{};S.allies=S.allies||{};S.spied=S.spied||{};S.ach=S.ach||{};S.daily=S.daily||{d:'',streak:0};S.inv=S.inv||{at:0,on:0};go('base');};
 $('bnew').onclick=function(){if(has)confirmBox('להתחיל מחדש? כל ההתקדמות תימחק!','כן, מחק והתחל',startNew);else startNew();};
 main.querySelectorAll('[data-d]').forEach(function(b){b.onclick=function(){pickD=b.dataset.d;rTitle();};});
}
function startNew(){S=E.newState(pickD);save();snd('lvl');go('base');}
/* ---------- base ---------- */
function objective(){
 var n=S.soldiers.length;
 if(E.cnt(S,'barracks')<1)return '🎯 משימה: בנה צריף כדי שיהיה מקום לעוד חיילים';
 if(n<3)return '🎯 משימה: גייס עוד חיילים (לשונית "החיילים")';
 if(E.cnt(S,'training')<1)return '🎯 משימה: בנה מגרש אימונים כדי לאמן חיילים';
 if(!S.soldiers.some(function(s){return s.lvl>1;}))return '🎯 משימה: אמן חייל אחד לרמה 2';
 if(E.cnt(S,'armory')<1)return '🎯 משימה: בנה נשקייה ואז שדרג נשק ושריון';
 if(!Object.keys(S.conquered).length)return '🎯 משימה: צא למפה וכבוש את המדינה הראשונה!';
 if(E.cnt(S,'canteen')<1)return '🎯 משימה: בנה מטבח שדה כדי להרוויח יותר כסף';
 return '🎯 משימה: כבשו '+Object.keys(S.conquered).length+' מתוך '+E.MAP.length+' מדינות. קדימה לכבוש את כולן!';
}
function rBase(){
 var h='<div class="obj">'+objective()+'</div>';
 if(S.inv.on)h+='<div class="obj" style="background:#8a2a2a;border-color:#ff8a7a;margin-top:6px" data-go="ops">🚨 פלישה לבסיס! לחץ כאן כדי להגן!</div>';
 h+='<div class="card row"><div class="grow"><b>קופת המחנה</b> <span class="tag">מסים: '+E.taxes(S).toFixed(1)+' ₪/ש\'</span><div class="bar" style="margin-top:4px"><i id="pbar" style="width:0"></i></div><div style="font-size:12px"><span id="pt"></span></div></div><button class="btn green" id="bcol"><span class="coin">🪙</span> אסוף</button></div>';
 h+='<div class="row"><b>החיילים שלי</b><span class="tag">'+S.soldiers.length+'/'+E.capacity(S)+' מקומות</span></div><div class="yard">'+S.soldiers.map(function(s){return '<div class="yd" data-go="army">'+mineSprite(s.type)+'<div>'+esc(s.name)+'<br>רמה '+s.lvl+'</div></div>';}).join('')+'</div>';
 h+='<div class="row" style="margin-top:8px"><b>הבסיס</b><span class="tag">לחץ על משבצת כדי לבנות</span></div><div class="plots">';
 S.plots.forEach(function(p,i){
  h+=p?'<button class="plot has" data-pl="'+i+'">'+SP.bsvg(p.t)+'<span class="lv">'+E.BTYPES[p.t].n+' '+(E.BTYPES[p.t].deco?'':'★'.repeat(p.l))+'</span></button>':'<button class="plot" data-pl="'+i+'">＋</button>';
 });
 h+='</div>';
 main.innerHTML=h;
 $('bcol').onclick=function(e){var a=Math.floor(S.pile);if(a<1){snd('err');return;}S.money+=a;S.pile-=a;snd('coin');var r=e.target.getBoundingClientRect();toast('+'+fmt(a)+' ₪',r.left,r.top);save();updTick();};
 main.querySelectorAll('[data-pl]').forEach(function(b){b.onclick=function(){plotClick(+b.dataset.pl);};});
 updTick();
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function plotClick(i){
 var p=S.plots[i];
 if(!p){
  var h='<h2>מה נבנה כאן?</h2>';
  Object.keys(E.BTYPES).forEach(function(t){var c=E.buildCost(S,t),ok=S.money>=c;h+='<div class="card sc"><div class="sp">'+SP.bsvg(t)+'</div><div class="grow"><b>'+E.BTYPES[t].n+'</b><div style="font-size:13px">'+E.BTYPES[t].d+'</div></div><button class="btn '+(ok?'':'dis')+'" data-b="'+t+'">₪'+fmt(c)+'</button></div>';});
  var m=modal(h);m.querySelectorAll('[data-b]').forEach(function(b){b.onclick=function(){var t=b.dataset.b,c=E.buildCost(S,t);if(S.money<c){snd('err');toast('אין מספיק כסף');return;}S.money-=c;S.plots[i]={t:t,l:1};snd('build');save();closeModal();render();};});
 }else{
  var c=E.upgradeBCost(S,p),mx=p.l>=E.MAXB||E.BTYPES[p.t].deco,ok=S.money>=c;
  var info={garage:'מקומות לכלי רכב: '+E.vcap(S),tower:'יורה על פולשים',wall:'חוסמת פולשים',tree:'🌳',flag:'🚩',fountain:'⛲',statue:'🗿',barracks:'מקומות לחיילים: '+E.capacity(S),training:'משבצות אימון: '+E.slots(S)+' | רמה מקסימלית לחייל: '+E.maxSoldierLvl(S),canteen:'הכנסה כוללת: '+E.income(S).toFixed(1)+' ₪/שנייה',armory:'שדרוגי נשק ושריון עד ★'+E.upCap(S),clinic:'ריפוי בקרב: '+(E.sumLvl(S,'clinic')*1)+'% מהחיים בשנייה',command:'חיילים בכוח הלוחם: '+E.squadSize(S)}[p.t];
  modal('<div class="center"><div style="width:110px;margin:auto">'+SP.bsvg(p.t)+'</div><h2>'+E.BTYPES[p.t].n+(E.BTYPES[p.t].deco?'':' ★'+p.l)+'</h2><div>'+E.BTYPES[p.t].d+'</div><div class="tag">'+info+'</div><br>'+(mx?'<b>'+(E.BTYPES[p.t].deco?'קישוט':'רמה מקסימלית!')+'</b>':'<button class="btn '+(ok?'':'dis')+'" id="bup">שדרג לרמה '+(p.l+1)+' (₪'+fmt(c)+')</button>')+'</div>');
  var u=$('bup');if(u)u.onclick=function(){if(S.money<c){snd('err');toast('אין מספיק כסף');return;}S.money-=c;p.l++;snd('build');save();closeModal();render();};
 }
}
function updTick(){
 var d=E.tick(S,Date.now());
 d.forEach(function(sd){if(sd){snd('lvl');toast('🎉 '+sd.name+' עלה לרמה '+sd.lvl);}});
 if(d.length)save();checkAch();
 if(E.conqN(S)>=1){if(!S.inv.at)S.inv.at=Date.now()+5*60000;if(!S.inv.on&&Date.now()>=S.inv.at){S.inv.on=1;if(cur==='base'){render();}toast('🚨 פלישה לבסיס!');snd('err');}}
 var m=$('mny');if(m)m.textContent=fmt(S.money);
 var pb=$('pbar');if(pb){var cap=E.pileCap(S);pb.style.width=Math.min(100,S.pile/cap*100)+'%';$('pt').textContent=fmt(S.pile)+' ₪ מחכים באוסף (מקסימום '+fmt(cap)+')';}
 document.querySelectorAll('[data-tr]').forEach(function(e){var id=e.dataset.tr,end=S.train[id];if(!end){render();return;}var sd=S.soldiers.filter(function(x){return x.id==id;})[0],tot=E.trainTime(S,sd)*1000,left=Math.max(0,end-Date.now());e.firstChild.style.width=(100-left/tot*100)+'%';});
 if(d.length&&cur==='army')rArmy();
}
setInterval(function(){if(S&&cur!=='battle'&&cur!=='title'){updTick();}},500);
setInterval(function(){if(S)save();},8000);
/* ---------- army ---------- */
function rArmy(){
 var st=main.scrollTop;
 var h='<h2>גיוס חיילים</h2><div class="tag">חיילים '+E.nInf(S)+'/'+E.capacity(S)+(E.nInf(S)>=E.capacity(S)?' - מלא! בנה עוד צריף':'')+'</div><div class="tag">כלי רכב '+E.nVeh(S)+'/'+E.vcap(S)+'</div>';
 Object.keys(E.STYPES).forEach(function(t){var T=E.STYPES[t],p=E.soldierPrice(S,t),full=T.veh?E.nVeh(S)>=E.vcap(S):E.nInf(S)>=E.capacity(S),ok=S.money>=p&&!full;
  h+='<div class="card sc"><div class="sp">'+mineSprite(t)+'</div><div class="grow"><b>'+T.n+'</b><div style="font-size:12px">'+T.d+'</div><span class="tag">❤ '+T.hp+'</span><span class="tag">💥 '+T.dmg+'</span><span class="tag">🎯 '+T.range+'</span>'+(T.veh&&E.vcap(S)<1?'<div class="tag">צריך מוסך</div>':'')+'</div><button class="btn '+(ok?'green':'dis')+'" data-buy="'+t+'">גייס<br>₪'+fmt(p)+'</button></div>';});
 h+='<h2>הכוח שלי</h2><div class="tag">רמה מקסימלית כרגע: '+E.maxSoldierLvl(S)+' (בנה/שדרג מגרש אימונים) | שדרוגי נשק עד ★'+E.upCap(S)+'</div>';
 S.soldiers.forEach(function(s){
  var T=E.STYPES[s.type],stt=E.stats(s,S),tr=S.train[s.id],ml=E.maxSoldierLvl(S);
  h+='<div class="card sc"><div class="sp">'+mineSprite(s.type)+'</div><div class="grow"><div><b data-ren="'+s.id+'">✏️ '+esc(s.name)+'</b> <span class="tag">'+T.n+'</span></div>'+
  '<span class="tag">⭐ רמה '+s.lvl+'/'+ml+'</span>'+(E.medal(s)?'<span class="tag">'+['','🥉','🥈','🥇'][E.medal(s)]+' מדליה +'+E.medal(s)*4+'%</span>':'<span class="tag">'+(s.b||0)+' קרבות (5=🥉)</span>')+'<span class="tag">❤ '+stt.hp+'</span><span class="tag">💥 '+stt.dmg+'</span><span class="tag">🔫 נשק ★'+s.wep+'</span><span class="tag">🛡 שריון ★'+s.arm+'</span><div class="row" style="margin-top:6px">';
  if(tr)h+='<div class="grow bar" data-tr="'+s.id+'"><i style="width:0"></i></div><span style="font-size:12px">מתאמן...</span>';
  else{var can=E.slots(S)>0&&s.lvl<ml&&Object.keys(S.train).length<E.slots(S),tc=E.trainCost(s);
   h+='<button class="btn sm '+(can&&S.money>=tc?'':'dis')+'" data-tr2="'+s.id+'">'+(E.slots(S)<1?'אימון (צריך מגרש)':s.lvl>=ml?'רמה מקסימלית':Object.keys(S.train).length>=E.slots(S)?'אין משבצת פנויה':'אימון ₪'+fmt(tc)+' · '+E.trainTime(S,s)+' ש\'')+'</button>';}
  var wc=E.upCost(s.wep),ac=E.upCost(s.arm),cap=E.upCap(S);
  h+='<button class="btn sm '+(s.wep<cap&&S.money>=wc?'':'dis')+'" data-up="wep:'+s.id+'">'+(s.wep>=5?'נשק מקס\'':s.wep>=cap?'נשק (צריך נשקייה)':'🔫 שדרג ₪'+fmt(wc))+'</button>'+
  '<button class="btn sm '+(s.arm<cap&&S.money>=ac?'':'dis')+'" data-up="arm:'+s.id+'">'+(s.arm>=5?'שריון מקס\'':s.arm>=cap?'שריון (צריך נשקייה)':'🛡 שדרג ₪'+fmt(ac))+'</button></div></div></div>';
 });
 main.innerHTML=h;main.scrollTop=st;
 main.querySelectorAll('[data-buy]').forEach(function(b){b.onclick=function(){var t=b.dataset.buy,p=E.soldierPrice(S,t),V=E.STYPES[t].veh;if(V?E.nVeh(S)>=E.vcap(S):E.nInf(S)>=E.capacity(S)){snd('err');toast(V?'אין מקום! בנה מוסך':'אין מקום! בנה צריף');return;}if(S.money<p){snd('err');toast('אין מספיק כסף');return;}S.money-=p;S.soldiers.push({id:S.nid++,name:(V?E.STYPES[t].n:'חייל')+' '+(S.soldiers.length+1),type:t,lvl:1,wep:0,arm:0,b:0});snd('buy');save();rArmy();topbar();};});
 main.querySelectorAll('[data-tr2]').forEach(function(b){b.onclick=function(){var s=S.soldiers.filter(function(x){return x.id==b.dataset.tr2;})[0];if(b.classList.contains('dis')){snd('err');return;}var c=E.trainCost(s);S.money-=c;S.train[s.id]=Date.now()+E.trainTime(S,s)*1000;snd('buy');save();rArmy();topbar();};});
 main.querySelectorAll('[data-up]').forEach(function(b){b.onclick=function(){if(b.classList.contains('dis')){snd('err');return;}var a=b.dataset.up.split(':'),s=S.soldiers.filter(function(x){return x.id==a[1];})[0],c=E.upCost(s[a[0]]);S.money-=c;s[a[0]]++;snd('lvl');save();rArmy();topbar();};});
 main.querySelectorAll('[data-ren]').forEach(function(b){b.onclick=function(){var s=S.soldiers.filter(function(x){return x.id==b.dataset.ren;})[0];var m=modal('<h2>שם חדש לחייל</h2><input id="nm" maxlength="16" value="'+esc(s.name)+'" style="width:100%;font-size:20px;padding:8px;border-radius:10px;border:0;direction:rtl"><br><br><button class="btn green" id="ok">שמור</button>');$('ok').onclick=function(){var v=$('nm').value.trim();if(v){s.name=v.slice(0,16);save();}closeModal();rArmy();};};});
}
/* ---------- map ---------- */
var HR=62,HW=Math.sqrt(3)*HR;
function hpos(c,r){return [30+HW/2+c*HW+(r&1?HW/2:0),30+HR+r*HR*1.5];}
function hexpts(x,y){var p=[];for(var i=0;i<6;i++){var a=Math.PI/180*(60*i-30);p.push((x+(HR-2)*Math.cos(a)).toFixed(1)+','+(y+(HR-2)*Math.sin(a)).toFixed(1));}return p.join(' ');}
function rMap(){
 main.className='noscroll';
 var w=Math.ceil(60+HW*(E.COLS+.5)),hh=Math.ceil(60+HR*1.5*E.ROWS+HR*.6),o='<svg width="'+w+'" height="'+hh+'" viewBox="0 0 '+w+' '+hh+'"><rect width="100%" height="100%" fill="#2a7fb8"/>';
 var hp=hpos(E.HOME.col,E.HOME.row);
 o+='<g class="hx" data-home="1"><polygon points="'+hexpts(hp[0],hp[1])+'" fill="#3fae3f" stroke="#ffd84a" stroke-width="4"/><text x="'+hp[0]+'" y="'+(hp[1]-6)+'" text-anchor="middle" font-size="30">🏕️</text><text x="'+hp[0]+'" y="'+(hp[1]+18)+'" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">הבסיס שלי</text></g>';
 E.MAP.forEach(function(c){
  var p=hpos(c.col,c.row),won=S.conquered[c.id],can=E.canAttack(S,c);
  var fill=won?'#3fae3f':S.allies[c.id]?'#3f8ae0':c.final?'#8a1a1a':can?'hsl('+c.hue+',60%,52%)':'hsl('+c.hue+',20%,34%)';
  o+='<g class="hx" data-c="'+c.id+'"><polygon points="'+hexpts(p[0],p[1])+'" fill="'+fill+'" stroke="'+(won?'#ffd84a':can?'#fff':'#0004')+'" stroke-width="'+(can?3.5:2)+'"/>';
  if(can||won){o+='<rect x="'+(p[0]-14)+'" y="'+(p[1]-34)+'" width="28" height="18" fill="hsl('+c.hue+',70%,60%)" stroke="#fff" stroke-width="1.5"/><rect x="'+(p[0]-14)+'" y="'+(p[1]-28)+'" width="28" height="6" fill="hsl('+c.h2+',70%,55%)"/>';
   o+='<text x="'+p[0]+'" y="'+(p[1]-1)+'" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">'+c.name+'</text>';
   o+='<text x="'+p[0]+'" y="'+(p[1]+19)+'" text-anchor="middle" font-size="13" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">'+(won?'✅ נכבשה':S.allies[c.id]?'🤝 בעלת ברית':c.final?'👑💀':'💀'.repeat(Math.min(5,Math.ceil(c.tier/2))))+'</text>';}
  else o+='<text x="'+p[0]+'" y="'+(p[1]+8)+'" text-anchor="middle" font-size="24" opacity=".6">'+(c.final?'👑':'❓')+'</text>';
  o+='</g>';
 });
 if(E.isNight())o+='<rect width="100%" height="100%" fill="#001030" opacity=".35" pointer-events="none"/>';
 o+='</svg>';
 main.innerHTML='<div id="mapwrap">'+o+'</div>';
 var mw=$('mapwrap');mw.scrollLeft=-(0);mw.scrollTop=mw.scrollHeight;
 var hx=hp[0]-mw.clientWidth/2;mw.scrollLeft=hx;
 // RTL scrollLeft quirks: set both ways
 setTimeout(function(){mw.scrollLeft=hx;if(Math.abs(mw.scrollLeft-hx)>50)mw.scrollLeft=-(mw.scrollWidth-hp[0]-mw.clientWidth/2);mw.scrollTop=mw.scrollHeight;},0);
 var moved=0,sx=0,sy=0;
 mw.addEventListener('touchstart',function(e){moved=0;sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
 mw.addEventListener('touchmove',function(e){if(Math.abs(e.touches[0].clientX-sx)+Math.abs(e.touches[0].clientY-sy)>8)moved=1;},{passive:true});
 mw.querySelectorAll('[data-c]').forEach(function(g){g.addEventListener('click',function(){if(!moved)countrySheet(E.MAP[+g.dataset.c]);});});
 mw.querySelector('[data-home]').addEventListener('click',function(){if(!moved)go('base');});
}
function openLaunch(head,goLabel,cb){
 var n=E.squadSize(S),sel=S.soldiers.slice().sort(function(a,b){return (b.lvl+b.wep+b.arm)-(a.lvl+a.wep+a.arm);}).slice(0,n).map(function(s){return s.id;});
 var h=head+'<h2>בחר כוח לוחם (עד '+n+')</h2><div class="yard" style="background:#3a5a3a" id="sq">';
 S.soldiers.forEach(function(s){h+='<div class="yd" data-s="'+s.id+'" style="color:#fff;padding:4px;border-radius:10px">'+mineSprite(s.type)+'<div>'+esc(s.name)+'<br>רמה '+s.lvl+'</div></div>';});
 h+='</div><br><div class="center"><button class="btn red" id="go" style="font-size:20px;padding:12px 30px">'+goLabel+'</button></div>';
 modal(h);
 function paint(){document.querySelectorAll('#sq .yd').forEach(function(d){var on=sel.indexOf(+d.dataset.s)>=0;d.style.background=on?'#3a8a3a':'transparent';d.style.outline=on?'3px solid #ffd84a':'none';});$('go').classList.toggle('dis',!sel.length);}
 document.querySelectorAll('#sq .yd').forEach(function(d){d.onclick=function(){var id=+d.dataset.s,i=sel.indexOf(id);if(i>=0)sel.splice(i,1);else if(sel.length<n)sel.push(id);else toast('הכוח מלא');paint();};});
 paint();
 $('go').onclick=function(){if(!sel.length)return;closeModal();cb(sel.slice());};
}
function allyList(){return Object.keys(S.allies).slice(0,3).map(Number);}
function countrySheet(c){
 var won=S.conquered[c.id],can=E.canAttack(S,c),ally=S.allies[c.id];
 var D=E.DIFF[S.diff],dots=c.final?'👑💀💀💀💀💀':'💀'.repeat(Math.min(5,Math.ceil(c.tier/2)));
 var h='<div class="center"><div style="font-size:42px">'+(won?'✅':ally?'🤝':can?(c.final?'👑':'⚔️'):'🔒')+'</div><h2>'+c.name+'</h2><div class="tag">מפקד: '+c.gen+'</div><div class="tag">כוח אויב: '+dots+'</div></div>';
 if(!can){modal(h+'<p class="center">'+(c.final?'המעוז של הגנרל הענק! צריך לכבוש קודם 25 מדינות (כבשת '+E.conqN(S)+').':'אי אפשר לתקוף עדיין. קודם כבוש (או כרות ברית עם) מדינה שגובלת איתה!')+'</p>');return;}
 var rw=Math.round(c.reward*D.r*(won?.3:1)/100)*100;
 h+='<div class="center"><div class="tag">🪙 פרס: ₪'+fmt(rw)+'</div>'+(won?'<div class="tag">כבר נכבשה (פרס מופחת)</div>':'<div class="tag">מסים אחרי כיבוש: +'+c.inc+' ₪/שנייה</div>')+(S.spied[c.id]?'<div class="tag">🕵️ המרגל חשף נקודות חולשה: אויב חלש ב-20%</div>':'')+(ally?'<div class="tag">🤝 בעלת ברית (תקיפה = בגידה!)</div>':'')+'</div>';
 if(!won&&!c.final){
  var sc=Math.round(300*c.tier*(1+.2*c.tier)/50)*50,chance=Math.min(95,Math.round((.5+(E.isNight()?.3:0)+.08*E.shopLv(S,'intel'))*100));
  var ac=Math.round(c.reward*.6/100)*100;
  h+='<div class="row" style="justify-content:center;margin-top:8px">'+(S.spied[c.id]?'':'<button class="btn sm '+(S.money>=sc?'':'dis')+'" id="spy">🕵️ שלח מרגל ₪'+fmt(sc)+' ('+chance+'%'+(E.isNight()?' 🌙 לילה!':'')+')</button>')+(ally?'':'<button class="btn sm green '+(S.money>=ac&&Object.keys(S.allies).length<4?'':'dis')+'" id="ally">🤝 ברית ₪'+fmt(ac)+'</button>')+'</div>';
 }
 openLaunch(h,'⚔️ תקוף!',function(sel){startBattle(c,sel,{mode:c.final?'final':'attack',spied:!!S.spied[c.id],allies:allyList().filter(function(a){return a!==c.id;})});});
 var sp=$('spy'),al=$('ally');
 if(sp)sp.onclick=function(){if(S.money<sc){snd('err');toast('אין מספיק כסף');return;}S.money-=sc;S.spies++;topbar();
  if(Math.random()*100<chance){S.spied[c.id]=1;snd('lvl');toast('🕵️ המרגל הצליח!');}else{snd('err');toast('המרגל נתפס...');}save();checkAch();countrySheet(c);};
 if(al)al.onclick=function(){if(S.money<ac||Object.keys(S.allies).length>=4){snd('err');toast(Object.keys(S.allies).length>=4?'מקסימום 4 בריתות':'אין מספיק כסף');return;}S.money-=ac;S.allies[c.id]=1;snd('lvl');save();checkAch();topbar();countrySheet(c);};
}
/* ---------- ops (missions) ---------- */
function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function pseudo(tier,hue,seed,style){return {id:-1,name:'',tier:tier,mod:1,style:style||0,hue:hue,seed:seed,inc:0,reward:0,gen:''};}
function rOps(){
 var P=E.progTier(S),D=E.DIFF[S.diff],n=E.conqN(S),h='<h2>מבצעים מיוחדים</h2>';
 // invasion
 var left=Math.max(0,S.inv.at-Date.now());
 h+='<div class="card" style="border-color:'+(S.inv.on?'#ff6a5a':'#3f7a50')+'"><b>🚨 הגנה על הבסיס</b><div style="font-size:13px">אויבים תוקפים את הבסיס! מגדלי שמירה וחומות עוזרים ללוחמים.</div><div class="tag">מגדלים: '+E.cnt(S,'tower')+' | חומות: '+E.cnt(S,'wall')+'</div>';
 var rwI=Math.round(2500*Math.pow(1.25,P)*D.r/100)*100;
 if(n<1)h+='<div class="tag">נפתח אחרי הכיבוש הראשון</div>';
 else if(S.inv.on)h+='<div class="tag">פרס: ₪'+fmt(rwI)+'</div><br><button class="btn red" id="inv">🛡️ הגן על הבסיס!</button>';
 else h+='<div class="tag" id="invt">פלישה הבאה בעוד '+Math.ceil(left/60000)+' דקות</div>';
 h+='</div>';
 // daily
 var done=S.daily.d===todayKey(),rwD=Math.round(4000*Math.pow(1.3,P)*D.r*(1+Math.min(5,S.daily.streak)*.1)/100)*100;
 h+='<div class="card"><b>📅 אתגר יומי</b><div style="font-size:13px">אויבים חזקים ב-30%. פעם ביום! רצף ימים נותן בונוס.</div><div class="tag">רצף: '+S.daily.streak+' ימים</div><div class="tag">פרס: ₪'+fmt(rwD)+'</div><br>'+(done?'<b>✅ הושלם להיום</b>':'<button class="btn" id="daily">התחל אתגר</button>')+'</div>';
 var rwS=Math.round(3000*Math.pow(1.25,P)*D.r/100)*100,rwG=Math.round(5000*Math.pow(1.25,P)*D.r/100)*100;
 h+='<div class="card"><b>⏳ מבצע הישרדות</b><div style="font-size:13px">שרוד 60 שניות מול גלי אויבים בלתי נגמרים.</div><div class="tag">פרס: ₪'+fmt(rwS)+'</div><br>'+(n<2?'<div class="tag">נפתח אחרי כיבוש 2 מדינות</div>':'<button class="btn" id="surv">התחל</button>')+'</div>';
 h+='<div class="card"><b>🎯 ציד הגנרל</b><div style="font-size:13px">חסל את הגנרל וצבאו תוך 55 שניות!</div><div class="tag">פרס: ₪'+fmt(rwG)+'</div><br>'+(n<4?'<div class="tag">נפתח אחרי כיבוש 4 מדינות</div>':'<button class="btn" id="gen">התחל</button>')+'</div>';
 main.innerHTML=h;
 var b;
 if(b=$('inv'))b.onclick=function(){openLaunch('<h2>🛡️ הגנה על הבסיס</h2>','🛡️ להגנה!',function(sel){startBattle(pseudo(P,0,77,1),sel,{mode:'defense',reward:rwI,fmul:1});});};
 if(b=$('daily'))b.onclick=function(){openLaunch('<h2>📅 אתגר יומי</h2>','⚔️ התחל!',function(sel){startBattle(pseudo(P+1,(new Date().getDate()*37)%360,new Date().getDate()*13,new Date().getDate()%3),sel,{mode:'daily',reward:rwD,fmul:1.3});});};
 if(b=$('surv'))b.onclick=function(){openLaunch('<h2>⏳ הישרדות</h2>','⚔️ התחל!',function(sel){startBattle(pseudo(P,160,31,0),sel,{mode:'survive',reward:rwS});});};
 if(b=$('gen'))b.onclick=function(){openLaunch('<h2>🎯 ציד הגנרל</h2>','⚔️ התחל!',function(sel){startBattle(pseudo(P,280,53,2),sel,{mode:'general',reward:rwG});});};
}
/* ---------- achievements ---------- */
var ACH=[
['first','ניצחון ראשון',function(){return S.wins>=1;},2000],['a5','צבא קטן: 5 חיילים',function(){return S.soldiers.length>=5;},3000],['a10','צבא גדול: 10 חיילים',function(){return S.soldiers.length>=10;},8000],
['b6','בנאי: 6 מבנים',function(){return S.plots.filter(Boolean).length>=6;},3000],['deco','מעצב פנים: 3 קישוטים',function(){return S.plots.filter(function(p){return p&&E.BTYPES[p.t].deco;}).length>=3;},2500],
['lv5','מאמן על: חייל ברמה 5',function(){return S.soldiers.some(function(s){return s.lvl>=5;});},4000],['up3','נשק חזק: שדרוג ★3',function(){return S.soldiers.some(function(s){return s.wep>=3||s.arm>=3;});},5000],
['c5','כובש: 5 מדינות',function(){return E.conqN(S)>=5;},10000],['c20','אימפריה: 20 מדינות',function(){return E.conqN(S)>=20;},50000],['c50','שליט העולם: 50 מדינות',function(){return E.conqN(S)>=50;},200000],
['veh','רכב ראשון',function(){return E.nVeh(S)>=1;},5000],['tank','טנקיסט',function(){return S.soldiers.some(function(s){return s.type==='tank';});},8000],['spy','סוכן סמוי: 3 מרגלים',function(){return S.spies>=3;},3000],
['ally','חבר טוב: ברית ראשונה',function(){return Object.keys(S.allies).length>=1;},4000],['med','מדליה ראשונה',function(){return S.soldiers.some(function(s){return E.medal(s)>=1;});},3000],['gold','מדליית זהב',function(){return S.soldiers.some(function(s){return E.medal(s)>=3;});},15000],
['str','מתמיד: רצף 3 ימים',function(){return S.daily.streak>=3;},6000],['boss','מנצח הרובוט הענק!',function(){return !!S.finalWon;},500000]];
function checkAch(){var ch=0;ACH.forEach(function(a){if(!S.ach[a[0]]&&a[2]()){S.ach[a[0]]=1;S.money+=a[3];ch=1;snd('lvl');toast('🏅 הישג: '+a[1]+' +₪'+fmt(a[3]));}});if(ch){save();var m=$('mny');if(m)m.textContent=fmt(S.money);}}
/* ---------- battle ---------- */
var BT=null,cv,cx,raf=0,lastT=0,spd=1;
function stopBattleLoop(keep){if(!keep&&raf){cancelAnimationFrame(raf);raf=0;}}
function startBattle(c,ids,opt){
 opt=opt||{};BT=E.create(S,ids,c,S.diff,opt);BT.opt=opt;BT.ids=ids;spd=1;
 BT.ev=function(k){if(Math.random()<.5||k==='boom'||k==='air'||k==='heal'||k==='ko0'||k==='wave')snd(k==='wave'?'coin':k);};
 cur='battle';render();window.scrollTo(0,0);
}
function rBattle(){
 main.className='noscroll';
 main.innerHTML='<div style="display:flex;flex-direction:column;height:100%"><div class="bhud"><b id="bw"></b><div class="hpb"><div style="font-size:11px">הכוח שלי</div><div class="bar"><i id="hm" style="background:#6f6;width:100%"></i></div></div><div class="hpb"><div style="font-size:11px">האויב</div><div class="bar"><i id="he" style="background:#f66;width:100%"></i></div></div><button class="btn sm" id="bsp">x1</button></div><canvas id="cv" width="720" height="300"></canvas>'+
 '<div class="bhud" style="justify-content:center;flex:1;align-content:center"><button class="btn red" id="bair">✈️ תקיפה אווירית</button><button class="btn green" id="bheal">💚 ריפוי</button><button class="btn sm" id="bret">🏳️ נסיגה</button><div style="width:100%;text-align:center;font-size:12px;color:#bcd">לחץ על אויב כדי שכולם יתמקדו בו</div></div></div>';
 cv=$('cv');cx=cv.getContext('2d');
 cv.addEventListener('click',function(e){var r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*E.W,y=(e.clientY-r.top)/r.height*E.H;BT.focus=E.pickEnemy(BT,x,y);});
 $('bair').onclick=function(){E.airstrike(BT);};$('bheal').onclick=function(){if(!E.heal(BT)){snd('err');}};
 $('bsp').onclick=function(){spd=spd===1?2:1;$('bsp').textContent='x'+spd;};
 $('bret').onclick=function(){confirmBox('לסגת מהקרב?','כן, נסוג',function(){endBattle(true);});};
 BT.units.forEach(function(u){getImg(u);});for(var w=0;w<BT.waves.length;w++)BT.waves[w].forEach(function(t){getImg({side:1,type:t});});getImg({side:1,type:'grunt'});getImg({side:1,type:'esniper'});getImg({side:1,type:'tank'});
 lastT=performance.now();raf=requestAnimationFrame(loop);
}
function getImg(u){
 if(u.type==='tower'||u.type==='wall')return SP.img('s'+u.type,SP.special(u.type));
 if(u.side===0&&u.type!=='ally')return SP.img('m'+u.type,SP.mine(u.type));
 var hue=u.type==='ally'?(u.hue||140):BT.c.hue;return SP.img('e'+u.type+hue,SP.enemy(u.type,hue));
}
function loop(t){
 if(cur!=='battle'||!BT)return;
 var dt=Math.min(.05,(t-lastT)/1000)*spd;lastT=t;
 E.step(BT,dt);draw();hud();
 if(BT.over&&!BT.done){BT.done=1;setTimeout(function(){endBattle(false);},900);}
 raf=requestAnimationFrame(loop);
}
function hud(){
 var mh=0,mm=0,eh=0,em=0;
 BT.units.forEach(function(u){if(u.side===0){if(u.type!=='wall'&&u.type!=='tower'){mh+=Math.max(0,u.hp);mm+=u.max;}}else if(!u.ko||u.kot>0){eh+=Math.max(0,u.hp);em+=u.max;}});
 var w=BT.wave<0?1:BT.wave+1,m=BT.mode;
 $('bw').textContent=m==='survive'?'⏳ '+Math.max(0,Math.ceil(BT.dur-BT.t))+'ש\'':m==='general'?'🎯 '+Math.max(0,Math.ceil(BT.tl-BT.t))+'ש\'':(m==='defense'?'🛡️ ':'')+'גל '+Math.min(w,BT.waves.length)+'/'+BT.waves.length;
 $('hm').style.width=(mm?mh/mm*100:0)+'%';
 $('he').style.width=(em?(eh/(em+0.0001))*100:0)+'%';
 var a=$('bair'),hl=$('bheal');a.textContent=BT.air>0?'✈️ '+Math.ceil(BT.air)+'ש\'':'✈️ תקיפה אווירית';a.classList.toggle('dis',BT.air>0);
 var hasC=E.sumLvl(S,'clinic')>0;hl.textContent=!hasC?'💚 דורש מרפאה':BT.heal>0?'💚 '+Math.ceil(BT.heal)+'ש\'':'💚 ריפוי';hl.classList.toggle('dis',!hasC||BT.heal>0);
}
var SZ={jeep:[66,46],tank:[68,47],heli:[72,45],tower:[44,66],wall:[40,60]};
function draw(){
 var W=E.W,H=E.H,t=BT.t,night=E.isNight();
 var g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,night?'#10204a':'#7ec8f0');g.addColorStop(.45,night?'#2a3a6a':'#c8ecff');g.addColorStop(.46,night?'#3a6a3a':'#7cc46a');g.addColorStop(1,night?'#26502a':'#4c9340');
 cx.fillStyle=g;cx.fillRect(0,0,W,H);
 cx.fillStyle=night?'#2f5a30':'#6aa85a';cx.beginPath();cx.moveTo(0,135);cx.quadraticCurveTo(180,80,360,135);cx.quadraticCurveTo(540,90,720,135);cx.lineTo(720,140);cx.lineTo(0,140);cx.fill();
 if(night){cx.fillStyle='#fff';[[50,20],[200,40],[400,15],[600,35],[680,12]].forEach(function(p){cx.fillRect(p[0],p[1],2,2);});cx.fillStyle='#ffd';cx.beginPath();cx.arc(620,40,16,0,7);cx.fill();}
 else{cx.fillStyle='#fff';[[80,30],[330,50],[560,25]].forEach(function(c,i){var x=(c[0]+t*6*(i+1))%900-90;cx.beginPath();cx.arc(x,c[1],18,0,7);cx.arc(x+20,c[1]+4,14,0,7);cx.arc(x-18,c[1]+5,12,0,7);cx.fill();});}
 cx.fillStyle='#fff';cx.fillRect(10,95,3,50);cx.fillStyle='#3fae3f';cx.fillRect(13,95,20,12);
 var us=BT.units.slice().sort(function(a,b){return a.y-b.y;});
 us.forEach(function(u){
  var im=getImg(u);if(!im.complete)return;
  var big=u.type==='boss'?1.7:1,sz=SZ[u.type]||(u.type==='tank'&&u.side===1?[70,44]:[44,66]),w=sz[0]*big,h=sz[1]*big,al=u.ko?Math.max(0,u.kot):1,fl=u.fly?-38:0;
  cx.save();cx.globalAlpha=al;
  var bob=(!u.ko&&u.spd)?Math.sin(t*9+u.ph)*2:0,rec=u.atk>0?-3:0;
  cx.translate(u.x+rec*(u.side?-1:1),u.y+bob-(u.ko?(1-al)*20:0));
  cx.fillStyle='#0003';cx.beginPath();cx.ellipse(0,0,w*.4,5,0,0,7);cx.fill();
  cx.translate(0,fl);
  if(u.side===1)cx.scale(-1,1);
  if(u.hit>0)cx.filter='brightness(2)';
  cx.drawImage(im,-w/2,-h+4,w,h);cx.filter='none';
  if(u.atk>.1){cx.fillStyle='#ffe066';cx.beginPath();cx.arc(w*.45,-h*.45,5,0,7);cx.fill();}
  cx.restore();
  var top=u.y+fl-h-6;
  if(!u.ko){var bw=36*big;cx.fillStyle='#0008';cx.fillRect(u.x-bw/2,top,bw,5);cx.fillStyle=u.side?'#f55':'#5f5';cx.fillRect(u.x-bw/2,top,bw*u.hp/u.max,5);}
  else{cx.font='16px sans-serif';cx.textAlign='center';cx.fillText('💫',u.x,top+2);}
  if(BT.focus===u&&!u.ko){cx.strokeStyle='#ffd84a';cx.lineWidth=3;cx.beginPath();cx.ellipse(u.x,u.y,26,9,0,0,7);cx.stroke();}
 });
 BT.fx.forEach(function(f){
  var p=f.t/.4;
  if(f.k==='tr'){cx.strokeStyle='rgba(255,230,120,'+(1-p)+')';cx.lineWidth=2;cx.beginPath();cx.moveTo(f.x1,f.y1);cx.lineTo(f.x2,f.y2);cx.stroke();}
  else if(f.k==='boom'){cx.fillStyle='rgba(255,140,30,'+(1-p)+')';cx.beginPath();cx.arc(f.x,f.y-20,(f.r||40)*Math.min(1,p+.2)*.9,0,7);cx.fill();cx.fillStyle='rgba(255,230,100,'+(1-p)+')';cx.beginPath();cx.arc(f.x,f.y-20,(f.r||40)*.4*Math.min(1,p+.2),0,7);cx.fill();}
  else if(f.k==='poof'){cx.font=(f.big?34:20)+'px sans-serif';cx.textAlign='center';cx.globalAlpha=Math.max(0,1-p);cx.fillText(f.side?'⚙️':'⭐',f.x-10+p*20,f.y-30-p*30);cx.fillText(f.side?'🔩':'✨',f.x+12-p*16,f.y-26-p*22);cx.globalAlpha=1;}
  else if(f.k==='heal'){cx.font='18px sans-serif';cx.textAlign='center';cx.globalAlpha=Math.max(0,1-p);cx.fillText('💚',f.x,f.y-50-p*30);cx.globalAlpha=1;}
 });
 if(BT.mode!=='survive'&&BT.wt>0&&BT.wave<BT.waves.length-1&&!E.alive(BT,1).length&&BT.wave>=0){cx.fillStyle='#fff';cx.font='bold 26px sans-serif';cx.textAlign='center';cx.strokeStyle='#000';cx.lineWidth=4;cx.strokeText('הגל הבא מגיע!',W/2,60);cx.fillText('הגל הבא מגיע!',W/2,60);}
}
function endBattle(retreat){
 stopBattleLoop(false);
 var c=BT.c,o=BT.opt||{},m=BT.mode,win=!retreat&&BT.over===1,D=E.DIFF[S.diff],rw=0,msg='',first=false;
 BT.ids.forEach(function(id){var sd=S.soldiers.filter(function(x){return x.id===id;})[0];if(sd){var before=E.medal(sd);sd.b=(sd.b||0)+1;if(E.medal(sd)>before)toast('🏅 '+sd.name+' קיבל מדליה!');}});
 S.kills+=BT.kills;
 var rb=E.rank(S);
 if(win){
  if(m==='attack'||m==='final'){first=!S.conquered[c.id];rw=Math.round(c.reward*D.r*(first?1:.3)/100)*100;S.conquered[c.id]=1;delete S.allies[c.id];delete S.spied[c.id];if(m==='final'&&!S.finalWon){S.finalWon=1;}}
  else{rw=o.reward||0;}
  if(m==='daily'){var k=todayKey(),y=new Date(Date.now()-864e5);var yk=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();S.daily.streak=(S.daily.d===yk?S.daily.streak:0)+1;S.daily.d=k;}
  S.money+=rw;S.wins++;snd('win');
 }else{
  if(m==='defense'){var lost=Math.floor(S.money*.1);S.money-=lost;msg='הפולשים לקחו ₪'+fmt(lost)+' מהקופה.';}
  snd('lose');S.losses++;
 }
 if(m==='defense'){S.inv={at:Date.now()+8*60000,on:0};}
 var ra=E.rank(S);
 save();checkAch();
 cur=(m==='attack'||m==='final')?'map':'ops';render();
 var h=win?'<div class="center"><div style="font-size:60px">'+(m==='final'?'👑':'🏆')+'</div><h2>'+(m==='attack'||m==='final'?'ניצחון! '+c.name+' נכבשה!':'המבצע הצליח!')+'</h2><div class="tag">🪙 קיבלת ₪'+fmt(rw)+'</div>'+(m==='attack'&&first?'<div class="tag">+'+c.inc+' ₪ בשנייה מסים</div>':'')+(m==='final'?'<h2>🎉 ניצחת את הרובוט הענק! אתה מפקד העולם! 🎉</h2>':'')+(ra>rb?'<h2>🎖️ דרגה חדשה: '+E.RANKS[ra][0]+'!</h2>':'')+'</div>':
 '<div class="center"><div style="font-size:60px">'+(retreat?'🏳️':'😵')+'</div><h2>'+(retreat?'נסוגנו!':'הפסדנו הפעם')+'</h2><p>'+msg+' חזקו את החיילים: אימון, נשק ושריון, חנות שדרוגים, או גייסו עוד - וננסה שוב!</p></div>';
 modal(h+'<div class="row" style="justify-content:center"><button class="btn green" id="rok">ממשיכים!</button></div>');
 $('rok').onclick=function(){closeModal();if(!win&&m!=='defense')go('army');};
}
/* ---------- settings ---------- */
function rSettings(){
 var h='<h2>הגדרות</h2><div class="card"><b>רמת קושי</b><div class="dif" style="margin-top:6px">'+Object.keys(E.DIFF).map(function(k){return '<button data-d="'+k+'" class="'+(S.diff===k?'on':'')+'">'+E.DIFF[k].n+'</button>';}).join('')+'</div><div style="font-size:12px;margin-top:4px">קל: אויבים חלשים ופרסים גדולים. אגדי: אויבים חזקים מאוד!</div></div>'+
 '<div class="card row"><b class="grow">צלילים</b><button class="btn" id="bs">'+(S.sound?'🔊 פועל':'🔇 מושתק')+'</button></div>'+
 '<div class="card row"><b class="grow">מסך מלא</b><button class="btn" id="bfs">⛶ מסך מלא</button></div>'+
 '<div class="card"><b>סטטיסטיקה</b><div>🏆 ניצחונות: '+S.wins+' | 😵 הפסדים: '+S.losses+' | 🗺️ נכבשו: '+Object.keys(S.conquered).length+'/'+E.MAP.length+'</div></div>'+
 '<div class="card" style="border-color:#d3301f"><b>איפוס התקדמות</b><div style="font-size:13px;margin:4px 0">מוחק הכל וחוזר להתחלה: חייל אחד ו-20,000 ₪.</div><button class="btn red" id="breset">🗑️ אפס את כל ההתקדמות</button></div>';
 h+='<h2>🛒 חנות שדרוגים</h2>'+Object.keys(E.SHOP).map(function(k){var X=E.SHOP[k],l=E.shopLv(S,k),c=E.shopCost(S,k);return '<div class="card row"><div style="font-size:28px">'+X.i+'</div><div class="grow"><b>'+X.n+'</b> <span class="tag">'+l+'/5</span><div style="font-size:12px">'+X.d+'</div></div>'+(l>=5?'<b>מקס\'</b>':'<button class="btn sm '+(S.money>=c?'':'dis')+'" data-shop="'+k+'">₪'+fmt(c)+'</button>')+'</div>';}).join('');
 h+='<h2>🏅 הישגים ('+Object.keys(S.ach).length+'/'+ACH.length+')</h2>'+ACH.map(function(a){return '<div class="card row" style="opacity:'+(S.ach[a[0]]?1:.6)+'"><div>'+(S.ach[a[0]]?'✅':'🔒')+'</div><div class="grow">'+a[1]+'</div><span class="tag">₪'+fmt(a[3])+'</span></div>';}).join('');
 h+='<h2>🎖️ דרגה: '+E.RANKS[E.rank(S)][0]+'</h2>';
 main.innerHTML=h;
 main.querySelectorAll('[data-shop]').forEach(function(bt){bt.onclick=function(){var kk=bt.dataset.shop,c=E.shopCost(S,kk);if(S.money<c){snd('err');toast('אין מספיק כסף');return;}S.money-=c;S.shop[kk]=(S.shop[kk]||0)+1;snd('lvl');save();var st=main.scrollTop;rSettings();main.scrollTop=st;topbar();};});
 main.querySelectorAll('[data-d]').forEach(function(b){b.onclick=function(){S.diff=b.dataset.d;save();rSettings();};});
 $('bs').onclick=function(){S.sound=!S.sound;save();render();};
 $('bfs').onclick=function(){var d=document.documentElement;(d.requestFullscreen||d.webkitRequestFullscreen||function(){}).call(d);};
 $('breset').onclick=function(){confirmBox('למחוק את כל ההתקדמות?','כן, אפס הכל',function(){var d=S.diff;localStorage.removeItem(KEY);S=E.newState(d);save();go('base');});};
}
/* ---------- wiring ---------- */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-go]');if(b&&S){go(b.dataset.go);}},true);
if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
window.addEventListener('visibilitychange',function(){if(S)save();});
S=load();if(S){E.tick(S,Date.now());S.shop=S.shop||{};S.allies=S.allies||{};S.spied=S.spied||{};S.ach=S.ach||{};S.daily=S.daily||{d:'',streak:0};S.inv=S.inv||{at:0,on:0};}
cur='title';render();
window.__dbg={fast:function(){var n=0;while(!BT.over&&n++<20000)E.step(BT,.05);},go:go,render:render,get S(){return S;},E:E,startBattle:startBattle};
})();

/* מפקד הפאה - engine (pure logic, no DOM) */
(function(root){
'use strict';
var DIFF={easy:{n:'קל',e:.75,r:1.25},normal:{n:'רגיל',e:1,r:1},hard:{n:'קשה',e:1.4,r:1},legend:{n:'אגדי',e:1.9,r:.9}};
var STYPES={
 rifle:{n:'חייל רגלי',d:'מאוזן וזול',price:1500,hp:100,dmg:12,cd:.7,range:150,spd:42,splash:0},
 sniper:{n:'צלף',d:'טווח ארוך, מכה חזק',price:3500,hp:70,dmg:42,cd:1.8,range:300,spd:34,splash:0},
 heavy:{n:'לוחם כבד',d:'מגן ענק, סופג המון',price:4500,hp:280,dmg:11,cd:.9,range:110,spd:30,splash:0},
 bazooka:{n:'מטולן',d:'פיצוץ שפוגע בכמה',price:6500,hp:115,dmg:48,cd:2.3,range:210,spd:34,splash:70},
 jeep:{n:'ג׳יפ',veh:1,d:'כלי רכב: מהיר ועמיד',price:7000,hp:220,dmg:14,cd:.5,range:160,spd:70,splash:0},
 tank:{n:'טנק',veh:1,d:'כלי רכב: תותח ענק ופיצוץ',price:14000,hp:600,dmg:40,cd:1.6,range:230,spd:28,splash:45},
 heli:{n:'מסוק קרב',veh:1,fly:1,d:'כלי רכב: מעופף ויורה ללא הפסקה',price:18000,hp:350,dmg:20,cd:.5,range:200,spd:60,splash:0}
};
var SHOP={dmg:{n:'תחמושת משודרגת',d:'+8% נזק לכל הלוחמים',base:6000,i:'💥'},hp:{n:'ציוד מגן',d:'+8% חיים לכל הלוחמים',base:6000,i:'🛡️'},inc:{n:'מסחר ומסים',d:'+10% הכנסה ומסים',base:5000,i:'💰'},eng:{n:'הנדסה חכמה',d:'בנייה וגיוס זולים ב-5%',base:5000,i:'🔧'},train:{n:'אימון מואץ',d:'אימון מהיר ב-10%',base:4000,i:'⏱️'},intel:{n:'מודיעין',d:'+8% הצלחה למרגלים',base:4000,i:'🕵️'}};
var RANKS=[['טוראי',0],['רב־טוראי',2],['סמל',5],['סמל ראשון',9],['סגן',14],['סרן',20],['רב־סרן',27],['סגן־אלוף',35],['אלוף־משנה',45],['תת־אלוף',58],['אלוף',72],['מרשל הפאה',90]];
function conqN(S){return Object.keys(S.conquered).length;}
function score(S){return conqN(S)+Math.floor(S.wins/3);}
function rank(S){var r=0,sc=score(S);RANKS.forEach(function(x,i){if(sc>=x[1])r=i;});return r;}
function isNight(){var h=new Date().getHours();return h<6||h>=19;}
var ETYPES={
 grunt:{n:'חייל אויב',hp:60,dmg:8,cd:.9,range:120,spd:38},
 esniper:{n:'צלף אויב',hp:45,dmg:22,cd:2,range:280,spd:28},
 tank:{n:'טנק',hp:320,dmg:20,cd:2.2,range:200,spd:24},
 boss:{n:'גנרל',hp:700,dmg:26,cd:1.4,range:170,spd:24}
};
var BTYPES={
 barracks:{n:'צריף',cost:3000,d:'+3 מקומות לחיילים'},
 training:{n:'מגרש אימונים',cost:4000,d:'מאפשר לאמן חיילים. שדרוג = אימון מהיר ורמה מקסימלית גבוהה'},
 canteen:{n:'מטבח שדה',cost:2500,d:'מכניס כסף כל שנייה'},
 armory:{n:'נשקייה',cost:5000,d:'פותח שדרוגי נשק ושריון לחיילים'},
 clinic:{n:'מרפאה',cost:3500,d:'מרפאת חיילים בזמן קרב ומאפשרת כפתור ריפוי'},
 command:{n:'מרכז פיקוד',cost:6000,d:'+1 חייל בכוח הלוחם ותקיפה אווירית חזקה יותר'},
 garage:{n:'מוסך',cost:7000,d:'+2 מקומות לכלי רכב (ג׳יפ, טנק, מסוק)'},
 tower:{n:'מגדל שמירה',cost:3500,d:'יורה על פולשים כשתוקפים את הבסיס'},
 wall:{n:'חומה',cost:1500,d:'חומה חזקה שחוסמת פולשים כשתוקפים את הבסיס'},
 tree:{n:'עץ',cost:300,deco:1,d:'קישוט יפה לבסיס'},
 flag:{n:'דגל ענק',cost:400,deco:1,d:'קישוט: דגל מתנופף'},
 fountain:{n:'מזרקה',cost:1000,deco:1,d:'קישוט: מזרקה מבעבעת'},
 statue:{n:'פסל הפאה הענקית',cost:2500,deco:1,d:'קישוט: פסל של הפאה המפורסמת'}
};
var COLS=12,ROWS=8,NPLOTS=16,MAXB=3;
var NAMES=['גבינסטן','פלאפלנד','חומוסיה','שניצליה','בורקסטן','פיצלנד','קקטוסיה','פינגוויה','דינוזאוריה','מיקרוגלסטן','זבובלנד','לגוסטן','בננסטן','שוקולדיה','גלידלנד','פופקורניה','צ\'יפסטן','ממתקיה','עננסטן','קרטונלנד','מסטיקיה','סוכרלנד','נודלסטן','דובדבניה','אבטיחיה','תותלנד','קפוציה','כדורגליה','רולדיה','בלוניה','פעמוניה','ירקרקיה','חלולסטן','קיפודיה','צבלנד','ינשופיה','תנינסטן','ג\'ירפלנד','פילסטן','קופיפיה','דבוריה','נמלסטן','מגדלנד','חלזוניה','עכברסטן','אריסטן','זאבלנד','שועליה','דובסטן','פנדלנד','קנגרוסטן','קואלניה','טוקנלנד','פלמינגיה','תוכיסטן','יענסטן','חתוליה','כלבלנד','סוסיה','פרתסטן','עיזסטן','תרנגוליה','ברווזלנד','אווזיה','דגיגסטן','כרישלנד','מדוזיה','תמסחיה','צדפסטן','דולפיניה','קשקשיה','פיקנטיה','טרללנד','הופלה','זיפזופיה','בומבסטן','פרפרלנד','לולינית','גמבליה','חתחתיה','שפיצלנד','בלגניה','קלולסטן','פיפלנד','טוסטיה','פלפליה','שקשוקיה','מלפפוניה','עגבניסטן','זיתיה','תמריסטן','חצילסטן','בצליה','גזרלנד','סלטיה','פיתיסטן','מרקיה'];
var GEN=['גנרל','אלוף','רב־סרן','קולונל','מרשל'];
var GENN=['נחירה','פיקוסון','גרגרן','זעמוני','שפמפם','קרקרוני','בולבול','טרטור'];
function rng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function cube(c,r){var x=c-((r-(r&1))>>1);return [x,-x-r,r];}
function hexd(a,b){return Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[2]-b[2]));}
var HOME={col:6,row:7};
function genMap(){
 var R=rng(20261030),list=[],hc=cube(HOME.col,HOME.row),i=0;
 for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
  if(c===HOME.col&&r===HOME.row)continue;
  var cb=cube(c,r),t=hexd(cb,hc),mod=.85+R()*.3;
  list.push({id:i,name:NAMES[i%NAMES.length],col:c,row:r,cube:cb,tier:t,hue:Math.floor(R()*360),h2:Math.floor(R()*360),style:Math.floor(R()*3),mod:mod,
   gen:GEN[Math.floor(R()*GEN.length)]+' '+GENN[Math.floor(R()*GENN.length)],
   reward:Math.round(3000*Math.pow(1.3,t-1)*mod/100)*100,inc:Math.round(1.5*Math.pow(1.2,t-1)*mod*10)/10,seed:1000+i*7});
  i++;
 }
 var fc=list.filter(function(a){return a.col===6&&a.row===0;})[0];
 fc.final=1;fc.name='רובוטופיה';fc.gen='הרובוט הענק';fc.tier=10;fc.mod=1.3;fc.reward=300000;fc.inc=40;fc.hue=0;
 list.forEach(function(a){a.nb=[];list.forEach(function(b){if(a!==b&&hexd(a.cube,b.cube)===1)a.nb.push(b.id);});a.nearHome=hexd(a.cube,hc)===1;});
 return list;
}
var MAP=genMap();
function sumLvl(S,t){var s=0;S.plots.forEach(function(p){if(p&&p.t===t)s+=p.l;});return s;}
function cnt(S,t){var s=0;S.plots.forEach(function(p){if(p&&p.t===t)s++;});return s;}
function maxLvl(S,t){var s=0;S.plots.forEach(function(p){if(p&&p.t===t&&p.l>s)s=p.l;});return s;}
function newState(diff){
 return {v:1,money:20000,diff:diff||'normal',sound:true,nid:2,
  soldiers:[{id:1,name:'החייל עם הפאה',type:'rifle',lvl:1,wep:0,arm:0}],
  plots:new Array(NPLOTS).fill(null),conquered:{},allies:{},spied:{},shop:{},ach:{},daily:{d:'',streak:0},inv:{at:0,on:0},train:{},pile:0,last:Date.now(),wins:0,losses:0,kills:0,spies:0,won:0};
}
function shopLv(S,k){return (S.shop&&S.shop[k])||0;}
function shopCost(S,k){return Math.round(SHOP[k].base*Math.pow(1.8,shopLv(S,k))/100)*100;}
function nInf(S){return S.soldiers.filter(function(x){return !STYPES[x.type].veh;}).length;}
function nVeh(S){return S.soldiers.length-nInf(S);}
function capacity(S){return 2+3*sumLvl(S,'barracks');}
function vcap(S){return 2*sumLvl(S,'garage');}
function squadSize(S){return Math.min(8,3+sumLvl(S,'command'));}
function slots(S){return cnt(S,'training');}
function maxSoldierLvl(S){return Math.min(10,sumLvl(S,'training')?2+2*sumLvl(S,'training'):1);}
function upCap(S){return Math.min(5,2*sumLvl(S,'armory'));}
function taxes(S){var s=0;for(var k in S.conquered){s+=MAP[k].inc;}for(var a in S.allies){s+=MAP[a].inc*.5;}return s*(1+.1*shopLv(S,'inc'));}
function income(S){return (2+6*sumLvl(S,'canteen'))*(1+.1*shopLv(S,'inc'))+taxes(S);}
function pileCap(S){return income(S)*900;}
function soldierPrice(S,t){var v=STYPES[t].veh;return Math.round(STYPES[t].price*Math.pow(v?1.15:1.12,(v?nVeh(S):nInf(S))-(v?0:1))*(1-.05*shopLv(S,'eng'))/50)*50;}
function buildCost(S,t){return Math.round(BTYPES[t].cost*Math.pow(1.35,cnt(S,t))*(1-.05*shopLv(S,'eng'))/50)*50;}
function upgradeBCost(S,p){return Math.round(BTYPES[p.t].cost*1.6*Math.pow(1.9,p.l-1)/50)*50;}
function trainCost(sd){return 500*sd.lvl;}
function trainTime(S,sd){return Math.max(2,Math.round(6*sd.lvl*(1-.1*shopLv(S,'train'))/(1+.3*(maxLvl(S,'training')-1))));}
function upCost(tier){return Math.round(1500*Math.pow(tier+1,1.4)/100)*100;}
function medal(sd){var b=sd.b||0;return b>=40?3:b>=15?2:b>=5?1:0;}
function stats(sd,S){
 var b=STYPES[sd.type],m=1+.15*(sd.lvl-1),md=1+.04*medal(sd)*1,dm=S?1+.08*shopLv(S,'dmg'):1,hm=S?1+.08*shopLv(S,'hp'):1;
 return {hp:Math.round(b.hp*m*(1+.25*sd.arm)*md*hm),dmg:+(b.dmg*m*(1+.25*sd.wep)*md*dm).toFixed(1)};
}
function tick(S,now){
 var dt=Math.max(0,Math.min((now-S.last)/1000,60*60*12));S.last=now;
 var inc=income(S);S.pile=Math.min(pileCap(S),S.pile+inc*dt);
 var done=[];
 for(var id in S.train){if(S.train[id]<=now){var sd=S.soldiers.filter(function(x){return x.id==id;})[0];if(sd&&sd.lvl<maxSoldierLvl(S))sd.lvl++;delete S.train[id];done.push(sd);}}
 return done;
}
function canAttack(S,c){
 if(S.conquered[c.id])return true;
 if(c.final)return conqN(S)>=25;
 if(S.allies[c.id])return true;
 if(c.nearHome)return true;
 return c.nb.some(function(n){return S.conquered[n]||S.allies[n];});
}
function progTier(S){return Math.max(1,Math.min(9,1+Math.floor(conqN(S)/6)));}
/* ---------- battle ---------- */
var W=720,H=300;
function genWaves(c,diff,mode){
 var R=rng(c.seed+Math.floor(Math.random()*9999)),t=c.tier,f=Math.pow(1.2,t-1)*c.mod*DIFF[diff].e,waves=[],nw=t<3?2:(t<7?3:4);
 if(c.final)nw=5;
 var base=Math.min(14,Math.round(3+t*.7));
 if(mode==='general'){return {waves:[['boss','grunt','grunt','grunt']],f:f};}
 if(mode==='survive'){return {waves:[[]],f:f};}
 for(var w=0;w<nw;w++){
  var n=Math.max(2,Math.round(base*(.6+.2*w))),arr=[];
  for(var i=0;i<n;i++){
   var r=R(),ty='grunt';
   if(t>=3&&r<.1+.12*(c.style===2))ty='tank';else if(r<.3+.12*(c.style===1))ty='esniper';
   arr.push(ty);
  }
  if(w===nw-1&&t>=2)arr.push('boss');
  if(c.final&&w>=3){arr.push('boss');arr.push('tank');}
  waves.push(arr);
 }
 return {waves:waves,f:f};
}
function mk(side,type,x,y,st,extra){
 var u={side:side,type:type,x:x,y:y,hp:st.hp,max:st.hp,dmg:st.dmg,cd:st.cd,cdt:Math.random()*st.cd,range:st.range,spd:st.spd,splash:st.splash||0,ko:false,kot:0,hit:0,atk:0,ph:Math.random()*6};
 for(var k in extra)u[k]=extra[k];return u;
}
function create(S,ids,c,diff,opt){
 opt=opt||{};var mode=opt.mode||'attack';
 var gw=genWaves(c,diff,mode),units=[],f=gw.f*(opt.fmul||1),spied=!!opt.spied;
 var fx={heavy:150,rifle:100,bazooka:70,sniper:45,jeep:170,tank:130,heli:80};
 ids.forEach(function(id,i){
  var sd=S.soldiers.filter(function(x){return x.id===id;})[0],b=STYPES[sd.type],s=stats(sd,S);
  units.push(mk(0,sd.type,(mode==='defense'?150:0)+fx[sd.type]-(i%3)*14,120+((i*37)%5)*34,{hp:s.hp,dmg:s.dmg,cd:b.cd,range:b.range,spd:b.spd,splash:b.splash},{sid:id,name:sd.name,fly:b.fly}));
 });
 var al=opt.allies||[];
 al.forEach(function(a,i){var C=MAP[a],ff=Math.pow(1.2,C.tier-1)*.9;units.push(mk(0,'ally',120+i*16,130+i*50,{hp:Math.round(60*ff*1.5),dmg:+(9*Math.pow(ff,.85)).toFixed(1),cd:.9,range:130,spd:38},{hue:C.hue,name:C.name}));});
 if(mode==='defense'){
  S.plots.forEach(function(p,i){if(!p)return;
   if(p.t==='tower')units.push(mk(0,'tower',30,150+(i%3)*30,{hp:400*p.l,dmg:16*p.l,cd:.7,range:280,spd:0},{}));
   if(p.t==='wall')units.push(mk(0,'wall',210+(i%2)*12,110+(i%4)*34,{hp:600*p.l,dmg:0,cd:99,range:0,spd:0},{}));
  });
 }
 var B={S:S,c:c,diff:diff,f:f,units:units,waves:gw.waves,wave:-1,wt:.8,fx:[],t:0,over:0,focus:null,air:0,heal:0,mode:mode,hpm:spied?.8:1,
  regen:.01*sumLvl(S,'clinic'),airPct:.25+.05*sumLvl(S,'command'),dur:mode==='survive'?60:0,tl:mode==='general'?55:0,sp:1,kills:0};
 return B;
}
function spawn(B){
 B.wave++;var arr=B.waves[B.wave];
 arr.forEach(function(ty,i){spawnOne(B,ty,i);});
}
function spawnOne(B,ty,i){
 var b=ETYPES[ty],f=B.f,y=110+((i*53)%5)*34;
 var u=mk(1,ty,W+30+i*24+Math.random()*30,y,{hp:Math.round(b.hp*f*B.hpm),dmg:+(b.dmg*Math.pow(f,.85)).toFixed(1),cd:b.cd,range:b.range,spd:b.spd},{});
 if(ty==='boss')u.big=1;
 B.units.push(u);
}
function alive(B,side){return B.units.filter(function(u){return u.side===side&&!u.ko;});}
function dmgTo(B,t,d){
 if(t.ko)return;t.hp-=d;t.hit=.15;
 if(t.hp<=0){t.hp=0;t.ko=true;t.kot=1;B.fx.push({k:'poof',x:t.x,y:t.y,t:0,side:t.side,big:t.big});if(t.side===1){B.kills++;B.ev&&B.ev('ko1');}else B.ev&&B.ev('ko0');}
}
function step(B,dt){
 if(B.over)return;
 B.t+=dt;
 var en=alive(B,1),my=alive(B,0).filter(function(u){return u.type!=='wall';}),all0=alive(B,0);
 if(B.air>0)B.air-=dt;if(B.heal>0)B.heal-=dt;
 if(!my.length){B.over=-1;return;}
 if(B.mode==='survive'){
  if(B.t>=B.dur){B.over=1;return;}
  B.sp-=dt;if(B.sp<=0){B.sp=3.5;var n=2+Math.floor(B.c.tier/3);for(var q=0;q<n;q++)spawnOne(B,Math.random()<.2&&B.c.tier>=3?'tank':Math.random()<.25?'esniper':'grunt',q);}
 }else{
  if(B.mode==='general'&&B.t>B.tl){B.over=-1;return;}
  if(!en.length){
   if(B.wave>=B.waves.length-1){B.over=1;return;}
   B.wt-=dt;if(B.wt<=0){spawn(B);B.wt=1.6;B.ev&&B.ev('wave');}
  }
 }
 var u,i,j;
 for(i=0;i<B.units.length;i++){
  u=B.units[i];
  if(u.hit>0)u.hit-=dt;if(u.atk>0)u.atk-=dt;
  if(u.ko){u.kot-=dt;continue;}
  if(u.side===0&&B.regen&&u.hp<u.max&&u.type!=='wall'&&u.type!=='tower')u.hp=Math.min(u.max,u.hp+u.max*B.regen*dt);
  var foes=u.side===0?en:all0;if(!foes.length)continue;
  if(!u.dmg&&!u.spd)continue;
  var tg=null,bd=1e9;
  if(u.side===0&&B.focus&&!B.focus.ko&&Math.abs(B.focus.x-u.x)<=u.range)tg=B.focus;
  else for(j=0;j<foes.length;j++){var d=Math.abs(foes[j].x-u.x);if(d<bd){bd=d;tg=foes[j];}}
  var dist=Math.abs(tg.x-u.x);
  u.cdt-=dt;
  if(dist<=u.range){
   if(u.cdt<=0&&u.dmg>0){
    u.cdt=u.cd;u.atk=.18;
    if(u.splash){for(j=0;j<foes.length;j++)if(Math.abs(foes[j].x-tg.x)<=u.splash)dmgTo(B,foes[j],u.dmg);B.fx.push({k:'boom',x:tg.x,y:tg.y,t:0,r:u.splash});B.ev&&B.ev('boom');}
    else{dmgTo(B,tg,u.dmg);B.fx.push({k:'tr',x1:u.x,y1:u.y-24,x2:tg.x,y2:tg.y-22,t:0});B.ev&&B.ev(u.side?'shoot1':'shoot0');}
   }
  }else if(u.spd){
   u.x+=(tg.x>u.x?1:-1)*u.spd*dt;
  }
 }
 B.units=B.units.filter(function(x){return !(x.ko&&x.kot<=0&&x.side===1);});
 if(B.fx.length>50)B.fx.splice(0,B.fx.length-50);
 for(i=B.fx.length-1;i>=0;i--){B.fx[i].t+=dt;if(B.fx[i].t>.6)B.fx.splice(i,1);}
}
function airstrike(B){
 if(B.air>0||B.over)return false;B.air=22;
 alive(B,1).forEach(function(u){dmgTo(B,u,u.max*(u.big?B.airPct*.4:B.airPct));B.fx.push({k:'boom',x:u.x,y:u.y,t:0,r:40});});
 B.ev&&B.ev('air');return true;
}
function heal(B){
 if(B.heal>0||B.over||sumLvl(B.S,'clinic')<1)return false;B.heal=30;
 alive(B,0).forEach(function(u){if(u.type==='wall'||u.type==='tower')return;u.hp=Math.min(u.max,u.hp+u.max*.4);B.fx.push({k:'heal',x:u.x,y:u.y,t:0});});
 B.ev&&B.ev('heal');return true;
}
function pickEnemy(B,x,y){var best=null,bd=60;alive(B,1).forEach(function(u){var d=Math.hypot(u.x-x,(u.y-30)-y);if(d<bd){bd=d;best=u;}});return best;}
root.E={DIFF:DIFF,STYPES:STYPES,ETYPES:ETYPES,BTYPES:BTYPES,SHOP:SHOP,RANKS:RANKS,MAP:MAP,COLS:COLS,ROWS:ROWS,NPLOTS:NPLOTS,MAXB:MAXB,HOME:HOME,W:W,H:H,
 newState:newState,capacity:capacity,vcap:vcap,nInf:nInf,nVeh:nVeh,squadSize:squadSize,slots:slots,maxSoldierLvl:maxSoldierLvl,upCap:upCap,income:income,taxes:taxes,pileCap:pileCap,
 soldierPrice:soldierPrice,buildCost:buildCost,upgradeBCost:upgradeBCost,trainCost:trainCost,trainTime:trainTime,upCost:upCost,stats:stats,tick:tick,medal:medal,
 shopLv:shopLv,shopCost:shopCost,conqN:conqN,rank:rank,score:score,isNight:isNight,progTier:progTier,
 canAttack:canAttack,create:create,step:step,airstrike:airstrike,heal:heal,pickEnemy:pickEnemy,sumLvl:sumLvl,cnt:cnt,alive:alive};
if(typeof module!=='undefined')module.exports=root.E;
})(typeof window!=='undefined'?window:globalThis);

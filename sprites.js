(function(){
function svg(vb,inner){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'">'+inner+'</svg>';}
var SK='#f2c392';
function face(){return '<circle cx="50" cy="62" r="20" fill="'+SK+'" stroke="#a8703f" stroke-width="2"/><circle cx="43" cy="61" r="5.5" fill="#fff"/><circle cx="58" cy="61" r="5.5" fill="#fff"/><circle cx="45" cy="62" r="2.7" fill="#222"/><circle cx="60" cy="62" r="2.7" fill="#222"/>';}
function soldier(type,col,enemy,boss){
 var o='<ellipse cx="50" cy="146" rx="26" ry="4" fill="#0003"/>';
 o+='<rect x="35" y="108" width="12" height="32" rx="4" fill="#3a4630"/><rect x="53" y="108" width="12" height="32" rx="4" fill="#3a4630"/><ellipse cx="40" cy="141" rx="10" ry="5" fill="#222"/><ellipse cx="60" cy="141" rx="10" ry="5" fill="#222"/>';
 o+='<rect x="29" y="78" width="42" height="40" rx="12" fill="'+col+'" stroke="#0004" stroke-width="2"/><rect x="29" y="104" width="42" height="6" fill="#5a3b1c"/><path d="M50 84l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffd84a"/>';
 if(type==='sniper'||type==='esniper')o+='<rect x="52" y="90" width="48" height="6" rx="3" fill="#2a2a2a"/><rect x="66" y="84" width="14" height="6" rx="3" fill="#111"/><rect x="62" y="94" width="10" height="10" fill="#444"/>';
 else if(type==='bazooka')o+='<rect x="34" y="76" width="64" height="14" rx="6" fill="#58607a" stroke="#222" stroke-width="2"/><rect x="92" y="73" width="8" height="20" rx="3" fill="#2a2a3a"/><circle cx="46" cy="83" r="3" fill="#ff7a00"/>';
 else if(type==='heavy')o+='<rect x="54" y="82" width="30" height="46" rx="10" fill="#8ea3bf" stroke="#344" stroke-width="3"/><path d="M69 92l4 8h8l-6 5 2 8-8-5-8 5 2-8-6-5h8z" fill="#ffd84a"/><rect x="48" y="92" width="28" height="5" rx="2" fill="#222"/>';
 else o+='<rect x="52" y="90" width="38" height="7" rx="3" fill="#2a2a2a"/><rect x="60" y="97" width="8" height="10" fill="#444"/>';
 o+='<circle cx="62" cy="96" r="6" fill="'+SK+'"/>';
 o+=face();
 o+='<path d="M43 73q7 5 14 0" stroke="#7a2a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
 if(!enemy){
  o+='<path d="M30 54C14 34 22 6 52 3C76 0 98 14 92 34C88 45 78 47 70 43C78 32 72 20 60 19C47 18 44 30 52 38C56 42 58 48 50 50C44 50 36 56 30 54Z" fill="#3a2212" stroke="#1b0e06" stroke-width="2"/><path d="M38 24C46 10 68 8 80 18" stroke="#7a4a28" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 8C66 6 74 8 78 14" stroke="#9a6a40" stroke-width="2" fill="none"/>';
  o+='<ellipse cx="62" cy="3" rx="13" ry="6" fill="#5b6b3a" stroke="#222" stroke-width="2" transform="rotate(-18 62 3)"/>';
 }else{
  o+='<path d="M28 58C28 34 72 34 72 58Z" fill="'+col+'" stroke="#0006" stroke-width="2.5"/><rect x="26" y="55" width="48" height="5" rx="2" fill="#0005"/>';
  o+='<path d="M38 53l12 5M62 53l-12 5" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>';
  if(boss)o+='<path d="M36 72q14 -7 28 0q-14 6 -28 0z" fill="#222"/><circle cx="36" cy="95" r="4" fill="#ffd84a"/><circle cx="44" cy="99" r="4" fill="#f55"/><path d="M30 46h40l-6-14H36z" fill="#222"/><circle cx="50" cy="40" r="5" fill="#ffd84a"/>';
 }
 return svg('0 0 100 150',o);
}
function tank(col){
 var o='<ellipse cx="80" cy="96" rx="64" ry="5" fill="#0003"/>';
 o+='<rect x="12" y="68" width="136" height="28" rx="14" fill="#333"/>';
 for(var i=0;i<5;i++)o+='<circle cx="'+(30+i*25)+'" cy="82" r="9" fill="#666" stroke="#222" stroke-width="2"/>';
 o+='<rect x="26" y="46" width="108" height="28" rx="8" fill="'+col+'" stroke="#0006" stroke-width="3"/><rect x="52" y="22" width="56" height="30" rx="12" fill="'+col+'" stroke="#0006" stroke-width="3"/>';
 o+='<rect x="106" y="30" width="48" height="9" rx="4" fill="#444"/><circle cx="68" cy="34" r="6" fill="'+SK+'"/><circle cx="66" cy="33" r="2" fill="#222"/><circle cx="72" cy="33" r="2" fill="#222"/><path d="M60 28l12 4" stroke="#222" stroke-width="3"/>';
 return svg('0 0 160 100',o);
}
var C={};
function url(s){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);}
function mineSvg(t){return soldier(t,{rifle:'#6e8b3d',sniper:'#3d6e8b',heavy:'#8b5e3d',bazooka:'#8b3d6e'}[t],0);}
function enemySvg(t,hue){var col='hsl('+hue+',55%,48%)';return t==='tank'?tank(col):soldier(t==='boss'?'rifle':t==='esniper'?'esniper':'rifle',col,1,t==='boss');}
function img(key,s){if(!C[key]){var i=new Image();i.src=url(s);C[key]=i;}return C[key];}
var B={
barracks:'<rect x="12" y="44" width="76" height="44" rx="4" fill="#d9b77a" stroke="#6b4a1e" stroke-width="3"/><path d="M6 46L50 14l44 32z" fill="#b5442e" stroke="#6b2a1a" stroke-width="3"/><rect x="42" y="62" width="16" height="26" rx="3" fill="#6b4a1e"/><rect x="20" y="54" width="14" height="12" fill="#9bd" stroke="#345" stroke-width="2"/><rect x="66" y="54" width="14" height="12" fill="#9bd" stroke="#345" stroke-width="2"/><path d="M50 14V2l14 5-14 5" fill="#ffd84a"/>',
training:'<rect x="10" y="82" width="80" height="8" fill="#9a7a4a"/><rect x="47" y="36" width="6" height="48" fill="#6b4a1e"/><circle cx="50" cy="30" r="24" fill="#fff" stroke="#333" stroke-width="3"/><circle cx="50" cy="30" r="16" fill="#e33"/><circle cx="50" cy="30" r="8" fill="#fff"/><circle cx="50" cy="30" r="3" fill="#e33"/><rect x="10" y="70" width="22" height="14" rx="6" fill="#c9a76a" stroke="#6b4a1e" stroke-width="2"/><rect x="68" y="70" width="22" height="14" rx="6" fill="#c9a76a" stroke="#6b4a1e" stroke-width="2"/>',
canteen:'<rect x="14" y="50" width="72" height="38" fill="#e8c88a" stroke="#6b4a1e" stroke-width="3"/><path d="M8 52L16 28h68l8 24z" fill="#e33" stroke="#822" stroke-width="3"/><path d="M26 28l-4 24M42 28l-2 24M58 28l2 24M74 28l4 24" stroke="#fff" stroke-width="5"/><circle cx="50" cy="72" r="10" fill="#ffd84a" stroke="#b36a00" stroke-width="3"/><text x="50" y="77" font-size="14" text-anchor="middle" fill="#8a5400" font-weight="900">₪</text><g class="steam"><path d="M84 20q-6-6 0-12q6-6 0-12" stroke="#fff" stroke-width="3" fill="none" transform="translate(0 14)"/></g>',
armory:'<path d="M10 90V50q40-34 80 0v40z" fill="#8a96a0" stroke="#3a444c" stroke-width="3"/><rect x="38" y="62" width="24" height="28" fill="#2a3138"/><path d="M50 22l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#ffd84a" stroke="#8a5400" stroke-width="2"/><rect x="14" y="76" width="18" height="14" fill="#8b6a3a" stroke="#4a3418" stroke-width="2"/>',
clinic:'<rect x="12" y="34" width="76" height="54" rx="6" fill="#fff" stroke="#999" stroke-width="3"/><rect x="42" y="42" width="16" height="36" rx="3" fill="#e33"/><rect x="32" y="52" width="36" height="16" rx="3" fill="#e33"/><rect x="40" y="80" width="20" height="8" fill="#9bd"/><rect x="8" y="28" width="84" height="10" rx="4" fill="#e33"/>',
command:'<rect x="40" y="44" width="20" height="46" fill="#7a8a96" stroke="#334" stroke-width="3"/><rect x="26" y="30" width="48" height="18" rx="5" fill="#5b6b7a" stroke="#334" stroke-width="3"/><g class="dish"><path d="M34 22q16 -26 32 0z" fill="#ddd" stroke="#555" stroke-width="3"/></g><path d="M50 4V-6l12 4-12 4" fill="#ffd84a" transform="translate(0 8)"/><rect x="30" y="84" width="40" height="8" fill="#4a3418"/>'
};
function bsvg(t){return svg('0 0 100 100',B[t]);}
window.SP={mine:mineSvg,enemy:enemySvg,img:img,bsvg:bsvg,url:url};
})();

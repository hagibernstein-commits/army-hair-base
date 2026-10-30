(function(){
var SKN='#f2c392';
function svg(vb,inner){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'">'+inner+'</svg>';}
function head(){return '<circle cx="50" cy="62" r="20" fill="'+SKN+'" stroke="#a8703f" stroke-width="3"/><circle cx="43" cy="61" r="5.5" fill="#fff"/><circle cx="58" cy="61" r="5.5" fill="#fff"/><circle cx="45" cy="62" r="2.7" fill="#222"/><circle cx="60" cy="62" r="2.7" fill="#222"/><path d="M43 73q7 5 14 0" stroke="#7a2a1a" stroke-width="3" fill="none"/><path d="M30 54C14 34 22 6 52 3C76 0 98 14 92 34C88 45 78 47 70 43C78 32 72 20 60 19C47 18 44 30 52 38C56 42 58 48 50 50C44 50 36 56 30 54Z" fill="#3a2212" stroke="#1b0e06" stroke-width="3"/><path d="M38 24C46 10 68 8 80 18" stroke="#7a4a28" stroke-width="4" fill="none" stroke-linecap="round"/>';}
function driver(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+s+')">'+head()+'</g>';}
function jeep(){var o='<ellipse cx="90" cy="118" rx="70" ry="5" fill="#0003"/>';
 o+=driver(52,-6,.62);
 o+='<rect x="14" y="62" width="150" height="38" rx="12" fill="#5d7a35" stroke="#2a3a14" stroke-width="3"/><rect x="40" y="48" width="60" height="22" rx="6" fill="#9bd" fill-opacity=".6" stroke="#2a3a14" stroke-width="3"/><rect x="30" y="64" width="124" height="10" fill="#4a6428"/><path d="M80 80l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffd84a"/><rect x="150" y="54" width="22" height="10" rx="4" fill="#333"/>';
 o+='<circle cx="42" cy="104" r="16" fill="#222"/><circle cx="42" cy="104" r="7" fill="#999"/><circle cx="136" cy="104" r="16" fill="#222"/><circle cx="136" cy="104" r="7" fill="#999"/>';
 return svg('0 0 180 125',o);}
function mtank(){var o='<ellipse cx="90" cy="118" rx="76" ry="5" fill="#0003"/>';
 o+=driver(58,-18,.6);
 o+='<rect x="12" y="84" width="150" height="30" rx="15" fill="#333"/>';for(var i=0;i<5;i++)o+='<circle cx="'+(34+i*28)+'" cy="99" r="10" fill="#777" stroke="#222" stroke-width="2"/>';
 o+='<rect x="26" y="62" width="122" height="30" rx="8" fill="#5d7a35" stroke="#2a3a14" stroke-width="3"/><rect x="52" y="40" width="70" height="30" rx="14" fill="#6d8a45" stroke="#2a3a14" stroke-width="3"/><rect x="112" y="48" width="62" height="10" rx="4" fill="#444"/><circle cx="87" cy="55" r="5" fill="#ffd84a"/>';
 return svg('0 0 180 125',o);}
function heli(){var o='<ellipse cx="90" cy="122" rx="40" ry="4" fill="#0003"/>';
 o+='<rect x="30" y="22" width="120" height="5" rx="2" fill="#555"/><rect x="86" y="26" width="8" height="16" fill="#555"/>';
 o+='<path d="M20 70q0-36 60-36q50 0 60 30l30 -4v12l-30 6q-10 14 -60 14q-60 0-60 -22z" fill="#8b3d6e" stroke="#4a1a38" stroke-width="3"/>';
 o+='<ellipse cx="72" cy="64" rx="34" ry="24" fill="#cde" fill-opacity=".7" stroke="#4a1a38" stroke-width="3"/>'+driver(46,2,.6);
 o+='<rect x="52" y="98" width="86" height="5" rx="2" fill="#333"/><path d="M70 90V100M120 90V100" stroke="#333" stroke-width="4"/><circle cx="186" cy="58" r="6" fill="#ffd84a"/>';
 return svg('0 0 200 125',o);}
var oldMine=SP.mine,oldEnemy=SP.enemy;
function tower(){return svg('0 0 100 150','<ellipse cx="50" cy="146" rx="30" ry="4" fill="#0003"/><path d="M26 140L34 50h32l8 90z" fill="#9a8a7a" stroke="#4a3a2a" stroke-width="3"/><rect x="22" y="36" width="56" height="20" rx="4" fill="#7a6a5a" stroke="#4a3a2a" stroke-width="3"/><rect x="40" y="18" width="30" height="8" rx="3" fill="#333"/><rect x="38" y="24" width="24" height="14" fill="#5b6b3a"/><path d="M50 36V4l24 8-24 8" fill="#3fae3f"/>');}
function wall(){return svg('0 0 100 150','<ellipse cx="50" cy="146" rx="30" ry="4" fill="#0003"/><rect x="26" y="50" width="48" height="92" rx="6" fill="#aaa" stroke="#555" stroke-width="3"/><path d="M26 80h48M26 110h48M50 50v30M38 80v30M62 80v30M50 110v32" stroke="#666" stroke-width="3"/>');}
SP.mine=function(t){if(t==='jeep')return jeep();if(t==='tank')return mtank();if(t==='heli')return heli();return oldMine(t);};
SP.enemy=function(t,h){if(t==='ally')return oldEnemy('grunt',h);return oldEnemy(t,h);};
SP.special=function(t){return t==='tower'?tower():wall();};
var extra={
garage:'<rect x="10" y="40" width="80" height="50" fill="#9aa5b0" stroke="#3a444c" stroke-width="3"/><path d="M6 42L50 20l44 22z" fill="#667" stroke="#334" stroke-width="3"/><rect x="22" y="54" width="56" height="36" fill="#445" stroke="#223" stroke-width="2"/><path d="M22 62h56M22 70h56M22 78h56" stroke="#889" stroke-width="2"/>',
tower:'<path d="M28 92L36 40h28l8 52z" fill="#9a8a7a" stroke="#4a3a2a" stroke-width="3"/><rect x="24" y="28" width="52" height="16" rx="4" fill="#7a6a5a" stroke="#4a3a2a" stroke-width="3"/><rect x="40" y="12" width="26" height="8" rx="3" fill="#333"/><rect x="38" y="18" width="22" height="12" fill="#5b6b3a"/>',
wall:'<rect x="6" y="46" width="88" height="46" rx="5" fill="#aaa" stroke="#555" stroke-width="3"/><path d="M6 61h88M6 77h88M34 46v15M62 46v15M20 61v16M48 61v16M76 61v16M34 77v15M62 77v15" stroke="#666" stroke-width="3"/>',
tree:'<rect x="44" y="60" width="12" height="30" fill="#7a4a1e"/><circle cx="50" cy="40" r="26" fill="#2f9a3a" stroke="#1a5a22" stroke-width="3"/><circle cx="38" cy="50" r="16" fill="#3fb04a"/><circle cx="62" cy="48" r="16" fill="#3fb04a"/>',
flag:'<rect x="30" y="10" width="5" height="80" fill="#ccc"/><path d="M35 14q22-12 44 0v28q-22-12-44 0z" fill="#3fae3f" stroke="#1a5a22" stroke-width="3"><animate attributeName="d" dur="1.5s" repeatCount="indefinite" values="M35 14q22-12 44 0v28q-22-12-44 0z;M35 14q22 12 44 0v28q-22 12-44 0z;M35 14q22-12 44 0v28q-22-12-44 0z"/></path><circle cx="32" cy="10" r="5" fill="#ffd84a"/>',
fountain:'<ellipse cx="50" cy="78" rx="40" ry="14" fill="#9ab" stroke="#567" stroke-width="3"/><ellipse cx="50" cy="75" rx="32" ry="9" fill="#4ad"/><rect x="46" y="40" width="8" height="35" fill="#9ab"/><path d="M50 40q-20-14-26 14M50 40q20-14 26 14" stroke="#7cf" stroke-width="4" fill="none"><animate attributeName="stroke-opacity" dur="1s" repeatCount="indefinite" values="1;.4;1"/></path>',
statue:'<rect x="24" y="76" width="52" height="16" fill="#999" stroke="#555" stroke-width="3"/><rect x="34" y="64" width="32" height="14" fill="#aaa" stroke="#555" stroke-width="3"/><g transform="translate(18 6) scale(.62)"><circle cx="50" cy="62" r="20" fill="#d8b074" stroke="#8a6a3a" stroke-width="3"/><path d="M30 54C14 34 22 6 52 3C76 0 98 14 92 34C88 45 78 47 70 43C78 32 72 20 60 19C47 18 44 30 52 38C56 42 58 48 50 50C44 50 36 56 30 54Z" fill="#c9a050" stroke="#8a6a3a" stroke-width="3"/></g>'
};
var oldB=SP.bsvg;SP.bsvg=function(t){return extra[t]?svg('0 0 100 100',extra[t]):oldB(t);};
})();

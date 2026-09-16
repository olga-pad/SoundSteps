'use strict';
const $=id=>document.getElementById(id);
const base={3:[['кот','🐱'],['дом','🏠'],['сок','🧃'],['мак','🌺'],['сыр','🧀'],['кит','🐋'],['мяч','⚽'],['лес','🌲'],['нос','👃'],['лук','🧅']],4:[['мама','👩'],['папа','👨'],['рука','✋'],['лиса','🦊'],['рыба','🐟'],['роза','🌹'],['сова','🦉'],['нога','🦵'],['луна','🌙'],['коза','🐐']],5:[['кошка','🐈'],['шапка','🧢'],['чашка','☕'],['книга','📖'],['лимон','🍋'],['белка','🐿️'],['сумка','👜'],['ложка','🥄'],['банан','🍌'],['арбуз','🍉']]};
const vowels='аеёиоуыэюя';
let level=Number(localStorage.getItem('ss-level')||3),style=localStorage.getItem('ss-style')||'normal';
let progress=JSON.parse(localStorage.getItem('ss-progress')||'{}'),custom=JSON.parse(localStorage.getItem('ss-custom')||'[]');
let current=null,rewardTimer=null;
function all(){const p=base[level].slice();custom.forEach(w=>{if([...w].length===level&&!p.some(x=>x[0]===w))p.push([w,'📖']);});return p;}
function st(w){return progress[w]||{self:0,help:0,no:0,mastered:false};}
function save(){localStorage.setItem('ss-progress',JSON.stringify(progress));localStorage.setItem('ss-custom',JSON.stringify(custom));}
function queue(){const available=all().map(x=>x[0]);let q=JSON.parse(localStorage.getItem('ss-queue-'+level)||'null');if(!Array.isArray(q))q=available.slice(0,5);q=q.filter(w=>available.includes(w));while(q.length<5){const n=available.find(w=>!q.includes(w));if(!n)break;q.push(n);}const ready=q.filter(w=>st(w).mastered);if(ready.length>=4){const fresh=available.find(w=>!q.includes(w)&&!st(w).mastered);if(fresh)q=q.map(w=>w===ready[0]?fresh:w);}localStorage.setItem('ss-queue-'+level,JSON.stringify(q));return q;}
function shown(w){return style==='upper'?w.toLocaleUpperCase('ru'):w.toLocaleLowerCase('ru');}
function render(w,target=$('word')){target.replaceChildren(...[...shown(w)].map(ch=>{const s=document.createElement('span');s.textContent=ch;s.className=vowels.includes(ch.toLowerCase())?'vowel':/\p{L}/u.test(ch)?'consonant':'sign';return s;}));target.classList.toggle('hand',style==='hand');}
function speak(text,rate=.72){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ru-RU';u.rate=rate;speechSynthesis.speak(u);}
function pick(){clearTimeout(rewardTimer);const q=queue();let w=q[Math.floor(Math.random()*q.length)];if(current&&q.length>1){for(let i=0;i<8&&w===current[0];i++)w=q[Math.floor(Math.random()*q.length)];}current=all().find(x=>x[0]===w)||all()[0];render(current[0]);$('pic').textContent=current[1];$('pic').hidden=true;$('reward').textContent='';}
function audioHelp(){if(current)speak(current[0],.72);}
function showPicture(){if(current)$('pic').hidden=false;}
function next(){if(!current)return;$('pic').hidden=false;$('reward').textContent='';rewardTimer=setTimeout(pick,1300);}
$('help').onclick=audioHelp;$('showPicture').onclick=showPicture;$('next').onclick=next;
function parentRender(){const q=queue();$('queue').replaceChildren(...q.map(w=>{const d=document.createElement('div');d.className='word-row';d.innerHTML='<strong>'+w+'</strong>';return d;}));$('level').value=String(level);$('letterStyle').value=style;}
$('parentOpen').onclick=()=>{$('childView').hidden=true;$('parentView').hidden=false;parentRender();};$('parentBack').onclick=()=>{$('parentView').hidden=true;$('childView').hidden=false;if(current)render(current[0]);};
$('letterStyle').onchange=e=>{style=e.target.value;localStorage.setItem('ss-style',style);if(current)render(current[0]);parentRender();};
$('level').onchange=e=>{level=Number(e.target.value);localStorage.setItem('ss-level',String(level));pick();parentRender();};
$('addWord').onclick=()=>{const w=$('customWord').value.trim().toLowerCase().replace(/[^\p{L}-]/gu,'');if([...w].length<3)return;custom=[...new Set([...custom,w])];save();$('customWord').value='';parentRender();};
pick();
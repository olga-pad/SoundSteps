'use strict';
const $=id=>document.getElementById(id);
const base={3:[['кот','🐱'],['дом','🏠'],['сок','🧃'],['мак','🌺'],['сыр','🧀'],['кит','🐋'],['мяч','⚽'],['лес','🌲'],['нос','👃'],['лук','🧅']],4:[['мама','👩'],['папа','👨'],['рука','✋'],['лиса','🦊'],['рыба','🐟'],['роза','🌹'],['сова','🦉'],['нога','🦵'],['луна','🌙'],['коза','🐐']],5:[['кошка','🐈'],['шапка','🧢'],['чашка','☕'],['книга','📖'],['лимон','🍋'],['белка','🐿️'],['сумка','👜'],['ложка','🥄'],['банан','🍌'],['арбуз','🍉']]};
const vowels='аеёиоуыэюя';
let level=Number(localStorage.getItem('ss-level')||3),style=localStorage.getItem('ss-style')||'normal';
let progress=JSON.parse(localStorage.getItem('ss-progress')||'{}'),custom=JSON.parse(localStorage.getItem('ss-custom')||'[]');
let current=null,rewardTimer=null,usedHint=false,markedThisTurn=false;
function all(){const p=base[level].slice();custom.forEach(w=>{if([...w].length===level&&!p.some(x=>x[0]===w))p.push([w,'📖']);});return p;}
function st(w){const old=progress[w]||{};return{self:Number(old.self||0),mastered:Boolean(old.mastered)};}
function save(){localStorage.setItem('ss-progress',JSON.stringify(progress));localStorage.setItem('ss-custom',JSON.stringify(custom));}
function queue(){const available=all().map(x=>x[0]);let q=JSON.parse(localStorage.getItem('ss-queue-'+level)||'null');if(!Array.isArray(q))q=available.slice(0,5);q=q.filter(w=>available.includes(w));while(q.length<5){const n=available.find(w=>!q.includes(w));if(!n)break;q.push(n);}const ready=q.filter(w=>st(w).mastered);if(ready.length>=4){const fresh=available.find(w=>!q.includes(w)&&!st(w).mastered);if(fresh)q=q.map(w=>w===ready[0]?fresh:w);}localStorage.setItem('ss-queue-'+level,JSON.stringify(q));return q;}
function shown(w){return style==='upper'?w.toLocaleUpperCase('ru'):w.toLocaleLowerCase('ru');}
function render(w,target=$('word')){target.replaceChildren(...[...shown(w)].map(ch=>{const s=document.createElement('span');s.textContent=ch;s.className=vowels.includes(ch.toLowerCase())?'vowel':/\p{L}/u.test(ch)?'consonant':'sign';return s;}));target.classList.toggle('hand',style==='hand');}
function speak(text,rate=.72){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ru-RU';u.rate=rate;speechSynthesis.speak(u);}
function resetTurn(){usedHint=false;markedThisTurn=false;$('readOk').disabled=false;$('readOk').classList.remove('done');$('readOk').title='Прочитал сам';}
function pick(){clearTimeout(rewardTimer);const q=queue();let w=q[Math.floor(Math.random()*q.length)];if(current&&q.length>1){for(let i=0;i<8&&w===current[0];i++)w=q[Math.floor(Math.random()*q.length)];}current=all().find(x=>x[0]===w)||all()[0];render(current[0]);$('pic').textContent=current[1];$('pic').hidden=true;$('reward').textContent='';resetTurn();}
function audioHelp(){if(!current)return;usedHint=true;$('readOk').disabled=true;speak(current[0],.72);}
function showPicture(){if(!current)return;usedHint=true;$('readOk').disabled=true;$('pic').hidden=false;}
function markIndependent(){if(!current||usedHint||markedThisTurn)return;const s=st(current[0]);s.self=Math.min(3,s.self+1);s.mastered=s.self>=3;progress[current[0]]=s;save();markedThisTurn=true;$('readOk').classList.add('done');$('readOk').disabled=true;$('readOk').title=s.mastered?'Слово освоено':`Самостоятельно: ${s.self}/3`;$('reward').textContent=s.mastered?'✓ Освоено':'✓ Засчитано';queue();rewardTimer=setTimeout(pick,700);}
function next(){if(!current)return;clearTimeout(rewardTimer);pick();}
$('help').onclick=audioHelp;$('showPicture').onclick=showPicture;$('readOk').onclick=markIndependent;$('next').onclick=next;
function parentRender(){const q=queue();$('queue').replaceChildren(...q.map(w=>{const d=document.createElement('div'),s=st(w);d.className='word-row';const status=s.mastered?'Освоено':`${s.self}/3`;d.innerHTML='<strong>'+w+'</strong><span class="status">'+status+'</span>';return d;}));$('level').value=String(level);$('letterStyle').value=style;}
$('parentOpen').onclick=()=>{$('childView').hidden=true;$('parentView').hidden=false;parentRender();};$('parentBack').onclick=()=>{$('parentView').hidden=true;$('childView').hidden=false;if(current)render(current[0]);};
$('letterStyle').onchange=e=>{style=e.target.value;localStorage.setItem('ss-style',style);if(current)render(current[0]);parentRender();};
$('level').onchange=e=>{level=Number(e.target.value);localStorage.setItem('ss-level',String(level));pick();parentRender();};
$('addWord').onclick=()=>{const w=$('customWord').value.trim().toLowerCase().replace(/[^\p{L}-]/gu,'');if([...w].length<3)return;custom=[...new Set([...custom,w])];save();$('customWord').value='';parentRender();};
pick();
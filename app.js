'use strict';
document.write('<script src="./app-core.js?v=40"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
  if(!localStorage.getItem('ss-style') && !(Storage.load()||{}).style){style='upper';persist();}
  const stylePanel=document.getElementById('letterStyle')?.closest('.panel');
  const summary=document.querySelector('#parentView .parent-summary');
  if(stylePanel&&summary)summary.insertAdjacentElement('afterend',stylePanel);

  const icon=(name)=>({home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.2 12 3l9 8.2v9.3a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>',chart:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',sound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.2a5 5 0 0 1 0 7.6M18.7 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5"/><path d="M4 4 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m7.5 12 3 3 6-7" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'})[name];

  const brand=document.querySelector('#childView .brand');
  if(brand){brand.className='brand brand-lockup';brand.innerHTML=`<span class="brand-home">${icon('home')}</span><span><strong>Fonika.ru</strong><small>Читаем вместе!</small></span>`;}
  const parentOpen=document.getElementById('parentOpen');
  if(parentOpen)parentOpen.innerHTML=`${icon('chart')}<span>Кабинет родителя</span>`;

  const card=document.getElementById('letterCard'), letterPictureBtn=document.getElementById('letterShowPicture'), letterPicture=document.getElementById('letterPicture'), letterMastery=document.getElementById('letterKnown'), word=document.getElementById('word'), wordPictureBtn=document.getElementById('showPicture'), wordPicture=document.getElementById('pic'), wordMastery=document.getElementById('readOk'), help=document.getElementById('help');
  const setActionLabels=()=>{
    if(help)help.innerHTML=`${icon('sound')}<span>Помоги прочитать</span>`;
    if(wordPictureBtn){const t=wordPicture.hidden?'Показать картинку':'Скрыть картинку';wordPictureBtn.innerHTML=`${icon('eye')}<span>${t}</span>`;}
    if(wordMastery&&!wordMastery.classList.contains('done'))wordMastery.innerHTML=`${icon('check')}<span>Прочитал сам</span>`;
  };
  setActionLabels();

  const useLetterHint=()=>{const x=currentLetter();if(!x)return;letterMastery.disabled=true;speak(x[1]);};
  card.onclick=useLetterHint;
  letterPictureBtn.onclick=()=>{const x=currentLetter();if(!x)return;const willShow=letterPicture.hidden;letterPicture.hidden=!willShow;letterPictureBtn.textContent=isSign(x[0])?(willShow?'Скрыть пример':'Показать пример'):(willShow?'Скрыть картинку':'Показать картинку');if(willShow){letterMastery.disabled=true;speak(x[1]);}};
  letterPicture.onclick=()=>{const x=currentLetter();if(x)speak(x[1]);};
  word.onclick=()=>{if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}};
  wordPicture.onclick=()=>{if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}};
  wordPictureBtn.onclick=()=>{if(!current)return;usedHint=true;wordMastery.disabled=true;const willShow=wordPicture.hidden;wordPicture.hidden=!willShow;if(willShow)speak(current[0],.68);setActionLabels();};

  const makeNav=(view,kind)=>{const stage=view?.querySelector('.stage');if(!stage)return;const nav=document.createElement('div');nav.className='lesson-nav';const prev=document.createElement('button');prev.type='button';prev.className='nav-arrow nav-prev';prev.innerHTML='<span aria-hidden="true">←</span><small>Предыдущий</small>';const nextArrow=document.createElement('button');nextArrow.type='button';nextArrow.className='nav-arrow nav-next';nextArrow.innerHTML='<span aria-hidden="true">→</span><small>Следующий</small>';nav.append(prev,nextArrow);stage.append(nav);const refresh=()=>{const i=kind==='words'?sessionIndex:letterIndex,total=kind==='words'?sessionWords.length:letterSession.length;prev.disabled=i<=0;nextArrow.disabled=i>=total-1;};prev.onclick=()=>{if(kind==='words'){if(sessionIndex<=0)return;sessionIndex--;showSessionWord();setActionLabels();}else{if(letterIndex<=0)return;letterIndex--;showLetter();}refresh();};nextArrow.onclick=()=>{if(kind==='words'){if(sessionIndex>=sessionWords.length-1)return;sessionIndex++;showSessionWord();setActionLabels();}else{if(letterIndex>=letterSession.length-1)return;letterIndex++;showLetter();}refresh();};view.addEventListener('click',()=>setTimeout(refresh,0));new MutationObserver(refresh).observe(stage,{childList:true,subtree:true,characterData:true});refresh();};
  makeNav(document.getElementById('readingView'),'words');makeNav(document.getElementById('lettersView'),'letters');
  new MutationObserver(()=>{if(wordMastery&&!wordMastery.classList.contains('done')&&!wordMastery.querySelector('svg'))setActionLabels();}).observe(wordMastery,{childList:true,subtree:true});
  switchSection(section==='letters'?'letters':'words');setActionLabels();
});
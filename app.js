'use strict';
document.write('<script src="./app-core.js?v=39"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
  // Uppercase print is the default for a new profile; an explicit saved choice is preserved.
  if(!localStorage.getItem('ss-style') && !(Storage.load()||{}).style){style='upper';persist();}

  // Put letter style first in the parent settings so it is easy to discover.
  const stylePanel=document.getElementById('letterStyle')?.closest('.panel');
  const summary=document.querySelector('#parentView .parent-summary');
  if(stylePanel&&summary)summary.insertAdjacentElement('afterend',stylePanel);

  const card=document.getElementById('letterCard');
  const letterPictureBtn=document.getElementById('letterShowPicture');
  const letterPicture=document.getElementById('letterPicture');
  const letterMastery=document.getElementById('letterKnown');
  const word=document.getElementById('word');
  const wordPictureBtn=document.getElementById('showPicture');
  const wordPicture=document.getElementById('pic');
  const wordMastery=document.getElementById('readOk');

  const useLetterHint=()=>{const x=currentLetter();if(!x)return;letterMastery.disabled=true;speak(x[1]);};
  card.onclick=useLetterHint;
  letterPictureBtn.onclick=()=>{const x=currentLetter();if(!x)return;const willShow=letterPicture.hidden;letterPicture.hidden=!willShow;letterPictureBtn.textContent=isSign(x[0])?(willShow?'Скрыть пример':'Показать пример'):(willShow?'Скрыть картинку':'Показать картинку');if(willShow){letterMastery.disabled=true;speak(x[1]);}};
  letterPicture.onclick=()=>{const x=currentLetter();if(x)speak(x[1]);};
  word.onclick=()=>{if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}};
  wordPicture.onclick=()=>{if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}};
  wordPictureBtn.onclick=()=>{if(!current)return;usedHint=true;wordMastery.disabled=true;const willShow=wordPicture.hidden;wordPicture.hidden=!willShow;wordPictureBtn.textContent=willShow?'Скрыть картинку':'Показать картинку';if(willShow)speak(current[0],.68);};

  // Side arrows: browse the current five-item session without changing mastery.
  const makeNav=(view,kind)=>{
    const stage=view?.querySelector('.stage'); if(!stage)return;
    const nav=document.createElement('div'); nav.className='lesson-nav';
    const prev=document.createElement('button'); prev.type='button'; prev.className='nav-arrow nav-prev'; prev.innerHTML='<span aria-hidden="true">←</span><small>Предыдущий</small>';
    const nextArrow=document.createElement('button'); nextArrow.type='button'; nextArrow.className='nav-arrow nav-next'; nextArrow.innerHTML='<span aria-hidden="true">→</span><small>Следующий</small>';
    nav.append(prev,nextArrow); stage.append(nav);
    const refresh=()=>{
      const i=kind==='words'?sessionIndex:letterIndex;
      const total=kind==='words'?sessionWords.length:letterSession.length;
      prev.disabled=i<=0; nextArrow.disabled=i>=total-1;
    };
    prev.onclick=()=>{if(kind==='words'){if(sessionIndex<=0)return;sessionIndex--;showSessionWord();}else{if(letterIndex<=0)return;letterIndex--;showLetter();}refresh();};
    nextArrow.onclick=()=>{if(kind==='words'){if(sessionIndex>=sessionWords.length-1)return;sessionIndex++;showSessionWord();}else{if(letterIndex>=letterSession.length-1)return;letterIndex++;showLetter();}refresh();};
    view.addEventListener('click',()=>setTimeout(refresh,0));
    new MutationObserver(refresh).observe(stage,{childList:true,subtree:true,characterData:true});
    refresh();
  };
  makeNav(document.getElementById('readingView'),'words');
  makeNav(document.getElementById('lettersView'),'letters');
  switchSection(section==='letters'?'letters':'words');
});
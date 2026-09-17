'use strict';
document.write('<script src="./app-core.js?v=38"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
  // Use uppercase print letters by default for new users. Keep an explicit saved choice.
  if(!localStorage.getItem('ss-style') && !(Storage.load()||{}).style){style='upper';persist();}

  const card=document.getElementById('letterCard');
  const letterPictureBtn=document.getElementById('letterShowPicture');
  const letterPicture=document.getElementById('letterPicture');
  const letterMastery=document.getElementById('letterKnown');
  const word=document.getElementById('word');
  const wordPictureBtn=document.getElementById('showPicture');
  const wordPicture=document.getElementById('pic');
  const wordMastery=document.getElementById('readOk');

  const useLetterHint=()=>{
    const x=currentLetter();
    if(!x)return;
    letterMastery.disabled=true;
    speak(x[1]);
  };

  // Tapping the letter says its association word.
  card.onclick=useLetterHint;

  // Letter picture: real Show/Hide toggle, with no layout movement.
  letterPictureBtn.onclick=()=>{
    const x=currentLetter();
    if(!x)return;
    const willShow=letterPicture.hidden;
    letterPicture.hidden=!willShow;
    letterPictureBtn.textContent=isSign(x[0])
      ? (willShow?'Скрыть пример':'Показать пример')
      : (willShow?'Скрыть картинку':'Показать картинку');
    if(willShow){
      letterMastery.disabled=true;
      speak(x[1]);
    }
  };
  letterPicture.onclick=()=>{
    const x=currentLetter();
    if(x)speak(x[1]);
  };

  // Reading: tapping the written word or its picture says the word.
  word.onclick=()=>{
    if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}
  };
  wordPicture.onclick=()=>{
    if(current){usedHint=true;wordMastery.disabled=true;speak(current[0],.68);}
  };

  // Word picture: Show/Hide toggle. The fixed picture slot keeps the screen stable.
  wordPictureBtn.onclick=()=>{
    if(!current)return;
    usedHint=true;
    wordMastery.disabled=true;
    const willShow=wordPicture.hidden;
    wordPicture.hidden=!willShow;
    wordPictureBtn.textContent=willShow?'Скрыть картинку':'Показать картинку';
    if(willShow)speak(current[0],.68);
  };

  switchSection(section==='letters'?'letters':'words');
});
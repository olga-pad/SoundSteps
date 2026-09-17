'use strict';
document.write('<script src="./app-core.js?v=38"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
  // Use uppercase print letters by default for new users. Keep an explicit saved choice.
  if(!localStorage.getItem('ss-style') && !(Storage.load()||{}).style){style='upper';persist();}
  const card=document.getElementById('letterCard'), pictureBtn=document.getElementById('letterShowPicture'), picture=document.getElementById('letterPicture'), mastery=document.getElementById('letterKnown');
  const useLetterHint=(showImage)=>{const x=currentLetter(); if(!x)return; mastery.disabled=true; if(showImage) picture.hidden=false; speak(x[1]);};
  card.addEventListener('click',()=>useLetterHint(false));
  pictureBtn.addEventListener('click',()=>useLetterHint(true));
  const wordPictureBtn=document.getElementById('showPicture');
  wordPictureBtn.addEventListener('click',()=>{if(current){usedHint=true;document.getElementById('readOk').disabled=true;speak(current[0],.68);}});
  switchSection(section==='letters'?'letters':'words');
});
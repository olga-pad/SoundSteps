'use strict';
document.write('<script src="./app-core.js?v=37"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
  const card=document.getElementById('letterCard'), pictureBtn=document.getElementById('letterShowPicture'), picture=document.getElementById('letterPicture'), mastery=document.getElementById('letterKnown');
  const useLetterHint=(showImage)=>{const x=currentLetter(); if(!x)return; mastery.disabled=true; if(showImage) picture.hidden=false; speak(x[1]);};
  card.addEventListener('click',()=>useLetterHint(false));
  pictureBtn.addEventListener('click',()=>useLetterHint(true));
  const wordPictureBtn=document.getElementById('showPicture');
  wordPictureBtn.addEventListener('click',()=>{if(current){usedHint=true;document.getElementById('readOk').disabled=true;speak(current[0],.68);}});
});
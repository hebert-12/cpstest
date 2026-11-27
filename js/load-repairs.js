(function(){'use strict';
/* Load repair assets once and avoid duplicate script injection. */
function init(){const css=document.querySelector('link[href="css/repair.css"]');if(!css){const l=document.createElement('link');l.rel='stylesheet';l.href='css/repair.css';document.head.appendChild(l)}const script=document.querySelector('script[src="js/repair.js"]');if(!script){const s=document.createElement('script');s.src='js/repair.js';document.body.appendChild(s)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

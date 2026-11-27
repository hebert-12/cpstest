(function(){'use strict';
/* GamingTools — suite repairs: repeat-safe inputs, larger test areas, compact categories */
const file='js/suite.js';
const repair=document.createElement('script');repair.id='suite-repeat-repair';repair.textContent=`
(function(){
  'use strict';
  const visited=new WeakSet();
  function stopOnViewChange(){
    document.querySelectorAll('.suite-test-area').forEach(area=>{
      if(!visited.has(area)){
        visited.add(area);
        area.addEventListener('pointerdown',e=>e.stopPropagation(),true);
      }
    });
  }
  document.addEventListener('gamingtools:viewchange',e=>{
    document.querySelectorAll('[data-repeat-active="true"]').forEach(el=>el.removeAttribute('data-repeat-active'));
  });
  document.addEventListener('keydown',e=>{
    if(!e.repeat)return;
    const active=document.querySelector('.view.active');
    if(!active)return;
    const id=active.id.replace('view-','');
    if(['jitter','multiclick','doubleclick','keycounter','keyaccuracy','wasd','bpm','spacebar','typing','keyboard','drill','endurance','latency'].includes(id)){
      if(id==='keycounter'||id==='keyaccuracy'||id==='wasd'||id==='bpm'||id==='latency'||id==='spacebar'||id==='typing'||id==='drill'||id==='endurance'){
        e.preventDefault();
      }
    }
  },true);
  document.addEventListener('keyup',e=>{
    e.stopPropagation;
  },true);
  document.addEventListener('DOMContentLoaded',stopOnViewChange);
  stopOnViewChange();
})();
`;
document.head.appendChild(repair);
})();

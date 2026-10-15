(function(){'use strict';
var doc=document,bar=doc.querySelector('#nav .nav-items');if(!bar||bar.querySelector('.ol-nav-slider'))return;
var style=doc.createElement('style');style.textContent='#nav .nav-items{position:relative;isolation:isolate}#nav .nav-items>.ol-nav-slider{position:absolute;left:0;top:0;z-index:0;border-radius:999px;background:var(--sage);pointer-events:none;opacity:0;will-change:transform;transition:transform .3s cubic-bezier(.25,.8,.25,1),opacity .12s ease}#nav .nav-items>.nav-pill{position:relative;z-index:1}#nav .nav-items.ol-nav-smooth .nav-pill.active .circle{background:transparent}@media(prefers-reduced-motion:reduce){#nav .nav-items>.ol-nav-slider{transition:none}}';doc.head.appendChild(style);
var slider=doc.createElement('span'),preview=null;slider.className='ol-nav-slider';slider.setAttribute('aria-hidden','true');bar.appendChild(slider);bar.classList.add('ol-nav-smooth');
function move(active){if(!active||!active.offsetWidth||!active.offsetHeight){slider.style.opacity='0';return}var w=active.offsetWidth+'px',h=active.offsetHeight+'px',t='translate3d('+active.offsetLeft+'px,'+active.offsetTop+'px,0)';if(slider.style.width!==w)slider.style.width=w;if(slider.style.height!==h)slider.style.height=h;if(slider.style.transform!==t)slider.style.transform=t;if(slider.style.opacity!=='1')slider.style.opacity='1'}
function sync(){move(preview||bar.querySelector('.nav-pill.active')||bar.querySelector('.nav-pill[aria-current="page"]'))}
var pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;sync()})}
function target(e){var b=e.target&&e.target.closest&&e.target.closest('.nav-pill');return b&&bar.contains(b)&&!b.disabled?b:null}
bar.addEventListener('pointerdown',function(e){if(e.button!==0)return;var b=target(e);if(!b)return;preview=b;move(b)},true);
bar.addEventListener('click',function(e){var b=target(e);if(!b)return;preview=null;move(b);schedule()},true);
function release(){if(!preview)return;preview=null;schedule()}
window.addEventListener('pointerup',function(e){if(preview&&target(e)!==preview)release()});window.addEventListener('pointercancel',release);window.addEventListener('blur',release);
new MutationObserver(schedule).observe(bar,{attributes:true,subtree:true,childList:true,attributeFilter:['class','aria-current']});if(typeof ResizeObserver==='function')new ResizeObserver(schedule).observe(bar);window.addEventListener('resize',schedule);if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(schedule,function(){});sync();
})();

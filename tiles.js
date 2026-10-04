(function(){'use strict';
/* Puts the Recalls and Lab tested entries side by side as two square tiles, under the scan button on Home and at the top of Explore. */
function arrange(host,place){if(!host)return;var r=host.querySelector('.rcp-entry'),l=host.querySelector('.lab-entry');if(!r||!l)return;
  var wrap=host.querySelector('.ol-tiles');if(wrap&&r.parentNode===wrap&&l.parentNode===wrap)return;
  if(!wrap){wrap=document.createElement('div');wrap.className='ol-tiles';place(wrap)}
  [r,l].forEach(function(b){b.classList.add('ol-tile');wrap.append(b)})}
function run(){var h=document.getElementById('home'),x=document.getElementById('explore');
  arrange(h,function(w){var cta=h.querySelector('.scan-cta');if(cta)cta.after(w);else h.prepend(w)});
  arrange(x,function(w){x.prepend(w)})}
var busy=false;function sched(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;run()})}
['home','explore'].forEach(function(id){var n=document.getElementById(id);if(n)new MutationObserver(sched).observe(n,{childList:true})});
run();
})();

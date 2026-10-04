(function(){'use strict';
/* Profile tabs: Profiles, Allergies, Diet and Topics each show their own dropdowns. */
var pf=document.getElementById('profile');if(!pf)return;
var st=document.createElement('style');
st.textContent='.pf-tabs{display:flex;gap:4px;padding:4px;background:var(--sage);border-radius:14px}.pf-tabs button{flex:1;min-height:42px;border-radius:11px;border:0;background:transparent;color:var(--forest);font-weight:750;font-size:14px;padding:0 4px}.pf-tabs button[aria-selected=true]{background:var(--forest);color:#fff}.pf-tabs button:focus-visible{outline:3px solid var(--eucalyptus);outline-offset:2px}'
+'#profile[data-tab=profiles] .p2>*:not([data-g=profiles]),#profile[data-tab=allergies] .p2>*:not([data-g=allergies]),#profile[data-tab=diet] .p2>*:not([data-g=diet]),#profile[data-tab=topics] .p2>*:not([data-g=topics]){display:none}';
document.head.appendChild(st);
var names=[['profiles','Profiles'],['allergies','Allergies'],['diet','Diet'],['topics','Topics']],bar=document.createElement('div'),btns={};
bar.className='pf-tabs';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Profile sections');
names.forEach(function(n){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=n[1];b.onclick=function(){show(n[0])};btns[n[0]]=b;bar.append(b)});
bar.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;var i=names.findIndex(function(n){return n[0]===pf.dataset.tab});var t=names[(i+k+names.length)%names.length][0];show(t);btns[t].focus()});
function show(t){pf.dataset.tab=t;names.forEach(function(n){btns[n[0]].setAttribute('aria-selected',String(n[0]===t));btns[n[0]].tabIndex=n[0]===t?0:-1})}
function group(t){t=t.toLowerCase();if(/saved profile/.test(t))return 'profiles';if(/topic/.test(t))return 'topics';if(/allerg|watch word|trigger|intoleran/.test(t))return 'allergies';return 'diet'}
function sync(){var p2=pf.querySelector('.p2');if(!p2)return;if(bar.nextElementSibling!==p2)p2.before(bar);
  [].forEach.call(p2.children,function(d){if(d.tagName!=='DETAILS'){return}var s=d.querySelector('summary'),g=group(s?s.textContent:'');if(d.dataset.g!==g)d.dataset.g=g})}
var busy=false;function sched(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;sync()})}
new MutationObserver(sched).observe(pf,{childList:true,subtree:true});
show('profiles');sync();
})();

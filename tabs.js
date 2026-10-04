(function(){'use strict';
/* Library tabs: Saved, Recent and Changes share one page and show one list at a time. */
var lib=document.getElementById('library'),sv=document.getElementById('savedArea'),hi=document.getElementById('historyArea');
if(!lib||!sv||!hi||lib.querySelector('.lb-tabs'))return;
var st=document.createElement('style');
st.textContent='.lb-tabs{display:flex;gap:4px;padding:4px;background:var(--sage);border-radius:14px}.lb-tabs button{flex:1;min-height:42px;border-radius:11px;border:0;background:transparent;color:var(--forest);font-weight:750;font-size:14px;padding:0 6px}.lb-tabs button[aria-selected=true]{background:var(--forest);color:#fff}.lb-tabs button:focus-visible{outline:3px solid var(--eucalyptus);outline-offset:2px}.lb-tabs .n{font-weight:600;opacity:.8;margin-left:4px}'
+'#library[data-tab=saved]>*:not(.lb-tabs):not(.lb-intro):not(#savedArea),#library[data-tab=recent]>*:not(.lb-tabs):not(.lb-intro):not(#historyArea):not(.lb-clear),#library[data-tab=changes]>*:not(.lb-tabs):not(.lb-intro):not(.lb-actions):not(.lb-changes):not(.lb-status){display:none}#library>.section-head{display:none}';
document.head.appendChild(st);
var intro=lib.firstElementChild;if(intro)intro.classList.add('lb-intro');
var names=[['recent','Recent'],['saved','Saved'],['changes','Changes']],bar=document.createElement('div');bar.className='lb-tabs';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Library sections');
var btns={};
names.forEach(function(n){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.dataset.t=n[0];b.append(document.createTextNode(n[1]));var c=document.createElement('span');c.className='n';b.append(c);b.onclick=function(){show(n[0])};btns[n[0]]=b;bar.append(b)});
bar.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;var i=names.findIndex(function(n){return n[0]===lib.dataset.tab});var t=names[(i+k+names.length)%names.length][0];show(t);btns[t].focus()});
if(intro)intro.after(bar);else lib.prepend(bar);
function show(t){lib.dataset.tab=t;names.forEach(function(n){btns[n[0]].setAttribute('aria-selected',String(n[0]===t));btns[n[0]].tabIndex=n[0]===t?0:-1})}
function counts(){var v={saved:sv.querySelectorAll('button.card').length,recent:hi.querySelectorAll('button.card').length,changes:lib.querySelectorAll('.lb-change').length};
  names.forEach(function(n){var c=btns[n[0]].querySelector('.n'),x=v[n[0]]?'('+v[n[0]]+')':'';if(c.textContent!==x)c.textContent=x})}
var busy=false;function sched(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;counts()})}
new MutationObserver(sched).observe(lib,{childList:true,subtree:true});
show('recent');counts();
window.OLLibraryTabs={show:show};
})();

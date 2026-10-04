(function(){'use strict';
/* Remove controls for Library. Saved: removes the product from Saved. Recent: removes it from Recent, plus Clear recent.
   Removing a product only changes this browser. It does not change any evidence or test. */
var lib=document.getElementById('library'),saved=document.getElementById('savedArea'),hist=document.getElementById('historyArea');
if(!lib||!saved||!hist)return;
var sty=document.createElement('style');
sty.textContent='.lb-wrap{display:flex;gap:8px;align-items:stretch}.lb-wrap>button.card{flex:1;min-width:0}.lb-rm{flex:none;min-width:64px;min-height:44px;border-radius:14px;border:1px solid var(--line);background:#fff;color:var(--forest);font-weight:750;font-size:13px;padding:0 10px}.lb-rm:focus-visible{outline:3px solid var(--eucalyptus);outline-offset:2px}.lb-clear{margin:0 0 10px;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#fff;color:var(--forest);font-weight:750;padding:0 14px}';
document.head.appendChild(sty);
function ids(area){var s=window.state||(typeof state!=='undefined'?state:null);if(!s)return [];var src=area===saved?s.saved:s.history;return src.filter(function(id){return !!getProduct(id)})}
function drop(area,id){var s=state;if(area===saved)s.saved=s.saved.filter(function(x){return x!==id});else s.history=s.history.filter(function(x){return x!==id});persist();renderLibrary();if(typeof renderHome==='function')renderHome();toast(area===saved?'Removed from Saved. It stays in Recent if you scanned it.':'Removed from Recent. It stays in Saved if you saved it.')}
function decorate(area){var list=ids(area),cards=area.querySelectorAll('button.card');if(cards.length!==list.length)return;
  cards.forEach(function(c,i){if(c.parentNode.classList.contains('lb-wrap'))return;var w=document.createElement('div');w.className='lb-wrap';c.parentNode.insertBefore(w,c);w.append(c);
    var b=document.createElement('button');b.type='button';b.className='lb-rm';b.textContent='Remove';var nm=(c.querySelector('strong')||{}).textContent||'product';b.setAttribute('aria-label','Remove '+nm+' from '+(area===saved?'Saved':'Recent'));
    var id=list[i];b.onclick=function(){drop(area,id)};w.append(b)});
  if(area===hist){var old=lib.querySelector('.lb-clear');if(old)old.remove();if(list.length>1){var cl=document.createElement('button');cl.type='button';cl.className='lb-clear';cl.textContent='Clear all Recent';var armed=false;cl.onclick=function(){if(!armed){armed=true;cl.textContent='Tap again to clear '+list.length+' recent products';setTimeout(function(){armed=false;cl.textContent='Clear all Recent'},4000);return}state.history=[];persist();renderLibrary();if(typeof renderHome==='function')renderHome();toast('Recent cleared. Saved products are kept.')};hist.parentNode.insertBefore(cl,hist)}}}
[saved,hist].forEach(function(a){new MutationObserver(function(){decorate(a)}).observe(a,{childList:true})});
decorate(saved);decorate(hist);
})();

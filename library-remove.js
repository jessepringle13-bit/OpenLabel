(function(){'use strict';
/* Remove controls for Library. Saved: removes the product from Saved. Recent: removes it from Recent, plus Clear recent.
   Removing a product only changes this browser. It does not change any evidence or test. */
var lib=document.getElementById('library'),saved=document.getElementById('savedArea'),hist=document.getElementById('historyArea');
if(!lib||!saved||!hist)return;
var sty=document.createElement('style');
sty.textContent='.lb-wrap{position:relative;display:flex;gap:6px;align-items:center;overflow:hidden;border-radius:14px}.lb-wrap>button.card{flex:1;min-width:0;touch-action:pan-y;transition:transform .18s ease;position:relative;z-index:1}.lb-wrap.dragging>button.card{transition:none}.lb-rm{flex:none;position:relative;z-index:1;width:32px;height:32px;min-width:32px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--forest);font-size:17px;line-height:1;padding:0;display:grid;place-items:center}.lb-rm:focus-visible,.lb-act:focus-visible{outline:3px solid var(--eucalyptus);outline-offset:2px}.lb-wrap.swiped .lb-act{visibility:visible}.lb-hint{margin:8px 2px 0;font-size:12.5px;color:var(--muted);transition:opacity .5s}.lb-hint.fade{opacity:0}.lb-act{visibility:hidden;position:absolute;right:0;top:0;bottom:0;width:84px;border:0;background:var(--forest);color:#fff;font-weight:750;font-size:13px;z-index:0}.lb-clear{margin:0 0 10px;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#fff;color:var(--forest);font-weight:750;padding:0 14px}';
document.head.appendChild(sty);
function ids(area){var A=window.OLLibraryApi;return A?A.ids(area===saved?'saved':'recent'):[]}
function drop(area,id){var A=window.OLLibraryApi;A.remove(area===saved?'saved':'recent',id);A.toast(area===saved?'Removed from Saved. It stays in Recent if you scanned it.':'Removed from Recent. It stays in Saved if you saved it.')}
var openW=null,W=84;
function setX(w,c,x){c.style.transform=x?'translateX('+x+'px)':'';w.classList.toggle('swiped',x<0)}
function closeOpen(except){if(openW&&openW!==except){var c=openW.querySelector('button.card');if(c)setX(openW,c,0);openW=null}}
function swipe(w,c){var act=w.querySelector('.lb-act');var sx=0,sy=0,dx=0,on=false,dir=0,base=0,moved=false;
  c.addEventListener('pointerdown',function(e){closeOpen(w);sx=e.clientX;sy=e.clientY;dx=0;on=true;dir=0;moved=false;base=(openW===w)?-W:0});
  c.addEventListener('pointermove',function(e){if(!on)return;var mx=e.clientX-sx,my=e.clientY-sy;if(!dir){if(Math.abs(mx)>8&&Math.abs(mx)>Math.abs(my))dir=1;else if(Math.abs(my)>8)dir=2}
    if(dir===1){moved=true;w.classList.add('dragging');dx=Math.max(-W,Math.min(0,base+mx));setX(w,c,dx);try{c.setPointerCapture(e.pointerId)}catch(x){}}});
  function end(){if(!on)return;on=false;w.classList.remove('dragging');if(dir===1){if(dx<-W/2){setX(w,c,-W);openW=w;seen()}else{setX(w,c,0);if(openW===w)openW=null}}}
  c.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){setX(w,c,-W);openW=w;act.tabIndex=0;seen();e.preventDefault()}else if(e.key==='ArrowRight'&&openW===w){closeOpen();act.tabIndex=-1;e.preventDefault()}});c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
  c.addEventListener('click',function(e){if(moved){e.stopPropagation();e.preventDefault();moved=false;return}if(openW===w){e.stopPropagation();e.preventDefault();closeOpen()}},true)}
var HK='openlabel-swipe-hint-v1';
function hcount(){try{return Number(localStorage.getItem(HK))||0}catch(e){return 0}}
function hset(n){try{localStorage.setItem(HK,String(n))}catch(e){}}
function seen(){hset(99);var h=lib.querySelector('.lb-hint');if(h)h.remove()}
var hintTimer=null;
function showHint(){if(hcount()>=3)return;var any=saved.querySelector('button.card')||hist.querySelector('button.card');if(!any)return;var old=lib.querySelector('.lb-hint');if(old)old.remove();
  var bar=lib.querySelector('.lb-tabs'),h=document.createElement('p');h.className='lb-hint';h.setAttribute('role','status');h.textContent='Tip: swipe an entry left to remove it.';if(bar)bar.after(h);else lib.append(h);hset(hcount()+1);
  clearTimeout(hintTimer);hintTimer=setTimeout(function(){h.classList.add('fade');setTimeout(function(){h.remove()},600)},5000)}
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-go=library]'))setTimeout(showHint,350)},true);
document.addEventListener('pointerdown',function(e){if(openW&&!openW.contains(e.target))closeOpen()});
function decorate(area){var list=ids(area),cards=area.querySelectorAll('button.card');if(cards.length!==list.length)return;
  cards.forEach(function(c,i){if(c.parentNode.classList.contains('lb-wrap'))return;var w=document.createElement('div');w.className='lb-wrap';c.parentNode.insertBefore(w,c);w.append(c);
    var id=list[i],nm=(c.querySelector('strong')||{}).textContent||'product',where=(area===saved?'Saved':'Recent');
        var act=document.createElement('button');act.type='button';act.className='lb-act';act.textContent='Remove';act.setAttribute('aria-label','Remove '+nm+' from '+where);act.tabIndex=-1;act.onclick=function(){drop(area,id)};
    w.append(act);swipe(w,c)});
  if(area===hist){var old=lib.querySelector('.lb-clear');if(old)old.remove();if(list.length>1){var cl=document.createElement('button');cl.type='button';cl.className='lb-clear';cl.textContent='Clear all Recent';var armed=false;cl.onclick=function(){if(!armed){armed=true;cl.textContent='Tap again to clear '+list.length+' recent products';setTimeout(function(){armed=false;cl.textContent='Clear all Recent'},4000);return}window.OLLibraryApi.clearRecent();window.OLLibraryApi.toast('Recent cleared. Saved products are kept.')};hist.parentNode.insertBefore(cl,hist)}}}
[saved,hist].forEach(function(a){new MutationObserver(function(){decorate(a)}).observe(a,{childList:true})});
decorate(saved);decorate(hist);
})();

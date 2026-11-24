(function(){'use strict';
var KEY='openlabel-journal-v1';
var STYLE_ID='ol-journal-css';
var PICKER_ID='olJournalPicker';
var LIST_ID='olDecisionJournal';
var frame=0;

var REASONS=['Fewer additives','Better price','Allergen-free','Cleaner form','Less sugar','Just testing'];

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='decision-journal.css?v=20261124-dj1';
  document.head.appendChild(l);
}

function load(){
  try{
    var raw=localStorage.getItem(KEY);
    var arr=raw?JSON.parse(raw):[];
    return Array.isArray(arr)?arr:[];
  }catch(_){return []}
}

function save(entries){
  try{localStorage.setItem(KEY,JSON.stringify(entries.slice(0,50)))}catch(_){}
}

function addPick(product,reason){
  var entries=load();
  entries.unshift({
    product:(product||'Scanned product').trim(),
    reason:reason,
    date:new Date().toISOString().slice(0,10)
  });
  save(entries);
  syncLibrary(true);
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function syncPanel(){
  frame=0;
  var panel=document.getElementById('olPanel');
  if(!panel||panel.hidden)return;
  var anchor=panel.querySelector('#olEvidenceConfidence')||panel.querySelector('.ol-ing-explore');
  if(!anchor||!anchor.parentNode)return;
  if(panel.querySelector('#'+PICKER_ID))return;
  ensureCss();
  var titleEl=panel.querySelector('h1, h2, .olp-title, .prod-name');
  var prod=titleEl?titleEl.textContent.trim():'Scanned product';
  var box=document.createElement('div');
  box.id=PICKER_ID;
  box.className='ol-dj-picker';
  var chips=REASONS.map(function(r){
    return '<button type="button" class="ol-dj-chip" data-reason="'+escapeHtml(r)+'">'+escapeHtml(r)+'</button>';
  }).join('');
  box.innerHTML='<div class="ol-dj-label"><strong>Log this pick</strong> <small>Save why you chose it</small></div><div class="ol-dj-chips">'+chips+'</div><div class="ol-dj-status" role="status"></div>';
  box.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.ol-dj-chip'):null;
    if(!btn)return;
    var reason=btn.getAttribute('data-reason');
    var currentTitle=panel.querySelector('h1, h2, .olp-title, .prod-name');
    addPick(currentTitle?currentTitle.textContent.trim():prod,reason);
    var st=box.querySelector('.ol-dj-status');
    if(st)st.textContent='Logged to Decision Journal ('+reason+')';
  });
  anchor.parentNode.insertBefore(box,anchor.nextSibling);
}

function syncLibrary(keepOpen){
  var host=document.getElementById('savedArea')||document.getElementById('library');
  if(!host)return;
  var entries=load();
  var sig=entries.length+':'+(entries[0]?entries[0].product+entries[0].reason+entries[0].date:'');
  var existing=document.getElementById(LIST_ID);
  if(existing&&existing.parentNode===host&&existing.dataset.sig===sig)return;
  ensureCss();
  var wasOpen=keepOpen||(existing&&existing.open);
  var el=document.createElement('details');
  el.id=LIST_ID;
  el.className='ol-dj-panel';
  el.dataset.sig=sig;
  if(wasOpen)el.open=true;
  var body='';
  if(entries.length===0){
    body='<p class="ol-dj-empty">Tap a reason on any scanned product to remember what you picked and why.</p>';
  }else{
    body='<ul class="ol-dj-list">'+entries.slice(0,15).map(function(e){
      return '<li><strong>'+escapeHtml(e.product)+'</strong> — '+escapeHtml(e.reason)+' <small>('+escapeHtml(e.date)+')</small></li>';
    }).join('')+'</ul>';
  }
  el.innerHTML='<summary>Decision Journal ('+entries.length+' logged)</summary><div class="ol-dj-body">'+body+'</div>';
  if(existing){existing.replaceWith(el)}
  else{host.appendChild(el)}
}

function schedulePanel(){if(!frame)frame=requestAnimationFrame(syncPanel)}
var panelEl=document.getElementById('olPanel');
if(panelEl){
  new MutationObserver(schedulePanel).observe(panelEl,{attributes:true,attributeFilter:['hidden'],childList:true});
}
var libEl=document.getElementById('library');
if(libEl){
  new MutationObserver(function(){syncLibrary(false)}).observe(libEl,{attributes:true,attributeFilter:['data-tab','hidden']});
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){schedulePanel();syncLibrary(false)});
}else{
  schedulePanel();
  syncLibrary(false);
}

window.OLDecisionJournal={load:load,addPick:addPick,syncLibrary:syncLibrary};
})();

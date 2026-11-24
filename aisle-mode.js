(function(){'use strict';
var SESSION_KEY='openlabel-aisle-mode-v1';
var STYLE_ID='ol-aisle-css';
var BAR_ID='olAisleBar';
var BANNER_ID='olAisleBanner';
var frame=0;

var FILTERS=[
  {id:'dyes',label:'No dyes',re:/\b(red\s*(40|3)|yellow\s*(5|6)|blue\s*(1|2)|green\s*3|fd&c|artificial\s+color)/i},
  {id:'sweeteners',label:'No art. sweeteners',re:/\b(sucralose|aspartame|acesulfame|saccharin|neotame|advantame)\b/i},
  {id:'seed_oils',label:'No seed oils',re:/\b(soybean|canola|corn|cottonseed|sunflower|safflower|rapeseed|grapeseed)\s+oil\b/i},
  {id:'nuts',label:'Nut watch',re:/\b(peanut|almond|cashew|walnut|pecan|pistachio|hazelnut|macadamia|brazil\s+nut)s?\b/i},
  {id:'gums',label:'No gums',re:/\b(carrageenan|xanthan\s+gum|guar\s+gum|gellan\s+gum|locust\s+bean\s+gum)\b/i}
];

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='aisle-mode.css?v=20261124-am1';
  document.head.appendChild(l);
}

function getActive(){
  try{
    var raw=sessionStorage.getItem(SESSION_KEY);
    var arr=raw?JSON.parse(raw):[];
    return Array.isArray(arr)?arr:[];
  }catch(_){return []}
}

function setActive(ids){
  try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(ids))}catch(_){}
}

function toggleFilter(id){
  var cur=getActive();
  var idx=cur.indexOf(id);
  if(idx===-1)cur.push(id);
  else cur.splice(idx,1);
  setActive(cur);
  updateBarStates();
  syncPanel();
}

function renderBar(){
  var bar=document.createElement('section');
  bar.id=BAR_ID;
  bar.className='ol-aisle-bar';
  bar.setAttribute('aria-label','Aisle Mode temporary filters');
  var html='<div class="ol-aisle-head"><span class="ol-aisle-title">Aisle Mode</span><span class="ol-aisle-sub">Temporary trip filters (won’t change Profile)</span></div><div class="ol-aisle-chips">';
  for(var i=0;i<FILTERS.length;i++){
    html+='<button type="button" class="ol-aisle-chip" data-aisle-id="'+FILTERS[i].id+'" aria-pressed="false">'+FILTERS[i].label+'</button>';
  }
  html+='</div>';
  bar.innerHTML=html;
  bar.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.ol-aisle-chip'):null;
    if(!btn)return;
    toggleFilter(btn.getAttribute('data-aisle-id'));
  });
  return bar;
}

function updateBarStates(){
  var bar=document.getElementById(BAR_ID);
  if(!bar)return;
  var active=getActive();
  var chips=bar.querySelectorAll('.ol-aisle-chip');
  for(var i=0;i<chips.length;i++){
    var on=active.indexOf(chips[i].getAttribute('data-aisle-id'))!==-1;
    chips[i].classList.toggle('is-on',on);
    chips[i].setAttribute('aria-pressed',on?'true':'false');
  }
}

function mountBar(){
  var host=document.getElementById('home')||document.getElementById('scan')||document.querySelector('main');
  if(!host)return;
  ensureCss();
  if(!document.getElementById(BAR_ID)){
    var det=document.getElementById('olDetectiveCard');
    var bar=renderBar();
    if(det&&det.parentNode===host){host.insertBefore(bar,det)}
    else{host.appendChild(bar)}
  }
  updateBarStates();
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
  var active=getActive();
  var existing=panel.querySelector('#'+BANNER_ID);
  if(active.length===0){
    if(existing)existing.remove();
    return;
  }
  var explore=panel.querySelector('.ol-ing-explore');
  var anchor=panel.querySelector('#olEvidenceConfidence')||explore;
  if(!anchor||!anchor.parentNode)return;

  var text=(explore?explore.textContent:'')+' '+(document.getElementById('labelFacts')?document.getElementById('labelFacts').textContent:'');
  var hits=[];
  var activeLabels=[];
  for(var i=0;i<FILTERS.length;i++){
    if(active.indexOf(FILTERS[i].id)===-1)continue;
    activeLabels.push(FILTERS[i].label);
    var m=text.match(FILTERS[i].re);
    if(m)hits.push(FILTERS[i].label+': '+m[0]);
  }
  var sig=active.join(',')+'|'+hits.join(',');
  if(existing&&existing.dataset.sig===sig)return;

  ensureCss();
  var banner=document.createElement('div');
  banner.id=BANNER_ID;
  banner.className='ol-aisle-banner '+(hits.length?'is-hit':'is-clear');
  banner.dataset.sig=sig;
  if(hits.length){
    banner.innerHTML='<strong>Aisle Mode flagged ('+hits.length+'):</strong> '+escapeHtml(hits.join(' · '));
  }else{
    banner.innerHTML='<strong>Aisle Mode clear:</strong> 0 matches for '+escapeHtml(activeLabels.join(', '));
  }
  if(existing){existing.replaceWith(banner)}
  else{anchor.parentNode.insertBefore(banner,anchor)}
}

function schedule(){if(!frame)frame=requestAnimationFrame(syncPanel)}
var panelEl=document.getElementById('olPanel');
if(panelEl){
  new MutationObserver(schedule).observe(panelEl,{attributes:true,attributeFilter:['hidden'],childList:true});
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){mountBar();schedule()});
}else{
  mountBar();
  schedule();
}

window.OLAisleMode={getActive:getActive,toggleFilter:toggleFilter,syncPanel:syncPanel};
})();

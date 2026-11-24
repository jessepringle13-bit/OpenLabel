(function(){'use strict';
var DOCK_KEY='openlabel-calm-dock-v1';
var STACK_KEY='openlabel-stack-v1';
var STYLE_ID='ol-stack-css';
var PANEL_ID='olSupplementStack';
var frame=0;

var NUTRIENTS=[
  {id:'b6',label:'Vitamin B6',ul:'NIH adult UL: 100 mg/day',re:/vitamin\s*b-?6|pyridoxine|pyridoxal|p-?5-?p/i},
  {id:'zinc',label:'Zinc',ul:'NIH adult UL: 40 mg/day',re:/\bzinc\b/i},
  {id:'vitd',label:'Vitamin D',ul:'NIH adult UL: 100 mcg (4,000 IU)/day',re:/vitamin\s*d\b|cholecalciferol|ergocalciferol/i},
  {id:'magnesium',label:'Magnesium (supplemental)',ul:'NIH adult supplemental UL: 350 mg/day',re:/\bmagnesium\b/i},
  {id:'iron',label:'Iron',ul:'NIH adult UL: 45 mg/day',re:/\biron\b|ferrous|ferric/i},
  {id:'vita',label:'Vitamin A',ul:'NIH adult preformed UL: 3,000 mcg RAE/day',re:/vitamin\s*a\b|retinyl|retinol/i},
  {id:'niacin',label:'Niacin (Vitamin B3)',ul:'NIH adult supplemental UL: 35 mg/day',re:/\bniacin\b|niacinamide|nicotinamide|vitamin\s*b-?3/i},
  {id:'selenium',label:'Selenium',ul:'NIH adult UL: 400 mcg/day',re:/\bselenium\b|selenomethionine/i},
  {id:'folate',label:'Folate / Folic Acid',ul:'NIH adult synthetic UL: 1,000 mcg/day',re:/\bfolate\b|folic\s*acid|methylfolate|5-mthf/i},
  {id:'calcium',label:'Calcium',ul:'NIH adult UL: 2,000–2,500 mg/day',re:/\bcalcium\b/i}
];

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='supplement-stack.css?v=20261124-st2';
  document.head.appendChild(l);
}

function readDock(){
  try{
    var raw=localStorage.getItem(DOCK_KEY);
    return raw?JSON.parse(raw):null;
  }catch(_){return null}
}

function readStackIds(){
  try{
    var raw=localStorage.getItem(STACK_KEY);
    var arr=raw?JSON.parse(raw):[];
    return Array.isArray(arr)?arr:[];
  }catch(_){return []}
}

function saveStackIds(ids){
  try{localStorage.setItem(STACK_KEY,JSON.stringify(ids))}catch(_){}
}

function getSavedSupplements(){
  var dock=readDock();
  if(!dock||!Array.isArray(dock.saved)||!dock.live)return [];
  var out=[];
  for(var i=0;i<dock.saved.length;i++){
    var id=dock.saved[i];
    var item=dock.live[id];
    if(!item)continue;
    var cat=(item.category||'').toLowerCase();
    var blob=[item.name,item.brand,item.ingredients,item.ingredients_text,cat].filter(Boolean).join(' ');
    if(cat.indexOf('supplement')!==-1||/vitamin|magnesium|zinc|omega|probiotic|creatine|electrolyte|multivitamin/i.test(blob)){
      out.push({id:String(id),name:item.name||String(id),brand:item.brand||'',text:blob});
    }
  }
  return out;
}

function analyzeOverlaps(items,selectedIds){
  var chosen=items.filter(function(it){return selectedIds.indexOf(it.id)!==-1});
  var overlaps=[];
  for(var n=0;n<NUTRIENTS.length;n++){
    var nut=NUTRIENTS[n];
    var hits=[];
    for(var i=0;i<chosen.length;i++){
      if(nut.re.test(chosen[i].text))hits.push(chosen[i].name);
    }
    if(hits.length>=2){
      overlaps.push({label:nut.label,ul:nut.ul,products:hits});
    }
  }
  return {chosen:chosen,overlaps:overlaps};
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function makeSig(items,selected){
  return items.map(function(it){return it.id}).join(',')+'|'+selected.join(',');
}

function renderPanel(items,selected,sig){
  var analysis=analyzeOverlaps(items,selected);

  var el=document.createElement('details');
  el.id=PANEL_ID;
  el.className='ol-stack-panel';
  el.dataset.sig=sig;

  var summaryText='Supplement Stack Overlap ('+selected.length+' selected)';
  var body='';
  if(items.length===0){
    body='<p class="ol-stack-empty">Save 2 or more supplements in Library to check for overlapping nutrients against published NIH upper limits.</p>';
  }else{
    body+='<div class="ol-stack-list">';
    for(var i=0;i<items.length;i++){
      var it=items[i];
      var checked=selected.indexOf(it.id)!==-1?' checked':'';
      body+='<label class="ol-stack-item"><input type="checkbox" data-stack-id="'+escapeHtml(it.id)+'"'+checked+'><span>'+escapeHtml(it.name)+(it.brand?' <small>('+escapeHtml(it.brand)+')</small>':'')+'</span></label>';
    }
    body+='</div>';
    if(selected.length<2){
      body+='<p class="ol-stack-note">Select at least 2 supplements above to check for overlapping nutrients.</p>';
    }else if(analysis.overlaps.length===0){
      body+='<p class="ol-stack-ok">No overlapping tracked nutrients detected across your '+selected.length+' selected supplements.</p>';
    }else{
      body+='<div class="ol-stack-alerts">';
      for(var j=0;j<analysis.overlaps.length;j++){
        var ov=analysis.overlaps[j];
        body+='<div class="ol-stack-alert"><strong>'+escapeHtml(ov.label)+' overlap ('+ov.products.length+' products)</strong><div>'+escapeHtml(ov.products.join(' · '))+'</div><small>'+escapeHtml(ov.ul)+'</small></div>';
      }
      body+='</div>';
    }
    body+='<p class="ol-stack-disclaimer">Reference only — verify exact mg/mcg amounts on each physical label. Not medical advice.</p>';
  }

  el.innerHTML='<summary>'+escapeHtml(summaryText)+'</summary><div class="ol-stack-body">'+body+'</div>';
  el.addEventListener('change',function(e){
    var input=e.target;
    if(!input||!input.hasAttribute('data-stack-id'))return;
    var id=input.getAttribute('data-stack-id');
    var cur=readStackIds();
    var idx=cur.indexOf(id);
    if(input.checked&&idx===-1)cur.push(id);
    if(!input.checked&&idx!==-1)cur.splice(idx,1);
    saveStackIds(cur);
    sync(true);
  });
  return el;
}

function sync(keepOpen){
  frame=0;
  var savedArea=document.getElementById('savedArea')||document.getElementById('library');
  if(!savedArea)return;
  var items=getSavedSupplements();
  var selected=readStackIds().filter(function(id){
    return items.some(function(it){return it.id===id});
  });
  var sig=makeSig(items,selected);
  var existing=document.getElementById(PANEL_ID);
  if(existing&&existing.parentNode===savedArea&&existing.dataset.sig===sig)return;
  ensureCss();
  var wasOpen=keepOpen||(existing&&existing.open);
  var fresh=renderPanel(items,selected,sig);
  if(wasOpen)fresh.open=true;
  if(existing){existing.replaceWith(fresh)}
  else{savedArea.appendChild(fresh)}
}

function schedule(){if(!frame)frame=requestAnimationFrame(function(){sync(false)})}
var lib=document.getElementById('library');
if(lib){
  new MutationObserver(schedule).observe(lib,{attributes:true,attributeFilter:['data-tab','hidden']});
}
window.addEventListener('storage',schedule);
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',schedule)}
else{schedule()}

window.OLSupplementStack={getSavedSupplements:getSavedSupplements,analyzeOverlaps:analyzeOverlaps,sync:sync};
})();

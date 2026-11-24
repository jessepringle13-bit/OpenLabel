(function(){'use strict';
var STYLE_ID='ol-claim-css';
var CARD_ID='olClaimReality';
var PANEL_ID='olPanelClaims';
var frame=0;

var CLAIMS=[
  {id:'natural',label:'Natural',re:/\bnatural\b/i,rule:'FDA has no formal binding definition for "natural" on most foods, though it generally expects no added artificial colors or synthetic substances.',doesNot:'Does not regulate farming methods, pesticides, antibiotics, or processing.',check:'Check the ingredient list for refined sugars, seed oils, or flavor carriers.'},
  {id:'no_added_sugar',label:'No Added Sugar',re:/no\s+added\s+sugar/i,rule:'Means no sugar or sugar-containing ingredient was added during processing or packaging.',doesNot:'Does not mean zero sugar or low calorie—naturally occurring sugars still count.',check:'Check Total Sugars and serving size in Nutrition Facts.'},
  {id:'clinically_studied',label:'Clinically Studied',re:/clinically\s+(studied|tested|proven)/i,rule:'Must be truthful and non-misleading under FTC guidelines, but often refers to a single ingredient.',doesNot:'Does not automatically mean the finished blended product was tested in a human trial.',check:'Check whether the dose per serving matches the studied ingredient amount.'},
  {id:'immune_support',label:'Immune Support',re:/immune\s+support|supports?\s+immunity/i,rule:'A structure/function claim allowed on supplements without pre-market FDA approval.',doesNot:'Does not prove the product prevents, treats, or cures infections or illness.',check:'Look for the required FDA disclaimer and check which specific vitamins/minerals are listed.'},
  {id:'organic',label:'USDA Organic',re:/\borganic\b/i,rule:'"USDA Organic" requires at least 95% certified organic ingredients; "Made with Organic" requires at least 70%.',doesNot:'Does not automatically mean low sugar, low sodium, or minimally processed.',check:'Check Nutrition Facts and added sugars just like conventional foods.'},
  {id:'sugar_free',label:'Sugar-Free',re:/sugar[\s-]*free|zero\s+sugar/i,rule:'FDA defines "sugar-free" as less than 0.5 grams of sugar per labeled serving.',doesNot:'Does not mean unsweetened—artificial sweeteners or sugar alcohols may be used.',check:'Scan ingredients for sucralose, acesulfame K, stevia, erythritol, or allulose.'},
  {id:'whole_grain',label:'Made with Whole Grain',re:/whole\s+grain/i,rule:'Indicates whole grain is present, but "made with" has no strict minimum percentage.',doesNot:'Does not guarantee whole grain is the primary flour.',check:'Check if a whole grain is the first ingredient and compare Dietary Fiber per serving.'}
];

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='claim-reality.css?v=20261124-cr1';
  document.head.appendChild(l);
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function renderDetail(c){
  return '<div class="ol-cr-detail">'+
    '<p><strong>What the rule requires:</strong> '+escapeHtml(c.rule)+'</p>'+
    '<p><strong>What it does not prove:</strong> '+escapeHtml(c.doesNot)+'</p>'+
    '<p><strong>What to check on the back:</strong> '+escapeHtml(c.check)+'</p>'+
  '</div>';
}

function mountHomeCard(){
  var host=document.getElementById('home')||document.getElementById('scan')||document.querySelector('main');
  if(!host||document.getElementById(CARD_ID))return;
  ensureCss();
  var el=document.createElement('details');
  el.id=CARD_ID;
  el.className='ol-cr-card';
  var chips='';
  for(var i=0;i<CLAIMS.length;i++){
    chips+='<button type="button" class="ol-cr-chip'+(i===0?' is-on':'')+'" data-claim-id="'+CLAIMS[i].id+'">'+escapeHtml(CLAIMS[i].label)+'</button>';
  }
  el.innerHTML='<summary>Claim Reality Check <small>Decode front-of-package labels</small></summary>'+
    '<div class="ol-cr-body"><div class="ol-cr-chips">'+chips+'</div><div class="ol-cr-out">'+renderDetail(CLAIMS[0])+'</div></div>';
  el.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.ol-cr-chip'):null;
    if(!btn)return;
    var id=btn.getAttribute('data-claim-id');
    var found=CLAIMS.find(function(x){return x.id===id});
    if(!found)return;
    var all=el.querySelectorAll('.ol-cr-chip');
    for(var j=0;j<all.length;j++)all[j].classList.toggle('is-on',all[j]===btn);
    var out=el.querySelector('.ol-cr-out');
    if(out)out.innerHTML=renderDetail(found);
  });
  host.appendChild(el);
}

function syncPanel(){
  frame=0;
  var panel=document.getElementById('olPanel');
  if(!panel||panel.hidden)return;
  var anchor=panel.querySelector('#olEvidenceConfidence')||panel.querySelector('.ol-ing-explore');
  if(!anchor||!anchor.parentNode)return;
  var titleEl=panel.querySelector('h1, h2, .olp-title, .prod-name');
  var text=(titleEl?titleEl.textContent:'')+' '+(document.getElementById('labelFacts')?document.getElementById('labelFacts').textContent:'');
  var matched=CLAIMS.filter(function(c){return c.re.test(text)});
  var existing=panel.querySelector('#'+PANEL_ID);
  if(matched.length===0){
    if(existing)existing.remove();
    return;
  }
  var sig=matched.map(function(c){return c.id}).join(',');
  if(existing&&existing.dataset.sig===sig)return;
  ensureCss();
  var box=document.createElement('details');
  box.id=PANEL_ID;
  box.className='ol-cr-panel';
  box.dataset.sig=sig;
  var inner='';
  for(var i=0;i<matched.length;i++){
    inner+='<div class="ol-cr-item"><strong>'+escapeHtml(matched[i].label)+':</strong> '+escapeHtml(matched[i].rule)+' <em>Check:</em> '+escapeHtml(matched[i].check)+'</div>';
  }
  box.innerHTML='<summary>Claim Reality Check ('+matched.length+' matched on label)</summary><div class="ol-cr-list">'+inner+'</div>';
  if(existing){existing.replaceWith(box)}
  else{anchor.parentNode.insertBefore(box,anchor.nextSibling)}
}

function schedule(){if(!frame)frame=requestAnimationFrame(syncPanel)}
var panelEl=document.getElementById('olPanel');
if(panelEl){
  new MutationObserver(schedule).observe(panelEl,{attributes:true,attributeFilter:['hidden'],childList:true});
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){mountHomeCard();schedule()});
}else{
  mountHomeCard();
  schedule();
}

window.OLClaimReality={claims:CLAIMS,syncPanel:syncPanel};
})();

(function(){'use strict';
var STYLE_ID='ol-share-card-css';
var BTN_ID='olShareWorkBtn';
var frame=0;

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='share-card.css?v=20261124-sh1';
  document.head.appendChild(l);
}

function buildSummary(panel){
  var titleEl=panel.querySelector('h1, h2, .olp-title, .prod-name');
  var title=titleEl?titleEl.textContent.trim():'Scanned product';
  var ec=panel.querySelector('#olEvidenceConfidence');
  var ecText=ec?ec.querySelector('.ol-ec-metrics').textContent.replace(/\s+/g,' ').trim():'';
  var lines=[
    'OpenLabel — Show Your Work',
    'Product: '+title
  ];
  if(ecText)lines.push('Coverage: '+ecText);
  lines.push('Shared from OpenLabel (factual label breakdown, not a safety score)');
  if(location&&location.origin&&location.origin!=='null')lines.push(location.origin+location.pathname);
  return lines.join('\n');
}

function shareNow(panel,btn){
  var text=buildSummary(panel);
  var orig=btn.textContent;
  function flash(msg){
    btn.textContent=msg;
    setTimeout(function(){btn.textContent=orig},2000);
  }
  if(navigator.share){
    navigator.share({title:'OpenLabel summary',text:text}).then(function(){
      flash('Shared');
    }).catch(function(err){
      if(err&&err.name==='AbortError')return;
      fallbackCopy(text,flash);
    });
  }else{
    fallbackCopy(text,flash);
  }
}

function fallbackCopy(text,flash){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){
      flash('Copied summary');
    }).catch(function(){
      flash('Copy unavailable');
    });
  }else{
    flash('Copy unavailable');
  }
}

function sync(){
  frame=0;
  var panel=document.getElementById('olPanel');
  if(!panel||panel.hidden)return;
  var ec=panel.querySelector('#olEvidenceConfidence');
  if(!ec)return;
  ensureCss();
  if(panel.querySelector('#'+BTN_ID))return;
  var btn=document.createElement('button');
  btn.id=BTN_ID;
  btn.type='button';
  btn.className='ol-share-btn';
  btn.textContent='Share “Show Your Work” summary';
  btn.addEventListener('click',function(){shareNow(panel,btn)});
  ec.appendChild(btn);
}

function schedule(){if(!frame)frame=requestAnimationFrame(sync)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
schedule();

window.OLShareCard={buildSummary:buildSummary,sync:sync};
})();

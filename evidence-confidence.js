(function(){'use strict';
var STYLE_ID='ol-evidence-confidence-css';
var CARD_ID='olEvidenceConfidence';
var frame=0;

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='evidence-confidence.css?v=20261124-ec1';
  document.head.appendChild(l);
}

function summarize(panel){
  var explore=panel.querySelector('.ol-ing-explore');
  if(!explore)return null;
  var rows=explore.querySelectorAll('.ol-ing-row, button.ol-ing-btn, [data-ing-name]');
  var total=rows.length;
  var sourced=0,plain=0,pending=0;
  for(var i=0;i<rows.length;i++){
    var t=(rows[i].textContent||'').toLowerCase();
    if(/not yet reviewed|unknown|no research|unreviewed/.test(t)){
      pending++;
    }else if(/plain food/.test(t)){
      plain++;
    }else{
      sourced++;
    }
  }
  var covered=sourced+plain;
  var pct=total>0?Math.round((covered/total)*100):0;
  var labFound=/lab[- ]tested|usp verified|nsf|consumerlab|informed choice|clean label/i.test(panel.textContent||'');
  var hasFacts=!!document.querySelector('#labelFacts .source');
  return {total:total,sourced:sourced,plain:plain,pending:pending,pct:pct,labFound:labFound,hasFacts:hasFacts};
}

function renderCard(stats){
  var wrap=document.createElement('section');
  wrap.id=CARD_ID;
  wrap.className='ol-ec-card';
  wrap.setAttribute('aria-label','Evidence confidence summary');
  wrap.dataset.sig=[stats.total,stats.sourced,stats.plain,stats.pending,stats.labFound?1:0].join(':');

  var tier=stats.pct>=80?'High coverage':stats.pct>=50?'Moderate coverage':'Partial coverage';
  wrap.innerHTML=
    '<div class="ol-ec-head">'+
      '<span class="ol-ec-title">Evidence confidence</span>'+
      '<span class="ol-ec-note">Coverage, not a safety score</span>'+
    '</div>'+
    '<div class="ol-ec-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+stats.pct+'">'+
      '<div class="ol-ec-fill" style="width:'+stats.pct+'%"></div>'+
    '</div>'+
    '<div class="ol-ec-metrics">'+
      '<span><strong>'+stats.pct+'%</strong> ingredients covered ('+(stats.sourced+stats.plain)+'/'+stats.total+')</span>'+
      '<span><strong>'+tier+'</strong></span>'+
      '<span>'+(stats.labFound?'Independent lab info found':'No independent lab test found')+'</span>'+
    '</div>';
  return wrap;
}

function sync(){
  frame=0;
  var panel=document.getElementById('olPanel');
  if(!panel||panel.hidden)return;
  var explore=panel.querySelector('.ol-ing-explore');
  if(!explore||!explore.parentNode)return;
  var stats=summarize(panel);
  if(!stats||stats.total===0)return;
  ensureCss();
  var sig=[stats.total,stats.sourced,stats.plain,stats.pending,stats.labFound?1:0].join(':');
  var existing=panel.querySelector('#'+CARD_ID);
  if(existing&&existing.dataset.sig===sig)return;
  var card=renderCard(stats);
  if(existing){existing.replaceWith(card)}
  else{explore.parentNode.insertBefore(card,explore)}
}

function schedule(){if(!frame)frame=requestAnimationFrame(sync)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
schedule();
window.OLEvidenceConfidence={summarize:summarize,sync:sync};
})();

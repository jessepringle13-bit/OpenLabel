(function(){
'use strict';
/* Library markers and recent changes (Roadmap batch 4).
   Keeps a small local snapshot of each live product's label data, marks Saved and Recent cards
   with source, last-seen time and a "label changed" marker, and lists recent changes.
   Everything stays in this browser. A change only means the Open Food Facts record changed;
   it does not say whether the package in your hand changed. */
var KEY='openlabel-calm-dock-v1',SK='openlabel-library-v1',MAXP=60,MAXCHECK=10;
var API='https://world.openfoodfacts.org/api/v2/product/',FIELDS='code,product_name,product_name_en,brands,ingredients_text,ingredients_text_en,allergens_tags,traces_tags,additives_tags,quantity,serving_size';
var lib=document.getElementById('library'),saved=document.getElementById('savedArea'),hist=document.getElementById('historyArea'),result=document.getElementById('result');
if(!lib||!saved||!hist)return;
var sty=document.createElement('style');
sty.textContent='.lb-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.lb-tag{display:inline-block;font-size:11px;font-weight:760;line-height:1.2;padding:4px 8px;border-radius:99px;background:var(--sage);color:var(--forest)}.lb-tag.grey{background:#ECEDEA;color:#4C5753}.lb-tag.orange{background:#FBE3D6;color:#7A3A1B}.lb-changes{display:grid;gap:8px}.lb-change{background:#FFF7F2;border:1px solid #F1C9B3;border-radius:16px;padding:12px 14px}.lb-change strong{display:block;color:var(--ink)}.lb-change p{margin:4px 0 0;font-size:13px;color:var(--muted)}.lb-change ul{margin:6px 0 0;padding-left:18px;font-size:13px;color:var(--ink)}.lb-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.lb-actions button{min-height:44px;border-radius:12px;padding:0 14px;background:var(--eucalyptus);color:var(--ivory);font-weight:750}.lb-actions button[disabled]{opacity:.6}.lb-open{margin-top:8px;min-height:44px;border-radius:12px;padding:0 14px;background:var(--eucalyptus);color:var(--ivory);font-weight:750}.lb-change li{margin-bottom:6px}.lb-change li div{font-size:12.5px;color:var(--muted);word-break:break-word}.lb-status{font-size:13px;color:var(--muted);margin:0}';
document.head.appendChild(sty);

function st(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function ld(){try{var o=JSON.parse(localStorage.getItem(SK));return o&&typeof o==='object'?o:{}}catch(e){return {}}}
function sv(o){try{var ks=Object.keys(o);if(ks.length>MAXP){ks.sort(function(a,b){return (o[a].lastSeen||0)-(o[b].lastSeen||0)});ks.slice(0,ks.length-MAXP).forEach(function(k){delete o[k]})}localStorage.setItem(SK,JSON.stringify(o))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function tagName(t){return String(t).replace(/^[a-z]{2}:/,'').replace(/-/g,' ')}
function clean(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim()}
function list(a){return (a||[]).map(clean).filter(Boolean).sort().join('|')}
function nq(v){return clean(v).replace(/\s*[e℮]$/,'').replace(/\s+/g,'')}
function trim(t){t=String(t);return t.length>160?t.slice(0,157)+'…':t}
function ago(t){if(!t)return '';var s=Math.max(0,(Date.now()-t)/1000);if(s<90)return 'just now';var m=s/60;if(m<60)return Math.round(m)+' min ago';var h=m/60;if(h<36)return Math.round(h)+' h ago';var d=h/24;if(d<14)return Math.round(d)+' days ago';return new Date(t).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}

/* Label fields compared between snapshots. Built the same way from a stored product or a fresh API record. */
var LABELS={ing:'Ingredients',alle:'Allergens listed',tr:'May contain (traces)',add:'Additives listed',qty:'Package size',srv:'Serving size'};
function fromProduct(p){var f={};(p.facts||[]).forEach(function(r){f[r[0]]=r[1]});
  return {ing:clean(f['Ingredients']),alle:list(String(f['Allergens listed']||'').split(',')),tr:list(String(f['May contain (traces)']||'').split(',')),add:list(String(f['Additives listed']||'').split(',')),qty:nq(f['Package size']),srv:clean(f['Serving size'])}}
function fromApi(p){return {ing:clean(String(p.ingredients_text_en||p.ingredients_text||'').trim().slice(0,1200)),alle:list((p.allergens_tags||[]).map(tagName)),tr:list((p.traces_tags||[]).map(tagName)),add:list((p.additives_tags||[]).map(function(t){return tagName(t).toUpperCase()})),qty:nq(p.quantity),srv:clean(p.serving_size)}}
function diff(a,b){if(!a||!b)return [];return Object.keys(LABELS).filter(function(k){return (a[k]||'')!==(b[k]||'')&&(a[k]||b[k])})}

/* Record a sighting of a product. Returns the list of changed fields, if any. */
function record(id,fp,name,brand,via){var o=ld(),now=Date.now(),e=o[id];
  if(!e){o[id]={firstSeen:now,lastSeen:now,name:name,brand:brand,fp:fp,changes:[]};sv(o);return []}
  var ch=diff(e.fp,fp);e.lastSeen=now;e.name=name||e.name;e.brand=brand||e.brand;
  if(ch.length){var dd=ch.map(function(k){return {k:k,from:String((e.fp||{})[k]||'').slice(0,400),to:String(fp[k]||'').slice(0,400)}});e.changes=[{at:now,fields:ch,d:dd,via:via||'scan'}].concat(e.changes||[]).slice(0,5);e.fp=fp;e.seenChange=false}
  o[id]=e;sv(o);return ch}

function currentId(){var s=st();return (s.history||[])[0]||null}
function onResult(){var id=currentId();if(!id)return;var s=st(),p=(s.live||{})[id];var o=ld();
  if(p&&p.facts){record(id,fromProduct(p),p.name,p.brand,'scan')}
  else{var e=o[id]||{firstSeen:Date.now(),changes:[]};e.lastSeen=Date.now();o[id]=e;sv(o)}}

/* Card decoration. index.html builds cards in the same order as state.saved/state.history, skipping ids it cannot resolve. */
function resolvable(s,id){return !!((s.live||{})[id])||!/^\d+$/.test(id)}
function idsFor(area,s){var src=area===saved?(s.saved||[]):(s.history||[]);return src.filter(function(id){return resolvable(s,id)})}
function decorate(area){var s=st(),o=ld(),ids=idsFor(area,s),cards=area.querySelectorAll('button.card');
  if(cards.length!==ids.length)return;
  cards.forEach(function(c,i){var id=ids[i],e=o[id],live=!!(s.live||{})[id],box=c.querySelector('.grow');if(!box)return;var oldm=box.querySelector('.lb-meta');if(oldm)oldm.remove();
    var m=el('span','lb-meta');if(e&&e.lastSeen)m.append(el('span','lb-tag grey','Seen '+ago(e.lastSeen)));
    var last=e&&e.changes&&e.changes[0];
    if(last&&!last.dismissed&&(Date.now()-last.at)<30*864e5)m.append(el('span','lb-tag orange','Database record changed '+ago(last.at)));
    box.append(m)})}

var changesHead,changesArea,actions,btn,status;
function build(){
  changesHead=el('div','section-head');changesHead.append(el('h2',null,'Recent changes'));
  changesArea=el('div','lb-changes');
  actions=el('div','lb-actions');btn=el('button',null,'Check saved for changes');btn.type='button';status=el('p','lb-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');actions.append(btn,status);
  var first=lib.querySelector('.section-head');lib.insertBefore(changesHead,first);lib.insertBefore(changesArea,first);lib.insertBefore(actions,first);
  btn.onclick=checkSaved}
function renderChanges(){var s=st(),o=ld(),keep={};(s.saved||[]).concat(s.history||[]).forEach(function(id){keep[id]=1});
  var rows=Object.keys(o).filter(function(id){return keep[id]&&o[id].changes&&o[id].changes.length&&!o[id].changes[0].dismissed}).map(function(id){return {id:id,e:o[id]}}).sort(function(a,b){return b.e.changes[0].at-a.e.changes[0].at}).slice(0,5);
  changesArea.replaceChildren();
  if(!rows.length){var d=el('div','card empty','No changes found yet. When the Open Food Facts record for a saved or recent product changes, it will show here.');changesArea.append(d);return}
  rows.forEach(function(r){var c=r.e.changes[0],box=el('div','lb-change');box.append(el('strong',null,(r.e.brand?r.e.brand+' · ':'')+(r.e.name||'Product')));
    box.append(el('p',null,'Changed in the Open Food Facts record '+ago(c.at)+' ('+(c.via==='check'?'found by a saved-product check':'found when scanned again')+'):'));
    var ul=el('ul');(c.d||c.fields.map(function(k){return {k:k}})).forEach(function(x){var li=el('li');li.append(el('strong',null,LABELS[x.k]||x.k));if(x.from!==undefined){var isList=/^(alle|tr|add)$/.test(x.k);if(isList){var a=x.from?x.from.split('|'):[],b=x.to?x.to.split('|'):[],added=b.filter(function(i){return a.indexOf(i)<0}),removed=a.filter(function(i){return b.indexOf(i)<0});if(added.length)li.append(el('div',null,'Now also listed: '+added.join(', ')));if(removed.length)li.append(el('div',null,'No longer listed: '+removed.join(', ')))}else{li.append(el('div',null,'Before: '+(x.from?trim(x.from):'not listed')));li.append(el('div',null,'Now: '+(x.to?trim(x.to):'not listed')))}}ul.append(li)});box.append(ul);
    box.append(el('p',null,'Level 1 of 3: the database record changed. This is not proof the label or product was reformulated (level 2), and only you can confirm the package in your hand changed (level 3). Old snapshots can also be incomplete.'));
    var go=el('button','lb-open','See current details');go.type='button';go.onclick=function(){if(window.OLOpenCode){var nav=document.querySelector('.nav-pill[data-go="scan"]');window.OLOpenCode(r.id)}};box.append(go);var dm=el('button','lb-open','Dismiss');dm.type='button';dm.style.marginLeft='8px';dm.style.background='var(--sage)';dm.style.color='var(--forest)';dm.onclick=function(){var oo=ld();if(oo[r.id]&&oo[r.id].changes[0]){oo[r.id].changes[0].dismissed=true;sv(oo)}refresh()};box.append(dm);
    changesArea.append(box)})}

var busy=false;
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
async function fetchOne(code){var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},12000);try{var res=await fetch(API+code+'.json?fields='+FIELDS,{signal:ctl.signal});if(!res.ok)return null;var d=await res.json();return d&&d.product&&Object.keys(d.product).length?d.product:null}catch(e){return null}finally{clearTimeout(t)}}
async function checkSaved(){if(busy)return;var s=st(),ids=(s.saved||[]).filter(function(id){return /^\d+$/.test(id)&&(s.live||{})[id]}).slice(0,MAXCHECK);
  if(!ids.length){status.textContent='No saved Open Food Facts products to check. Sample products do not change.';return}
  busy=true;btn.disabled=true;var changed=0,failed=0;
  for(var i=0;i<ids.length;i++){status.textContent='Checking '+(i+1)+' of '+ids.length+'…';var p=await fetchOne(ids[i]);
    if(!p){failed++}else{var lp=s.live[ids[i]],o=ld();if(!o[ids[i]]&&lp&&lp.facts)record(ids[i],fromProduct(lp),lp.name,lp.brand,'check');var ch=record(ids[i],fromApi(p),lp&&lp.name,lp&&lp.brand,'check');if(ch.length)changed++}
    if(i<ids.length-1)await sleep(4500)}
  busy=false;btn.disabled=false;
  status.textContent='Checked '+(ids.length-failed)+' of '+ids.length+'. '+(changed?changed+' changed.':'No changes found.')+(failed?' '+failed+' could not be reached.':'')+' Scan a changed product to see its current details.';
  refresh()}

function refresh(){if(!changesArea)build();renderChanges();decorate(saved);decorate(hist)}
new MutationObserver(function(){if(!lib.hidden)refresh()}).observe(lib,{attributes:true,attributeFilter:['hidden']});
[saved,hist].forEach(function(a){new MutationObserver(function(){decorate(a)}).observe(a,{childList:true})});
if(result)new MutationObserver(function(){if(!result.hidden)onResult()}).observe(result,{attributes:true,attributeFilter:['hidden']});
if(result&&!result.hidden)onResult();
refresh();
window.OLLibrary={refresh:refresh,checkSaved:checkSaved};
})();

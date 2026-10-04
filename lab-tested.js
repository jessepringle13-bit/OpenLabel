(function(){
'use strict';
var TS={'crb-gerber-rice':['orange',"Above tester's limit"],'crb-gg-puree':['orange',"Above tester's limit"],'crb-mummum':['orange','Elevated BPA'],'crp-naked':['red',"Tester advises avoiding"],'crp-huel':['red',"Tester advises avoiding"],'crp-garden':['orange',"Above tester's limit"],'crp-serious':['orange',"Above tester's limit"],'crp-musclemech':['grey','Lead not detected in lots tested'],'crc-hershey-cocoa':['orange',"Above tester's limit"],'crc-droste':['orange',"Above tester's limit"],'crc-hershey-milk':['grey',"Below tester's limit, detected"],'crr-lundberg-cilantro':['orange','Above tester\u2019s marks'],'crj-welch-grape':['orange','Lead above tester\u2019s mark'],'crw-starkey':['orange',"Above tester's level"],'crw-deer-park':['grey','Detected, low level']};
var RK={red:4,orange:3,yellow:2,green:1,grey:0};
var sty=document.createElement('style');
sty.textContent='#olLab{position:fixed;z-index:14;inset:0;left:50%;transform:translateX(-50%);width:min(100%,520px);background:var(--oat);overflow-y:auto;overscroll-behavior:contain;padding:calc(14px + env(safe-area-inset-top)) 18px calc(40px + env(safe-area-inset-bottom))}#olLab[hidden]{display:none}.lab-top{display:flex;align-items:center;gap:12px;margin-bottom:6px}.lab-top button{width:43px;height:43px;border-radius:50%;background:var(--ivory);border:1px solid var(--line);color:var(--forest);font-size:23px}.lab-top h2{font-size:24px}.lab-sub{color:var(--muted);font-size:13px;margin:4px 2px 12px}.lab-q{width:100%;height:48px;border-radius:14px;border:1px solid #BFCADD;background:var(--ivory);color:var(--ink);padding:0 14px;font:inherit}.lab-chips{display:flex;gap:8px;overflow-x:auto;padding:10px 0 8px;scrollbar-width:none}.lab-chips::-webkit-scrollbar{display:none}.lab-chips button{white-space:nowrap;border-radius:99px;padding:9px 14px;background:var(--ivory);border:1px solid var(--line);color:var(--forest);font-size:13px;font-weight:740;min-height:40px}.lab-chips button.on{background:var(--eucalyptus);color:var(--ivory);border-color:var(--eucalyptus)}.lab-h{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--eucalyptus);font-weight:800;margin:16px 2px 8px}.lab-it{display:block;width:100%;text-align:left;background:var(--ivory);border:1px solid var(--line);border-left-width:5px;border-radius:16px;margin:0 0 10px;padding:13px 14px}.lab-it.c-red{border-left-color:#B4412E}.lab-it.c-orange{border-left-color:#D77F22}.lab-it.c-green{border-left-color:#3E8A4F}.lab-it.c-grey{border-left-color:#8A948F}.lab-t{font-weight:760;color:var(--ink)}.lab-r{font-size:14px;color:var(--muted);margin-top:4px}.lab-m{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center;font-size:12px;color:var(--muted)}.lab-c{border-radius:99px;padding:3px 9px;font-weight:780;font-size:11px}.lab-c.c-red{background:#FCE9E4;color:#8F2E1E}.lab-c.c-orange{background:#FCEEDB;color:#85470B}.lab-c.c-green{background:#E2F0E5;color:#24633A}.lab-c.c-grey{background:#ECEFED;color:#4B5651}.lab-note{font-size:12px;color:var(--muted);margin:10px 2px}.lab-empty{padding:26px 14px;text-align:center;color:var(--muted)}.lab-retry{width:100%;min-height:48px;border-radius:14px;background:var(--sage);color:var(--forest);font-weight:750;margin:6px 0}';
document.head.appendChild(sty);
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function cut(s,n){s=String(s||'').trim();return s.length>n?s.slice(0,n-1)+'…':s}
var items=null,state='idle',filter='all',query='',root,listEl,qEl,chipEl,subEl;
function stat(e){return TS[e.id]||(e.kind==='category'?['grey','Category-level']:['grey','Test on file'])}
function catOf(e){if(e.category)return e.category;var id=String(e.id||'');if(id.indexOf('crb-')===0)return 'Baby foods';if(id.indexOf('crp-')===0||id==='clp-protein')return 'Protein powders';return 'Other'}
function load(){if(state==='loading'||items)return;state='loading';render();
fetch('registry.json').then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(j){items=(j.entries||[]).map(function(e){var s=stat(e);return{e:e,color:s[0],chip:s[1],cat:catOf(e)}}).sort(function(a,b){return RK[b.color]-RK[a.color]||String(a.e.title).localeCompare(String(b.e.title))});state='done';chips();render()}).catch(function(){state='error';render()})}
function cats(){var m={},o=[];items.forEach(function(it){if(!m[it.cat]){m[it.cat]=0;o.push(it.cat)}m[it.cat]++});o.sort(function(a,b){return a==='Other'?1:b==='Other'?-1:a.localeCompare(b)});return o.map(function(c){return[c,m[c]]})}
function chips(){chipEl.replaceChildren();var list=[['all','All',items.length]].concat(cats().map(function(c){return[c[0],c[0],c[1]]}));
list.forEach(function(c){var b=el('button',c[0]===filter?'on':'',c[1]+' ('+c[2]+')');b.onclick=function(){filter=c[0];chips();render()};chipEl.append(b)})}
function match(it){if(filter!=='all'&&it.cat!==filter)return false;if(query){var h=(it.e.title+' '+it.e.tester+' '+it.e.result+' '+it.cat).toLowerCase();if(h.indexOf(query)<0)return false}return true}
function card(it){var e=it.e,b=el('button','lab-it c-'+it.color);b.append(el('div','lab-t',e.title),el('div','lab-r',cut(String(e.result).split('. ')[0],170)));
var m=el('div','lab-m'),c=el('span','lab-c c-'+it.color,it.chip);m.append(c,document.createTextNode(e.tester+' · '+e.published+(e.kind==='category'?' · not a specific product':'')));b.append(m);
b.onclick=function(){var a=window.OLEvidence&&window.OLEvidence.api;if(a)a.openTestSheet(e)};return b}
function render(){if(!root)return;listEl.replaceChildren();
if(state==='loading'||state==='idle'){listEl.append(el('div','lab-empty','Loading…'));return}
if(state==='error'){listEl.append(el('div','lab-empty','We could not load the test register just now.'));var rb=el('button','lab-retry','Try again');rb.onclick=function(){state='idle';load()};listEl.append(rb);return}
var cs=cats();subEl.textContent=items.length+' tests in '+cs.length+' categories. Each one shows who tested, what they found and how they judged it.';
var all=items.filter(match);if(!all.length)listEl.append(el('div','lab-empty','No tests match your search or filter.'));
cs.forEach(function(c){var g=all.filter(function(it){return it.cat===c[0]});if(!g.length)return;listEl.append(el('div','lab-h',c[0]+' · '+g.length));g.forEach(function(it){listEl.append(card(it))})});
listEl.append(el('p','lab-note','This is a small set. Testers are magazines and nonprofits. Each entry describes who funds the tester, using the tester\u2019s own statements and trade press, which is not an independent audit. Results describe the lots tested at the time, not every lot. Colors follow the tester’s own limit: red is above it, orange is elevated, green is not detected, grey is category-level.'))}
function build(){root=el('section');root.id='olLab';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-label','Lab tested products');
var top=el('div','lab-top'),bk=el('button',null,'‹');bk.setAttribute('aria-label','Close lab tested products');bk.onclick=close;top.append(bk,el('h2',null,'Lab tested'));
subEl=el('p','lab-sub','Independent test results for contaminants.');
qEl=el('input','lab-q');qEl.type='search';qEl.placeholder='Search product, brand or tester';qEl.setAttribute('aria-label','Search lab tested products');qEl.oninput=function(){query=qEl.value.trim().toLowerCase();render()};
chipEl=el('div','lab-chips');
listEl=el('div');root.append(top,subEl,qEl,chipEl,listEl);document.body.append(root);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root&&!root.hidden&&document.getElementById('sheetWrap').hidden)close()})}
function open(){if(!root)build();root.hidden=false;root.scrollTop=0;load();render();var b=root.querySelector('.lab-top button');if(b)b.focus({preventScroll:true})}
function close(){if(root)root.hidden=true}
function entry(){var b=el('button','card asbutton row lab-entry'),th=el('span','thumb','⚗'),g=el('span','grow');g.append(el('strong',null,'Lab tested'),el('small',null,'Independent contaminant test results'));b.append(th,g,el('span','chevron','›'));b.onclick=open;return b}
function put(host,anchorFn){if(!host||host.querySelector('.lab-entry'))return;var last=[].slice.call(host.querySelectorAll('.rcp-entry')).pop();if(last)last.after(entry());else anchorFn(host)}
function inject(){put(document.getElementById('home'),function(h){var cta=h.querySelector('.scan-cta');if(cta)cta.after(entry());else h.prepend(entry())});put(document.getElementById('explore'),function(x){var f=x.firstElementChild;if(f)f.after(entry())})}
inject();
var sw=document.getElementById('sheetWrap');
if(sw){new MutationObserver(function(){if(!sw.hidden){var top=function(){var s=sw.querySelector('.sheet');if(s)s.scrollTop=0};top();requestAnimationFrame(top);setTimeout(top,80)}}).observe(sw,{attributes:true,attributeFilter:['hidden']})}
window.OLLab={open:open};
})();

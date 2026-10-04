(function(){
'use strict';
var CSS=`.ec{margin-top:4px}.ec-status{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 6px}.ec-badge{display:inline-flex;border-radius:99px;padding:6px 11px;background:#f9e8df;color:#7a432c;font-size:12px;font-weight:780}.ec p.small{margin:6px 0 12px;color:var(--muted);font-size:13px}.ec details{border-top:1px solid var(--line)}.ec details:last-of-type{border-bottom:1px solid var(--line)}.ec summary{list-style:none;cursor:pointer;min-height:52px;padding:10px 2px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:760;color:var(--forest)}.ec summary::-webkit-details-marker{display:none}.ec summary::after{content:'+';font-size:22px;color:var(--eucalyptus);font-weight:500}.ec details[open] summary::after{content:'−'}.ec summary small{display:block;font-weight:700;font-size:12px;color:#7a432c;margin-top:2px}.ec-body{padding:0 2px 14px;font-size:14px}.ec-body h4{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--eucalyptus);margin:12px 0 4px}.ec-body ul{margin:0;padding-left:18px;color:var(--muted)}.ec-body li{margin:4px 0}.ec-body p{margin:0;color:var(--muted)}.ec-src{padding:10px 0;border-top:1px solid var(--line)}.ec-src:first-child{border-top:0}.ec-src strong{display:block;color:var(--forest);font-size:14px}.ec-src span.t{display:block;font-size:13px;color:var(--muted);margin-top:2px}.ec-chip{display:inline-block;margin-top:5px;border-radius:99px;padding:3px 9px;font-size:11px;font-weight:780;background:var(--sage);color:var(--forest)}.ec-chip.flag{background:#f9e8df;color:#7a432c}.ec-chip.part{background:var(--mist);color:var(--forest)}.ec-stance{margin-top:14px;padding:12px 14px;border-radius:14px;background:var(--mist);font-size:13px;color:var(--ink)}.tx h4{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--eucalyptus);margin:14px 0 4px}.tx p{margin:0;color:var(--ink);font-size:14px}.tx ul{margin:0;padding-left:18px;color:var(--muted);font-size:14px}.tx li{margin:4px 0}.tx a{color:var(--forest);font-weight:700;overflow-wrap:anywhere}`;
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
function $(s){return document.querySelector(s)}
function textKey(s){return ' '+String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' '}
var REG=null;
var READY=fetch('registry.json').then(function(r){return r.ok?r.json():null}).then(function(j){REG=j}).catch(function(){});
var SEED_OIL_WORDS=['sunflower oil','sunflower seed oil','safflower oil','canola oil','rapeseed oil','soybean oil','soya oil','corn oil','cottonseed oil','grapeseed oil','rice bran oil'];
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function list(items){var u=el('ul');items.forEach(function(x){u.append(el('li',null,x))});return u}
function details(summary,small,body){var d=el('details'),s=el('summary'),span=el('span',null,summary);if(small)span.append(el('small',null,small));s.append(span);d.append(s,body);return d}
function section(root,h,body){root.append(el('h4',null,h));root.append(typeof body==='string'?el('p',null,body):body)}
function openTestSheet(e){$('#sheetTitle').textContent=e.kind==='product'?'Independent test results':'Testing on this kind of product';
$('#sheetContent').textContent=e.title+'. Tested by '+e.tester+', published '+e.published+'. We are showing what the tester reported and how they judged it. The tester\u2019s funding and ties are described under Who tested it.';
var r=el('div','tx');section(r,'What they found',e.result);section(r,'How they judged it',e.threshold+(e.serving&&e.serving!=='Not per serving'?' Serving used: '+e.serving+'.':''));section(r,'What this does not show',list(e.kind==='product'?e.caveats.concat(['We matched this test to your product by brand and name only. Check that it is the same product, flavor and size.']):e.caveats));
if(e.response)section(r,'Company response',e.response);
section(r,'Who tested it',e.ties+' '+e.check+'.');
var a=el('a',null,e.source.label);a.href=e.source.url;a.target='_blank';a.rel='noopener noreferrer';var p=el('p');p.append(a);section(r,'Source',p);
$('#sheetExtra').replaceChildren(r);$('#sheetWrap').hidden=false;$('#closeSheet').focus()}
function matchEntries(p){var out={prod:[],cat:[]};if(!REG||!REG.entries)return out;var t=textKey([p.brand,p.name,p.category].join(' '));
REG.entries.forEach(function(e){var m=e.match||{};if(e.kind==='product'){if(m.brand&&m.name&&t.indexOf(textKey(m.brand))>=0&&t.indexOf(textKey(m.name))>=0)out.prod.push(e)}else if(m.any&&m.any.some(function(w){return t.indexOf(textKey(w))>=0}))out.cat.push(e)});return out}
window.OLEvidence={renderGeneral:function(){},api:{ready:READY,matchEntries:matchEntries,openTestSheet:openTestSheet,seedWords:SEED_OIL_WORDS,textKey:textKey}};
var lk=document.createElement('link');lk.rel='stylesheet';lk.href='result.css?v=20261004c';document.head.appendChild(lk);
var sc=document.createElement('script');sc.src='result.js?v=20261004c';document.body.appendChild(sc);
})();

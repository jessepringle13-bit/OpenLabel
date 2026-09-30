(function(){
'use strict';
var CSS=`.gen .finding.info{border-left-color:#9DB8AA}.gen .finding.test{border-left-color:#7a9cb0}.ec{margin-top:4px}.ec-status{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 6px}.ec-badge{display:inline-flex;border-radius:99px;padding:6px 11px;background:#f9e8df;color:#7a432c;font-size:12px;font-weight:780}.ec p.small{margin:6px 0 12px;color:var(--muted);font-size:13px}.ec details{border-top:1px solid var(--line)}.ec details:last-of-type{border-bottom:1px solid var(--line)}.ec summary{list-style:none;cursor:pointer;min-height:52px;padding:10px 2px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:760;color:var(--forest)}.ec summary::-webkit-details-marker{display:none}.ec summary::after{content:'+';font-size:22px;color:var(--eucalyptus);font-weight:500}.ec details[open] summary::after{content:'−'}.ec summary small{display:block;font-weight:700;font-size:12px;color:#7a432c;margin-top:2px}.ec-body{padding:0 2px 14px;font-size:14px}.ec-body h4{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--eucalyptus);margin:12px 0 4px}.ec-body ul{margin:0;padding-left:18px;color:var(--muted)}.ec-body li{margin:4px 0}.ec-body p{margin:0;color:var(--muted)}.ec-src{padding:10px 0;border-top:1px solid var(--line)}.ec-src:first-child{border-top:0}.ec-src strong{display:block;color:var(--forest);font-size:14px}.ec-src span.t{display:block;font-size:13px;color:var(--muted);margin-top:2px}.ec-chip{display:inline-block;margin-top:5px;border-radius:99px;padding:3px 9px;font-size:11px;font-weight:780;background:var(--sage);color:var(--forest)}.ec-chip.flag{background:#f9e8df;color:#7a432c}.ec-chip.part{background:var(--mist);color:var(--forest)}.ec-stance{margin-top:14px;padding:12px 14px;border-radius:14px;background:var(--mist);font-size:13px;color:var(--ink)}.tx h4{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--eucalyptus);margin:14px 0 4px}.tx p{margin:0;color:var(--ink);font-size:14px}.tx ul{margin:0;padding-left:18px;color:var(--muted);font-size:14px}.tx li{margin:4px 0}.tx a{color:var(--forest);font-weight:700;overflow-wrap:anywhere}`;
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
function $(s){return document.querySelector(s)}
function textKey(s){return ' '+String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' '}
function hasWord(text,w){return text.includes(textKey(w))}
var REG=null,LAST=null;
fetch('registry.json').then(function(r){return r.ok?r.json():null}).then(function(j){REG=j;var res=$('#result');if(LAST&&res&&!res.hidden)renderGeneral(LAST)}).catch(function(){});
var SEED_OIL_WORDS=['sunflower oil','sunflower seed oil','safflower oil','canola oil','rapeseed oil','soybean oil','soya oil','corn oil','cottonseed oil','grapeseed oil','rice bran oil'];
var SEED_EC={
claims:[
{q:'Do seed oils raise inflammation?',status:'No good evidence for it. Not disproven.',
supports:['Mechanism argument: linoleic acid, the main fat in seed oils, can convert to arachidonic acid, which the body uses to make inflammation signals. This is a lab-level idea, not a measured human outcome.'],
against:['Small, short trials in healthy adults found no rise in blood inflammation markers. The main review was funded by an industry-linked committee.','Pooled studies of 30 groups of people link higher blood linoleic acid levels to fewer heart-disease deaths. Part of that work had a restricted company grant.'],
limits:'The trials measured blood markers, not disease, and lasted days to weeks. Longer-term effects are unknown.'},
{q:'Do linoleic-acid-rich oils help or harm the heart?',status:'Contested.',
supports:['Re-analyses of two old diet trials raised questions about whether these oils help, and possibly about harm (figures not yet verified against the papers).'],
against:['Large observational studies point toward benefit, though they cannot prove cause and have funding flags.'],
limits:'Critiques of the re-analyses have not been read yet, and some old-trial design issues are unverified.'}],
other:'Also under review: a report, seen only through a university article, linking omega-6 fats to a higher breast-cancer risk after menopause and to other outcomes. The primary source has not been checked.',
sources:[
{n:'Trial review of inflammation markers (2012)',f:'Grant from an industry-linked lipids committee. One author reported consulting for two agribusiness companies.',s:'Checked',flag:1},
{n:'Pooled analysis of 30 cohorts (2019)',f:'Part supported by a restricted company grant. The paper says the company had no role in the design, analysis, or writing.',s:'Checked',flag:1},
{n:'Sydney diet trial re-analysis (2013)',f:'An Australian life-insurance research fund is named. Other disclosures not read.',s:'Partly checked'},
{n:'Minnesota diet trial re-analysis (2016)',f:'Original trial was publicly funded. Funding of the re-analysis not found yet.',s:'Partly checked'},
{n:'Systematic review (2022)',f:'Authors declare no competing interests. Funding statement not found yet.',s:'Partly checked'},
{n:'6 more sources (commentaries, news, and a WHO review seen secondhand)',f:'Funding and ties not checked yet.',s:'Not checked'}],
counts:{checked:2,partial:3,none:6,total:11}};
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function list(items){var u=el('ul');items.forEach(function(x){u.append(el('li',null,x))});return u}
function details(summary,small,body){var d=el('details'),s=el('summary'),span=el('span',null,summary);if(small)span.append(el('small',null,small));s.append(span);d.append(s,body);return d}
function buildSeedEc(){var e=SEED_EC,c=e.counts,pending=c.checked<c.total,root=el('div','ec'),st=el('div','ec-status');
st.append(el('span','ec-badge',pending?'Outcome pending checks':'Evidence check: complete'));root.append(st);
root.append(el('p','small',(pending?'We show the arguments and the sources now, and will state an outcome only after every source has been checked. ':'')+'Funding and conflict checks: '+c.checked+' of '+c.total+' sources fully checked, '+c.partial+' partly, '+c.none+' not yet.'));
e.claims.forEach(function(cl){var b=el('div','ec-body');b.append(el('h4',null,'What supports the concern'),list(cl.supports),el('h4',null,'What argues against it'),list(cl.against),el('h4',null,'Limits'),list([cl.limits]));root.append(details(cl.q,pending?'Outcome pending checks':cl.status,b))});
var sb=el('div','ec-body');e.sources.forEach(function(s){var d=el('div','ec-src');d.append(el('strong',null,s.n),el('span','t',s.f),el('span','ec-chip'+(s.flag?' flag':(s.s==='Partly checked'?' part':'')),s.s+(s.flag?' - flag':'')));sb.append(d)});
root.append(details('Sources and funding',c.checked+' checked, '+c.partial+' partly, '+c.none+' not yet',sb));
var ob=el('div','ec-body');ob.append(el('p',null,e.other));root.append(details('Also under review',null,ob));
root.append(el('div','ec-stance','OpenLabel favors whole, minimally processed foods. That is our stance, not a research finding, and we keep it separate from the evidence above. Seed oil is an informal term, and lists of which oils count vary.'));
return root}
function openSeedSheet(found,vegOnly){$('#sheetTitle').textContent='Seed oils: what the evidence shows';
$('#sheetContent').textContent=(vegOnly?'This product lists vegetable oil without naming the type, so it may or may not be a seed oil. ':'This product lists '+found.join(', ')+'. ')+'Claims about seed oils are common online. Here is what the research shows, what it does not, and who paid for it.';
$('#sheetExtra').replaceChildren(buildSeedEc());$('#sheetWrap').hidden=false;$('#closeSheet').focus()}
function section(root,h,body){root.append(el('h4',null,h));root.append(typeof body==='string'?el('p',null,body):body)}
function openTestSheet(e){$('#sheetTitle').textContent=e.kind==='product'?'Independent test results':'Testing on this kind of product';
$('#sheetContent').textContent=e.title+'. Tested by '+e.tester+', published '+e.published+'. We are showing what the tester reported and how they judged it. We have not yet checked the tester.';
var r=el('div','tx');section(r,'What they found',e.result);section(r,'How they judged it',e.threshold+(e.serving&&e.serving!=='Not per serving'?' Serving used: '+e.serving+'.':''));section(r,'What this does not show',list(e.kind==='product'?e.caveats.concat(['We matched this test to your product by brand and name only. Check that it is the same product, flavor and size.']):e.caveats));
if(e.response)section(r,'Company response',e.response);
section(r,'Who tested it',e.ties+' '+e.check+'.');
var a=el('a',null,e.source.label);a.href=e.source.url;a.target='_blank';a.rel='noopener noreferrer';var p=el('p');p.append(a);section(r,'Source',p);
$('#sheetExtra').replaceChildren(r);$('#sheetWrap').hidden=false;$('#closeSheet').focus()}
function matchEntries(p){var out={prod:[],cat:[]};if(!REG||!REG.entries)return out;var t=textKey([p.brand,p.name,p.category].join(' '));
REG.entries.forEach(function(e){var m=e.match||{};if(e.kind==='product'){if(m.brand&&m.name&&t.indexOf(textKey(m.brand))>=0&&t.indexOf(textKey(m.name))>=0)out.prod.push(e)}else if(m.any&&m.any.some(function(w){return t.indexOf(textKey(w))>=0}))out.cat.push(e)});return out}
function card(cls,h,body,label,fn){var d=el('div','finding '+cls),b=el('button','link',label);b.onclick=fn;d.append(el('h3',null,h),el('p',null,body),b);return d}
function renderGeneral(p){LAST=p;var wrap=$('#generalWrap'),host=$('#generalFindings');if(!wrap||!host)return;host.replaceChildren();
var text=textKey(p.ingText),found=[],vegOnly=false;
if(p.ingText){found=SEED_OIL_WORDS.filter(function(w){return hasWord(text,w)});if(!found.length&&(hasWord(text,'vegetable oil')||hasWord(text,'vegetable oils')))vegOnly=true}
if(found.length||vegOnly){host.append(card('info',vegOnly?'Lists vegetable oil (type not stated)':'Contains seed oil: '+found.join(', '),vegOnly?'It may or may not be a seed oil. Claims about seed oils are common online; see what the research shows and who paid for it.':'Claims about seed oils are common online. See both sides, who paid for the studies, and what is still unproven.','See the evidence →',function(){openSeedSheet(found,vegOnly)}))}
var m=matchEntries(p);
m.prod.forEach(function(e){host.append(card('test','Independent test: '+e.tester+' tested this product',e.result,'See the test details →',function(){openTestSheet(e)}))});
m.cat.forEach(function(e){host.append(card('test','Testing on this kind of product ('+e.tester+')',e.result,'See what they found →',function(){openTestSheet(e)}))});
wrap.hidden=!host.children.length;
setTimeout(function(){var u=$('#unknownText');if(!u||!REG)return;var note=' No independent contaminant test for this exact product was found in our register, which covers only a small set of products so far.';if(!m.prod.length&&u.textContent.indexOf('our register')<0)u.textContent=u.textContent+note},0)}
window.OLEvidence={renderGeneral:renderGeneral};
})();

(function(){
'use strict';
var res=document.getElementById('result'),app=document.getElementById('app');
if(!res||!app)return;
var API=(window.OLEvidence&&window.OLEvidence.api)||null;
var KEY='openlabel-calm-dock-v1',XKEY='openlabel-extra-v1';
var RANK={red:4,orange:3,yellow:2,green:1,grey:0};
var TEST={'crb-gerber-rice':['red',"Above tester's limit"],'crb-gg-puree':['red',"Above tester's limit"],'crb-mummum':['orange','Elevated BPA'],'crp-naked':['red',"Above tester's limit"],'crp-huel':['red',"Above tester's limit"],'crp-garden':['red',"Above tester's limit"],'crp-serious':['red',"Above tester's limit"],'crp-musclemech':['green','Lead not detected']};
var ECODE={e100:'Curcumin',e101:'Riboflavin (vitamin B2)',e150a:'Plain caramel',e160a:'Carotenes',e162:'Beetroot red',e202:'Potassium sorbate',e211:'Sodium benzoate',e220:'Sulphur dioxide',e250:'Sodium nitrite',e300:'Ascorbic acid (vitamin C)',e322:'Lecithins',e330:'Citric acid',e331:'Sodium citrates',e338:'Phosphoric acid',e407:'Carrageenan',e412:'Guar gum',e415:'Xanthan gum',e440:'Pectins',e471:'Mono- and diglycerides of fatty acids',e950:'Acesulfame potassium',e951:'Aspartame',e952:'Cyclamates',e954:'Saccharin',e955:'Sucralose',e960:'Steviol glycosides',e965:'Maltitol',e967:'Xylitol',e968:'Erythritol'};
var HL=/(sunflower (?:seed )?oil|safflower oil|canola oil|rapeseed oil|soybean oil|soya oil|corn oil|cottonseed oil|grapeseed oil|rice bran oil|steviol glycosides|stevia(?: leaf)?(?: extract)?|sucralose|aspartame|acesulfame(?: potassium| k)?|saccharin|erythritol|xylitol|monk fruit(?: extract)?|natural flavou?rs?)/gi;
var SWEET=/stevia|steviol|sucralose|aspartame|acesulfame|saccharin|erythritol|xylitol|monk fruit|sorbitol|maltitol|allulose|cyclamate/i;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function tx(s,r){var n=$(s,r);return n?n.textContent.trim():''}
function state(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function curCode(){var st=state(),id=(st.history||[])[0],p=st.live&&st.live[id];return p&&p.code?String(p.code):''}
var panel,head,bodyEl,handle,mode='peek',drag=null,lastView='home',sig='',regReady=false,nodes={},rowEls={};
function scrape(){var facts={};$$('#labelFacts .source').forEach(function(d){var k=$('strong',d),v=$('span',d);if(k&&v)facts[k.textContent.trim()]=v.textContent.trim()});
var f=$$('#personalFindings .finding').map(function(d){return{head:tx('h3',d),body:tx('p',d),cls:d.className,btn:$('button',d)}});
return{name:tx('#resultName'),brand:tx('#resultBrand'),type:tx('#resultType'),facts:facts,findings:f,unknown:tx('#unknownText'),hint:tx('#resultHint'),src:tx('#srcInfo'),saved:tx('#resultSave').indexOf('★')>=0}}
function getExtra(code){if(!code)return Promise.resolve(null);var cache={};try{cache=JSON.parse(localStorage.getItem(XKEY))||{}}catch(e){}
if(cache[code])return Promise.resolve(cache[code]);var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},9000);
return fetch('https://world.openfoodfacts.org/api/v2/product/'+code+'.json?fields=image_front_small_url,image_front_url,nutriments,serving_size',{signal:ctl.signal}).then(function(r){return r.ok?r.json():null}).then(function(d){clearTimeout(t);var p=d&&d.product;if(!p)return null;var n=p.nutriments||{},k={};['energy-kcal','fat','saturated-fat','sodium','salt','carbohydrates','fiber','sugars','added-sugars','proteins'].forEach(function(a){['_serving','_100g'].forEach(function(b){if(n[a+b]!=null)k[a+b]=n[a+b]})});
var x={img:p.image_front_small_url||p.image_front_url||'',n:k,serving:p.serving_size||''};try{var keys=Object.keys(cache);if(keys.length>30)delete cache[keys[0]];cache[code]=x;localStorage.setItem(XKEY,JSON.stringify(cache))}catch(e){}return x}).catch(function(){clearTimeout(t);return null})}
function num(v){var f=v<10?10:1;return String(Math.round(v*f)/f)}
function pick(x){var n=x.n,sfx=(n['energy-kcal_serving']!=null||n['carbohydrates_serving']!=null)?'_serving':'_100g';return{sfx:sfx,v:function(k){var v=n[k+sfx];return v==null||v===''||isNaN(Number(v))?null:Number(v)}}}
function nutrTable(x){if(!x||!x.n)return null;var q=pick(x),g=q.v,sfx=q.sfx;
var na=g('sodium');if(na==null&&g('salt')!=null)na=g('salt')/2.5;
var rows=[['Calories',g('energy-kcal'),'',0],['Total fat',g('fat'),' g',0],['Saturated fat',g('saturated-fat'),' g',1],['Sodium',na==null?null:na*1000,' mg',0],['Total carbohydrate',g('carbohydrates'),' g',0],['Fiber',g('fiber'),' g',1],['Total sugars',g('sugars'),' g',1],['Added sugars',g('added-sugars'),' g',1],['Protein',g('proteins'),' g',0]].filter(function(r){return r[1]!=null});
if(!rows.length)return null;var wrap=el('div'),t=el('table','ntab');rows.forEach(function(r){var tr=el('tr',r[3]?'sub':''),a=el('td',null,r[0]),b=el('td',null,num(r[1])+r[2]);tr.append(a,b);t.append(tr)});
wrap.append(el('p',null,sfx==='_serving'?'Per serving'+(x.serving?' · '+x.serving:''):'Per 100 g or 100 mL (no per-serving values listed)'),t);return wrap}
function macroNode(x){var w=el('div'),g;
if(x===undefined){g=el('div','mac');for(var i=0;i<4;i++)g.append(el('div','mc skel'));w.append(g);return w}
if(!x||!x.n){w.append(el('p','olp-note','No macro values are listed for this product.'));return w}
var q=pick(x),items=[['Calories',q.v('energy-kcal'),''],['Carbs',q.v('carbohydrates'),' g'],['Protein',q.v('proteins'),' g'],['Fat',q.v('fat'),' g']];
if(items.every(function(i){return i[1]==null})){w.append(el('p','olp-note','No macro values are listed for this product.'));return w}
g=el('div','mac');items.forEach(function(i){var t=el('div','mc');t.append(el('b',null,i[1]==null?'—':num(i[1])+i[2]),el('span',null,i[0]));g.append(t)});w.append(g);
var s=q.v('sugars');w.append(el('p','olp-note',(q.sfx==='_serving'?'Per serving'+(x.serving?' · '+x.serving:''):'Per 100 g or 100 mL')+(s!=null?' · sugars '+num(s)+' g':'')));return w}
function hl(text,watch){var f=document.createDocumentFragment(),last=0,m,any={};HL.lastIndex=0;while((m=HL.exec(text))){if(m.index>last)f.append(text.slice(last,m.index));var w=m[0].toLowerCase(),c=/oil/.test(w)?'m-seed':/natural/.test(w)?'m-flav':(watch?'m-sweet':'m-flav');any[c]=1;f.append(el('mark',c,m[0]));last=m.index+m[0].length}if(last<text.length)f.append(text.slice(last));return{f:f,any:any}}
function para(t){return el('p',null,t)}
function linkBtn(t,fn){var b=el('button','link',t);b.onclick=fn;return b}
function row(type,title,color,chip,body,o){o=o||{};return{type:type,title:title,color:color,chip:chip,body:body,pin:!!o.pin,open:!!o.open}}
function buildRows(m,ing){var rows=[],F=m.findings,fa=m.facts;
var hits=F.filter(function(x){return /alert|warn/.test(x.cls)}),info=F.filter(function(x){return x.cls.split(' ').indexOf('info')>=0&&/^(Allergy check|No match for your allergens|Cannot check allergens)/.test(x.head)})[0];
var b=el('div');
if(hits.length){var red=hits.some(function(x){return /alert/.test(x.cls)});hits.forEach(function(x){var p=el('p');p.append(el('strong',null,x.head),document.createElement('br'),document.createTextNode(x.body));b.append(p);if(x.btn)b.append(linkBtn('Why am I seeing this?',function(){x.btn.click()}))});
rows.push(row('allergen','Allergens',red?'red':'orange',red?'Matches your allergy':'Trace warning',b,{pin:true,open:red}))}
else if(info){var h=info.head,c='grey',ch='Not enough data';if(/^No match/.test(h)){c='green';ch='No match to your list'}else if(/^Allergy check is off/.test(h)){ch='Not set up'}else if(/fresh scan/.test(h)){ch='Needs a fresh scan'}
b.append(para(info.body));if(info.btn)b.append(linkBtn('How this works',function(){info.btn.click()}));if(c==='grey'&&/off/.test(h))b.append(linkBtn('Choose your allergies',function(){var n=$('.nav-pill[data-go="profile"]');if(n)n.click()}));rows.push(row('allergen','Allergens',c,ch,b))}
var tb=el('div'),tc='grey',tch=regReady?'No test found':'Checking…',ents={prod:[],cat:[]};
if(API&&regReady)ents=API.matchEntries({brand:m.brand,name:m.name,category:m.type});
if(ents.prod.length||ents.cat.length){
ents.prod.forEach(function(e){var t=TEST[e.id]||['grey','Test on file'];if(tc==='grey'||RANK[t[0]]>RANK[tc]){tc=t[0];tch=t[1]}tb.append(para(e.tester+' ('+e.published+'): '+e.result));tb.append(linkBtn('See the test details',function(){API.openTestSheet(e)}))});
if(!ents.prod.length){tch='Category-level only'}
ents.cat.forEach(function(e){tb.append(para('On this kind of product — '+e.tester+' ('+e.published+'): '+e.result));tb.append(linkBtn('See what they found',function(){API.openTestSheet(e)}))});
}else if(regReady){tb.append(para('We did not find an independent contaminant test for this exact product in our register. The register covers only a small set of products so far, so this does not say anything about the product itself.'))}
else tb.append(para('Looking in our register of independent tests…'));
rows.push(row('test','Independent testing',tc,tch,tb,{pin:tc==='red',open:tc==='red'}));
var key=API?API.textKey(ing):'',found=[],veg=false;
if(ing&&API){found=API.seedWords.filter(function(w){return key.indexOf(API.textKey(w))>=0});veg=!found.length&&(key.indexOf(' vegetable oil ')>=0||key.indexOf(' vegetable oils ')>=0)}
var sb=el('div'),sc='grey',sch='Not enough data';
if(!ing){sb.append(para('There is no ingredient list for this product, so we cannot tell.'))}
else if(found.length){sc='yellow';sch='Contested evidence';sb.append(para('Listed: '+found.join(', ')+'.'));sb.append(para('Claims about seed oils are common online. The research is mixed and some of it has industry funding. We show both sides and who paid.'));sb.append(linkBtn('See the evidence',function(){API.openSeedSheet(found,false)}))}
else if(veg){sch='Type not stated';sb.append(para('The label says vegetable oil without naming the type, so it may or may not be a seed oil.'));sb.append(linkBtn('See the evidence',function(){API.openSeedSheet([],true)}))}
else{sc='green';sch='None found';sb.append(para('None of the oils we check for appear in the ingredient list. The list can be incomplete, so check the package.'))}
rows.push(row('seed','Seed oils',sc,sch,sb));
var nm=/Group ([0-9]) of 4/.exec(fa['NOVA group']||''),pb=el('div'),pc='grey',pch='Not available';
if(nm){var n=+nm[1],names=['','Unprocessed or minimally processed','Processed culinary ingredient','Processed food','Ultra-processed food'];pc=n<3?'green':n===3?'yellow':'orange';pch=n<3?'Low processing':n===3?'Processed':'Ultra-processed';
pb.append(para(names[n]+' (NOVA group '+n+' of 4).'));var bar=el('div','nova'),mk=el('i');mk.style.left=((n-1)/3*84+8)+'%';bar.append(mk);pb.append(bar);var lab=el('div','nova-l');lab.append(el('span',null,'Unprocessed'),el('span',null,'Ultra-processed'));pb.append(lab);
pb.append(el('p','olp-note','NOVA is a way researchers group foods by how much industrial processing they go through. Open Food Facts calculates it from the ingredients. It describes processing, not nutrition.'))}
else pb.append(para('Open Food Facts has no processing group for this product.'));
rows.push(row('proc','Processing level',pc,pch,pb));
var addTxt=fa['Additives listed']||'',codes=addTxt?addTxt.split(',').map(function(c){return c.trim()}).filter(Boolean):[];
var watch=F.some(function(x){return /^Sweetener listed/.test(x.head)}),hasSweet=SWEET.test(ing)||codes.some(function(c){return /^E9(5[0-9]|6[0-9])/i.test(c)});
if(hasSweet){var swb=el('div'),r2=el('div','chiprow');(ing.match(new RegExp(SWEET.source,'gi'))||[]).filter(function(v,i,a){return a.map(function(z){return z.toLowerCase()}).indexOf(v.toLowerCase())===i}).forEach(function(w){r2.append(el('span',null,w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()))});if(r2.children.length)swb.append(r2);
swb.append(para(watch?'You chose to highlight sweeteners. Listed does not mean harmful, and we have not yet reviewed the research on sweeteners.':'A sweetener appears in this product. Listed does not mean harmful, and we have not yet reviewed the research on sweeteners.'));rows.push(row('sweet','Sweeteners',watch?'orange':'grey',watch?'On your watch list':'Listed',swb))}
if(codes.length){var ab=el('div'),ar=el('div','chiprow');codes.forEach(function(c){var nmn=ECODE[String(c).toLowerCase()];ar.append(el('span',null,c+(nmn?' · '+nmn:'')))});ab.append(ar,para('We have not yet reviewed the evidence on these additives. Listed does not mean harmful.'));rows.push(row('add','Additives','grey',codes.length+' listed · not yet reviewed',ab))}
var cf=fa['Caffeine'],over=F.filter(function(x){return /^Above your caffeine limit/.test(x.head)})[0];
if(cf){var cb=el('div');cb.append(para(over?over.body:cf+'. No higher than the daily limit you set.'));rows.push(row('caf','Caffeine',over?'orange':'green',over?'Within your limit':'Within your limit',cb,{pin:!!over}))}
return rows}
function buildNutrition(ex){var b=el('div');nodes.nutr=b;var t=ex&&nutrTable(ex);if(t)b.append(t);else if(ex===undefined)b.append(el('div','olp-skel'));else b.append(para('Open Food Facts has no nutrition values for this product.'));return row('nutr','Nutrition facts',null,'',b)}
function ingSection(ing){var c=el('div','ingcard');if(ing){var h=hl(ing,true),d=el('div','ing');d.append(h.f);c.append(d);var leg=[];if(h.any['m-seed'])leg.push('yellow: seed oils');if(h.any['m-sweet'])leg.push('orange: sweeteners you chose to highlight');if(h.any['m-flav'])leg.push('grey: natural flavors or unreviewed sweeteners');if(leg.length)c.append(el('p','olp-note','Highlights — '+leg.join('; ')+'.'))}else c.append(para('No ingredient list is available for this product.'));return c}
function buildSources(m,code){var b=el('div');b.append(para(m.hint||''));if(m.src)b.append(para('Product information:'+(m.src.charAt(0)===' '?'':' ')+m.src));if(code)b.append(para('Product photos, when shown, come from Open Food Facts contributors under a CC BY-SA license.'));b.append(para('Personal findings are computed from the product data and preferences saved on this device.'));if(m.unknown)b.append(para('What we do not know: '+m.unknown));b.append(el('p','olp-note','Not medical advice or a product safety assessment. Always check the package.'));return row('src','Sources and unknowns',null,'',b)}
function mkRow(r){var d=el('details','olr'+(r.color?' c-'+r.color:'')+(r.pin?' pin':''));if(r.open)d.open=true;var s=el('summary');s.append(el('span','t',r.title));if(r.color){var c=el('span','chip2');c.append(el('span','dot'),document.createTextNode(r.chip));s.append(c)}s.append(el('span','cv'));var b=el('div','olr-b');b.append(r.body);d.append(s,b);rowEls[r.type]=d;return d}
var TAGN={allergen:'Allergens',recall:'Recalls',test:'Testing',seed:'Seed oils',proc:'Processing',sweet:'Sweeteners',add:'Additives',caf:'Caffeine',diet:'Diets',intol:'Intolerances',gut:'Gut',emul:'Emulsifiers'};
function openRow(type){var d=rowEls[type];if(!d)return;d.open=true;function go(){d.scrollIntoView({block:'center',behavior:'smooth'})}if(mode!=='full'){setMode('full');setTimeout(go,330)}else go()}
var SHORT=[[/^No match to your list$/,'no match'],[/^Matches your allergy$/,'matches you'],[/^Trace warning$/,'trace warning'],[/^Not enough data$/,'no data'],[/^On your watch list$/,'watch list'],[/^([0-9]+) listed.*$/,'$1 listed'],[/^Above tester's limit$/,'above limit'],[/^No test found$/,'none found'],[/^Contested evidence$/,'contested'],[/^Category-level only$/,'category only'],[/^Within your limit$/,'within limit'],[/^Above your limit$/,'above limit'],[/^Needs a fresh scan$/,'rescan']];
function shortTag(c){for(var i=0;i<SHORT.length;i++){if(SHORT[i][0].test(c))return c.replace(SHORT[i][0],SHORT[i][1])}return c.charAt(0).toLowerCase()+c.slice(1)}
function tagsSection(rows){var w=el('div','tags');rows.filter(function(r){return r.color}).sort(function(a,b){return RANK[b.color]-RANK[a.color]}).forEach(function(r){var t=el('button','tag c-'+r.color);t.append(el('span','dot c-'+r.color),document.createTextNode((TAGN[r.type]||r.title)+': '+shortTag(r.chip)));t.onclick=function(){openRow(r.type)};w.append(t)});return w}
function render(){var m=scrape();if(!m.name)return;var code=curCode();nodes={};rowEls={};
var ing=m.facts['Ingredients']||'';var rows=buildRows(m,ing);
(window.OLPanelPlugins||[]).forEach(function(fn){try{var r=fn(m,{code:code,rows:rows,ing:ing});if(r){var at=r.at==null?rows.length:r.at;delete r.at;rows.splice(at,0,r)}}catch(e){}});
var all=rows.concat([buildNutrition(code?undefined:null),buildSources(m,code)]),pinned=rows.filter(function(r){return r.pin}),rest=all.filter(function(r){return !r.pin});
head.replaceChildren();var top=el('div','olp-top'),img=el('div','olp-img load');nodes.img=img;
var id=el('div','olp-id');id.append(el('h2',null,m.name),el('div','olp-brand',m.brand),el('div','olp-cat',m.type));
var act=el('div','olp-act'),sv=el('button',null,m.saved?'★':'☆'),cl=el('button',null,'×');sv.setAttribute('aria-label',m.saved?'Remove saved product':'Save product');cl.setAttribute('aria-label','Close product details');
sv.onclick=function(){var r=$('#resultSave');if(r)r.click();var now=tx('#resultSave').indexOf('★')>=0;sv.textContent=now?'★':'☆';sv.setAttribute('aria-label',now?'Remove saved product':'Save product')};
cl.onclick=closePanel;act.append(sv,cl);top.append(img,id,act);
handle=el('button','olp-handle');handle.onclick=function(){setMode(mode==='full'?'peek':'full')};
head.append(handle,top);
bodyEl.replaceChildren();
bodyEl.append(el('div','olp-h','Macros'));nodes.mac=macroNode(code?undefined:null);bodyEl.append(nodes.mac);
bodyEl.append(el('div','olp-h','Tags'));bodyEl.append(tagsSection(rows));
bodyEl.append(el('div','olp-h','Ingredients'));bodyEl.append(ingSection(ing));
if(pinned.length){bodyEl.append(el('div','olp-h','For you'));pinned.forEach(function(r){bodyEl.append(mkRow(r))})}
bodyEl.append(el('div','olp-h','Breakdown'));rest.forEach(function(r){bodyEl.append(mkRow(r))});
setMode(mode,true);
getExtra(code).then(function(x){if(tx('#resultName')!==m.name)return;nodes.img.classList.remove('load');if(x&&x.img){var im=document.createElement('img');im.alt='';im.draggable=false;im.decoding='async';im.onerror=function(){nodes.img.replaceChildren(document.createTextNode('▣'))};im.src=x.img;nodes.img.replaceChildren(im)}else{nodes.img.replaceChildren(document.createTextNode('▣'))}
if(nodes.mac)nodes.mac.replaceWith(nodes.mac=macroNode(x));
var t=x&&nutrTable(x);if(nodes.nutr){nodes.nutr.replaceChildren();if(t)nodes.nutr.append(t);else nodes.nutr.append(para('Open Food Facts has no nutrition values for this product.'))}});
if(!code){nodes.img.classList.remove('load');nodes.img.textContent='▣'}}
function setMode(m,keep){mode=m;panel.classList.toggle('full',m==='full');panel.style.height='';if(handle){handle.setAttribute('aria-expanded',m==='full'?'true':'false');handle.setAttribute('aria-label',m==='full'?'Show less product details':'Show more product details')}if(!keep||m==='peek')bodyEl.scrollTop=0}
function closePanel(){var b=$('#resultBack');if(b)b.click()}
function refresh(){if(!panel||panel.hidden||res.hidden)return;var md=mode,st=bodyEl.scrollTop;render();setMode(md,true);bodyEl.scrollTop=st}
window.OLPanel={refresh:refresh};
function build(){panel=el('section');panel.id='olPanel';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Product details');head=el('div','olp-head');bodyEl=el('div','olp-body');panel.append(head,bodyEl);document.body.append(panel);
panel.addEventListener('pointerdown',function(e){if(e.target.closest('.olp-act button'))return;if(mode==='full'&&e.target.closest('.olp-body'))return;drag={y:e.clientY,h:panel.offsetHeight,moved:false,id:e.pointerId,tgt:e.target};if(e.pointerType==='touch'&&e.target.closest('.olp-head')&&e.cancelable)e.preventDefault()});
panel.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>8){drag.moved=true;panel.classList.add('dragging');try{panel.setPointerCapture(drag.id)}catch(x){}}if(drag.moved){if(e.cancelable)e.preventDefault();var mx=window.innerHeight*.95;panel.style.height=Math.min(mx,Math.max(window.innerHeight*.35,drag.h-dy))+'px'}});
function end(e){if(!drag||e.pointerId!==drag.id)return;var d=drag;drag=null;panel.classList.remove('dragging');var dy=e.clientY-d.y;if(!d.moved){if(d.tgt.closest('.olp-head')&&!d.tgt.closest('button'))setMode(mode==='full'?'peek':'full');return}
if(dy<-40)setMode('full');else if(dy>40&&mode==='full')setMode('peek');else setMode(mode)}
panel.addEventListener('dragstart',function(e){e.preventDefault()});panel.addEventListener('pointerup',end);panel.addEventListener('pointercancel',function(){if(drag){drag=null;panel.classList.remove('dragging');setMode(mode)}});
panel.addEventListener('touchmove',function(e){if(drag&&drag.moved&&e.cancelable)e.preventDefault()},{passive:false});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!res.hidden&&$('#sheetWrap').hidden)closePanel()})}
function sync(){if(res.hidden){if(panel)panel.hidden=true;sig='';return}
if(!panel)build();var prev=document.getElementById(lastView);if(prev&&prev.hidden&&prev.id!=='result'){prev.hidden=false}app.classList.toggle('scanning',lastView==='scan');
var s=tx('#resultName')+'|'+tx('#resultBrand')+'|'+curCode();var fresh=panel.hidden||s!==sig;panel.hidden=false;if(fresh){sig=s;mode='peek';render()}}
var t0;function schedule(){cancelAnimationFrame(t0);t0=requestAnimationFrame(sync)}
function track(){if(!res.hidden)return;$$('.view').forEach(function(v){if(v.id!=='result'&&!v.hidden)lastView=v.id})}
var vo=new MutationObserver(function(){track();schedule()});
$$('.view').forEach(function(v){vo.observe(v,{attributes:true,attributeFilter:['hidden']})});
new MutationObserver(schedule).observe(res,{subtree:true,childList:true,characterData:true});
track();schedule();
if(API&&API.ready)API.ready.then(function(){regReady=true;if(!res.hidden&&panel&&!panel.hidden){var md=mode;render();setMode(md,true)}});else regReady=true;
var sl=document.createElement('link');sl.rel='stylesheet';sl.href='scroll-hotfix.css';document.head.appendChild(sl);
['recalls.js','profile.js','profile-rows.js'].forEach(function(f){var sc=document.createElement('script');sc.src=f;document.body.appendChild(sc)});
})();

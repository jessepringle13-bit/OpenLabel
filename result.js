(function(){
'use strict';
var res=document.getElementById('result'),app=document.getElementById('app');
if(!res||!app)return;
var API=(window.OLEvidence&&window.OLEvidence.api)||null;
var KEY='openlabel-calm-dock-v1',XKEY='openlabel-extra-v1';
var RANK={red:4,orange:3,yellow:2,green:1,grey:0};
var TEST={'crb-gerber-rice':['orange',"Above tester's limit"],'crb-gg-puree':['orange',"Above tester's limit"],'crb-mummum':['orange','Elevated BPA'],'crp-naked':['red',"Tester advises avoiding"],'crp-huel':['red',"Tester advises avoiding"],'crp-garden':['orange',"Above tester's limit"],'crp-serious':['orange',"Above tester's limit"],'crp-musclemech':['grey','Lead not detected in lots tested']};
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
function row(type,title,color,chip,body,o){o=o||{};return{type:type,title:title,color:color,chip:chip,body:body,pin:!!o.pin,open:!!o.open,rec:o.rec||null}}

function regTopics(){var t=[];try{t=(JSON.parse(localStorage.getItem('openlabel-profile2-v1')||'{}').topics)||[]}catch(e){}return t}
function openRecSheet(rec,intro){var T=document.getElementById('sheetTitle'),C=document.getElementById('sheetContent'),X=document.getElementById('sheetExtra');if(!T||!C||!X)return;T.textContent=rec.subject+': what the evidence shows';C.textContent=intro;var r=el('div','tx');
function sec(h,node){r.append(el('h4',null,h));r.append(typeof node==='string'?el('p',null,node):node)}
function ul(a){var u=el('ul');a.forEach(function(x){u.append(el('li',null,x))});return u}
sec('Claim',rec.claim);sec('What the evidence shows',ul(rec.shows));sec('What it does not show',ul(rec.does_not_show));
if(rec.sides){sec('Strongest case that it matters',ul(rec.sides.for));sec('Strongest case against, or for caution',ul(rec.sides.against))}
sec('Amount',rec.amount);sec('Who it applies to',rec.applies_to);
var sl=el('ul');rec.sources.forEach(function(x){var li=el('li');if(x.url){var a=el('a',null,x.title);a.href=x.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a)}else li.append(document.createTextNode(x.title));li.append(document.createTextNode(' - '+x.publisher+', '+x.type+', '+x.date+(x.note?'. '+x.note:'')));sl.append(li)});sec('Sources',sl);
sec('Source check ('+rec.source_check.state+')',rec.source_check.summary);
sec('Review','Status: '+rec.status+'. '+rec.reviewed_by+', '+rec.reviewed_on+(rec.review_state==='provisional'?' (provisional)':'')+'. Next review due '+rec.next_review+'. Not medical advice.');
X.replaceChildren(r);document.getElementById('sheetWrap').hidden=false;var cb=document.getElementById('closeSheet');if(cb)cb.focus()}
/* Fill a row body from a register record. Returns the resolved state (color, chip). */
function regFill(sb,id,lines,notes,sheetFn,applies){var REG=window.OLRegister,rec=REG&&REG.get(id);
var rs=rec?REG.resolve(rec,{topics:regTopics(),applies:applies}):{color:'grey',chip:'Evidence register unavailable',reason:'The evidence register did not load, so no color is shown.',record:null};
lines.forEach(function(t){sb.append(para(t))});sb.append(para(rs.reason));notes.forEach(function(t){sb.append(para(t))});
if(rs.record){var rr=rs.record;sb.append(para('Applies to: '+rr.applies_to));sb.append(para('Kind of evidence: '+rr.scope_type+'. Amount: '+rr.amount));sb.append(para('Source check: '+rr.source_check.summary));sb.append(para('Review: '+rr.reviewed_by+', '+rr.reviewed_on+(rr.review_state==='provisional'?' (provisional)':'')+'. Next review due '+rr.next_review+'.'));
sb.append(linkBtn('See the evidence',sheetFn||function(){openRecSheet(rr,rr.review_state==='provisional'?'This is what our draft record says, what it does not say, and what we know about who paid for the research. It has not been finalized.':'This is what our record says, what it does not say, and what we know about who paid for the research. The owner has reviewed it. Source checks are still partial, and it is reviewed again on the date shown.')}))}
rs.rec=rs.record;return rs}
window.OLRegFill=regFill;
function buildRows(m,ing){var rows=[],F=m.findings,fa=m.facts;
var allH=F.filter(function(x){return /alert|warn/.test(x.cls)}),hits=allH.filter(function(x){return !/^Your watch word/.test(x.head)}),wh=allH.filter(function(x){return /^Your watch word/.test(x.head)}),info=F.filter(function(x){return x.cls.split(' ').indexOf('info')>=0&&/^(Allergy check|No match for your allergens|Cannot check allergens)/.test(x.head)})[0];
var b=el('div');
if(hits.length){var red=hits.some(function(x){return /alert/.test(x.cls)});hits.forEach(function(x){var p=el('p');p.append(el('strong',null,x.head),document.createElement('br'),document.createTextNode(x.body));b.append(p);if(x.btn)b.append(linkBtn('Why am I seeing this?',function(){x.btn.click()}))});
rows.push(row('allergen','Allergens',red?'red':'orange',red?'Matches your allergy':'Trace warning',b,{pin:true,open:red}))}
else if(info){var h=info.head,c='grey',ch='Not enough data';if(/^No match/.test(h)){c='grey';ch='No match to your list'}else if(/^Allergy check is off/.test(h)){ch='Not set up'}else if(/fresh scan/.test(h)){ch='Needs a fresh scan'}
b.append(para(info.body));if(info.btn)b.append(linkBtn('How this works',function(){info.btn.click()}));if(c==='grey'&&/off/.test(h))b.append(linkBtn('Choose your allergies',function(){var n=$('.nav-pill[data-go="profile"]');if(n)n.click()}));rows.push(row('allergen','Allergens',c,ch,b))}
if(wh.length){var wb=el('div');wh.forEach(function(x){var p=el('p');p.append(el('strong',null,x.head),document.createElement('br'),document.createTextNode(x.body));wb.append(p)});wb.append(para('Why am I seeing this? You added this word under Your own watch words in Profile. It is matched against the ingredient and may-contain text only.'));wb.append(linkBtn('Edit your watch words',function(){var n=$('.nav-pill[data-go="profile"]');if(n)n.click()}));rows.push(row('watch','Your watch words','orange','Word on your list',wb,{pin:true}))}
var tb=el('div'),tc='grey',tch=regReady?'No test found':'Checking…',ents={prod:[],cat:[]};
if(API&&regReady)ents=API.matchEntries({brand:m.brand,name:m.name,category:m.type});
if(ents.prod.length||ents.cat.length){
ents.prod.forEach(function(e){var t=TEST[e.id]||['grey','Test on file'];var tcol=t[0]==='red'?'red':t[0];if(tc==='grey'||RANK[tcol]>RANK[tc]){tc=tcol;tch=t[1]}tb.append(para(e.tester+' ('+e.published+'): '+e.result));tb.append(linkBtn('See the test details',function(){API.openTestSheet(e)}))});
if(!ents.prod.length){tch='Category-level only'}
ents.cat.forEach(function(e){tb.append(para('On this kind of product — '+e.tester+' ('+e.published+'): '+e.result));tb.append(linkBtn('See what they found',function(){API.openTestSheet(e)}))});
}else if(regReady){tb.append(para('We did not find an independent contaminant test for this exact product in our register. The register covers only a small set of products so far, so this does not say anything about the product itself.'))}
else tb.append(para('Looking in our register of independent tests…'));
rows.push(row('test','Independent testing',tc,tch,tb,{pin:tc==='red',open:tc==='red'}));
var key=API?API.textKey(ing):'',found=[],veg=false;
if(ing&&API){found=API.seedWords.filter(function(w){return key.indexOf(API.textKey(w))>=0});veg=!found.length&&(key.indexOf(' vegetable oil ')>=0||key.indexOf(' vegetable oils ')>=0)}
var sb=el('div'),sc='grey',sch='Not enough data',seedRec=null,seedRow2=null;
if(!ing){sb.append(para('There is no ingredient list for this product, so we cannot tell.'))}
else if(found.length){var rs0=regFill(sb,'seed-oils-inflammation',['Listed: '+found.join(', ')+'.'],[],null);sc=rs0.color;sch=rs0.chip;seedRec=rs0.rec;var sb2=el('div'),rs1=regFill(sb2,'seed-oils-heart-outcomes',['Listed: '+found.join(', ')+'.'],[],null);seedRow2=row('seedh','Seed oils: heart outcomes',rs1.color,rs1.chip,sb2,{rec:rs1.rec})}
else if(veg){sch='Type not stated';sb.append(para('The label says vegetable oil without naming the type, so it may or may not be a seed oil.'));sb.append(linkBtn('See the evidence',function(){var q=window.OLRegister&&window.OLRegister.get('seed-oils-inflammation');if(q)openRecSheet(q,'This product lists vegetable oil without naming the type, so it may or may not be a seed oil.')}))}
else{sc='grey';sch='None named in list';sb.append(para('None of the oils we check for are named in the ingredient list. This describes the list only. It can be incomplete, so check the package.'))}
rows.push(row('seed',seedRow2?'Seed oils: inflammation':'Seed oils',sc,sch,sb,{rec:seedRec}));if(seedRow2)rows.push(seedRow2);
if(window.OLRegister&&ing){var REG2=window.OLRegister,cd=REG2.detect('curedmeats',ing);
if(cd.found.length){var cb2=el('div'),cl=['Listed: '+cd.found.join(', ')+'.'];if(!cd.meat)cl.push('No meat word was found in this ingredient list, and the studies are about meat, so this may not apply.');if(cd.celeryOnly)cl.push('Celery powder or juice is a natural source of nitrite, and labels may say uncured. The research does not tell us whether that changes the risk.');
var cr=regFill(cb2,'cured-meats-colorectal',cl,[],null,cd.meat);rows.push(row('cured','Cured meats',cr.color,cr.chip,cb2,{rec:cr.rec}))}
var dd=REG2.detect('dyes',ing);
if(dd.found.length){var db=el('div'),dr0=REG2.get('synthetic-dyes-child-behavior'),dn=dr0?REG2.notesFor(dr0,dd.found):[];var dr=regFill(db,'synthetic-dyes-child-behavior',['Listed: '+dd.found.join(', ')+'.'],dn,null);rows.push(row('dyes','Food dyes',dr.color,dr.chip,db,{rec:dr.rec}))}}
var nm=/Group ([0-9]) of 4/.exec(fa['NOVA group']||''),pb=el('div'),pc='grey',pch='Not available';
if(nm){var n=+nm[1],names=['','Unprocessed or minimally processed','Processed culinary ingredient','Processed food','Ultra-processed food'];pc='grey';pch=n<3?'Low processing':n===3?'Processed':'Ultra-processed';
pb.append(para(names[n]+' (NOVA group '+n+' of 4).'));var bar=el('div','nova'),mk=el('i');mk.style.left=((n-1)/3*84+8)+'%';bar.append(mk);pb.append(bar);var lab=el('div','nova-l');lab.append(el('span',null,'Unprocessed'),el('span',null,'Ultra-processed'));pb.append(lab);
pb.append(el('p','olp-note','NOVA is a way researchers group foods by how much industrial processing they go through. Open Food Facts calculates it from the ingredients. It describes processing, not nutrition.'))}
else pb.append(para('Open Food Facts has no processing group for this product.'));
var procRec=null;
if(nm&&+nm[1]===4&&window.OLRegister){var urs=regFill(pb,'ultra-processed-health',[],[],null);procRec=urs.rec;if(urs.color!=='grey'){pc=urs.color;pch=urs.chip}else if(urs.chip!=='Listed'){pch=urs.chip}}
rows.push(row('proc','Processing level',pc,pch,pb,procRec?{rec:procRec}:undefined));
var addTxt=fa['Additives listed']||'',codes=addTxt?addTxt.split(',').map(function(c){return c.trim()}).filter(Boolean):[];
var watch=F.some(function(x){return /^Sweetener listed/.test(x.head)}),hasSweet=SWEET.test(ing)||codes.some(function(c){return /^E9(5[0-9]|6[0-9])/i.test(c)});
if(hasSweet){var swb=el('div'),r2=el('div','chiprow'),swNames=(ing.match(new RegExp(SWEET.source,'gi'))||[]).filter(function(v,i,a){return a.map(function(z){return z.toLowerCase()}).indexOf(v.toLowerCase())===i});swNames.forEach(function(w){r2.append(el('span',null,w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()))});if(r2.children.length)swb.append(r2);
var RG=window.OLRegister,sdt=RG?RG.detect('sweeteners',ing):{nss:[],aspartame:[]},nssCode=codes.some(function(c){return /^E9(50|51|52|54|55|56|57|59|6[0-2])$/i.test(c)}),aspCode=codes.some(function(c){return /^E9(51|62)$/i.test(c)}),nssApplies=sdt.nss.length>0||nssCode;
var sr=regFill(swb,'sweeteners-weight-disease',[],[],null,nssApplies);rows.push(row('sweet','Sweeteners',sr.color,sr.chip,swb,{rec:sr.rec}));
if(sdt.aspartame.length||aspCode){var ab2=el('div'),ar2=regFill(ab2,'aspartame-cancer',['Listed: aspartame.'],[],null);rows.push(row('sweetasp','Aspartame and cancer',ar2.color,ar2.chip,ab2,{rec:ar2.rec}))}}
var adt=window.OLRegister?window.OLRegister.detect('additives',ing+' '+codes.join(' ')):{tio2:[],bromate:[],benzoate:[],benzene:false};
if(codes.length){var ab=el('div'),ar=el('div','chiprow');codes.forEach(function(c){var nmn=ECODE[String(c).toLowerCase()];ar.append(el('span',null,c+(nmn?' · '+nmn:'')))});ab.append(ar);
var has=function(t){return rows.some(function(x){return x.type===t})},cov={},unrev=[];
codes.forEach(function(c){var u=String(c).toUpperCase(),w=null;
if(/^E(102|104|110|122|124|127|129|132|133|143)$/.test(u)&&has('dyes'))w='Food dyes';
else if(/^E171$/.test(u))w='Titanium dioxide';
else if(/^E924[AB]?$/.test(u))w='Potassium bromate';
else if(/^E21[0-3]$/.test(u))w='Benzoates';
else if(/^E(249|250|251|252)$/.test(u)&&has('cured'))w='Cured meats';
else if(/^E(950|951|952|954|955|957|959|961|962|969)$/.test(u)&&has('sweet'))w='Sweeteners';
else if(/^E320$/.test(u))w='BHA';
else if(/^E321$/.test(u))w='BHT';
else if(/^E22[0-8]$/.test(u))w='Sulfites';
else if(/^E21[67]$/.test(u))w='Propylparaben';
else if(/^E150[CD]$/.test(u))w='Caramel color';
else if(/^E62[0-5]$/.test(u))w='Glutamates (MSG)';
else if(/^E(338|339|340|341|343|450|451|452)$/.test(u))w='Phosphates';
else if(/^E407A?$/.test(u))w='Carrageenan';
else if(/^E(322|405|410|412|414|415|418|433|461|464|466|471|472[A-F]|481|491)$/.test(u))w='Emulsifiers and stabilizers';
if(w){(cov[w]=cov[w]||[]).push(c)}else unrev.push(c)});
var covN=codes.length-unrev.length,covK=Object.keys(cov);
if(covK.length)ab.append(para('Have their own row: '+covK.map(function(k){return cov[k].join(', ')+' ('+k+')'}).join('; ')+'.'));
if(unrev.length)ab.append(para('Not yet reviewed by us: '+unrev.join(', ')+'. Not yet reviewed does not mean harmful.'));
var arr=regFill(ab,'additives-label-review',[],[],null),watchedAdd=regTopics().indexOf('additives')>=0;
rows.push(row('add','Additives','grey',codes.length+' listed · '+(unrev.length?unrev.length+' not yet reviewed':'all have their own row')+(watchedAdd?' · on your watch list':''),ab,{rec:arr.rec}))}
function addRow(type,title,id,found,extra){var bb=el('div'),rr=regFill(bb,id,['Listed: '+found.join(', ')+'.'].concat(extra||[]),[],null);rows.push(row(type,title,rr.color,rr.chip,bb,{rec:rr.rec}))}
if(adt.tio2.length)addRow('addtio2','Titanium dioxide','titanium-dioxide-genotoxicity',adt.tio2);
if(adt.bromate.length)addRow('addbrom','Potassium bromate','potassium-bromate-cancer',adt.bromate);
if(adt.benzoate.length)addRow('addbenz','Benzoate preservatives','benzoate-preservatives-intake',adt.benzoate,adt.benzene?['Ascorbic acid or a similar ingredient is also listed. That combination can form trace benzene in some drinks, depending on heat and light. The label does not show whether it did.']:[]);
if(adt.bha&&adt.bha.length)addRow('addbha','BHA','bha-cancer',adt.bha);
if(adt.bht&&adt.bht.length)addRow('addbht','BHT','bht-intake',adt.bht);
if(adt.sulfite&&adt.sulfite.length)addRow('addsulf','Sulfites','sulfites-sensitivity',adt.sulfite);
if(adt.propylparaben&&adt.propylparaben.length)addRow('addpp','Propylparaben','propylparaben-endocrine',adt.propylparaben);
if(adt.caramel&&adt.caramel.length)addRow('addcar','Caramel color','caramel-color-4mei',adt.caramel,['The label rarely says which caramel class was used. The 4-methylimidazole question applies to the ammonia-process classes (E150c and E150d).']);
if(adt.msg&&adt.msg.length)addRow('addmsg','MSG and glutamates','msg-glutamate',adt.msg);
if(adt.phosphate&&adt.phosphate.length)addRow('addpho','Phosphate additives','phosphate-additives',adt.phosphate);
var cf=fa['Caffeine'],over=F.filter(function(x){return /^Above your caffeine limit/.test(x.head)})[0];
if(cf){var cb=el('div');cb.append(para(over?over.body:cf+'. No higher than the daily limit you set.'));rows.push(row('caf','Caffeine',over?'orange':'grey',over?'Above your limit':'Within your limit',cb,{pin:!!over}))}
return rows}
function buildNutrition(ex){var b=el('div');nodes.nutr=b;var t=ex&&nutrTable(ex);if(t)b.append(t);else if(ex===undefined)b.append(el('div','olp-skel'));else b.append(para('Open Food Facts has no nutrition values for this product.'));return row('nutr','Nutrition facts',null,'',b)}
function ingSection(ing){var c=el('div','ingcard');if(window.__olIngNote)c.append(el('p','olp-note','⚠ '+window.__olIngNote));if(ing){var h=hl(ing,true),d=el('div','ing');d.append(h.f);c.append(d);var leg=[];if(h.any['m-seed'])leg.push('yellow: seed oils');if(h.any['m-sweet'])leg.push('orange: sweeteners you chose to highlight');if(h.any['m-flav'])leg.push('grey: natural flavors or unreviewed sweeteners');if(leg.length)c.append(el('p','olp-note','Highlights — '+leg.join('; ')+'.'))}else c.append(para('No ingredient list is available for this product.'));return c}
function buildSources(m,code){var b=el('div');b.append(para(m.hint||''));if(m.src)b.append(para('Product information:'+(m.src.charAt(0)===' '?'':' ')+m.src));if(code)b.append(para('Product photos, when shown, come from Open Food Facts contributors under a CC BY-SA license.'));b.append(para('Personal findings are computed from the product data and preferences saved on this device.'));if(m.unknown)b.append(para('What we do not know: '+m.unknown));b.append(el('p','olp-note','Not medical advice or a product safety assessment. Always check the package.'));return row('src','Sources and unknowns',null,'',b)}
var WHY={
allergen:['A word on the label matches an allergy or trace warning you set.','Your saved profile and the Open Food Facts label.','Label wording only.','You.','Word matching can miss derivatives or misspellings, and labels can be wrong or incomplete.','Matching rules are tested in this app. Not reviewed by a clinician.'],
watch:['A word you asked us to watch for appears on the label.','Your saved watch words and the Open Food Facts label.','Label wording only.','You.','Word matching can miss variants, and labels can be incomplete.','Your own list. Not an evidence finding.'],
recall:['A recall report matches this product.','FDA (openFDA) and USDA FSIS recall reports. Links are in the row.','Matched by barcode, or by brand and name. A barcode match is stronger than a name match.','Anyone with this product.','Recalls often cover only certain lots, and not every recall is in these databases.','Official reports, checked when you scanned.'],
test:['An independent test of this product, or of this kind of product, reported a result.','The tester named in the row.','Product-specific or category-level, as the row says. Matched by brand and name, not barcode.','Anyone eating this product, using the tester’s own serving assumptions.','One snapshot. Other lots may differ. Tester funding and ties are not checked yet.','We compared the figures with the tester’s page on 2026-10-02.'],
diet:['Label data was compared with the diets you chose.','Your saved diets and the Open Food Facts label and nutrition data.','Label data only. Rules are listed in the diet rules document.','You.','The database record can be incomplete or wrong, so check the package.','Rules are tested in this app. Not dietary or medical advice.'],
caf:['The listed caffeine is above the daily limit you set.','Your saved limit and the caffeine amount in the database.','Per serving, as listed.','You.','Serving size and caffeine amounts can be wrong or missing.','Your own threshold. Not medical advice.'],
topic:['You put this topic on your watch list, and it appears on the label.','Your saved watch list and the Open Food Facts label.','Listed on the label. Amount is not known.','You.','We have not reviewed the research on this topic, so orange here is your choice, not our judgment.','Not an evidence finding.'],
seed:['The evidence on this topic is mixed or contested.','Our evidence dossier on seed oils, linked in the row.','General research, not specific to this product or amount.','General reading, not personal advice.','Studies differ, and some have industry funding.','Dossier reviewed by us. Not clinically reviewed.']};
var WN=['Reason','Source','Scope','Applies to','Limits','Review status'];
function whyOf(r){if(r.rec&&r.color&&r.color!=='grey'){var q=r.rec;return[q.color_reason,q.sources.map(function(x){return x.title}).slice(0,3).join('; ')+(q.sources.length>3?' and '+(q.sources.length-3)+' more (see the evidence sheet)':''),'Evidence type: '+q.scope_type+'. Status: '+q.status+'.',q.applies_to,'Does not show: '+q.does_not_show[0],'Reviewer: '+q.reviewed_by+' ('+q.reviewed_on+'). Source check: '+q.source_check.state+'. Next review due '+q.next_review+'.']}if(!r.color||r.color==='grey'||!r.type)return null;var k=r.type;if(k==='intol'||k==='sweet'||k==='add'||k==='emul'||k==='flav'||k==='sugar'||k==='proc')k=r.color==='yellow'?'seed':'topic';if(k==='gut')return null;return WHY[k]||null}
function whyBlock(r){var w=whyOf(r);if(!w)return null;var d=el('details','olr-why'),s=el('summary',null,'Why this color'),b=el('div');w.forEach(function(x,i){var p=el('p');p.append(el('b',null,WN[i]+': '),document.createTextNode(x));b.append(p)});d.append(s,b);return d}
function mkRow(r){var d=el('details','olr'+(r.color?' c-'+r.color:'')+(r.pin?' pin':''));if(r.open)d.open=true;var s=el('summary');s.append(el('span','t',r.title));if(r.color){var c=el('span','chip2');c.append(el('span','dot'),document.createTextNode(r.chip));s.append(c)}s.append(el('span','cv'));var b=el('div','olr-b');b.append(r.body);var wb=whyBlock(r);if(wb)b.append(wb);d.append(s,b);rowEls[r.type]=d;return d}
var TAGN={addtio2:'Titanium dioxide',addbrom:'Potassium bromate',addbenz:'Benzoates',addbha:'BHA',addbht:'BHT',addsulf:'Sulfites',addpp:'Propylparaben',addcar:'Caramel color',addmsg:'MSG',addpho:'Phosphates',allergen:'Allergens',recall:'Recalls',test:'Testing',seed:'Seed oils',proc:'Processing',sweet:'Sweeteners',add:'Additives',caf:'Caffeine',diet:'Diets',intol:'Intolerances',gut:'Gut',emul:'Emulsifiers',carra:'Carrageenan'};
function openRow(type){var d=rowEls[type];if(!d)return;d.open=true;function go(){d.scrollIntoView({block:'center',behavior:'smooth'})}if(mode!=='full'){setMode('full');setTimeout(go,330)}else go()}
var SHORT=[[/^No match to your list$/,'no match'],[/^Matches your allergy$/,'matches you'],[/^Word on your list$/,'watch word'],[/^Trace warning$/,'trace warning'],[/^Not enough data$/,'no data'],[/^On your watch list$/,'watch list'],[/^([0-9]+) listed.*$/,'$1 listed'],[/^Above tester's limit$/,'above limit'],[/^Tester advises avoiding$/,'advised to avoid'],[/^Lead not detected in lots tested$/,'lead not detected'],[/^No test found$/,'none found'],[/^Contested evidence$/,'contested'],[/^Category-level only$/,'category only'],[/^Within your limit$/,'within limit'],[/^Above your limit$/,'above limit'],[/^Needs a fresh scan$/,'rescan']];
function shortTag(c){for(var i=0;i<SHORT.length;i++){if(SHORT[i][0].test(c))return c.replace(SHORT[i][0],SHORT[i][1])}return c.charAt(0).toLowerCase()+c.slice(1)}
/* Tags show only what matters for this user: findings (any color but grey), the allergy check when allergies are set, diets when diets are set, and checks that failed. Everything else stays in the breakdown. */
function tagKeep(r){if(!r.color)return false;if(r.color!=='grey')return true;var c=String(r.chip||'');
if(r.type==='allergen')return !/not set up/i.test(c);
if(r.type==='diet')return true;
if(r.type==='recall')return /couldn.?t|unavailable|failed|error|unknown|not listed|check/i.test(c)&&!/no match/i.test(c);
return false}
function tagsSection(rows){var w=el('div','tags'),kept=rows.filter(tagKeep);if(!kept.length){w.append(el('p','tags-none','Nothing from your profile matched. This is not a safety statement. Open Breakdown below to see everything we checked and what we could not tell.'));return w}kept.sort(function(a,b){return RANK[b.color]-RANK[a.color]}).forEach(function(r){var t=el('button','tag c-'+r.color);t.append(el('span','dot c-'+r.color),document.createTextNode((TAGN[r.type]||r.title)+': '+shortTag(r.chip)));t.onclick=function(){openRow(r.type)};w.append(t)});return w}
(function(){var _ts=tagsSection;tagsSection=function(r){var w=_ts(r);if(window.__olHidden>0)w.append(el('p','tags-none',window.__olHidden+(window.__olHidden===1?' topic is':' topics are')+' hidden because '+(window.__olHidden===1?'it is':'they are')+' not on your watch list. You can add topics in Profile. Hidden does not mean nothing was found.'));return w}})();
function render(){var m=scrape();if(!m.name)return;var code=curCode();nodes={};rowEls={};
var ing=m.facts['Ingredients']||'';var rows=buildRows(m,ing);
(window.OLPanelPlugins||[]).forEach(function(fn){try{var r=fn(m,{code:code,rows:rows,ing:ing});if(r){var at=r.at==null?rows.length:r.at;delete r.at;rows.splice(at,0,r)}}catch(e){}});
var TOPIC_OF={cured:'curedmeats',dyes:'dyes',sweet:'sweeteners',sweetasp:'sweeteners',sugar:'addedsugar',sugardrink:'addedsugar',seed:'seedoils',seedh:'seedoils',proc:'ultra',flav:'flavors',emul:'emulsifiers',carra:'emulsifiers',add:'additives',addtio2:'additives',addbrom:'additives',addbenz:'additives',addbha:'additives',addbht:'additives',addsulf:'additives',addpp:'additives',addcar:'additives',addmsg:'additives',addpho:'additives'},wt=regTopics(),hidT={},hid=0;
for(var hi=rows.length-1;hi>=0;hi--){var tp=TOPIC_OF[rows[hi].type];if(tp&&wt.indexOf(tp)<0&&rows[hi].color!=='red'){rows.splice(hi,1);hidT[tp]=1}}
hid=Object.keys(hidT).length;
window.__olHidden=hid;
var all=rows.concat([buildNutrition(code?undefined:null),buildSources(m,code)]),pinned=rows.filter(function(r){return r.pin||r.color==='red'}),more=rows.filter(function(r){return !r.pin&&r.color!=='red'&&(r.color==='orange'||r.color==='yellow')}).sort(function(a,b){return RANK[b.color]-RANK[a.color]}).slice(0,3),shown=pinned.concat(more),rest=all.filter(function(r){return shown.indexOf(r)<0});var cnt={red:0,orange:0,yellow:0};rows.forEach(function(r){if(cnt[r.color]!=null)cnt[r.color]++});var nFind=cnt.red+cnt.orange+cnt.yellow;
head.replaceChildren();var top=el('div','olp-top'),img=el('div','olp-img load');nodes.img=img;
var id=el('div','olp-id');id.append(el('h2',null,m.name),el('div','olp-brand',m.brand),el('div','olp-cat',m.type));
var act=el('div','olp-act'),sv=el('button',null,m.saved?'★':'☆'),cl=el('button',null,'×');sv.setAttribute('aria-label',m.saved?'Remove saved product':'Save product');cl.setAttribute('aria-label','Close product details');
sv.onclick=function(){var r=$('#resultSave');if(r)r.click();var now=tx('#resultSave').indexOf('★')>=0;sv.textContent=now?'★':'☆';sv.setAttribute('aria-label',now?'Remove saved product':'Save product')};
cl.onclick=closePanel;act.append(sv,cl);top.append(img,id,act);
handle=el('button','olp-handle');handle.onclick=function(){setMode(mode==='full'?'peek':'full')};
head.append(handle,top);
bodyEl.replaceChildren();
bodyEl.append(el('div','olp-h','Macros'));nodes.mac=macroNode(code?undefined:null);bodyEl.append(nodes.mac);
var ap=window.OLProfile&&window.OLProfile.active&&window.OLProfile.active();bodyEl.append(el('div','olp-h','Tags'+(ap?' · profile: '+ap.name+(ap.changed?' (edited)':''):'')));bodyEl.append(tagsSection(rows));
bodyEl.append(el('div','olp-h','Ingredients'));bodyEl.append(ingSection(ing));
if(shown.length){bodyEl.append(el('div','olp-h','For you'));var parts=[];if(cnt.red)parts.push(cnt.red+' red');if(cnt.orange)parts.push(cnt.orange+' orange');if(cnt.yellow)parts.push(cnt.yellow+' yellow');bodyEl.append(el('p','olp-cnt',nFind+' finding'+(nFind===1?'':'s')+' ('+parts.join(', ')+'). Red items are always shown first, then up to three more. Colors never mean good or bad overall.'));shown.forEach(function(r){bodyEl.append(mkRow(r))})}
bodyEl.append(el('div','olp-h','Breakdown'));var fw=el('div','olp-flt'),brs=[];[['all','See all'],['find','Findings only'],['none','No findings']].forEach(function(f){var b=el('button','olp-fb'+(f[0]==='all'?' on':''),f[1]);b.type='button';b.setAttribute('aria-pressed',f[0]==='all'?'true':'false');b.onclick=function(){brs.forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on?'true':'false')});brs2.forEach(function(p){var isF=p.r.color==='red'||p.r.color==='orange'||p.r.color==='yellow';p.d.hidden=!(f[0]==='all'||(f[0]==='find'&&isF)||(f[0]==='none'&&!isF))})};brs.push(b);fw.append(b)});if(rest.length>1)bodyEl.append(fw);var brs2=[];rest.forEach(function(r){var d=mkRow(r);brs2.push({r:r,d:d});bodyEl.append(d)});
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
var s=tx('#resultName')+'|'+tx('#resultBrand')+'|'+curCode()+'|'+(window.__olIngSig||'');var fresh=panel.hidden||s!==sig;panel.hidden=false;if(fresh){sig=s;mode='peek';render()}}
var t0;function schedule(){cancelAnimationFrame(t0);t0=requestAnimationFrame(sync)}
function track(){if(!res.hidden)return;$$('.view').forEach(function(v){if(v.id!=='result'&&!v.hidden)lastView=v.id})}
var vo=new MutationObserver(function(){track();schedule()});
$$('.view').forEach(function(v){vo.observe(v,{attributes:true,attributeFilter:['hidden']})});
new MutationObserver(schedule).observe(res,{subtree:true,childList:true,characterData:true});
track();schedule();
if(API&&API.ready)API.ready.then(function(){regReady=true;if(!res.hidden&&panel&&!panel.hidden){var md=mode;render();setMode(md,true)}});else regReady=true;
var sl=document.createElement('link');sl.rel='stylesheet';sl.href='scroll-hotfix.css';document.head.appendChild(sl);
['recalls.js','profile.js','profile-rows.js','ingredient-loader.js','library.js'].forEach(function(f){var sc=document.createElement('script');sc.src=f;document.body.appendChild(sc)});
})();

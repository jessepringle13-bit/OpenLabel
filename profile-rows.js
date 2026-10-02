(function(){
'use strict';
var PK='openlabel-profile2-v1',OK='openlabel-calm-dock-v1',XK='openlabel-profile-x-v1',ARS='https://agresearchmag.ars.usda.gov/2009/apr/caffeine';
function oldSweet(){try{var v=JSON.parse(localStorage.getItem(OK)||'{}');return v.sweetener!==false}catch(e){return true}}
function prof(){var d={intol:[],diets:[],topics:null,carbs:''};try{var v=JSON.parse(localStorage.getItem(PK));if(v&&typeof v==='object')for(var k in v)d[k]=v[k]}catch(e){}if(!Array.isArray(d.topics))d.topics=oldSweet()?['sweeteners']:[];return d}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function para(t){return el('p',null,t)}
function K(t){return ' '+String(t||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' '}
function hits(text,list){var t=K(text),out=[];list.forEach(function(w){if(t.indexOf(K(w))>=0&&out.indexOf(w)<0)out.push(w)});return out}
function strip(text,list){var t=String(text||'').toLowerCase();list.forEach(function(s){t=t.split(s).join(' ')});return t}
var NOTMILK=['coconut milk','almond milk','oat milk','soy milk','soya milk','rice milk','cashew milk','hemp milk','cocoa butter','shea butter','peanut butter','almond butter','nut butter','cream of tartar','butternut','coconut cream','cream of coconut','coconut butter','apple butter','butter beans','butter bean','cream soda','sunflower seed butter','seed butter','sunflower butter'];
var NOTMEAT=['vegetable broth','vegetable stock','mushroom broth','veggie broth','seaweed broth','kombu broth','vegan broth','plant based broth'];
var MILK=['milk','whey','casein','caseinate','lactose','butter','cream','cheese','yogurt','yoghurt','ghee','lactalbumin','lactoglobulin','custard','buttermilk'];
var EGG=['egg','eggs','albumin','albumen','mayonnaise','meringue','lysozyme','ovalbumin'];
var MEAT=['beef','pork','chicken','turkey','lamb','veal','bacon','ham','sausage','meat','lard','tallow','gelatin','gelatine','broth','carmine','cochineal'];
var FISH=['fish','tuna','salmon','anchovy','anchovies','shrimp','prawn','crab','lobster','shellfish','krill','cod','sardine','mackerel','fish sauce'];
var ANIMALX=['honey','beeswax','royal jelly','lanolin','shellac'];
var GLUTEN=['wheat','barley','rye','malt','spelt','triticale','semolina','farina','kamut','durum','bulgur','seitan','gluten'];
var GRAIN=['wheat','rice','oats','oat','corn','barley','rye','flour','bread','pasta','cornstarch'];
var LEGUME=['soy','soya','soybean','peanut','peanuts','bean','beans','lentil','lentils','chickpea','chickpeas','peas'];
var REFSUG=['sugar','cane sugar','corn syrup','high fructose corn syrup','dextrose','maltodextrin'];
var SEEDOIL=['sunflower oil','safflower oil','canola oil','rapeseed oil','soybean oil','soya oil','corn oil','cottonseed oil','grapeseed oil','rice bran oil'];
var SULF=['sulfite','sulphite','sulfites','sulphites','sulfur dioxide','sulphur dioxide','metabisulfite','metabisulphite','e220','e221','e222','e223','e224','e225','e226','e227','e228'];
var SALC=['sorbitol','maltitol','xylitol','erythritol','mannitol','isomalt','lactitol','e420','e421','e953','e965','e966','e967','e968'];
var FRUC=['fructose','high fructose corn syrup','agave','honey','invert sugar','fruit juice concentrate'];
var SUGW=['sugar','cane sugar','brown sugar','syrup','corn syrup','honey','dextrose','fructose','glucose','maltose','molasses','cane juice','agave','invert sugar'];
var EMUL=['lecithin','soy lecithin','sunflower lecithin','mono and diglycerides','mono- and diglycerides','monoglycerides','diglycerides','polysorbate 80','polysorbate','carboxymethylcellulose','cellulose gum','carrageenan','xanthan gum','guar gum','gellan gum','locust bean gum','gum arabic','acacia gum','datem','sorbitan monostearate','sodium stearoyl lactylate','methylcellulose','hydroxypropyl methylcellulose','propylene glycol alginate','e322','e471','e472e','e466','e407','e415','e412','e418','e410','e414','e433','e491','e481','e461','e464','e405'];
var LIVE=['live and active cultures','live cultures','active cultures','probiotic','probiotics','lactobacillus','bifidobacterium','bacillus coagulans','saccharomyces boulardii','lactobacillus acidophilus','l acidophilus','b lactis'];
var PREB=['inulin','chicory root','chicory root fiber','chicory fiber','fructooligosaccharides','fructo oligosaccharides','fos','galactooligosaccharides','gos','oligofructose'];
var FERM=['yogurt','yoghurt','kefir','kombucha','kimchi','sauerkraut','miso','tempeh','natto','fermented','sourdough','cultured','buttermilk'];
var CAFW=['caffeine','guarana','yerba mate','kola nut','cola nut','green tea','black tea','matcha','tea extract','coffee','coffee extract'];
var xc={};function xload(){try{xc=JSON.parse(localStorage.getItem(XK))||{}}catch(e){xc={}}}xload();
var pend={};
function getX(code){if(!code)return null;if(xc[code])return xc[code];if(pend[code])return null;pend[code]=1;
var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},9000);
fetch('https://world.openfoodfacts.org/api/v2/product/'+code+'.json?fields=ingredients_analysis_tags,labels_tags,nutriments,serving_size',{signal:ctl.signal}).then(function(r){return r.ok?r.json():null}).then(function(j){clearTimeout(tm);var p=j&&j.product,n=(p&&p.nutriments)||{},o={a:(p&&p.ingredients_analysis_tags)||[],l:(p&&p.labels_tags)||[],c:n.carbohydrates_serving!=null?n.carbohydrates_serving:null,s:n.sugars_serving!=null?n.sugars_serving:null,na:n.sodium_serving!=null?n.sodium_serving:null,ad:n['added-sugars_serving']!=null?n['added-sugars_serving']:null,c100:n.carbohydrates_100g!=null?n.carbohydrates_100g:null,s100:n.sugars_100g!=null?n.sugars_100g:null,na100:n.sodium_100g!=null?n.sodium_100g:null,sv:(p&&p.serving_size)||''};
var keys=Object.keys(xc);if(keys.length>30)delete xc[keys[0]];xc[code]=o;try{localStorage.setItem(XK,JSON.stringify(xc))}catch(e){}if(window.OLPanel)window.OLPanel.refresh()}).catch(function(){clearTimeout(tm);xc[code]={a:[],l:[],err:1};if(window.OLPanel)window.OLPanel.refresh()});return null}
function n1(v){v=Number(v);return String(Math.round(v*(v<10?10:1))/(v<10?10:1))}
function evalDiet(id,ing,x,facts){var t=strip(strip(ing,NOTMILK),NOTMEAT),a=(x&&x.a)||[],l=(x&&x.l)||[],R=function(s,w){return{s:s,w:w}};
var milk=hits(t,MILK),egg=hits(t,EGG),meat=hits(t,MEAT),fish=hits(t,FISH),ax=hits(t,ANIMALX),glu=hits(t,GLUTEN);
if(id==='vegan'){if(a.indexOf('en:vegan')>=0||l.indexOf('en:vegan')>=0)return R('yes','Open Food Facts analysis or a label says vegan.');var bad=[].concat(milk,egg,meat,fish,ax);if(bad.length||a.indexOf('en:non-vegan')>=0)return R('no','Contains '+(bad.length?bad.slice(0,4).join(', '):'animal-derived ingredients')+'.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','No animal ingredients found in the list. Lists can hide animal-derived items.')}
if(id==='vegetarian'){if(a.indexOf('en:vegetarian')>=0||a.indexOf('en:vegan')>=0||l.indexOf('en:vegetarian')>=0||l.indexOf('en:vegan')>=0)return R('yes','Open Food Facts analysis or a label says vegetarian.');var b2=[].concat(meat,fish);if(b2.length||a.indexOf('en:non-vegetarian')>=0)return R('no','Contains '+(b2.length?b2.slice(0,4).join(', '):'meat or fish ingredients')+'.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','No meat or fish found in the list.')}
if(id==='pescatarian'){if(meat.length)return R('no','Contains '+meat.slice(0,4).join(', ')+'.');if(a.indexOf('en:vegetarian')>=0||a.indexOf('en:vegan')>=0)return R('yes','Vegetarian or vegan, so no meat.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','No meat or poultry found in the list.')}
if(id==='glutenfree'){if(l.indexOf('en:gluten-free')>=0)return R('yes','Labeled gluten-free.');if(glu.length)return R('no','Contains '+glu.slice(0,4).join(', ')+'.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','No gluten ingredients found. Cross-contact cannot be judged from a list.')}
if(id==='dairyfree'){if(milk.length)return R('no','Contains '+milk.slice(0,4).join(', ')+'.');if(l.indexOf('en:dairy-free')>=0||l.indexOf('en:vegan')>=0)return R('yes','Labeled dairy-free or vegan.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','No dairy found in the list.')}
if(id==='paleo'){var p=[].concat(hits(t,GRAIN),hits(t,LEGUME),milk,hits(t,REFSUG),hits(t,SEEDOIL));if(p.length)return R('no','Contains '+p.slice(0,4).join(', ')+'. Definitions of paleo vary.');if(!ing)return R('unknown','No ingredient list.');return R('maybe','Nothing paleo excludes was found. Definitions of paleo vary.')}
var c=x&&x.c!=null?x.c:null,s=x&&x.s!=null?x.s:null,na=x&&x.na!=null?x.na*1000:null;
var c100=x&&x.c100!=null?x.c100:null,s100=x&&x.s100!=null?x.s100:null,na100=x&&x.na100!=null?x.na100*1000:null;
if(id==='keto'||id==='lowcarb'){var tg=Number(prof().carbs),pc=function(v){return tg>0?' That is '+Math.round(v/tg*100)+'% of your '+tg+' g daily target.':' Set a daily target in Profile to compare.'};
if(c!=null){if(c>=35||(s!=null&&s>10))return R('no','High carb: '+n1(c)+' g carbs'+(s!=null?', '+n1(s)+' g sugar':'')+' per serving.'+pc(c));return R('maybe',n1(c)+' g carbs per serving.'+pc(c))}
if(c100!=null){if(c100>=25)return R('no','High carb: '+n1(c100)+' g carbs per 100 g or 100 mL. No per-serving amount is listed.');return R('maybe',n1(c100)+' g carbs per 100 g or 100 mL. No per-serving amount is listed, so check the serving size on the package.')}
return R('unknown','Open Food Facts lists no carbohydrate value for this product.')}
if(id==='lowsugar'){if(s!=null){if(s>10)return R('no',n1(s)+' g sugar per serving.');return R('maybe',n1(s)+' g sugar per serving.')}
if(s100!=null){if(s100>=10)return R('no',n1(s100)+' g sugar per 100 g or 100 mL. No per-serving amount is listed.');return R('maybe',n1(s100)+' g sugar per 100 g or 100 mL. No per-serving amount is listed, so check the serving size on the package.')}
return R('unknown','Open Food Facts lists no sugar value for this product.')}
if(id==='lowsodium'){if(na!=null)return R('maybe',Math.round(na)+' mg sodium per serving. Check it against your own limit.');if(na100!=null)return R('maybe',Math.round(na100)+' mg sodium per 100 g or 100 mL. No per-serving amount is listed. Check it against your own limit.');return R('unknown','Open Food Facts lists no sodium value for this product.')}
return R('unknown','')}
var DN={vegan:'Vegan',vegetarian:'Vegetarian',pescatarian:'Pescatarian',keto:'Keto','lowcarb':'Low-carb',paleo:'Paleo',glutenfree:'Gluten-free',dairyfree:'Dairy-free',lowsodium:'Low-sodium',lowsugar:'Low-sugar'};
var WORD={yes:'yes',no:'no',maybe:'maybe',unknown:'can’t tell'};
function dietPlugin(m,ctx){var P=prof();if(!P.diets.length)return null;var x=getX(ctx.code),ing=ctx.ing||'';
var b=el('div'),no=0,yes=0,res=P.diets.map(function(d){return[d,evalDiet(d,ing,x,m.facts)]});
res.forEach(function(r){if(r[1].s==='no')no++;if(r[1].s==='yes')yes++;var p=el('p');p.append(el('strong',null,(DN[r[0]]||r[0])+': '+WORD[r[1].s]),document.createTextNode(' — '+r[1].w));b.append(p)});
b.append(el('p','olp-note','Ingredient lists and database labels can be incomplete or wrong. Always check the package for what matters to you.'));
var rest=res.length-yes-no,color=no?'orange':(yes===res.length?'green':'grey'),chip=no?(no+' not a fit'):(yes===res.length?'Fits by label':(yes?yes+' fit · '+rest+' unclear':'Can’t tell'));
return{type:'diet',title:'Diets',color:color,chip:chip,body:b,pin:false,open:false,at:2}}
function intolPlugin(m,ctx){var P=prof();if(!P.intol.length)return null;var ing=ctx.ing||'',t=strip(ing,NOTMILK),found=[],lists={lactose:MILK,gluten:GLUTEN,sulfites:SULF,sugaralc:SALC,fructose:FRUC},names={lactose:'Lactose',gluten:'Gluten',sulfites:'Sulfites',sugaralc:'Sugar alcohols',fructose:'Fructose'},b=el('div');
P.intol.forEach(function(id){var h=ing?hits(t,lists[id]||[]):[];if(h.length)found.push(id);var p=el('p');p.append(el('strong',null,names[id]+': '+(ing?(h.length?'found':'not found'):'can’t tell')),document.createTextNode(h.length?' — '+h.slice(0,5).join(', ')+'.':(ing?' — nothing matching in the ingredient list.':' — no ingredient list.')));b.append(p)});
b.append(el('p','olp-note','We match words in the ingredient list. Trace amounts and cross-contact are not visible there.'));
var color=!ing?'grey':(found.length?'orange':'grey'),chip=!ing?'Not enough data':(found.length?'Found: '+found.map(function(i){return names[i].toLowerCase()}).join(', '):'No match to your list');
return{type:'intol',title:'Intolerances',color:color,chip:chip,body:b,pin:found.length>0,open:false,at:2}}
function cafPlugin(m,ctx){var ing=ctx.ing||'',h=hits(ing,CAFW),dec=K(ing).indexOf(' decaffeinated ')>=0||K(ing).indexOf(' decaf ')>=0,fact=m.facts['Caffeine'],ex=null;
for(var i=0;i<ctx.rows.length;i++)if(ctx.rows[i].type==='caf'){ex=ctx.rows[i];break}
if(!h.length&&!fact){if(ex)ctx.rows.splice(ctx.rows.indexOf(ex),1);return null}
var b=el('div');b.append(para(fact?'Open Food Facts lists '+fact+'.':'The amount of caffeine is not listed for this product.'));
if(h.length)b.append(para('Caffeine-containing ingredients found: '+h.join(', ')+'.'+(dec?' The label also says decaffeinated, which can still leave a small amount.':'')));
b.append(para('In the US there is no requirement to state the amount of caffeine in a food, and ingredients like guarana, yerba mate and tea extracts may not be labeled as caffeine sources.'));
var a=el('a',null,'USDA Agricultural Research Service: caffeine in botanicals');a.href=ARS;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='color:var(--forest);font-weight:700;overflow-wrap:anywhere';var pp=el('p');pp.append(a);b.append(pp);
var r={type:'caf',title:'Caffeine',color:'orange',chip:'Caffeine present',body:b,pin:false,open:false};
if(ex){for(var k in r)ex[k]=r[k];return null}r.at=ctx.rows.length;return r}
function sugarPlugin(m,ctx){var P=prof(),ing=ctx.ing||'',h=hits(ing,SUGW);if(!h.length)return null;var x=getX(ctx.code),ad=x&&x.ad!=null?x.ad:null;
var sel=P.topics.indexOf('addedsugar')>=0,b=el('div');b.append(para(ad!=null?'Added sugars: '+n1(ad)+' g per serving.':'Sugar-type ingredients in the list: '+h.slice(0,6).join(', ')+'.'));b.append(para('Open Food Facts does not always list added sugars, so check the nutrition panel.'));
return{type:'sugar',title:'Added sugar',color:sel?'orange':'grey',chip:sel?'On your watch list':(ad!=null?n1(ad)+' g added':'Listed'),body:b,pin:false,open:false}}
function flavPlugin(m,ctx){var ing=ctx.ing||'',h=hits(ing,['natural flavor','natural flavors','natural flavour','natural flavours','natural flavoring']);if(!h.length)return null;var sel=prof().topics.indexOf('flavors')>=0,b=el('div');
b.append(para('Natural flavor is a flavoring made from a natural source. The ingredient list does not show the individual components.'));
if(window.OLGloss){var bt=el('button','link','What is this?');bt.onclick=function(){window.OLGloss.open('natural flavors')};b.append(bt)}
return{type:'flav',title:'Natural flavors',color:sel?'orange':'grey',chip:sel?'On your watch list':'Listed',body:b,pin:false,open:false}}
function emulPlugin(m,ctx){var ing=ctx.ing||'',codes=(m.facts['Additives listed']||'').toLowerCase();var h=hits(ing+' '+codes,EMUL);if(!h.length)return null;var sel=prof().topics.indexOf('emulsifiers')>=0,b=el('div');
b.append(para('Found: '+h.slice(0,6).join(', ')+'.'));
b.append(para('What they are: additives that help oil and water mix, or that thicken and stabilize, used to improve texture and extend shelf life. Some of the items above are gums and thickeners that researchers group with emulsifiers.'));
var f=el('p');f.append(el('strong',null,'What we found: mixed evidence.'));b.append(f);
var ul=el('ul');['In a lab model using one healthy donor’s gut microbes, many of the 20 emulsifiers tested changed the microbes, including carboxymethylcellulose, polysorbate 80, carrageenans and several gums. Lecithin did not significantly. This was a lab model, not people.','The same research group reports that carboxymethylcellulose and polysorbate 80 promoted gut inflammation in mice.','In a randomized, placebo-controlled trial of 58 healthy adults in Belgium, four weeks of brownies containing one of five emulsifiers (carboxymethyl cellulose, polysorbate 80, carrageenan, soy lecithin or rice starch) lowered short-chain fatty acids made by gut microbes, but did not raise inflammation markers. The authors noted the trial was small and short and tested single emulsifiers, not the mixtures in real foods.'].forEach(function(t){ul.append(el('li',null,t))});ul.style.cssText='margin:0 0 9px;padding-left:18px';b.append(ul);
b.append(para('Who paid: the trial reports academic funding, and several authors reported consulting fees or honoraria from pharmaceutical and nutrition-related companies. Funding for the lab study has not been checked yet.'));
var p=el('p');[['Lab study (Microbiome, 2021)','https://pmc.ncbi.nlm.nih.gov/articles/PMC7986288/'],['Trial report (AGA, April 2026)','https://news.gastro.org/issues/2026/april-2026/emulsifiers-found-to-lower-gut-metabolites-not-inflammation/']].forEach(function(s,i){if(i)p.append(document.createElement('br'));var a=el('a',null,s[0]);a.href=s[1];a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='color:var(--forest);font-weight:700;overflow-wrap:anywhere';p.append(a)});b.append(p);
return{type:'emul',title:'Emulsifiers and stabilizers',color:sel?'orange':'grey',chip:sel?'On your watch list · mixed evidence':'Mixed evidence',body:b,pin:false,open:false}}
function gutPlugin(m,ctx){var ing=ctx.ing||'',live=hits(ing,LIVE),pre=hits(ing,PREB),fer=hits(ing,FERM);if(!live.length&&!pre.length&&!fer.length)return null;var b=el('div'),parts=[];
function item(h,name,list,txt){var p=el('p');p.append(el('strong',null,name+': '),document.createTextNode(txt+' Found: '+list.slice(0,4).join(', ')+'.'));b.append(p);parts.push(h)}
if(live.length)item('live cultures','Live cultures listed',live,'A probiotic is defined by scientists as live microorganisms that, when given in adequate amounts, give a health benefit. A label that says live cultures does not tell us the strain or the amount.');
if(pre.length)item('prebiotic fiber','Possible prebiotic fiber',pre,'A prebiotic is a substrate that gut microbes selectively use to give a health benefit, and scientists treat it as distinct from fiber in general. These ingredients are often marketed as prebiotics, but the label does not show the benefit.');
if(fer.length)item('fermented','Fermented',fer,'Fermented foods are made through desired microbial growth. They are not the same as probiotics: they need not contain live microbes at the strain level or show a health benefit.');
b.append(para('We only report what the ingredient list says is present. Whether it helps your gut depends on the specific microbe or fiber and the amount, which labels rarely give.'));
var a=el('a',null,'ISAPP: consensus definitions of probiotics, prebiotics and fermented foods');a.href='https://isappscience.org/a-roundup-of-the-isapp-consensus-definitions-probiotics-prebiotics-synbiotics-postbiotics-and-fermented-foods/';a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='color:var(--forest);font-weight:700;overflow-wrap:anywhere';var pp=el('p');pp.append(a);b.append(pp);
return{type:'gut',title:'Gut: live cultures, prebiotics, fermented',color:'grey',chip:'Contains: '+parts.join(', '),body:b,pin:false,open:false}}
function topicMutate(m,ctx){var T=prof().topics;ctx.rows.forEach(function(r){
if(r.type==='seed'&&r.color==='yellow'){if(T.indexOf('seedoils')>=0){r.color='orange';r.chip='On your watch list · contested evidence'}else{r.color='grey';r.chip='Listed · contested evidence'}}
if(r.type==='sweet'){var on=T.indexOf('sweeteners')>=0;r.color=on?'orange':'grey';r.chip=on?'On your watch list':'Listed'}
if(r.type==='add'){var on2=T.indexOf('additives')>=0;r.color=on2?'orange':'grey';var mm=/^([0-9]+)/.exec(r.chip);r.chip=(mm?mm[1]+' listed · ':'')+(on2?'on your watch list':'not yet reviewed')}
if(r.type==='proc'){var u=T.indexOf('ultra')>=0&&r.chip==='Ultra-processed';if(u){r.color='orange';r.chip='On your watch list · ultra-processed'}else if(r.color==='orange'||r.color==='yellow'||r.color==='green')r.color='grey'}});return null}
window.OLDietEval=evalDiet;
var P=window.OLPanelPlugins=window.OLPanelPlugins||[];
[topicMutate,cafPlugin,dietPlugin,intolPlugin,sugarPlugin,flavPlugin,emulPlugin,gutPlugin].forEach(function(f){P.push(f)});
if(window.OLPanel)window.OLPanel.refresh();
})();

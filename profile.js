(function(){
'use strict';
var PK='openlabel-profile2-v1',OK='openlabel-calm-dock-v1';
var INTOL=[['lactose','Lactose'],['gluten','Gluten'],['sulfites','Sulfites'],['sugaralc','Sugar alcohols'],['fructose','Fructose']];
var DIETS=[['vegan','Vegan'],['vegetarian','Vegetarian'],['pescatarian','Pescatarian'],['keto','Keto'],['lowcarb','Low-carb'],['paleo','Paleo'],['glutenfree','Gluten-free'],['dairyfree','Dairy-free'],['lowsodium','Low-sodium'],['lowsugar','Low-sugar']];
var TOPICS=[['seedoils','Seed oils'],['sweeteners','Sweeteners'],['addedsugar','Added sugar'],['ultra','Ultra-processed'],['additives','Additives'],['flavors','Flavors'],['emulsifiers','Emulsifiers'],['curedmeats','Cured meats'],['dyes','Food dyes']];
function oldSweet(){try{var v=JSON.parse(localStorage.getItem(OK)||'{}');return v.sweetener!==false}catch(e){return true}}
function get(){var d={intol:[],diets:[],topics:null,carbs:''};try{var v=JSON.parse(localStorage.getItem(PK));if(v&&typeof v==='object')for(var k in v)d[k]=v[k]}catch(e){}
if(!Array.isArray(d.topics))d.topics=oldSweet()?['sweeteners']:[];return d}
function put(d){try{localStorage.setItem(PK,JSON.stringify(d))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var sty=document.createElement('style');
sty.textContent='#profile.p2on>.field,#profile.p2on>#savePrefs{display:none}.p2 .olr-b>p{margin:0 0 12px;color:var(--muted);font-size:13px}.p2 .p2n{font-size:12px;color:var(--muted);margin:10px 0 0}.p2 .search{margin-top:6px}.p2 .olr .chip2{font-weight:700}';
document.head.appendChild(sty);

var SK='openlabel-profile-sets-v1';
function sload(){try{var v=JSON.parse(localStorage.getItem(SK));if(v&&typeof v==='object'&&v.sets)return v}catch(e){}return{active:null,sets:{}}}
function sput(v){try{localStorage.setItem(SK,JSON.stringify(v))}catch(e){}}
function snapshot(){var o={};try{o=JSON.parse(localStorage.getItem(OK)||'{}')}catch(e){}var d=get();return{p2:{intol:d.intol.slice().sort(),diets:d.diets.slice().sort(),topics:d.topics.slice().sort(),carbs:d.carbs||''},allergies:(o.allergies||[]).slice().sort(),custom:(o.custom||[]).slice(),limit:o.limit==null?150:o.limit,sweetener:o.sweetener!==false}}
function applySnap(sn){var d=get();d.intol=(sn.p2.intol||[]).slice();d.diets=(sn.p2.diets||[]).slice();d.topics=(sn.p2.topics||[]).slice();d.carbs=sn.p2.carbs||'';put(d);var o={};try{o=JSON.parse(localStorage.getItem(OK)||'{}')}catch(e){}o.allergies=(sn.allergies||[]).slice();o.custom=(sn.custom||[]).slice();o.limit=sn.limit;o.sweetener=sn.sweetener;try{localStorage.setItem(OK,JSON.stringify(o))}catch(e){}}
function activeInfo(){var s=sload();if(!s.active||!s.sets[s.active])return null;var same=JSON.stringify(s.sets[s.active])===JSON.stringify(snapshot());return{name:s.active,changed:!same}}
function setsGroup(){var host=el('div'),listEl=el('div');
var nm=el('input','search');nm.type='text';nm.maxLength=30;nm.placeholder='Name, e.g. Family or Training';nm.setAttribute('aria-label','Name for this profile');
var sv=el('button','button','Save my current choices as this profile');sv.style.marginTop='10px';sv.type='button';
function render(){listEl.replaceChildren();var s=sload(),names=Object.keys(s.sets);if(!names.length){listEl.append(el('p','p2n','No saved profiles yet.'))}
names.forEach(function(n){var row=el('div');row.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--line)';var t=el('b',null,n+(s.active===n?' (in use)':''));t.style.flex='1 1 100%';
function btn(txt,fn){var b=el('button','chip',txt);b.type='button';b.onclick=fn;return b}
row.append(t,btn('Use',function(){var sn=s.sets[n];applySnap(sn);var cur=sload();cur.active=n;sput(cur);location.reload()}),btn('Update with my current choices',function(){var cur=sload();cur.sets[n]=snapshot();cur.active=n;sput(cur);render();updAll();if(window.OLPanel)window.OLPanel.refresh()}),btn('Delete',function(){var cur=sload();delete cur.sets[n];if(cur.active===n)cur.active=null;sput(cur);render();updAll()}));listEl.append(row)})}
sv.onclick=function(){var n=nm.value.trim();if(!n){nm.focus();nm.placeholder='Type a name first, then press Save';nm.style.borderColor='var(--peach)';return}nm.style.borderColor='';var cur=sload();cur.sets[n]=snapshot();cur.active=n;sput(cur);nm.value='';render();updAll();if(window.OLPanel)window.OLPanel.refresh()};
host.append(nm,sv,listEl,el('p','p2n','A profile saves your allergies, watch words, intolerances, diets, topics, caffeine limit and carb target. Using one replaces your current choices and reloads the app. Stored on this device only. Scans show only what matches the profile in use.'));render();return host}
var groups=[];
function updAll(){groups.forEach(function(g){g.upd()})}
function oldChips(){return [].slice.call(document.querySelectorAll('#allergyChips button,#allergyMore button'))}
function oldFor(label){return oldChips().filter(function(b){return b.textContent===label})[0]}
function group(title,desc,host,countFn){var d=el('details','olr c-grey'),s=el('summary'),c=el('span','chip2'),b=el('div','olr-b');s.append(el('span','t',title),c,el('span','cv'));b.append(el('p',null,desc),host);d.append(s,b);
d.upd=function(){var n=countFn?countFn():host.querySelectorAll('.chip.active').length;c.textContent=n?n+' selected':'None selected'};d.upd();groups.push(d);return d}
function chipSet(list,key,d){var host=el('div','chips wrap');list.forEach(function(it){var b=el('button','chip'+(d[key].indexOf(it[0])>=0?' active':''),it[1]);b.type='button';b.setAttribute('aria-pressed',d[key].indexOf(it[0])>=0?'true':'false');
b.onclick=function(){var cur=get(),i=cur[key].indexOf(it[0]);if(i>=0)cur[key].splice(i,1);else cur[key].push(it[0]);put(cur);var on=i<0;b.className='chip'+(on?' active':'');b.setAttribute('aria-pressed',on?'true':'false');updAll();if(window.OLPanel)window.OLPanel.refresh()};host.append(b)});return host}
function allergySet(){var host=el('div','chips wrap');function sync(){[].forEach.call(host.children,function(b){var o=oldFor(b.textContent),on=!!o&&o.classList.contains('active');b.className='chip'+(on?' active':'');b.setAttribute('aria-pressed',on?'true':'false')})}
oldChips().forEach(function(ob){var b=el('button','chip',ob.textContent);b.type='button';b.onclick=function(){var o=oldFor(b.textContent);if(o)o.click();sync();updAll();if(window.OLPanel)window.OLPanel.refresh()};host.append(b)});sync();return host}
function build(){var sec=document.getElementById('profile');if(!sec||sec.querySelector('.p2'))return;if(!oldChips().length){setTimeout(build,200);return}
var d=get(),root=el('div','p2');sec.classList.add('p2on');
root.append(group('Saved profiles','Save sets of choices for different people or goals and switch between them.',setsGroup(),function(){return Object.keys(sload().sets).length}));
root.append(group('Allergies','Tap the ones that apply. OpenLabel compares them with each product’s declared allergens, its may-contain traces and its ingredient text. A match is a warning. No match never means safe, so always read the package.',allergySet()));
var words=el('input','search');words.type='text';words.placeholder='e.g. corn, coconut';words.setAttribute('aria-label','Other words to watch for');var cw=document.getElementById('customWords');words.value=cw?cw.value:'';
words.oninput=function(){if(cw){cw.value=words.value;cw.dispatchEvent(new Event('input'))}updAll()};
words.onchange=function(){if(cw){cw.value=words.value;var sp=document.getElementById('savePrefs');if(sp)sp.click()}updAll()};
var wf=el('div');wf.append(words,el('p','p2n','Separated by commas. Matched against the ingredient list only, and shown as your watch word, not as an allergy.'));root.append(group('Your own watch words','Not medical allergies. Anything you simply want flagged by name, such as a food you avoid.',wf,function(){return words.value.split(',').filter(function(x){return x.trim()}).length}));
root.append(group('Intolerances','We flag matching ingredient words in orange. Labels can be incomplete, so this is a prompt to check, not a guarantee.',chipSet(INTOL,'intol',d)));
var carb=el('input','search');carb.type='number';carb.min='0';carb.max='1000';carb.step='1';carb.placeholder='Daily carb target in grams (optional)';carb.setAttribute('aria-label','Daily carb target in grams');carb.value=d.carbs;carb.onchange=function(){var c=get(),n=Number(carb.value);c.carbs=(carb.value!==''&&n>=0&&n<=1000)?String(Math.round(n)):'';carb.value=c.carbs;put(c)};
var df=el('div');df.append(chipSet(DIETS,'diets',d),carb,el('p','p2n','Each product gets a yes, no, maybe or can’t tell for the diets you pick. Halal and kosher depend on certification, so we can’t judge them from a label. Keto and low-carb compare a product’s carbs with your target.'));root.append(group('Diets','Pick as many as you like.',df,function(){return df.querySelectorAll('.chip.active').length}));
var cl=document.getElementById('limit'),cin=el('input','search');cin.type='number';cin.min='0';cin.max='1000';cin.step='1';cin.placeholder='Daily caffeine limit in mg';cin.setAttribute('aria-label','Daily caffeine limit in mg');cin.value=cl?cl.value:'';
cin.onchange=function(){var n=Number(cin.value);if(cin.value===''||!Number.isInteger(n)||n<0||n>1000){cin.value=cl?cl.value:'';return}if(cl){cl.value=String(n);var sp=document.getElementById('savePrefs');if(sp)sp.click()}updAll();if(window.OLPanel)window.OLPanel.refresh()};
var cf=el('div');cf.append(cin,el('p','p2n','Whole number from 0 to 1000. A product is flagged only when its caffeine amount is listed and above this. If no amount is listed we cannot compare, and that is not the same as zero.'));var cg=group('Caffeine limit','Your own daily limit. This is a personal preference, not medical advice.',cf);cg.upd=function(){cg.querySelector('.chip2').textContent=((cl&&cl.value)||'150')+' mg'};cg.upd();root.append(cg);
var tf=el('div');tf.append(chipSet(TOPICS,'topics',d),el('p','p2n','Topics you pick show their evidence color when they appear in a product (orange or yellow, with the reason). Topics you don’t pick stay grey, so the information is still there. Caffeine is always shown when it is present, because many labels don’t say.'));root.append(group('Topics to watch','What matters to you.',tf));
var first=sec.firstElementChild;first.after(root)}
build();
window.OLProfile={get:get,active:activeInfo,defs:{intol:INTOL,diets:DIETS,topics:TOPICS}};
})();

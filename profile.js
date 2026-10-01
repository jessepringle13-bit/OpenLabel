(function(){
'use strict';
var PK='openlabel-profile2-v1',OK='openlabel-calm-dock-v1';
var INTOL=[['lactose','Lactose'],['gluten','Gluten'],['sulfites','Sulfites'],['sugaralc','Sugar alcohols'],['fructose','Fructose']];
var DIETS=[['vegan','Vegan'],['vegetarian','Vegetarian'],['pescatarian','Pescatarian'],['keto','Keto'],['lowcarb','Low-carb'],['paleo','Paleo'],['glutenfree','Gluten-free'],['dairyfree','Dairy-free'],['lowsodium','Low-sodium'],['lowsugar','Low-sugar']];
var TOPICS=[['seedoils','Seed oils'],['sweeteners','Sweeteners'],['addedsugar','Added sugar'],['ultra','Ultra-processed'],['additives','Additives'],['flavors','Natural flavors'],['emulsifiers','Emulsifiers']];
function oldSweet(){try{var v=JSON.parse(localStorage.getItem(OK)||'{}');return v.sweetener!==false}catch(e){return true}}
function get(){var d={intol:[],diets:[],topics:null,carbs:''};try{var v=JSON.parse(localStorage.getItem(PK));if(v&&typeof v==='object')for(var k in v)d[k]=v[k]}catch(e){}
if(!Array.isArray(d.topics))d.topics=oldSweet()?['sweeteners']:[];return d}
function put(d){try{localStorage.setItem(PK,JSON.stringify(d))}catch(e){}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var sty=document.createElement('style');
sty.textContent='#profile.p2on>.field,#profile.p2on>#savePrefs{display:none}.p2 .olr-b>p{margin:0 0 12px;color:var(--muted);font-size:13px}.p2 .p2n{font-size:12px;color:var(--muted);margin:10px 0 0}.p2 .search{margin-top:6px}.p2 .olr .chip2{font-weight:700}';
document.head.appendChild(sty);
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
root.append(group('Allergies','Tap the ones that apply. OpenLabel compares them with each product’s declared allergens, its may-contain traces and its ingredient text. A match is a warning. No match never means safe, so always read the package.',allergySet()));
var words=el('input','search');words.type='text';words.placeholder='e.g. corn, coconut';words.setAttribute('aria-label','Other words to watch for');var cw=document.getElementById('customWords');words.value=cw?cw.value:'';
words.onchange=function(){if(cw){cw.value=words.value;var sp=document.getElementById('savePrefs');if(sp)sp.click()}updAll()};
var wf=el('div');wf.append(words,el('p','p2n','Separated by commas. They are matched against the ingredient list.'));root.append(group('Other words','Anything else you want flagged by name.',wf,function(){return words.value.split(',').filter(function(x){return x.trim()}).length}));
root.append(group('Intolerances','We flag matching ingredient words in orange. Labels can be incomplete, so this is a prompt to check, not a guarantee.',chipSet(INTOL,'intol',d)));
var carb=el('input','search');carb.type='number';carb.min='0';carb.max='1000';carb.step='1';carb.placeholder='Daily carb target in grams (optional)';carb.setAttribute('aria-label','Daily carb target in grams');carb.value=d.carbs;carb.onchange=function(){var c=get(),n=Number(carb.value);c.carbs=(carb.value!==''&&n>=0&&n<=1000)?String(Math.round(n)):'';carb.value=c.carbs;put(c)};
var df=el('div');df.append(chipSet(DIETS,'diets',d),carb,el('p','p2n','Each product gets a yes, no, maybe or can’t tell for the diets you pick. Halal and kosher depend on certification, so we can’t judge them from a label. Keto and low-carb compare a product’s carbs with your target.'));root.append(group('Diets','Pick as many as you like.',df,function(){return df.querySelectorAll('.chip.active').length}));
var tf=el('div');tf.append(chipSet(TOPICS,'topics',d),el('p','p2n','Topics you pick turn orange when they appear in a product. Topics you don’t pick stay grey, so the information is still there. Caffeine is always shown when it is present, because many labels don’t say.'));root.append(group('Topics to watch','What matters to you.',tf));
var first=sec.firstElementChild;first.after(root)}
build();
window.OLProfile={get:get,defs:{intol:INTOL,diets:DIETS,topics:TOPICS}};
})();

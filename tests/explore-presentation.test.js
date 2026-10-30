const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
let count=0;function check(v,m){count++;assert.ok(v,m)}
function node(text=''){const classes=new Set();return {textContent:text,dataset:{},classList:{add:v=>classes.add(v),contains:v=>classes.has(v)},classes}}
const clear=node('Clear'),form=node(),input=node(),sample=node(),wrap=node(),heading=node('Sample products — illustrative, not live matches'),styles=[],handlers={},timers=[],searches=[];
input.id='exploreSearch';input.value='';input.closest=()=>form;form.querySelectorAll=()=>[clear];sample.parentElement=wrap;wrap.querySelector=s=>s==='h2'?heading:null;
const explore={hidden:false,dataset:{},addEventListener:(type,fn)=>{handlers[type]=fn},contains:n=>n===form};
const document={getElementById:id=>({explore,exploreSearch:input,exploreResults:sample})[id]||null,createElement:()=>({textContent:''}),head:{appendChild:s=>styles.push(s)}};
const context={document,MutationObserver:class{observe(){}},requestAnimationFrame:f=>f(),setTimeout:(f,ms)=>{timers.push({f,ms});return timers.length},clearTimeout:()=>{},Event:class{}};
context.window=context;context.OLExploreSearch={search:v=>searches.push(v),cancel(){}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','explore-layout.js'),'utf8'),context);
check(form.classList.contains('ol-product-search'),'Scoped product form');
check(wrap.dataset.olSamples==='true','Sample wrapper marked');
check(styles[0].textContent.includes('.ol-product-search>button{display:none!important}'),'Search buttons hidden');
input.value='jell-o';handlers.input({target:input});
check(searches.length===0&&timers.length===1&&timers[0].ms===900,'Typing waits 900 ms before searching products');
timers[0].f();check(searches.length===1&&searches[0]==='jell-o','Search runs once after the pause');
input.value='j';handlers.input({target:input});timers[1].f();check(searches.length===1,'One-character text does not search');
console.log(count+' Explore presentation and debounce assertions passed');

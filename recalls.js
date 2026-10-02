(function(){
'use strict';
var BASE='https://api.fda.gov/food/enforcement.json',TTL=6*3600*1000,LK='openlabel-recalls-v1',OFFICIAL='https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts';
var sty=document.createElement('style');sty.textContent='.rc-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:11px 12px;margin:0 0 9px}.rc-card strong{display:block;color:var(--ink)}.rc-card p{margin:5px 0 0!important}.rc-meta{font-size:12px;color:var(--muted);margin-top:5px;overflow-wrap:anywhere}.rc-sub{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--eucalyptus);font-weight:800;margin:12px 0 6px}.rc-lot{display:flex;gap:8px;margin:8px 0 6px}.rc-lot input{flex:1;min-width:0;height:44px;border-radius:12px;border:1px solid #b8cec0;background:var(--ivory);color:var(--ink);padding:0 12px;font:inherit}.rc-lot button{min-height:44px;border-radius:12px;padding:0 14px;background:var(--eucalyptus);color:var(--ivory);font-weight:750}.rc-res{font-size:13px;margin:4px 0 8px;color:var(--ink)}.rc-a{color:var(--forest);font-weight:700;overflow-wrap:anywhere}';
document.head.appendChild(sty);
var mem={},lots={};
var STOP={the:1,and:1,of:1,with:1,for:1,in:1,a:1,an:1,original:1,classic:1,natural:1,organic:1,oz:1,fl:1,ml:1,lb:1,pack:1,count:1,size:1,flavor:1,flavored:1,style:1,premium:1,super:1,brand:1};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function para(t){return el('p',null,t)}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function stem(w){return w.replace(/ies$/,'y').replace(/s$/,'')}
function nz(s){return ' '+norm(s).split(' ').map(stem).join(' ')+' '}
function toks(s){return norm(s).split(' ').map(stem).filter(function(w){return w.length>1&&!STOP[w]&&!/^[0-9]+$/.test(w)})}
function enc(s){return encodeURIComponent(s).replace(/%20/g,'+')}
function ymd(d){var m=d.getMonth()+1,x=d.getDate();return d.getFullYear()+(m<10?'0':'')+m+(x<10?'0':'')+x}
var MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(s){var m=/^([0-9]{4})([0-9]{2})([0-9]{2})$/.exec(s||'');return m?MO[+m[2]-1]+' '+(+m[3])+', '+m[1]:(s||'')}
function cut(s,n){s=String(s||'').split(String.fromCharCode(10)).join(' ').split(String.fromCharCode(13)).join(' ').split(String.fromCharCode(9)).join(' ').replace(/ +/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s}
function ld(){try{return JSON.parse(localStorage.getItem(LK))||{}}catch(e){return {}}}
function save(k){try{var o=ld();o[k]={t:mem[k].t,recs:mem[k].recs};var ks=Object.keys(o);if(ks.length>8){ks.sort(function(a,b){return o[a].t-o[b].t});delete o[ks[0]]}localStorage.setItem(LK,JSON.stringify(o))}catch(e){}}
function pickF(r){var o={};['recall_number','classification','reason_for_recall','recall_initiation_date','report_date','recalling_firm','product_description','code_info','more_code_info','distribution_pattern','status'].forEach(function(f){o[f]=cut(r[f],700)});o.event_id=r.event_id?String(r.event_id):'';return o}
function done(){if(window.OLPanel)window.OLPanel.refresh()}
function fetchBrand(brand){var k=norm(brand),c=mem[k],now=Date.now();
if(c&&(c.state==='loading'||(c.state==='done'&&now-c.t<TTL)||(c.state==='error'&&now-c.t<60000)))return;
var d=ld()[k];if(d&&now-d.t<TTL){mem[k]={state:'done',t:d.t,recs:d.recs};return}
mem[k]={state:'loading',t:now};
var term='"'+brand.replace(/"/g,' ')+'"',from=ymd(new Date(now-548*864e5));
var q='(recalling_firm:'+term+' OR product_description:'+term+') AND report_date:['+from+' TO 20991231]';
var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},10000);
fetch(BASE+'?search='+enc(q)+'&sort=report_date:desc&limit=25',{signal:ctl.signal}).then(function(r){clearTimeout(tm);if(r.status===404)return {results:[]};if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(j){mem[k]={state:'done',t:Date.now(),recs:(j.results||[]).map(pickF)};save(k);done()}).catch(function(){clearTimeout(tm);mem[k]={state:'error',t:Date.now()};done()})}

var FSURL='https://www.fsis.usda.gov/fsis/api/recall/v/1?field_archive_recall=0',FSK='openlabel-fsis-v1',FSTTL=6*3600*1000;
var fst={state:'idle',t:0,upd:'',recs:[]},fscb=[];
function stripH(h){return String(h||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;|&#039;|&rsquo;|&ldquo;|&rdquo;/g,'"').replace(/\s+/g,' ').trim()}
function fsFirm(t){var m=/^(.*?)\s+(?:Recalls?|Issues?|Announces?|Expands?|Voluntarily|Establishes|Is Recalling|Recalled)\b/i.exec(t||'');return cut((m&&m[1])||t,90)}
function fsReduce(j){var cutoff=ymd(new Date(Date.now()-548*864e5)),out=[],upd='';(j||[]).forEach(function(x){var d=String(x.field_recall_date||'').replace(/-/g,'');if(!/^[0-9]{8}$/.test(d)||d<cutoff)return;var lm=String(x.field_last_modified_date||'');if(lm>upd)upd=lm;
var prods=(x.field_product_items||[]).map(function(s){return cut(stripH(s),200)}).filter(Boolean),states=(x.field_states||[]).join(', '),type=x.field_recall_type||'',summ=stripH(x.field_summary),url=String(x.field_recall_url||'').replace(/^http:/,'https:');
out.push({src:'USDA',classification:x.field_recall_classification||(/alert/i.test(type)?'Public health alert':''),reason_for_recall:cut((x.field_recall_reason||[]).join('; '),300),cat_text:cut((x.field_recall_reason||[]).join(' ')+' '+summ,600),recall_initiation_date:d,report_date:d,recalling_firm:fsFirm(x.field_title),title:cut(x.field_title,200),product_description:prods.length?prods.join('; '):cut(x.field_title,200),prods:prods,code_info:'',more_code_info:'',distribution_pattern:states,status:type,recall_number:x.field_recall_number||'',event_id:'',url:/^https:\/\/www\.fsis\.usda\.gov\//.test(url)?url:''})});
out.sort(function(a,b){return a.report_date<b.report_date?1:-1});return {recs:out,upd:upd}}
function fsisLoad(cb){if(cb)fscb.push(cb);if(fst.state==='loading')return;if(fst.state==='done'&&Date.now()-fst.t<FSTTL){flush();return}
if(fst.state==='error'&&Date.now()-fst.t<60000){flush();return}
try{var c=JSON.parse(localStorage.getItem(FSK));if(c&&Date.now()-c.t<FSTTL&&Array.isArray(c.recs)){fst={state:'done',t:c.t,upd:c.upd||'',recs:c.recs};flush();return}}catch(e){}
fst.state='loading';var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},25000);
fetch(FSURL,{signal:ctl.signal}).then(function(r){clearTimeout(tm);if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(j){var o=fsReduce(j);fst={state:'done',t:Date.now(),upd:o.upd,recs:o.recs};try{localStorage.setItem(FSK,JSON.stringify({t:fst.t,upd:fst.upd,recs:fst.recs}))}catch(e){}flush()}).catch(function(){clearTimeout(tm);fst={state:'error',t:Date.now(),upd:'',recs:[]};flush()})}
function flush(){var a=fscb;fscb=[];a.forEach(function(f){try{f()}catch(e){}})}
window.OLFsis={load:fsisLoad,get:function(){return fst}};
function variants(code){var d=String(code||'').replace(/[^0-9]/g,''),v=[];if(d.length>=8)v.push(d);if(d.length===13&&d.charAt(0)==='0')v.push(d.slice(1));if(d.length===12)v.push('0'+d);return v}
function level(r,p){var dg=(r.product_description+' '+r.code_info+' '+r.more_code_info).replace(/[^0-9]/g,'');
if(p.variants.some(function(v){return dg.indexOf(v)>=0}))return 3;
var hay=nz(r.product_description+' '+r.recalling_firm),bt=toks(p.brand);
if(!bt.length||!bt.every(function(w){return hay.indexOf(' '+w+' ')>=0}))return 0;
var nt=toks(p.name).filter(function(w){return bt.indexOf(w)<0}),need=nt.length<=2?nt.length:Math.ceil(nt.length*0.6);
if(!need)return 1;var pd=nz(r.product_description);
return nt.filter(function(w){return pd.indexOf(' '+w+' ')>=0}).length>=need?2:1}
function lotHit(lot,r){var u=String(lot||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(u.length<3)return false;return (r.code_info+' '+r.more_code_info).toUpperCase().replace(/[^A-Z0-9]/g,'').indexOf(u)>=0}
function card(r){var d=el('div','rc-card');d.append(el('strong',null,(r.classification||'Recall')+' · '+(r.recalling_firm||'Unknown firm')),para(cut(r.product_description,240)));
if(r.reason_for_recall)d.append(el('div','rc-meta','Reason: '+cut(r.reason_for_recall,240)));
d.append(el('div','rc-meta',(r.src==='USDA'?'USDA FSIS · announced ':'Recall started ')+fmt(r.recall_initiation_date)+(r.status?' · status: '+r.status:'')+(r.recall_number?' · '+r.recall_number:'')));
if(r.code_info)d.append(el('div','rc-meta','Lots or dates listed: '+cut(r.code_info,320)));
if(r.distribution_pattern)d.append(el('div','rc-meta','Sold in: '+cut(r.distribution_pattern,160)));if(r.url){var lu=el('a','rc-a','USDA FSIS notice for this recall (official)');lu.href=r.url;lu.target='_blank';lu.rel='noopener noreferrer';var lq=el('div','rc-meta');lq.append(lu);d.append(lq)}if(r.event_id&&/^[0-9]+$/.test(r.event_id)){var lk=el('a','rc-a','FDA enforcement report for this recall (official)');lk.href='https://www.accessdata.fda.gov/scripts/ires/index.cfm?Event='+r.event_id;lk.target='_blank';lk.rel='noopener noreferrer';var lp=el('div','rc-meta');lp.append(lk);d.append(lp)}return d}
function foot(b){b.append(el('p','olp-note','Sources: FDA food recall reports (openFDA) and USDA FSIS meat, poultry and egg product recalls and public health alerts, last 18 months.'+(fst.state==='error'?' The USDA check could not be reached just now, so USDA recalls were not searched.':'')+' Matches are by brand and name, so a possible match is not confirmed. Finding no recall does not guarantee a product is safe.'));var p=el('p'),a=el('a','rc-a','FDA recalls list (official)');a.href=OFFICIAL;a.target='_blank';a.rel='noopener noreferrer';p.append(a);p.append(document.createElement('br'));var a2=el('a','rc-a','USDA FSIS recalls and alerts (official)');a2.href='https://www.fsis.usda.gov/recalls';a2.target='_blank';a2.rel='noopener noreferrer';p.append(a2);b.append(p)}
function plugin(m,ctx){var R={type:'recall',title:'Recalls',at:1,pin:false,open:false,color:'grey',chip:'Not enough data'},b=el('div');R.body=b;
if(!ctx.code){R.chip='Sample product';b.append(para('This is a sample product, so we did not search recall reports.'));return R}
var brand=m.brand;if(!brand||/not listed/i.test(brand)){R.chip='No brand listed';b.append(para('This product has no brand in the database, so we cannot search recall reports.'));return R}
var k=norm(brand);fetchBrand(brand);var c=mem[k]||{state:'loading'};
if(c.state==='loading'){R.chip='Checking…';b.append(para('Searching FDA recall reports…'));return R}
if(c.state==='error'){R.chip="Couldn't check";b.append(para('We could not reach the FDA recall database just now. Nothing was learned about recalls for this product.'));var tb=el('button','link','Try again');tb.onclick=function(){delete mem[k];done()};b.append(tb);foot(b);return R}
if(fst.state==='idle'||(fst.state==='done'&&Date.now()-fst.t>FSTTL)||(fst.state==='error'&&Date.now()-fst.t>60000))fsisLoad(done);if(fst.state==='loading'||fst.state==='idle'){R.chip='Checking…';b.append(para('Searching FDA and USDA recall reports…'));return R}
var p={brand:brand,name:m.name,variants:variants(ctx.code)},ms=c.recs.concat(fst.recs).map(function(r){return{r:r,l:level(r,p)}}).filter(function(x){return x.l>0}).sort(function(a,b){return b.l-a.l});
var strong=ms.filter(function(x){return x.l===3}),poss=ms.filter(function(x){return x.l===2}),other=ms.filter(function(x){return x.l===1});
function list(arr,n,label){if(!arr.length)return;if(label)b.append(el('div','rc-sub',label));arr.slice(0,n).forEach(function(x){b.append(card(x.r))});if(arr.length>n)b.append(el('p','olp-note','+ '+(arr.length-n)+' more in the official list.'))}
var cand=strong.length?strong:poss;
if(cand.length){var lk=k+'|'+ctx.code,lot=lots[lk]||'',isS=strong.length>0;R.pin=true;R.open=true;R.color=isS?'red':'orange';R.chip=isS?'Recall found':'Possible match';
b.append(para(isS?'This barcode appears in an FDA recall report. Recalls often cover only certain lots, so check the lot or best-by date on your package.':'A recent FDA recall report from this brand lists a similar product. We could not match it by barcode, so check your lot or best-by date.'));list(cand,3);
var f=el('div','rc-lot'),inp=el('input');inp.type='text';inp.placeholder='Lot or best-by, as printed';inp.setAttribute('aria-label','Lot or best-by date as printed on the package');inp.value=lot;var go=el('button',null,'Check');go.onclick=function(){lots[lk]=inp.value.trim();done()};f.append(inp,go);b.append(f);
if(lot){var hit=cand.some(function(x){return lotHit(lot,x.r)}),all=cand.every(function(x){return (x.r.code_info||'').length>3});
if(hit){R.color='red';R.chip='Lot matches';b.append(el('div','rc-res','Your lot or date appears in the recall list. Read the official notice before you decide.'))}
else if(all){R.color='grey';R.chip='Lot not listed';R.pin=false;b.append(el('div','rc-res','Your entry does not appear in the lots this report lists. That does not confirm your product is unaffected. Type it exactly as printed, and read the official notice if unsure.'))}
else{R.chip='Check the notice';b.append(el('div','rc-res','This report does not list lots clearly, so we cannot compare. Read the official notice.'))}}
else b.append(el('p','olp-note','The check only looks for the same text, so type the lot or date exactly as printed (for example 23-Dec-2026).'))}
else{R.color='grey';R.chip='No match found';b.append(para('We searched FDA and USDA recall reports from the last 18 months for this brand and product and did not find a match. That is not proof that no recall applies.'));list(other,2,'Other recent recalls from this brand')}
foot(b);return R}
(window.OLPanelPlugins=window.OLPanelPlugins||[]).push(plugin);
done();
var sp=document.createElement('script');sp.src='recalls-page.js';document.body.appendChild(sp);
var sg=document.createElement('script');sg.src='glossary.js';document.body.appendChild(sg);
var sl=document.createElement('script');sl.src='lab-tested.js';document.body.appendChild(sl);
})();

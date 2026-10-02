(function(){'use strict';
/* Background research check for the ingredient sheet (first slice of "live research", see
   docs/DESIGN_LAYERS.md and docs/SOURCE_CHECK_SPEC.md).
   It only finds and checks studies. It never states what the evidence shows.
   Per study: C1 standing (PubMed publication types + Crossref update notices), C2 declared funding (Crossref),
   C3 declared conflicts (PubMed record text, shown verbatim), C4 registry flag for human review. "Not found" is never shown as a pass.
   The ingredient name is sent to NCBI (PubMed) and Crossref when a sheet opens. Results are cached 7 days on this device. */
var EU='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',CR='https://api.crossref.org/works/',CK='openlabel-research-v2',TTL=7*864e5,MAXS=3,MAXC=40;
var sty=document.createElement('style');
sty.textContent='.ol-rs{margin-top:16px;border-top:1px solid var(--line);padding-top:12px}.ol-rs h4{margin:0 0 6px;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--eucalyptus);font-weight:800}.ol-rs-st{display:inline-block;font-size:12px;font-weight:760;border-radius:99px;padding:4px 10px;background:#ECEDEA;color:#4C5753;margin:0 0 8px}.ol-rs p{margin:0 0 8px;font-size:13px;line-height:1.45;color:var(--ink)}.ol-rs .ol-rs-note{color:var(--muted);font-size:12px}.ol-rs-item{background:var(--ivory);border:1px solid var(--line);border-radius:14px;padding:10px 12px;margin:0 0 8px}.ol-rs-item strong{display:block;font-size:13px;line-height:1.35}.ol-rs-item small{display:block;color:var(--muted);font-size:12px;margin-top:3px}.ol-rs-item ul{list-style:none;margin:6px 0 0;padding:0;font-size:12px;line-height:1.5}.ol-rs-item li b{font-weight:760}.ol-rs-item a{color:var(--forest);font-weight:700;overflow-wrap:anywhere}.ol-rs-flag{color:#7A3A1B}';
document.head.appendChild(sty);
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function cache(){try{return JSON.parse(localStorage.getItem(CK))||{}}catch(e){return {}}}
function put(k,v){try{var c=cache();c[k]={t:Date.now(),v:v};var ks=Object.keys(c);if(ks.length>MAXC){ks.sort(function(a,b){return c[a].t-c[b].t});delete c[ks[0]]}localStorage.setItem(CK,JSON.stringify(c))}catch(e){}}
function get(k){var e=cache()[k];return e&&Date.now()-e.t<TTL?e.v:null}
function jf(url){var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},12000);return fetch(url,{signal:ctl.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()},function(e){clearTimeout(t);throw e})}
var regP=null;
function registry(){if(!regP)regP=jf('relationship-registry.json').then(function(r){return r&&r.entries||[]},function(){regP=null;return null});return regP}
function xmlInfo(txt){var out={};try{var doc=new DOMParser().parseFromString(txt,'text/xml');Array.prototype.forEach.call(doc.getElementsByTagName('PubmedArticle'),function(a){var pm=a.getElementsByTagName('PMID')[0];if(!pm)return;var coi=a.getElementsByTagName('CoiStatement')[0],aff=[],ag=[];Array.prototype.forEach.call(a.getElementsByTagName('Affiliation'),function(x){aff.push(x.textContent)});Array.prototype.forEach.call(a.getElementsByTagName('Agency'),function(x){ag.push(x.textContent)});out[pm.textContent]={coi:coi?coi.textContent.replace(/\s+/g,' ').trim():'',aff:aff,grants:ag}})}catch(e){}return out}
function regHits(entries,fields){var hits=[];entries.forEach(function(en){var found=[];fields.forEach(function(f){var t=String(f.text||'').toLowerCase();en.match.forEach(function(m){var re=new RegExp('(^|[^a-z0-9])'+m.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z0-9]|$)','i');if(re.test(t)&&found.indexOf(f.where)<0)found.push(f.where)})});if(found.length)hits.push({entry:en,where:found})});return hits}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
function safeName(s){return String(s||'').replace(/[\[\]"()]/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}

/* Standing from PubMed publication types. */
function pmFlags(types){var f=[];(types||[]).forEach(function(t){if(/^Retracted Publication$/i.test(t))f.push('PubMed lists this paper as retracted');else if(/^Retraction of Publication$/i.test(t))f.push('This is a retraction notice');else if(/Expression of Concern/i.test(t))f.push('PubMed lists an expression of concern');else if(/Published Erratum|Erratum/i.test(t))f.push('PubMed lists a correction (erratum)')});return f}
function crFlags(m){var f=[];['updated-by','update-to'].forEach(function(k){(m[k]||[]).forEach(function(u){var ty=String(u.type||u.label||'').toLowerCase();if(ty&&f.indexOf('Crossref lists a '+ty)<0&&k==='updated-by')f.push('Crossref lists a '+ty+(u.source?' (source: '+u.source+')':''))})});return f}

async function checkOne(s){var out={standing:{state:'not run',notes:[]},funding:{state:'not run',names:[]},coi:{state:s.coi?'statement':(s.xml?'none in record':'not run'),text:s.coi||''},reg:{state:'not run',hits:[]}};
  var pm=pmFlags(s.types);
  if(s.doi){try{var d=await jf(CR+encodeURIComponent(s.doi)),m=d&&d.message||{};var cf=crFlags(m);var all=pm.concat(cf);
      out.standing=all.length?{state:'flagged',notes:all}:{state:'no notice found',notes:[]};
      var fn=(m.funder||[]).map(function(x){return x.name}).filter(Boolean);
      out.funding=fn.length?{state:'declared',names:fn.slice(0,4)}:{state:'none in metadata',names:[]}}
    catch(e){out.standing=pm.length?{state:'flagged',notes:pm}:{state:'partly run',notes:[]}}}
  else out.standing=pm.length?{state:'flagged',notes:pm}:{state:'partly run',notes:[]};
  var reg=await registry();
  if(reg){var fields=[{where:'conflict statement',text:s.coi},{where:'author affiliations',text:(s.aff||[]).join(' | ')},{where:'grant agencies in PubMed',text:(s.grants||[]).join(' | ')},{where:'funders in Crossref',text:(out.funding.names||[]).join(' | ')}];
    var h=regHits(reg,fields);out.reg=h.length?{state:'flag',hits:h.map(function(x){return {id:x.entry.id,label:x.entry.label,statement:x.entry.statement,type:x.entry.type,confidence:x.entry.confidence,evidence:x.entry.evidence,where:x.where}})}:{state:'no match',hits:[]}}
  return out}

async function research(name){var q=safeName(name);
  var term='"'+q+'"[Title/Abstract] AND humans[MeSH Terms] AND (randomized controlled trial[pt] OR systematic review[pt] OR meta-analysis[pt])';
  var es=await jf(EU+'esearch.fcgi?db=pubmed&retmode=json&retmax='+MAXS+'&sort=relevance&term='+encodeURIComponent(term));
  var r=es.esearchresult||{},ids=r.idlist||[],total=Number(r.count||0);
  if(!ids.length)return {total:total,studies:[],at:Date.now()};
  var su=await jf(EU+'esummary.fcgi?db=pubmed&retmode=json&id='+ids.join(',')),res=su.result||{},studies=[];
  var xi={};try{var xt=await (await fetch(EU+'efetch.fcgi?db=pubmed&retmode=xml&id='+ids.join(','))).text();xi=xmlInfo(xt)}catch(e){}
  for(var i=0;i<ids.length;i++){var x=res[ids[i]];if(!x)continue;var doi='';(x.articleids||[]).forEach(function(a){if(a.idtype==='doi')doi=a.value});
    var s={pmid:ids[i],title:String(x.title||'').replace(/\.$/,''),journal:x.source||'',date:x.pubdate||'',types:x.pubtype||[],doi:doi};var inf=xi[ids[i]];if(inf){s.xml=true;s.coi=inf.coi;s.aff=inf.aff;s.grants=inf.grants}
    await sleep(350);s.checks=await checkOne(s);studies.push(s)}
  return {total:total,studies:studies,at:Date.now()}}

function typeLabel(types){var t=(types||[]).filter(function(x){return /Randomized|Systematic|Meta-Analysis|Clinical Trial/i.test(x)});return t.length?t.join(', '):'Study'}
function render(box,name,data,err){box.replaceChildren();box.append(el('h4',null,'Research check'));
  var st=el('span','ol-rs-st');
  if(err){st.textContent='Could not check';box.append(st,el('p',null,'The study search did not finish, so nothing was learned about this ingredient. Check your connection and reopen this sheet.'));return}
  if(!data){st.textContent='Checking…';box.append(st,el('p','ol-rs-note','Searching PubMed for human trials and reviews, then checking each result. This can take a few seconds.'));return}
  if(!data.studies.length){st.textContent='No matching studies found';box.append(st,el('p',null,'This search found no human trials or reviews with this exact name in the title or abstract. That does not mean none exist; the name may be written differently.'));}
  else{st.textContent='Studies found · not yet reviewed';box.append(st,el('p',null,'PubMed lists '+data.total+' human trial'+(data.total===1?'':'s')+' or review'+(data.total===1?'':'s')+' with this name in the title or abstract. Showing the top '+data.studies.length+' by relevance. We have not read them, so we make no claim about what they show.'));
    data.studies.forEach(function(s){var it=el('div','ol-rs-item');it.append(el('strong',null,s.title));it.append(el('small',null,[typeLabel(s.types),s.journal,s.date].filter(Boolean).join(' · ')));
      var ul=el('ul'),c=s.checks||{},li;
      li=el('li');li.append(el('b',null,'Standing: '));var sd=c.standing||{};
      if(sd.state==='flagged'){li.append(el('span','ol-rs-flag',sd.notes.join('; ')+'. Read the notice before relying on this paper.'))}
      else if(sd.state==='no notice found')li.append(document.createTextNode('No retraction or correction notice found in PubMed or Crossref. This is not proof the paper is sound.'));
      else li.append(document.createTextNode('Only partly checked (Crossref was not reachable or has no record).'));
      ul.append(li);
      li=el('li');li.append(el('b',null,'Declared funding: '));var fd=c.funding||{};
      li.append(document.createTextNode(fd.state==='declared'?fd.names.join('; ')+'. Funder role not checked.':fd.state==='none in metadata'?'No funder in Crossref metadata. This is not the same as no funding.':'Not run.'));ul.append(li);
      li=el('li');li.append(el('b',null,'Declared conflicts: '));var cd=c.coi||{};
      li.append(document.createTextNode(cd.state==='statement'?'PubMed record says: “'+(cd.text.length>360?cd.text.slice(0,359)+'…':cd.text)+'” (author text, not checked)':cd.state==='none in record'?'No statement in the PubMed record. This is not the same as none; read the paper.':'Not run.'));ul.append(li);
      var rg=c.reg||{};li=el('li');li.append(el('b',null,'Relationship registry: '));
      if(rg.state==='flag'){li.append(el('span','ol-rs-flag','Flag for human review. '));rg.hits.forEach(function(h){li.append(document.createTextNode(h.label+' appears in the '+h.where.join(', ')+'. Registry note ('+h.confidence+'): '+h.statement+' This is a lead about the organization, not a finding about this study. '));h.evidence.forEach(function(ev,i){var ea=el('a',null,'Evidence (tier '+ev.tier+')');ea.href=ev.url;ea.target='_blank';ea.rel='noopener noreferrer';li.append(ea);li.append(document.createTextNode(' '))})})}
      else if(rg.state==='no match')li.append(document.createTextNode('No match in the seed list (4 entries). The list is small, so no match says very little.'));
      else li.append(document.createTextNode('Not run.'));
      ul.append(li);
      it.append(ul);
      var links=el('small');var a=el('a',null,'PubMed');a.href='https://pubmed.ncbi.nlm.nih.gov/'+s.pmid+'/';a.target='_blank';a.rel='noopener noreferrer';links.append(a);
      if(s.doi){links.append(document.createTextNode(' · '));var b=el('a',null,'DOI');b.href='https://doi.org/'+s.doi;b.target='_blank';b.rel='noopener noreferrer';links.append(b)}
      it.append(links);box.append(it)});
    box.append(el('p','ol-rs-note','Provisional: funder roles, undisclosed relationships, study design and human relevance have not been reviewed. A name search can also match a different form or dose than the one on your label.'))}
  box.append(el('p','ol-rs-note','Sources: PubMed (NCBI) and Crossref. The ingredient name is sent to them to run this search. Cached on this device for 7 days.'))}

var running={};
function attach(sheet){var h=sheet.querySelector('h3');if(!h||sheet.querySelector('.ol-rs'))return;var name=h.textContent.trim();if(name.length<3)return;
  var box=el('div','ol-rs');box.setAttribute('aria-live','polite');sheet.append(box);var key=safeName(name),hit=get(key);
  if(hit){render(box,name,hit);return}
  render(box,name,null);
  var p=running[key]||(running[key]=research(name));
  p.then(function(d){put(key,d);render(box,name,d)},function(){render(box,name,null,true)}).then(function(){delete running[key]})}
var pending=false;
function scan(){pending=false;document.querySelectorAll('.ol-ing-sheet').forEach(attach)}
new MutationObserver(function(){if(!pending){pending=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true});
scan();
window.OLResearch={research:research};
})();

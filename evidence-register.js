/* OpenLabel evidence register: finding records, validator and resolver.
   Design: docs/EVIDENCE_REGISTER_DESIGN.md. A non-grey color can only come from a record that passes validate(). */
(function(root){'use strict';
var COLORS=['red','orange','yellow','green','grey'];
var SCOPES=['product-specific','category-level','general research'];
var STATUSES=['converging','contested','unresolved','unsupported'];
var CHECKS=['passed','flagged','not found','not run','partial','complete','incomplete'];
var DAY=864e5;

var RECORDS=[
{
 id:'seed-oils-inflammation',
 topic:'seedoils',
 subject:'Seed oils named in the ingredient list',
 claim:'Higher dietary linoleic acid (the main fat in seed oils) raises inflammation in people.',
 scope_type:'general research',
 applies_to:'People who put seed oils on their watch list. Not a statement about any one product or a medical recommendation.',
 amount:'Not amount-dependent in the evidence reviewed. The label does not state how much oil the product contains.',
 color:'yellow',
 color_reason:'The evidence is contested and unresolved, and key funding checks are incomplete, so no direction is claimed.',
 status:'contested',
 shows:['Small, short randomized trials in healthy adults found no rise in blood inflammation markers.','Pooled studies of 30 groups of people link higher blood linoleic acid levels to fewer heart-disease deaths.'],
 does_not_show:['Long-term effects or disease outcomes from inflammation markers.','That seed oils are safe or harmful for any individual.','Anything about the amount in this product.'],
 sources:[
  {title:'Johnson and Fritsche, Journal of the Academy of Nutrition and Dietetics (2012), review of 15 randomized trials',publisher:'Journal of the Academy of Nutrition and Dietetics',type:'review',date:'2012',url:null,verified:false,note:'Funded by an industry-linked lipids committee; link to be added.'},
  {title:'Marklund et al., Circulation (2019), pooled analysis of 30 cohort studies',publisher:'Circulation',type:'pooled cohort analysis',date:'2019',url:null,verified:false,note:'Part supported by a restricted company grant; link to be added.'}
 ],
 source_check:{state:'incomplete',summary:'Funding and ties checked for 2 of 11 sources, partly checked for 3, not checked for 6.'},
 reviewed_by:'Jesse Pringle (owner)',
 owner_signoff:null,
 review_state:'provisional',
 reviewed_on:'2026-09-30',
 next_review:'2027-03-30',
 dossier:'docs/dossiers/seed-oils-inflammation.md',
 changelog:[{date:'2026-10-03',change:'Moved from a hand-set row into the register.',reason:'Phase 3: every color comes from a record.'}]
}
];

function isDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))}
function nonEmpty(s){return typeof s==='string'&&s.trim().length>0}

/* Returns an array of problems. Empty array means the record may use its color. */
function validate(r){
 var p=[];
 if(!r||typeof r!=='object')return['record is not an object'];
 ['id','topic','subject','claim','applies_to','amount','color_reason','reviewed_by','dossier'].forEach(function(k){if(!nonEmpty(r[k]))p.push('missing '+k)});
 if(COLORS.indexOf(r.color)<0)p.push('color must be one of '+COLORS.join(', '));
 if(SCOPES.indexOf(r.scope_type)<0)p.push('scope_type must be one of '+SCOPES.join(', '));
 if(STATUSES.indexOf(r.status)<0)p.push('status must be one of '+STATUSES.join(', '));
 if(!Array.isArray(r.shows)||!r.shows.length)p.push('shows must list at least one item');
 if(!Array.isArray(r.does_not_show)||!r.does_not_show.length)p.push('does_not_show must list at least one item');
 var src=Array.isArray(r.sources)?r.sources:[];
 src.forEach(function(s,i){['title','publisher','type','date'].forEach(function(k){if(!nonEmpty(s[k]))p.push('source '+(i+1)+' missing '+k)})});
 if(!r.source_check||!nonEmpty(r.source_check.state)||!nonEmpty(r.source_check.summary))p.push('source_check needs state and summary');
 else if(CHECKS.indexOf(r.source_check.state)<0)p.push('source_check.state not recognized');
 if(!isDate(r.reviewed_on))p.push('reviewed_on must be a date (YYYY-MM-DD)');
 if(!isDate(r.next_review))p.push('next_review must be a date (YYYY-MM-DD)');
 if(!Array.isArray(r.changelog)||!r.changelog.length)p.push('changelog needs at least one entry');
 var c=r.color,complete=r.source_check&&(r.source_check.state==='complete'||r.source_check.state==='passed');
 if(c==='orange'||c==='yellow'||c==='green'){
  if(src.length<2)p.push(c+' needs at least two sources');
  if(c==='yellow'&&r.status!=='contested'&&r.status!=='unresolved')p.push('yellow requires status contested or unresolved');
  if(c==='orange'&&r.status!=='converging')p.push('orange requires status converging');
  if(c==='orange'&&(!nonEmpty(r.amount)||/^not amount/i.test(r.amount)))p.push('orange needs an amount or context');
 }
 if(c==='green'){
  if(r.status!=='converging')p.push('green requires status converging');
  if(!complete)p.push('green requires a complete source check');
  if(!nonEmpty(r.green_scope))p.push('green requires green_scope written in the row');
  if(!r.owner_signoff)p.push('green requires owner sign-off');
 }
 if(c==='red'){
  if(['personal-match','official-source'].indexOf(r.red_basis)<0)p.push('red requires red_basis personal-match or official-source');
  if(r.scope_type==='general research')p.push('red cannot come from general research alone');
 }
 return p;
}

/* Resolve the display state of a record for one user and product.
   ctx: {topics:[...], now:Date, matched:[words found on this product]}
   Returns {color, chip, reason, record, problems, note}. Never returns a non-grey color for a bad, overdue or unwatched record. */
function resolve(r,ctx){
 ctx=ctx||{};var now=ctx.now||new Date();var topics=ctx.topics||[];
 var problems=validate(r);
 if(problems.length)return{color:'grey',chip:'Evidence record unavailable',reason:'This evidence record did not pass its checks, so no color is shown.',record:r,problems:problems,note:'invalid'};
 if(new Date(r.next_review).getTime()+DAY<=now.getTime())return{color:'grey',chip:'Review overdue',reason:'This evidence was due for review on '+r.next_review+'. No color is shown until it is reviewed again.',record:r,problems:[],note:'overdue'};
 var watched=topics.indexOf(r.topic)>=0;
 if(r.color==='red'||r.color==='grey'){return{color:r.color,chip:r.color==='grey'?'No evidence finding':'See reason',reason:r.color_reason,record:r,problems:[],note:'ok'}}
 if(!watched)return{color:'grey',chip:'Listed',reason:'Not on your watch list, so no color is shown. The evidence is still available below.',record:r,problems:[],note:'unwatched'};
 var chip=r.status==='contested'?'Contested evidence · on your watch list':r.status==='unresolved'?'Unresolved evidence · on your watch list':'On your watch list';
 return{color:r.color,chip:chip,reason:r.color_reason,record:r,problems:[],note:'ok'};
}

function get(id){for(var i=0;i<RECORDS.length;i++)if(RECORDS[i].id===id)return RECORDS[i];return null}
var api={records:RECORDS,validate:validate,resolve:resolve,get:get,COLORS:COLORS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.OLRegister=api;
})(typeof window!=='undefined'?window:globalThis);

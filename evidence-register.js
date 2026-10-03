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
 sides:{
  for:['Mechanism argument: linoleic acid can convert to arachidonic acid, which the body uses to make inflammation signals. This is a laboratory-level idea, not a measured human outcome.','Re-analyses of two old diet trials raised questions about whether linoleic-acid-rich oils help the heart, and possibly about harm (figures not yet verified against the papers).'],
  against:['Small, short randomized trials in healthy adults found no rise in blood inflammation markers. The main review was funded by an industry-linked committee.','Pooled studies of 30 groups of people link higher blood linoleic acid levels to fewer heart-disease deaths. Part of that work had a restricted company grant.']
 },
 sources:[
  {title:'Johnson and Fritsche, Journal of the Academy of Nutrition and Dietetics (2012), review of 15 randomized trials',publisher:'Journal of the Academy of Nutrition and Dietetics',type:'review',date:'2012',url:null,verified:false,note:'Funded by an industry-linked lipids committee; link to be added.'},
  {title:'Marklund et al., Circulation (2019), pooled analysis of 30 cohort studies',publisher:'Circulation',type:'pooled cohort analysis',date:'2019',url:null,verified:false,note:'Part supported by a restricted company grant; link to be added.'}
 ],
 source_check:{state:'incomplete',summary:'Funding and ties checked for 2 of 11 sources, partly checked for 3, not checked for 6.'},
 reviewed_by:'Draft prepared by OpenLabel research; owner review pending (Jesse Pringle)',
 owner_signoff:null,
 review_state:'provisional',
 reviewed_on:'2026-09-30',
 next_review:'2027-03-30',
 dossier:'docs/dossiers/seed-oils-inflammation.md',
 changelog:[{date:'2026-10-03',change:'Moved from a hand-set row into the register.',reason:'Phase 3: every color comes from a record.'}]
},
{
 id:'cured-meats-colorectal',
 topic:'curedmeats',
 subject:'Cured or processed meat (curing ingredients such as nitrite or nitrate on the label)',
 claim:'Eating processed meat is associated with a higher risk of colorectal cancer.',
 scope_type:'category-level',
 applies_to:'People who put cured meats on their watch list. This describes long-term eating patterns across populations, not a prediction for one person.',
 amount:'Pooled studies: about 16% to 18% higher relative risk of colorectal cancer for each 50 g of processed meat eaten daily (WCRF/AICR 2018: 1.16, 95% CI 1.08 to 1.26; Chan 2011: 1.18, 95% CI 1.10 to 1.28). These are relative risks, not the chance that you get cancer. The label does not say how much you eat.',
 color:'orange',
 color_reason:'Two independent expert reviews rate the evidence that eating processed meat raises colorectal cancer risk as sufficient (IARC) or convincing (WCRF/AICR), and this label lists curing ingredients. The finding is about processed meat as a food category, not about one ingredient.',
 status:'converging',
 shows:[
  'IARC (WHO) classified processed meat as carcinogenic to humans (Group 1) in 2015, based on sufficient evidence for colorectal cancer.',
  'WCRF/AICR (2018) rated the evidence that processed meat increases colorectal cancer risk as convincing.',
  'A 2011 pooled analysis of prospective studies found about 18% higher colorectal cancer risk per 50 g a day.',
  'EFSA (2017) kept the safe levels for nitrite and nitrate added to food. Nitrite from additives was within safe levels for most groups, but highly exposed children might slightly exceed the nitrite limit.'
 ],
 does_not_show:[
  'That curing ingredients are the cause. Processed meat also involves salt, smoking and cooking, and EFSA lists nitrosamine formation from nitrite as a research gap.',
  'How dangerous it is. IARC says Group 1 describes how strong the evidence is, not the size of the risk, and does not mean processed meat is as dangerous as smoking.',
  'A safe amount. IARC says the data did not establish a safe intake level.',
  'Anything about how much of this product you eat, or about this brand.',
  'Whether labels such as uncured or no nitrite added change the risk. Celery powder is a natural source of nitrite.'
 ],
 sides:{
  for:['IARC working group: more than 800 studies considered, sufficient evidence for colorectal cancer.','WCRF/AICR: convincing evidence, relative risk 1.16 per 50 g a day.','Chan 2011: relative risk 1.18 per 50 g a day; risk rose roughly in a straight line up to about 140 g a day of red and processed meat.'],
  against:['Meat trade group NAMI called the IARC classification a dramatic and alarmist overreach and described the hazards as theoretical (an industry position, not a study).','The studies are observational, and the Chan authors say they cannot rule out residual confounding. They also found moderate differences between studies (I-squared 56% for total meat).','EFSA kept the safe levels for added nitrite and nitrate, and said nitrosamines from nitrite added at approved levels are of low concern. Its concern is nitrite unintentionally present in meat products.','USDA said in 2020 it intended to rule on claims such as uncured and no nitrate added. CSPI and Consumer Reports, who petitioned for it, say products labeled uncured can contain similar nitrite levels. We have not verified their tests.']
 },
 sources:[
  {title:'IARC Monographs Volume 114: Questions and answers on red meat and processed meat',publisher:'IARC, World Health Organization',type:'expert evaluation',date:'2015',url:'https://www.iarc.who.int/wp-content/uploads/2018/11/Monographs-QA_Vol114.pdf',verified:true},
  {title:'Meat, fish and dairy products and the risk of cancer (Continuous Update Project Expert Report 2018)',publisher:'World Cancer Research Fund and American Institute for Cancer Research',type:'expert review',date:'2018',url:'https://www.wcrf.org/wp-content/uploads/2024/10/Meat-fish-and-dairy-products.pdf',verified:true},
  {title:'Chan et al., Red and processed meat and colorectal cancer incidence: meta-analysis of prospective studies',publisher:'PLOS ONE',type:'meta-analysis',date:'2011',url:'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0020456',verified:true},
  {title:'EFSA confirms safe levels for nitrites and nitrates added to food',publisher:'European Food Safety Authority',type:'regulator statement',date:'2017-06-15',url:'https://www.efsa.europa.eu/en/press/news/170615',verified:true},
  {title:'USDA to improve misleading processed meat labels',publisher:'Center for Science in the Public Interest',type:'advocacy statement',date:'2020-12-11',url:'https://www.cspi.org/news/usda-improve-misleading-processed-meat-labels-20201211',verified:true},
  {title:'Industry says WHO meat-cancer report alarmist',publisher:'Meat and Poultry (trade press, quoting NAMI)',type:'industry statement',date:'2015 (year not printed on the page)',url:'https://www.meatpoultry.com/articles/11987-industry-says-who-meat-cancer-report-alarmist',verified:true}
 ],
 source_check:{state:'partial',summary:'Funding is stated for 1 of 6 sources (Chan 2011: World Cancer Research Fund International, funder had no role, no competing interests declared). The IARC, WCRF report and EFSA pages read do not state funding or conflicts, and we have not looked further. The advocacy and industry items are positions, not studies. Retraction and correction checks have not been run.'},
 reviewed_by:'Draft prepared by OpenLabel research; owner review pending (Jesse Pringle)',
 owner_signoff:null,
 review_state:'provisional',
 reviewed_on:'2026-10-03',
 next_review:'2027-10-03',
 dossier:'docs/dossiers/cured-meats-colorectal-cancer.md',
 changelog:[{date:'2026-10-03',change:'First draft record from the dossier.',reason:'Owner chose cured meats as the first new topic.'}]
},
{
 id:'synthetic-dyes-child-behavior',
 topic:'dyes',
 subject:'Synthetic food dyes named in the ingredient list',
 claim:'Certain synthetic food dyes can increase hyperactivity or attention problems in some children.',
 scope_type:'general research',
 applies_to:'People who put food dyes on their watch list. The studies are in children, and the app does not know whether the product is for a child. It says nothing about adults.',
 amount:'The main trial gave children drinks with mixtures of several dyes plus sodium benzoate; EFSA noted that children eating brightly colored sweets and drinks could reach similar intakes. The label does not state how much dye is in the product.',
 color:'yellow',
 color_reason:'Researchers and regulators disagree. Studies find small effects in some children, but the largest trial tested mixtures and cannot say which dye or amount caused them, and regulators have not agreed the link is established.',
 status:'contested',
 shows:[
  'A UK trial of about 300 children found small increases in hyperactivity scores after drinks containing dye mixtures plus sodium benzoate (McCann 2007).',
  'A 2012 pooled analysis found a small effect on parent-rated behavior (0.18, falling to 0.12 after adjusting for publication bias) and no significant effect on teacher or observer ratings.',
  'California OEHHA (2021) concluded human studies associate synthetic food dyes with adverse neurobehavioral outcomes in children and that children differ in sensitivity.',
  'FDA revoked Red No. 3 for food on 2025-01-15 because of cancer in male rats at high levels, and says there is no evidence it causes cancer in humans.'
 ],
 does_not_show:[
  'Which single dye is responsible. Most trials tested mixtures, some with sodium benzoate.',
  'That dyes cause ADHD. A 2012 review concluded they are not a main cause of ADHD.',
  'Whether the small changes matter for schoolwork or daily life. EFSA said the clinical significance is unknown.',
  'Anything about adults.',
  'Anything about the amount in this product, or that a product without these dyes is better in any other way.'
 ],
 sides:{
  for:['McCann 2007 (UK Food Standards Agency funded, randomized, double-blind, placebo-controlled): dye and benzoate mixtures increased hyperactivity in 3-year-olds and 8 to 9-year-olds.','OEHHA 2021: the current acceptable daily intakes are based on 35 to 70-year-old studies not designed to detect behavioral effects, and may not adequately protect children.','Nigg 2012 pooled analysis: small but significant effect on parent-rated behavior.'],
  against:['EFSA (2008) called the Southampton evidence limited, with a small effect that was not consistent across ages or mixtures, and did not change the acceptable daily intakes.','The trade group IACM states that FDA, JECFA and EFSA have concluded the evidence does not establish causation. This is an industry position that we have not checked.','An FDA advisory committee voted 8 to 6 in 2011 against recommending a ban or warning label (as reported in a 2012 review).','The 2012 pooled analysis found no significant effect on teacher or observer ratings. Its work was funded by ILSI North America with partial funding from the National Confectioners Association.']
 },
 word_notes:[
  {match:'\\b(?:fd&c\\s*)?red\\s*(?:no\\.?\\s*|number\\s*|#\\s*)?3\\b|erythrosine|\\be127\\b',text:'Red No. 3: FDA revoked its use in food on 2025-01-15 (cancer in male rats at high levels; FDA says no evidence of cancer in humans). Food makers have until 2027-01-15, and products made earlier may still be sold.'},
  {match:'tartrazine|quinoline yellow|sunset yellow|carmoisine|azorubine|ponceau 4r|allura red|\\be10[24]\\b|\\be1(?:10|22|24|29)\\b|\\b(?:fd&c\\s*)?(?:yellow\\s*(?:no\\.?\\s*|#\\s*)?[56]|red\\s*(?:no\\.?\\s*|#\\s*)?40)\\b',text:'This is one of the dyes tested in the 2007 UK trial. Since 2010 the EU has required the warning may have an adverse effect on activity and attention in children on foods with six such colors (source dated 2010; current rules not rechecked).'}
 ],
 sources:[
  {title:'McCann et al., Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children in the community',publisher:'The Lancet (copy hosted by CSPI)',type:'randomized trial',date:'2007-09-06',url:'https://www.cspinet.org/sites/default/files/attachment/mccann.pdf',verified:true},
  {title:'EFSA evaluates Southampton study on food additives and child behaviour',publisher:'European Food Safety Authority',type:'regulator statement',date:'2008-03-14',url:'https://www.efsa.europa.eu/en/news/efsa-evaluates-southampton-study-food-additives-and-child-behaviour',verified:true},
  {title:'Nigg et al., Meta-analysis of ADHD or ADHD symptoms, restriction diet, and synthetic food color additives',publisher:'Journal of the American Academy of Child and Adolescent Psychiatry',type:'meta-analysis',date:'2012',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4321798/',verified:true},
  {title:'Arnold, Lofthouse and Hurt, Artificial food colors and attention-deficit/hyperactivity symptoms',publisher:'Neurotherapeutics',type:'review',date:'2012',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC3441937/',verified:true},
  {title:'Health effects assessment: potential neurobehavioral effects of synthetic food dyes in children',publisher:'California Office of Environmental Health Hazard Assessment',type:'government risk assessment',date:'2021-04-16',url:'https://oehha.ca.gov/risk-assessment/report/health-effects-assessment-potential-neurobehavioral-effects-synthetic-food-dyes-children',verified:true},
  {title:'IACM statement on the final OEHHA report',publisher:'International Association of Color Manufacturers',type:'industry statement',date:'2021-04-16',url:'https://iacmcolor.org/iacm-holding-statement-final-oehha-report/',verified:true},
  {title:'FD&C Red No. 3',publisher:'US Food and Drug Administration',type:'regulatory status',date:'2025-01-15',url:'https://www.fda.gov/industry/color-additives/fdc-red-no-3',verified:true},
  {title:'Tracking food industry pledges to remove petroleum-based food dyes',publisher:'US Food and Drug Administration',type:'regulatory status',date:'2026-09-15',url:'https://www.fda.gov/food/color-additives-information-consumers/tracking-food-industry-pledges-remove-petroleum-based-food-dyes',verified:true},
  {title:'Compulsory warnings on colours in food and drink',publisher:'CMS law firm (UK update)',type:'legal summary',date:'2010-08-02',url:'https://cms.law/en/gbr/legal-updates/compulsory-warnings-on-colours-in-food-and-drink',verified:true}
 ],
 source_check:{state:'partial',summary:'Funding is stated for 3 of the 4 research sources (UK Food Standards Agency; ILSI North America with the National Confectioners Association; California Legislature). The 2012 Neurotherapeutics review states none on the page read. The industry statement and law-firm summary are positions, not studies. Retraction and correction checks have not been run.'},
 reviewed_by:'Draft prepared by OpenLabel research; owner review pending (Jesse Pringle)',
 owner_signoff:null,
 review_state:'provisional',
 reviewed_on:'2026-10-03',
 next_review:'2027-04-03',
 dossier:'docs/dossiers/synthetic-food-dyes-child-behavior.md',
 changelog:[{date:'2026-10-03',change:'First draft record from the dossier.',reason:'Owner chose food dyes as the second new topic.'}]
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
 if(r.word_notes!=null){if(!Array.isArray(r.word_notes))p.push('word_notes must be a list');else r.word_notes.forEach(function(w,i){if(!nonEmpty(w.match)||!nonEmpty(w.text))p.push('word_note '+(i+1)+' needs match and text')})}
 if(r.status==='contested'&&(!r.sides||!r.sides.for||!r.sides.against||!r.sides.for.length||!r.sides.against.length))p.push('contested needs the strongest case on each side (sides.for and sides.against)');
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
 if(ctx.applies===false)return{color:'grey',chip:'Listed · may not apply',reason:'The research behind this record does not clearly apply to this ingredient list, so no color is shown.',record:r,problems:[],note:'inapplicable'};
 var watched=topics.indexOf(r.topic)>=0;
 if(r.color==='red'||r.color==='grey'){return{color:r.color,chip:r.color==='grey'?'No evidence finding':'See reason',reason:r.color_reason,record:r,problems:[],note:'ok'}}
 if(!watched)return{color:'grey',chip:'Listed',reason:'Not on your watch list, so no color is shown. The evidence is still available below.',record:r,problems:[],note:'unwatched'};
 var chip=r.status==='contested'?'Contested evidence · on your watch list':r.status==='unresolved'?'Unresolved evidence · on your watch list':'On your watch list';
 return{color:r.color,chip:chip,reason:r.color_reason,record:r,problems:[],note:'ok'};
}

/* Detectors: decide whether a product's ingredient text touches a topic. They never decide a color. */
var CURE=/\b(?:sodium|potassium)\s+(?:nitrite|nitrate)\b|\bnitrites?\b|\bnitrates?\b|\bcuring\s+salts?\b|\bcured\b/gi;
var CELERY=/\bcelery\s+(?:powder|juice|juice\s+powder|extract|salt)\b|\bcultured\s+celery\b/gi;
var MEAT=/\b(?:pork|beef|chicken|turkey|ham|bacon|sausages?|salami|pepperoni|hot\s*dogs?|frankfurters?|bologna|mortadella|pastrami|corned|jerky|prosciutto|lamb|veal|meat|bratwurst|kielbasa|chorizo|pancetta|lunch\s*meat)\b/i;
var DYE=/\b(?:fd&c\s*)?(?:red|yellow|blue|green)\s*(?:no\.?\s*|number\s*|#\s*)?(?:40|3|5|6|1|2)\b(?:\s*lake)?|\ballura\s+red\b|\btartrazine\b|\bsunset\s+yellow\b|\bbrilliant\s+blue\b|\bindigotine\b|\bindigo\s+carmine\b|\bfast\s+green\b|\berythrosine\b|\bcitrus\s+red\b|\borange\s+b\b|\bquinoline\s+yellow\b|\bcarmoisine\b|\bazorubine\b|\bponceau\s+4r\b|\be(?:102|104|110|122|124|127|129|132|133|143)\b|\bartificial\s+colou?rs?\b/gi;
function uniq(a){var o=[];a.forEach(function(x){x=x.toLowerCase().replace(/\s+/g,' ');if(o.indexOf(x)<0)o.push(x)});return o}
function detect(topic,text){
 text=String(text||'');var m;
 if(topic==='curedmeats'){
  var cure=uniq(text.match(CURE)||[]),cel=uniq(text.match(CELERY)||[]),meat=MEAT.test(text);
  var found=cure.slice();if(meat)cel.forEach(function(x){found.push(x)});
  return{found:found,meat:meat,celeryOnly:!cure.length&&found.length>0};
 }
 if(topic==='dyes'){var d=uniq(text.match(DYE)||[]);return{found:d}}
 return{found:[]};
}
function notesFor(r,found){
 var out=[];(r.word_notes||[]).forEach(function(w){var re=new RegExp(w.match,'i');if(found.some(function(f){return re.test(f)}))out.push(w.text)});return out;
}

function get(id){for(var i=0;i<RECORDS.length;i++)if(RECORDS[i].id===id)return RECORDS[i];return null}
var api={records:RECORDS,validate:validate,resolve:resolve,get:get,detect:detect,notesFor:notesFor,COLORS:COLORS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.OLRegister=api;
})(typeof window!=='undefined'?window:globalThis);

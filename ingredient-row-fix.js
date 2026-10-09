(function(){'use strict';
var rules=[
[/^(?:cyanocobalamin|methylcobalamin|hydroxycobalamin|hydroxocobalamin|adenosylcobalamin|vitamin b12|cobalamin)$/i,'Vitamin B12'],
[/^(?:vitamin d|vitamin d2|vitamin d3|ergocalciferol|cholecalciferol)$/i,'Vitamin D'],
[/^(?:folic acid|folate|vitamin b9|(?:l-)?(?:5-)?methylfolate|5-mthf|l-5-mthf|levomefolate(?: calcium)?)$/i,'Folate'],
[/^magnesium(?: (?:oxide|citrate|chloride|lactate|aspartate|sulfate))?$/i,'Magnesium'],
[/^(?:vitamin e|mixed tocopherols|(?:d-|dl-)?alpha[- ]tocopher(?:ol|yl acetate|yl succinate))$/i,'Vitamin E'],
[/^(?:citric acid|lactic acid)$/i,'Acidity control'],
[/^(?:ascorbic acid|vitamin c)$/i,'Vitamin C / antioxidant'],
[/^(?:sodium benzoate|potassium sorbate|calcium propionate|sodium nitrite)$/i,'Preservative'],
[/^(?:soy lecithin|sunflower lecithin|lecithin|lecithins|mono- and diglycerides(?: of fatty acids)?|polysorbate ?80)$/i,'Emulsifier'],
[/^(?:xanthan gum|guar gum|carrageenan|pectin|gelatin)$/i,'Texture'],
[/^(?:sodium bicarbonate|baking soda|monocalcium phosphate)$/i,'Leavening'],
[/^(?:silicon dioxide|calcium silicate)$/i,'Anti-caking'],
[/^(?:natural flavou?r(?:s|ing)?|artificial flavou?r(?:s|ing)?|spices)$/i,'Flavoring'],
[/^(?:sugar|sucrose|glucose|fructose|corn syrup|high fructose corn syrup|honey|maple syrup)$/i,'Sweetening'],
[/^(?:sucralose|aspartame|acesulfame(?: potassium| k)?|saccharin|stevia|steviol glycosides|sorbitol|xylitol|erythritol|maltitol)$/i,'Sweetener'],
[/^(?:caramel colou?r|annatto(?: extract)?|beta[- ]carotene|red 40|yellow 5|blue 1)$/i,'Color'],
[/^(?:modified (?:food )?starch|corn starch|tapioca starch)$/i,'Starch'],
[/^(?:sunflower oil|safflower oil|canola oil|rapeseed oil|soybean oil|soya oil|corn oil|olive oil|coconut oil|palm oil|vegetable oil)$/i,'Oil'],
[/^(?:salt|sea salt|sodium chloride)$/i,'Salt'],
[/^(?:water|filtered water)$/i,'Liquid base']
];
var unspecific=[/^(?:vitamin b12|cobalamin|vitamin d|folate|vitamin b9|magnesium|vitamin e|mixed tocopherols|vegetable oil)$/i];
function clean(s){return String(s||'').trim().replace(/^[.\s]+|[.\s]+$/g,'').replace(/^ingredients?\s*:\s*/i,'').replace(/^contains?\s+2%\s+or\s+less\s+of\s*:\s*/i,'').trim()}
function info(s){var t=clean(s),detail=window.OLIngredients&&window.OLIngredients.lookup?window.OLIngredients.lookup(t):null;if(detail&&detail.purpose)return detail.use+(detail.formUnspecified?' · form/source unspecified':'');for(var i=0;i<rules.length;i++)if(rules[i][0].test(t))return rules[i][1]+(unspecific[0].test(t)?' · form/source unspecified':'');var ph=window.OLPurpose&&window.OLPurpose.lookup(t);if(ph&&ph.use)return ph.use;return 'Purpose not yet verified'}
function applyRow(row){if(row.dataset.olRowFixed)return;var name=row.querySelector('.ol-ing-row-name'),meta=row.querySelector('.ol-ing-row-meta');if(!name||!meta)return;var inf=info(name.textContent),txt=(inf==='Purpose not yet verified'?'':inf+'  ')+'›';row.dataset.olBaseMeta=txt;if(!row.dataset.evidence&&!row.dataset.watchWord)meta.textContent=txt;row.dataset.olRowFixed='1';row.classList.add('ol-ing-neutral')}
function applySheet(box){if(box.dataset.olColorFixed)return;box.dataset.olColorFixed='1';var name=box.querySelector('h3'),role=box.querySelector('.ol-ing-role');if(!name||!role)return;var rt=role.textContent.trim();if(rt==='Not yet reviewed'||rt==='Common use identified')role.textContent=info(name.textContent).replace(/^Purpose not yet verified$/,'Research review pending');if(!/research review pending/i.test(role.textContent))role.textContent=role.textContent.trim()+' · research review pending';var note=document.createElement('p');note.className='ol-ing-evidence-note';note.textContent='Color is not a verdict. A colored finding requires a source, a stated scope (person, amount or use), and a reason you can inspect. No ingredient gets green or red just because its name or general purpose is known.';box.append(note)}
var pending=false;function scan(){pending=false;document.querySelectorAll('.ol-ing-row').forEach(applyRow);document.querySelectorAll('.ol-ing-sheet').forEach(applySheet)}
new MutationObserver(function(){if(!pending){pending=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true});scan();
})();

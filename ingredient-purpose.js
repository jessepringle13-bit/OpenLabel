(function(){'use strict';
var FDA='https://www.fda.gov/food/food-additives-and-gras-ingredients-information-consumers/types-food-ingredients';
var ODS='https://ods.od.nih.gov/factsheets/';
var rules=[
[/^(?:cyanocobalamin|methylcobalamin|hydroxycobalamin|hydroxocobalamin|adenosylcobalamin|vitamin b12|cobalamin)$/i,'A form of vitamin B12, a nutrient needed for red blood cells and nerve function. When added to food it can increase the B12 content; the label alone does not tell us the manufacturer’s reason.',ODS+'VitaminB12-HealthProfessional/'],
[/^(?:vitamin d|vitamin d2|vitamin d3|ergocalciferol|cholecalciferol)$/i,'Vitamin D is a nutrient involved in calcium absorption and bone health. In fortified foods it can increase vitamin D content.',ODS+'VitaminD-HealthProfessional/'],
[/^(?:folic acid|folate|vitamin b9|(?:l-)?(?:5-)?methylfolate|5-mthf|l-5-mthf|levomefolate(?: calcium)?)$/i,'A form of folate (vitamin B9), a nutrient used in DNA synthesis and cell division. It can be added to enrich or fortify food.',ODS+'Folate-HealthProfessional/'],
[/^magnesium(?: (?:oxide|citrate|chloride|lactate|aspartate|sulfate))?$/i,'A magnesium source. Magnesium is a mineral nutrient; the named compound can affect how much is absorbed. The label alone does not establish the manufacturer’s reason.',ODS+'Magnesium-HealthProfessional/'],
[/^(?:vitamin e|mixed tocopherols|(?:d-|dl-)?alpha[- ]tocopher(?:ol|yl acetate|yl succinate))$/i,'Vitamin E is a nutrient; tocopherols can also act as antioxidants to help slow rancidity in foods. The label alone does not tell us which purpose applies here.',FDA],
[/^(?:citric acid|lactic acid)$/i,'An acid commonly used to adjust tartness or acidity; it can also help maintain freshness.',FDA],
[/^(?:ascorbic acid|vitamin c)$/i,'Vitamin C (ascorbic acid) can add a nutrient or act as an antioxidant to help preserve color and freshness.',FDA],
[/^(?:sodium benzoate|potassium sorbate|calcium propionate|sodium nitrite)$/i,'A preservative commonly used to slow spoilage or help maintain product quality. The exact purpose depends on the food.',FDA],
[/^(?:soy lecithin|sunflower lecithin|lecithin|lecithins|mono- and diglycerides(?: of fatty acids)?|polysorbate ?80)$/i,'An emulsifier commonly used to help ingredients mix and resist separation, or to improve texture.',FDA],
[/^(?:xanthan gum|guar gum|carrageenan|pectin|gelatin)$/i,'A stabilizer or thickener commonly used to create or maintain texture.',FDA],
[/^(?:sodium bicarbonate|baking soda|monocalcium phosphate)$/i,'A leavening ingredient commonly used to help baked goods rise.',FDA],
[/^(?:silicon dioxide|calcium silicate)$/i,'An anti-caking agent commonly used to keep powdered foods free-flowing.',FDA],
[/^(?:natural flavou?r(?:s|ing)?|artificial flavou?r(?:s|ing)?|spices)$/i,'A label term for ingredients used to add flavor. It does not disclose every component or the precise source.',FDA],
[/^(?:sugar|sucrose|glucose|fructose|corn syrup|high fructose corn syrup|honey|maple syrup)$/i,'A sweetening ingredient; some forms also contribute to texture or browning in foods.',FDA],
[/^(?:sucralose|aspartame|acesulfame(?: potassium| k)?|saccharin|stevia|steviol glycosides|sorbitol|xylitol|erythritol|maltitol)$/i,'A sweetener used to add sweetness. Its effects and suitability depend on the exact substance, amount, and person.',FDA],
[/^(?:caramel colou?r|annatto(?: extract)?|beta[- ]carotene|red 40|yellow 5|blue 1)$/i,'A color ingredient commonly used to add, restore, or standardize appearance.',FDA],
[/^(?:modified (?:food )?starch|corn starch|tapioca starch)$/i,'A starch that can contribute thickness and texture. The label alone does not show its exact role in this product.',FDA],
[/^(?:sunflower oil|safflower oil|canola oil|rapeseed oil|soybean oil|soya oil|corn oil|olive oil|coconut oil|palm oil|vegetable oil)$/i,'An oil commonly used as a fat source or to affect texture and cooking performance. “Vegetable oil” alone does not identify which plant oils are in it.',FDA],
[/^(?:salt|sea salt|sodium chloride)$/i,'Salt adds flavor and can also affect preservation or texture. Its role varies with the food.',FDA],
[/^(?:water|filtered water)$/i,'Water is used as a liquid base or to dissolve and distribute other ingredients.',FDA]
];
function clean(s){return String(s||'').trim().replace(/^[.\s]+|[.\s]+$/g,'').replace(/^ingredients?\s*:\s*/i,'').replace(/^contains?\s+2%\s+or\s+less\s+of\s*:\s*/i,'').trim()}
function lookup(text){var t=clean(text);for(var i=0;i<rules.length;i++)if(rules[i][0].test(t))return{purpose:rules[i][1],source:rules[i][2]};return null}
function add(box,label){var hit=lookup(label);var title=document.createElement('h4'),p=document.createElement('p');title.className='ol-ing-label';title.textContent='What it is and why it may be used';p.textContent=hit?hit.purpose:'This label gives a name, but we do not yet have a verified plain-language purpose for this exact term. We will add one as the ingredient library grows; we won’t guess from its name.';var anchor=box.querySelector('.ol-ing-label');if(anchor){anchor.before(title,p)}else box.append(title,p);if(hit){var a=document.createElement('a');a.className='ol-ing-source';a.href=hit.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Source for common use';p.after(a)}}
function update(box){if(box.dataset.purposeAdded)return;box.dataset.purposeAdded='1';var title=box.querySelector('h3');if(!title)return;var label=title.textContent.trim(),hit=lookup(label);var role=box.querySelector('.ol-ing-role');if(role&&role.textContent.trim()==='Not yet reviewed')role.textContent=hit?'Common use explained':'Purpose not yet verified';add(box,label);var headings=box.querySelectorAll('.ol-ing-label');for(var i=0;i<headings.length;i++)if(headings[i].textContent.trim()==='What we know'){headings[i].textContent='Research review';var p=headings[i].nextElementSibling;if(p)p.textContent='A form-specific evidence review is pending. The common uses above do not establish the effect or safety of this product.'}}
var scheduled=false;function scan(){scheduled=false;var boxes=document.querySelectorAll('.ol-ing-sheet');for(var i=0;i<boxes.length;i++)update(boxes[i])}
new MutationObserver(function(){if(!scheduled){scheduled=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true});scan();
})();

(function(){'use strict';
if(window.__olSupplementActives2Added)return;
if(!window.OLIngredientEntries)throw new Error('Supplement actives batch 2 requires OLIngredientEntries');
/* Supplement actives, second batch: carnitine. Quotes sentences from the NIH Office of Dietary Supplements (ODS) health-professional
   fact sheet word for word (text supplied by the owner on 2026-11-02, page updated April 17, 2023) and adds no health claim of its own.
   tests/supplement-actives-2.test.js checks every quotation against a saved copy of those passages. */
var ODS='The National Institutes of Health Office of Dietary Supplements (ODS) says: ';
var ODS_SHORT='ODS says: ';
var FORM_TAIL=' The label does not establish amount, purity, origin or form.';
var TAIL=' This summarizes one federal health-agency fact sheet. It is not a review of this product, its dose, purity or source, it is not medical advice, and it assigns no verdict. Existing health-evidence findings in OpenLabel are unchanged.';
var q=function(a){return a.map(function(s){return '“'+s+'”'}).join(' ')};
var records=[{
 names:['carnitine','l-carnitine','acetyl-l-carnitine','propionyl-l-carnitine'],
 role:'Amino-acid derived compound · supplement ingredient',use:'Amino-acid derived compound · supplement ingredient',
 form:ODS_SHORT+q(['Carnitine, derived from an amino acid, is the generic term for several compounds, including L-carnitine, acetyl-L-carnitine, and propionyl-L-carnitine',
   'The two main forms of carnitine in dietary supplements are L-carnitine and acetyl-L-carnitine, and amounts range from about 3 mg to 5,000 mg'])+FORM_TAIL,
 purpose:ODS+q(['It is an essential cofactor that helps transport long-chain fatty acids into the mitochondria so that they can be oxidized to produce energy in the form of adenosine triphosphate (ATP)',
   'Healthy children and adults do not need to consume carnitine from food or supplements because the liver and kidneys synthesize sufficient amounts to meet daily needs']),
 difference:ODS_SHORT+q(['Absorption of supplemental L-carnitine is about 14% to 18%, much less than that of dietary L-carnitine',
   'Overall, the evidence on supplemental carnitine’s effectiveness for performance enhancement is mixed, and additional investigations are needed.',
   'Carnitine does not have an established tolerable upper intake level. However, doses of approximately 3 g/day of carnitine supplements can cause nausea, vomiting, abdominal cramps, diarrhea, and a fishy body odor',
   'Several types of medications have the potential to interact with carnitine supplements.'])+' The ODS fact sheet used here (Carnitine, health professional version) was last updated in April 2023.'+TAIL,
 source:'https://ods.od.nih.gov/factsheets/Carnitine-HealthProfessional/',sourceLabel:'NIH Office of Dietary Supplements: Carnitine',
 formUnspecified:true,bracketOk:true,reviewed:'2026-11-02'}];
window.OLIngredientEntries.add(records);
window.__olSupplementActives2Added=true;
})();

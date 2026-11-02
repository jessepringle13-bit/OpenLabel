(function(){'use strict';
if(window.__olSupplementActives3Added)return;
if(!window.OLIngredientEntries)throw new Error('Supplement actives batch 3 requires OLIngredientEntries');
/* Supplement actives, third batch: creatine. Quotes sentences from the Operation Supplement Safety (OPSS, a US Department of Defense
   supplement education program) page on creatine monohydrate word for word (text supplied by the owner on 2026-11-02, page posted
   7 April 2025) and adds no health claim of its own. tests/supplement-actives-3.test.js checks every quotation against a saved copy. */
var OPSS='Operation Supplement Safety (OPSS, a US Department of Defense supplement education program) says: ';
var OPSS_SHORT='OPSS says: ';
var FORM_TAIL=' The label does not establish amount, purity, origin or form.';
var TAIL=' This summarizes one program page, not an NIH fact sheet. It is not a review of this product, its dose, purity or source, it is not medical advice, and it assigns no verdict. Existing health-evidence findings in OpenLabel are unchanged.';
var q=function(a){return a.map(function(s){return '“'+s+'”'}).join(' ')};
var records=[{
 names:['creatine','creatine monohydrate'],
 role:'Muscle-energy compound · supplement ingredient',use:'Muscle-energy compound · supplement ingredient',
 form:OPSS_SHORT+q(['Creatine is a compound found mainly in the skeletal muscle with small amounts also found in the brain.',
   'There are many other forms of creatine available on the market, such as creatine citrate, creatine ethyl ester, and creatine malate. However, creatine monohydrate is the most extensively studied.'])+FORM_TAIL,
 purpose:OPSS+q(['Our bodies store creatine as phosphocreatine (primarily in the muscles) where it\'s used as a source of energy.',
   'Studies involving participants engaged in sports such as soccer players, combat sport athletes, and some racquet sports, have shown benefits from using creatine monohydrate.']),
 difference:OPSS_SHORT+q(['Studies show that there does not appear to be any benefit from creatine monohydrate on aerobic performance, and some studies have shown a decline in performance.',
   'Some other forms of creatine might be marketed as better absorbed by the body, minimizing water retention, or having a greater benefit, but research to support these claims is limited.',
   'There isn\'t enough scientific evidence to confirm that creatine monohydrate supplements improve cognitive performance in healthy adults.',
   'Some studies report minor adverse events such as gastrointestinal upset, bloating, muscle cramping, and headache. The most commonly reported side effect is weight gain.',
   'Dietary supplements are not medicines and are not intended to treat, cure, or prevent any disease or medical condition.',
   'It’s important to seek the guidance of a healthcare provider or performance dietitian before use.'])+' The OPSS page used here (Creatine monohydrate dietary supplement for performance) was posted 7 April 2025.'+TAIL,
 source:'https://www.opss.org/article/creatine-monohydrate-dietary-supplement-performance',sourceLabel:'Operation Supplement Safety (US DoD): Creatine monohydrate',
 formUnspecified:true,bracketOk:true,reviewed:'2026-11-02'}];
window.OLIngredientEntries.add(records);
window.__olSupplementActives3Added=true;
})();

(function(){'use strict';
if(window.__olSupplementActives1Added)return;
if(!window.OLIngredientEntries)throw new Error('Supplement actives batch 1 requires OLIngredientEntries');
/* Batch 2 (supplement actives, first batch): melatonin, omega-3 oils, coenzyme Q10, probiotics, ginkgo, turmeric/curcumin, ashwagandha.
   Each entry quotes sentences from one NIH NCCIH page word for word (read 2026-11-01) and adds no health claim of its own.
   tests/supplement-actives-1.test.js checks every quotation against a saved copy of those pages. */
var NCCIH='The National Center for Complementary and Integrative Health (NCCIH, part of the National Institutes of Health) says: ';
var NCCIH_SHORT='NCCIH says: ';
var FORM_TAIL=' The label does not establish amount, purity, origin or form.';
var TAIL=' This summarizes one federal health-agency page. It is not a review of this product, its dose, purity or source, it is not medical advice, and it assigns no verdict. Existing health-evidence findings in OpenLabel are unchanged.';
// page key: [url, page title, month the page was last updated]
var PAGES={
 "melatonin": [
  "https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know",
  "Melatonin: What You Need To Know",
  "May 2024"
 ],
 "omega3": [
  "https://www.nccih.nih.gov/health/omega3-supplements-what-you-need-to-know",
  "Omega-3 Supplements: What You Need To Know",
  "November 2024"
 ],
 "coq10": [
  "https://www.nccih.nih.gov/health/coenzyme-q10",
  "Coenzyme Q10",
  "January 2019"
 ],
 "probiotics": [
  "https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety",
  "Probiotics: Usefulness and Safety",
  "August 2019"
 ],
 "ginkgo": [
  "https://www.nccih.nih.gov/health/ginkgo",
  "Ginkgo: Usefulness and Safety",
  "February 2025"
 ],
 "turmeric": [
  "https://www.nccih.nih.gov/health/turmeric",
  "Turmeric: Usefulness and Safety",
  "April 2025"
 ],
 "ashwagandha": [
  "https://www.nccih.nih.gov/health/ashwagandha",
  "Ashwagandha: Usefulness and Safety",
  "March 2023"
 ]
};
function quoted(list){return list.map(function(s){return '\u201c'+s+'\u201d'}).join(' ')}
// [names, role, page key, what it is, why it may be used, evidence and safety limits, formUnspecified]
var data=[
 [
  [
   "melatonin"
  ],
  "Hormone (supplement ingredient)",
  "melatonin",
  [
   "Melatonin is a hormone that your brain produces in response to darkness.",
   "Melatonin dietary supplements can be made from animals or microorganisms, but most often they’re made synthetically."
  ],
  [
   "Melatonin supplements may help with certain conditions, such as jet lag, delayed sleep-wake phase disorder, some sleep disorders in children, and anxiety before and after surgery."
  ],
  [
   "According to practice guidelines from the American Academy of Sleep Medicine (2017) and the American College of Physicians (2016), there’s not enough strong evidence on the effectiveness or safety of melatonin supplementation for chronic insomnia to recommend its use.",
   "For melatonin supplements, particularly at doses higher than what the body normally produces, there’s not enough information yet about possible side effects to have a clear picture of overall safety.",
   "Short-term use of melatonin supplements appears to be safe for most people, but information on the long-term safety of supplementing with melatonin is lacking.",
   "In particular, people with epilepsy and those taking blood thinner medications need to be under medical supervision when taking melatonin supplements.",
   "There’s been a lack of research on the safety of melatonin use in pregnant or breastfeeding women.",
   "Some melatonin supplements may not contain what’s listed on the product label.",
   "For most of the supplements, the amount of melatonin in the product didn’t match what was listed on the product label.",
   "In several other countries, melatonin is available only with a prescription and is considered a drug."
  ],
  false
 ],
 [
  [
   "omega-3",
   "omega-3 fatty acids",
   "omega 3 fatty acids"
  ],
  "Omega-3 fatty acids",
  "omega3",
  [
   "Omega-3s (short for omega-3 fatty acids) are a kind of fat found in foods and in the human body.",
   "Most of the research on omega-3s has focused on EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid)."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  true
 ],
 [
  [
   "fish oil",
   "fish oil concentrate"
  ],
  "Fish oil (omega-3 source)",
  "omega3",
  [
   "Fish oil supplements contain EPA and DHA.",
   "EPA and DHA are found in seafood, especially cold-water fish such as salmon, mackerel, and tuna, as well as shellfish and fish oil supplements."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  true
 ],
 [
  [
   "epa",
   "dha",
   "eicosapentaenoic acid",
   "docosahexaenoic acid"
  ],
  "Omega-3 fatty acids (EPA and DHA)",
  "omega3",
  [
   "Most of the research on omega-3s has focused on EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid).",
   "EPA and DHA are found in seafood, especially cold-water fish such as salmon, mackerel, and tuna, as well as shellfish and fish oil supplements."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  true
 ],
 [
  [
   "cod liver oil"
  ],
  "Fish liver oil (omega-3 source)",
  "omega3",
  [
   "Fish liver oil supplements, such as cod liver oil, contain EPA and DHA, and they also contain vitamins A and D, in amounts that vary from product to product.",
   "Vitamins A and D can be harmful in excessive amounts."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  false
 ],
 [
  [
   "krill oil"
  ],
  "Krill oil (omega-3 source)",
  "omega3",
  [
   "Krill oil contains omega-3s in the form of phospholipids."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  false
 ],
 [
  [
   "algal oil"
  ],
  "Algal oil (omega-3 source)",
  "omega3",
  [
   "Algal oils are a vegetarian source of DHA; some also contain EPA."
  ],
  [
   "There is some evidence that people with heart disease or high triglycerides may benefit from taking omega-3 supplements."
  ],
  [
   "For some health conditions, the evidence for benefits from seafood (fish and shellfish) is stronger than the evidence for omega-3 supplements.",
   "Several products containing omega-3s have been approved as prescription drugs to be used in combination with diet to reduce triglyceride levels in patients whose triglyceride levels are very high.",
   "The composition of these products is not the same as that of typical omega-3 supplements, and the testing and regulation of prescription drugs differ from those for dietary supplements.",
   "Side effects of omega-3 supplements are usually mild.",
   "They include unpleasant taste, bad breath, bad-smelling sweat, headache, and gastrointestinal symptoms such as heartburn, nausea, and diarrhea."
  ],
  false
 ],
 [
  [
   "coenzyme q10",
   "coq10"
  ],
  "Coenzyme Q10",
  "coq10",
  [
   "Coenzyme Q10 (CoQ10) is a substance that is naturally present in the human body, with the highest levels in the heart, liver, kidneys, and pancreas.",
   "It is sold in the United States as a dietary supplement."
  ],
  [
   "Because CoQ10 has important functions in the body and because people with some diseases have reduced levels of this substance, researchers have been interested in finding out whether CoQ10 supplements might have health benefits."
  ],
  [
   "CoQ10 has not been shown to be of value in treating cancer, but it may reduce the risk of heart damage caused by one type of cancer chemotherapy drug.",
   "Only a few studies have looked at whether CoQ10 might help prevent heart disease, and their results are inconclusive.",
   "Although results of individual studies have varied, the overall scientific evidence does not support the idea that CoQ10 can reduce muscle pain caused by the cholesterol-lowering drugs known as statins.",
   "No serious side effects of CoQ10 have been reported.",
   "Mild side effects such as insomnia or digestive upsets may occur.",
   "CoQ10 may interact with the anticoagulant (blood thinner) warfarin and the diabetes drug insulin, and it may not be compatible with some types of cancer treatment."
  ],
  false
 ],
 [
  [
   "probiotics",
   "probiotic"
  ],
  "Probiotic (live microorganisms)",
  "probiotics",
  [
   "Probiotics are live microorganisms that are intended to have health benefits when consumed or applied to the body.",
   "The most common are bacteria that belong to groups called Lactobacillus and Bifidobacterium.",
   "Different types of probiotics may have different effects."
  ],
  [
   "Probiotics have shown promise for a variety of health purposes, including prevention of antibiotic-associated diarrhea (including diarrhea caused by Clostridium difficile), prevention of necrotizing enterocolitis and sepsis in premature infants, treatment of infant colic, treatment of periodontal disease, and induction or maintenance of remission in ulcerative colitis."
  ],
  [
   "A great deal of research has been done on probiotics, but much remains to be learned about whether they’re helpful and safe for various health conditions.",
   "However, in most instances, we still don’t know which probiotics are helpful and which are not.",
   "Cases of severe or fatal infections have been reported in premature infants who were given probiotics, and the U.S. Food and Drug Administration (FDA) has warned health care providers about this risk."
  ],
  true
 ],
 [
  [
   "ginkgo",
   "ginkgo biloba",
   "ginkgo biloba extract",
   "ginkgo biloba leaf extract",
   "ginkgo leaf extract"
  ],
  "Ginkgo (herbal extract)",
  "ginkgo",
  [
   "Today, ginkgo leaf, usually as an extract, is the most commonly used form of ginkgo."
  ],
  [
   "Ginkgo is promoted as a dietary supplement for many conditions, including anxiety, heart disease, cognitive impairment and dementia, diabetes, premenstrual syndrome (PMS), schizophrenia, and tinnitus, among others."
  ],
  [
   "There’s no conclusive evidence that ginkgo is helpful for any health condition.",
   "Ginkgo has not been shown to be beneficial for preventing or slowing the progression of dementia.",
   "For most adults, ginkgo leaf extracts are likely to be safe when taken orally in moderate amounts.",
   "Fresh ginkgo seeds are toxic when consumed orally, and serious side effects have also occurred in people who consumed roasted ginkgo seeds or the crude ginkgo plant.",
   "Ginkgo leaf extract is generally well tolerated; the most common side effects are dizziness, gastrointestinal symptoms, and headache.",
   "Ginkgo may increase the risk of bleeding in people who are taking anticoagulant drugs, such as warfarin.",
   "Ginkgo may be unsafe for use during pregnancy."
  ],
  true
 ],
 [
  [
   "curcumin",
   "curcuminoids",
   "turmeric root extract"
  ],
  "Turmeric and curcumin (herbal)",
  "turmeric",
  [
   "Curcumin, a major component of turmeric, gives the spice its yellow color.",
   "The health activities of turmeric are commonly attributed to curcuminoids, which include curcumin."
  ],
  [
   "Today, oral (taken by mouth) turmeric is promoted as a dietary supplement for a variety of conditions, including osteoarthritis, depression, allergies, itching, and high cholesterol."
  ],
  [
   "We don’t know enough to definitively conclude if turmeric or curcumin is beneficial for any health purposes.",
   "Oral curcumin products vary in how much curcumin they actually contain, and they often contain substances from other plants, such as piperine from black pepper.",
   "Combining curcumin with piperine is one way to improve the bioavailability of curcumin.",
   "Highly bioavailable formulations of curcumin, which enhance the body’s ability to absorb the curcumin, may harm your liver.",
   "Conventionally formulated oral turmeric or curcumin (not modified to enhance bioavailability) is likely safe in the recommended amounts for up to 2 or 3 months.",
   "Many curcumin products with increased bioavailability are on the market, and liver damage has been reported in some people who have consumed these bioavailable formulations.",
   "If you notice any liver damage symptoms such as fatigue, nausea, poor appetite, dark urine, or jaundice, stop consuming turmeric or curcumin products immediately and talk with your health care provider.",
   "The use of turmeric supplements during pregnancy may be unsafe."
  ],
  true
 ],
 [
  [
   "ashwagandha",
   "ashwagandha root",
   "ashwagandha root extract",
   "withania somnifera"
  ],
  "Ashwagandha (herbal root extract)",
  "ashwagandha",
  [
   "Ashwagandha is an evergreen shrub found in parts of India, Africa, and the Middle East.",
   "It contains several bioactive compounds, including a group of substances known as withanolides."
  ],
  [
   "Currently, ashwagandha supplements are often promoted for stress and anxiety, sleep, male infertility, and athletic performance.",
   "These supplements typically contain ashwagandha root, leaf, or root/leaf extracts."
  ],
  [
   "However, many of the studies have had small sample sizes and have used a variety of ashwagandha preparations.",
   "Research shows that some ashwagandha preparations may be effective for insomnia and stress.",
   "There isn’t enough evidence to determine if ashwagandha is helpful for any other health conditions, such as asthma, athletic performance, cognitive function, diabetes, menopause, and female infertility.",
   "Ashwagandha may be safe when taken in the short term (up to 3 months).",
   "There is not enough information to allow conclusions about its long-term safety to be reached.",
   "Although it is rare, there have been a number of cases that link liver injury to ashwagandha supplements.",
   "Ashwagandha should be avoided during pregnancy and should not be used while breastfeeding.",
   "There is evidence that ashwagandha might interact with some medications, including those for diabetes and high blood pressure, medicines that decrease the immune system response (immunosuppressants), sedatives, anti-seizure medications (anticonvulsants), and thyroid hormone medications."
  ],
  true
 ]
];
var records=data.map(function(r){var p=PAGES[r[2]];
  return {names:r[0],role:r[1],use:r[1],form:NCCIH_SHORT+quoted(r[3])+FORM_TAIL,purpose:NCCIH+quoted(r[4]),
    difference:NCCIH_SHORT+quoted(r[5])+' The NCCIH page used here ('+p[1]+') was last updated in '+p[2]+'.'+TAIL,
    source:p[0],sourceLabel:'NIH NCCIH: '+p[1],formUnspecified:r[6],reviewed:'2026-11-01'}});
window.OLIngredientEntries.add(records);
window.__olSupplementActives1Added=true;
})();

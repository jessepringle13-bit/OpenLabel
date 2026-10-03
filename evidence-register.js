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
 color_reason:'Human trials of inflammation markers are null, but they are small, short and partly industry-linked, a gene-variant signal exists, and the wider heart-outcome evidence is disputed, so no direction is claimed. Owner decision pending on whether yellow is the right word for an unsupported claim.',
 status:'contested',
 shows:['Two reviews of human randomized trials in mostly healthy adults found no rise in blood inflammation markers when linoleic acid intake went up: 15 trials in 2012 and 30 trials with 1,377 people in 2017 (C-reactive protein, interleukin-6 and tumor necrosis factor-alpha unchanged).','Pooled studies of 30 groups of people link higher blood linoleic acid levels to fewer cardiovascular deaths (hazard ratio 0.78 per interquintile range, 0.70 to 0.85).'],
 does_not_show:['Long-term effects or disease outcomes from inflammation markers. The trials were short and mostly small.','That seed oils are safe or harmful for any individual. One small trial found the C-reactive protein response to linoleic acid differed by a gene variant (FADS1), so averages may hide differences between people.','Anything about the amount in this product, or about oils that are heated, repeatedly reused or partly hydrogenated.'],
 sides:{
  for:['Mechanism argument: linoleic acid can convert to arachidonic acid, which the body uses to make inflammation signals. This is a laboratory-level idea, not a measured human outcome, and a review of trials found tissue arachidonic acid did not rise with more linoleic acid in healthy people.','A 4-week trial in 62 men found the C-reactive protein response to a linoleic-acid-rich diet differed by FADS1 gene variant (Lankinen 2019). It is small, short, and tested one gene, so it is a signal, not a finding.','A meta-regression in the 2017 meta-analysis suggested C-reactive protein might rise when linoleic acid in the diet rose by a very large amount, though the main pooled result was null (as described in a 2025 narrative review; not confirmed from the full 2017 paper).','Re-analyses of two old diet trials (Sydney 1966-73: all-cause death hazard ratio 1.62, 1.00 to 2.64; Minnesota 1968-73: no benefit) raised questions about heart outcomes of linoleic-acid-rich oils. These measure deaths, not inflammation, and both have trans-fat and data-recovery caveats stated by their authors.'],
  against:['The 2017 meta-analysis of 30 randomized trials (1,377 people) found no effect of higher linoleic acid on C-reactive protein (standardized mean difference 0.09, -0.05 to 0.24), interleukin-6 (0.11, -0.07 to 0.29) or tumor necrosis factor-alpha (-0.01, -0.19 to 0.17). Funding and author interests were not on the page read.','The earlier 2012 review of 15 trials found no significant change in any inflammation marker. It was funded by an industry-linked committee and one author consults for Monsanto and Bunge. Its authors state the trials were small and may have missed subtle changes.','Pooled studies of 30 groups of people link higher blood linoleic acid levels to fewer cardiovascular deaths. Part of that work had a restricted company grant (Unilever), and one author reports fees from Bunge and others.','A Cochrane review (19 trials, 6,461 people, WHO-commissioned) found raising omega-6 fats made little or no difference to deaths or cardiovascular events (low-certainty), and a 2017 meta-analysis found that trials with well-controlled diets showed no heart benefit or harm from swapping saturated fat for omega-6-rich oils. The American Heart Association 2017 advisory concluded the opposite for heart disease (about 30 percent fewer events). Heart outcomes are a separate question from inflammation.']
 },
 sources:[
  {title:'Johnson and Fritsche, Effect of dietary linoleic acid on markers of inflammation in healthy persons: a systematic review of randomized controlled trials',publisher:'Journal of the Academy of Nutrition and Dietetics',type:'review',date:'2012',url:'https://pubmed.ncbi.nlm.nih.gov/22889633/',verified:true,note:'Full text read. Funded by an unrestricted grant from the ILSI North America Technical Committee on Dietary Lipids. Johnson reported consulting for Monsanto and Bunge in the previous 5 years; Fritsche reported none. 15 trials. No confidence intervals reported.'},
  {title:'Su et al., Dietary linoleic acid intake and blood inflammatory markers: a systematic review and meta-analysis of randomized controlled trials',publisher:'Food and Function',type:'meta-analysis',date:'2017',url:'https://pubmed.ncbi.nlm.nih.gov/28752873/',verified:true,note:'Abstract read; the full text could not be reached, so funding and author interests are unchecked. 30 trials, 1,377 people.'},
  {title:'Marklund et al., Biomarkers of dietary omega-6 fatty acids and incident cardiovascular disease and mortality',publisher:'Circulation',type:'pooled cohort analysis',date:'2019',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6582360/',verified:true,note:'Full text read. Unilever gave Tufts University a restricted grant to partly support the analysis and states it had no role. Two authors report Unilever research support; Mozaffarian reports fees from Bunge, DSM, GOED and others. 30 studies, 68,659 people.'},
  {title:'Ramsden et al., Use of dietary linoleic acid for secondary prevention of coronary heart disease and death (Sydney Diet Heart Study recovered data)',publisher:'BMJ',type:'trial re-analysis and meta-analysis',date:'2013',url:'https://www.bmj.com/content/346/bmj.e8707',verified:true,note:'Full text read. Funded by the Life Insurance Medical Research Fund of Australia and New Zealand (original trial) and the US NIAAA intramural program; one author was an investigator in the original trial. Crossref lists no correction.'},
  {title:'Ramsden et al., Re-evaluation of the traditional diet-heart hypothesis (Minnesota Coronary Experiment recovered data)',publisher:'BMJ',type:'trial re-analysis and meta-analysis',date:'2016',url:'https://www.bmj.com/content/353/bmj.i1246',verified:true,note:'Full text read. Supported by the US NIAAA intramural program; authors declare no relevant financial relationships. Authors state the diets trans-fat content is unknown and most participants left the study within a year. Crossref lists no correction.'},
  {title:'Abdelhamid et al., Omega-6 fats for the primary and secondary prevention of cardiovascular disease (Cochrane review)',publisher:'Cochrane Database of Systematic Reviews',type:'systematic review',date:'2018',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6513455/',verified:true,note:'Full text read. Funded by the World Health Organization, which commissioned it, plus UK NIHR; no industry ties declared. A later version (pub4, 2018-11) exists; the pub4 page was read for the main results, which match.'},
  {title:'Hamley, The effect of replacing saturated fat with mostly n-6 polyunsaturated fat on coronary heart disease: a meta-analysis of randomised controlled trials',publisher:'Nutrition Journal',type:'meta-analysis',date:'2017',url:'https://nutritionj.biomedcentral.com/articles/10.1186/s12937-017-0254-5',verified:true,note:'Full text read. No funding; sole author declares no competing interests. The author sorted trials into adequately and inadequately controlled himself, which the paper names as a limitation.'},
  {title:'Sacks et al., Dietary fats and cardiovascular disease: a presidential advisory',publisher:'American Heart Association (Circulation)',type:'expert advisory',date:'2017',url:'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000510',verified:true,note:'Full text read. No funding statement on the page. Writing group disclosures include grants or advisory roles from canola, walnut, beef and seafood bodies and from drug companies for some members, and Unilever research support for Wu. A September 2017 correction fixed Wu disclosure entry (Unilever was listed as none); no change to findings.'},
  {title:'Lankinen et al., Inflammatory response to dietary linoleic acid depends on FADS1 genotype',publisher:'American Journal of Clinical Nutrition',type:'controlled trial',date:'2019',url:'https://pubmed.ncbi.nlm.nih.gov/30624587/',verified:true,note:'Abstract and funding read. 62 men, 4 weeks; the abstract says the C-reactive protein response differed by genotype but does not give the direction. Funded by Finnish, Swedish and Novo Nordisk Foundation sources; no industry funder; author disclosures not found.'},
  {title:'Lee and Kurniawan, Are seed oils the culprit in cardiometabolic and chronic diseases? A narrative review',publisher:'Nutrition Reviews',type:'narrative review',date:'2025',url:'https://academic.oup.com/nutritionreviews/article/83/7/e2106/7958450',verified:true,note:'Read. Two authors, no funding or interests declared. Narrative review with no stated risk-of-bias or certainty rating; used here for the 2017 meta-analysis sub-findings it reports.'}
 ],
 source_check:{state:'partial',summary:'Checked 2026-10-03. Funding and author interests read for 9 of 10 sources (Johnson 2012 and Marklund 2019 have industry ties; AHA 2017 has member ties to food and drug bodies). Not read: Su 2017 funding and interests (full text unreachable); Lankinen 2019 author disclosures not found. Crossref shows no correction or retraction for Johnson 2012, Su 2017, Marklund 2019, Ramsden 2013 or 2016, or Hamley 2017; the AHA 2017 advisory has a disclosure-only correction; Cochrane has a newer version with the same main results. Searched 2026-10-03 for newer human studies after 2019; only reviews and one genotype trial found. Not read: the WHO omega-6 observational review (seen only second-hand), the Ramsden 2016 critiques, and full texts of the 2024 vegetable oil umbrella review and the 2026 linoleic acid review.'},
 reviewed_by:'Draft prepared by OpenLabel research; owner review pending (Jesse Pringle)',
 owner_signoff:null,
 review_state:'provisional',
 reviewed_on:'2026-10-03',
 next_review:'2027-03-30',
 dossier:'docs/dossiers/seed-oils-inflammation.md',
 changelog:[{date:'2026-10-03',change:'Moved from a hand-set row into the register.',reason:'Phase 3: every color comes from a record.'},{date:'2026-10-03',change:'Evidence review round 1: 10 sources with links, 2017 meta-analysis of 30 trials added, funding and interests read, source check rerun.',reason:'Owner started the seed oils review.'}]
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
  'IARC Monograph 114 (full evaluation text): for processed meat, 18 cohort studies examined colorectal cancer and 12 found positive associations. A meta-analysis of 10 cohorts gave a relative risk of 1.18 (1.10 to 1.28) per 50 g a day. The Working Group judged chance, bias and confounding unlikely explanations for processed meat, and wrote that consumption of processed meat causes cancer of the colorectum. The Lancet Oncology summary says the majority of the Working Group reached the sufficient-evidence conclusion for processed meat, so it was not described as unanimous.',
  'In the NIH-AARP cohort (about 500,000 adults), estimated nitrate from processed meat was linked to colorectal cancer (relative risk 1.16, 1.02 to 1.32, highest vs lowest fifth) and nitrite showed a similar trend that was not statistically significant (1.11, 0.97 to 1.25).',
  'WCRF/AICR (2018) rated the evidence that processed meat increases colorectal cancer risk as convincing.',
  'A 2011 pooled analysis of prospective studies found about 18% higher colorectal cancer risk per 50 g a day.',
  'A 2025 meta-analysis of 60 prospective studies found processed meat linked to higher colorectal cancer risk (hazard ratio 1.21, 95% CI 1.14 to 1.28, high vs low intake). UK Biobank (475,000 adults, 2020) found 1.18 per 20 g a day (1.03 to 1.31).',
  'WCRF\'s 2025 dietary patterns report again recommends avoiding processed meat for colorectal cancer prevention and calls that evidence particularly strong.',
  'EFSA (2017) kept the safe levels for nitrite and nitrate added to food. Nitrite from additives was within safe levels for the general population, but children at the highest exposure slightly exceeded the nitrite limit.',
  'EFSA\'s full opinion (46 epidemiological studies reviewed) found some evidence linking nitrite plus nitrate from processed meat with colorectal cancer, and evidence linking estimated preformed nitrosamine NDMA intake with colorectal cancer, while finding insufficient evidence for dietary nitrite alone.',
  'IARC\'s 2025 to 2029 priorities report does not list processed meat for re-evaluation and puts ingested nitrate at medium priority for evaluation. No IARC meeting on meat is announced.'
 ],
 does_not_show:[
  'That curing ingredients are the cause. EFSA could not tell apart nitrosamines made from added nitrite and those already in the food, said evidence for dietary nitrite alone is insufficient, and processed meat also involves salt, smoking and cooking.',
  'Which part of processed meat does it. In IARC\'s tables, a diet of nitrite-cured meat raised stool nitroso compounds about as much as a fresh red meat diet did in one human trial (Joosen 2009), nitrite curing made no difference to a DNA-adduct marker in lab fermentation studies, and a rat diet of salt, nitrite and phosphate without meat did not reproduce the lipid-oxidation effect of ham. The IARC Working Group wrote that the mechanisms cannot be attributed to a particular meat component, rated the mechanistic evidence for processed meat as moderate (strong for red meat), and said the evidence on N-nitroso compounds is less clear for processed meat because no studies measured them after eating processed meat.',
  'How dangerous it is. IARC says Group 1 describes how strong the evidence is, not the size of the risk, and does not mean processed meat is as dangerous as smoking.',
  'A safe amount. IARC says the data did not establish a safe intake level.',
  'Anything about how much of this product you eat, or about this brand.',
  'Whether labels such as uncured or no nitrite added change the risk. Celery powder is a natural source of nitrite, and EFSA\'s opinion did not assess nitrite from celery or other vegetable extracts.',
  'Whether newer research changes the finding. Our search found larger and newer cohorts and meta-analyses that agree on direction, plus disputes about certainty. We did not find a retraction or reversal.'
 ],
 sides:{
  for:['IARC working group: more than 800 studies considered, sufficient evidence for colorectal cancer.','WCRF/AICR: convincing evidence, relative risk 1.16 per 50 g a day.','Chan 2011: relative risk 1.18 per 50 g a day; risk rose roughly in a straight line up to about 140 g a day of red and processed meat.'],
  against:['IARC counted 12 of 18 informative cohorts on processed meat as positive, so 6 were not. Several large ones found no significant link: the Danish Diet, Cancer and Health study, the Swedish Mammography Cohort, the Netherlands Cohort Study, the Miyagi cohort and the Multiethnic Cohort, where the association fell from 1.25 to 1.06 after full adjustment. Intake was low in the Japanese cohorts. In EPIC, ham, bacon and other processed meat were each not significant on their own.','IARC noted that the rat studies showing cured meats promote early colon lesions came from a single laboratory, and that dietary nitrate and nitrite intake does not necessarily reflect nitroso compound intake.','A 2019 guideline panel (NutriRECS, Annals of Internal Medicine, no external funding) rated the evidence low certainty and weakly suggested adults continue current processed meat intake. Harvard researchers publicly disputed that recommendation as unjustified by the panel\'s own reviews.','A 2026 umbrella review of processed meat across 37 outcomes rated 72% of its meta-analyses very low and 28% low certainty by GRADE (it did not re-analyze the data).','Two newer cohorts looked at curing-related exposures and found no colorectal link: EPIC (367,463 people, 2025) found no association for nitrosyl-heme (hazard ratio 1.01), and French NutriNet-Santé (101,056 adults, 2022) found none for additive nitrite or nitrate (authors cite limited statistical power), though it linked additive nitrates to breast and nitrites to prostate cancer.','Meat trade group NAMI called the IARC classification a dramatic and alarmist overreach and described the hazards as theoretical (an industry position, not a study).','The studies are observational, and the Chan authors say they cannot rule out residual confounding. They also found moderate differences between studies (I-squared 56% for total meat).','EFSA (2017, full opinion read) kept the safe levels for added nitrite and nitrate, concluded that nitrite added to meat at authorised levels does not lead to nitrosamines at levels of concern, and that nitrosamine exposure from meat products was unlikely to be of concern. It also said the epidemiological evidence is insufficient to conclude that dietary nitrite causes cancer in humans.','USDA said in 2020 it planned to prohibit uncured and no-nitrate-added claims on products cured with any nitrite source. A September 2026 opinion piece says that rulemaking was never finished (an opinion, not an official status). CSPI and Consumer Reports, who petitioned for it, say products labeled uncured can contain similar nitrite levels. We have not verified their tests.']
 },
 sources:[
  {title:'IARC Monographs Volume 114: Questions and answers on red meat and processed meat',publisher:'IARC, World Health Organization',type:'expert evaluation',date:'2015',url:'https://www.iarc.who.int/wp-content/uploads/2018/11/Monographs-QA_Vol114.pdf',verified:true},
  {title:'Meat, fish and dairy products and the risk of cancer (Continuous Update Project Expert Report 2018)',publisher:'World Cancer Research Fund and American Institute for Cancer Research',type:'expert review',date:'2018',url:'https://www.wcrf.org/wp-content/uploads/2024/10/Meat-fish-and-dairy-products.pdf',verified:true},
  {title:'Chan et al., Red and processed meat and colorectal cancer incidence: meta-analysis of prospective studies',publisher:'PLOS ONE',type:'meta-analysis',date:'2011',url:'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0020456',verified:true},
  {title:'Association between red and processed meat consumption and colorectal cancer risk: a meta-analysis of prospective studies',publisher:'GeroScience (PubMed record)',type:'meta-analysis',date:'2025',url:'https://pubmed.ncbi.nlm.nih.gov/40210826/',verified:true,note:'NIH grants listed; one author conflict statement not fully read.'},
  {title:'Meat intake and cancer risk: prospective analyses in UK Biobank',publisher:'International Journal of Epidemiology (PubMed record)',type:'prospective cohort',date:'2020',url:'https://pubmed.ncbi.nlm.nih.gov/32814947/',verified:true,note:'Funded by UK Medical Research Council, Cancer Research UK and Wellcome; no conflict statement on the page.'},
  {title:'Unprocessed red meat and processed meat consumption: dietary guideline recommendations from the NutriRECS consortium',publisher:'Annals of Internal Medicine (PubMed record)',type:'guideline',date:'2019',url:'https://pubmed.ncbi.nlm.nih.gov/31569235/',verified:true,note:'Primary funding: none; specific competing interests not on the page.'},
  {title:'New guidelines say continue red meat consumption habits, but flawed',publisher:'Harvard T.H. Chan School of Public Health, The Nutrition Source',type:'expert critique',date:'2019-09-30',url:'https://nutritionsource.hsph.harvard.edu/2019/09/30/flawed-guidelines-red-processed-meat/',verified:true},
  {title:'Dietary nitrosyl-heme from processed meats and colorectal cancer risk in EPIC',publisher:'PubMed record',type:'prospective cohort',date:'2025-12',url:'https://pubmed.ncbi.nlm.nih.gov/41422247/',verified:true,note:'WHO and Instituto de Salud Carlos III funding listed.'},
  {title:'Nitrites and nitrates from food additives and natural sources and cancer risk: NutriNet-Santé',publisher:'PubMed record',type:'prospective cohort',date:'2022',url:'https://pubmed.ncbi.nlm.nih.gov/35303088/',verified:true,note:'WHO funding listed; no conflict statement on the page.'},
  {title:'A comprehensive evaluation of epidemiological evidence on processed meat intake (umbrella review)',publisher:'PubMed Central',type:'umbrella review',date:'2026-04-28',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC13161111/',verified:true},
  {title:'Dietary and lifestyle patterns for cancer prevention',publisher:'World Cancer Research Fund',type:'expert report',date:'2025-09',url:'https://www.wcrf.org/wp-content/uploads/2025/09/DLP_Report_FINAL_updated.pdf',verified:true},
  {title:'IARC Monographs Volume 114: Red Meat and Processed Meat (Sections 5 and 6, List of Participants)',publisher:'International Agency for Research on Cancer, 2018',type:'expert evaluation (full text)',date:'2018',url:'https://publications.iarc.who.int/Book-And-Report-Series/Iarc-Monographs-On-The-Identification-Of-Carcinogenic-Hazards-To-Humans/Red-Meat-And-Processed-Meat-2018',verified:true,note:'Evaluation, summary, participant declarations, the colorectal chapter text (cohort, case-control and meta-analysis narrative) and the mechanistic chapter (including the nitroso compounds section) read; the numeric tables were spot-checked against the narrative: EPIC, Multiethnic Cohort, NIH-AARP, Danish and CPS-II figures match, and the processed-meat cohort table has 18 studies, matching the stated 18. 22 Working Group scientists; no significant pertinent interests are footnoted for any Working Group member. Industry observers attended but did not take part in evaluations. The volume imprint says co-funded by the European Union. IARC states the Monographs programme is funded by the US National Cancer Institute, the US National Institute of Environmental Health Sciences and the European Commission (employment and social affairs directorate); no industry funder is listed, and the meeting itself is not separately itemized.'},
  {title:'Bouvard et al., Carcinogenicity of consumption of red and processed meat',publisher:'The Lancet Oncology (IARC Working Group summary)',type:'expert evaluation summary',date:'2015-12',url:'https://pubmed.ncbi.nlm.nih.gov/26514947/',verified:true,note:'Full author version read (open copy on HAL). Declaration of interests: one Working Group member was involved in a research project funded by World Cancer Research Fund; all others declared no competing interests; representatives declared none. The majority of the Working Group, not all, concluded sufficient evidence for processed meat. WHO and US National Cancer Institute grants are listed on PubMed; the paper has no funding section in the version read.'},
  {title:'Re-evaluation of potassium nitrite (E 249) and sodium nitrite (E 250) as food additives (scientific opinion)',publisher:'European Food Safety Authority, EFSA Journal',type:'regulator scientific opinion',date:'2017',url:'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4786',verified:true,note:'Full opinion read. Funded by EFSA; declarations of interest filed under EFSA policy (summary on its website, not read).'},
  {title:'EFSA confirms safe levels for nitrites and nitrates added to food',publisher:'European Food Safety Authority',type:'regulator statement',date:'2017-06-15',url:'https://www.efsa.europa.eu/en/press/news/170615',verified:true},
  {title:'USDA to improve misleading processed meat labels',publisher:'Center for Science in the Public Interest',type:'advocacy statement',date:'2020-12-11',url:'https://www.cspi.org/news/usda-improve-misleading-processed-meat-labels-20201211',verified:true},
  {title:'Industry says WHO meat-cancer report alarmist',publisher:'Meat and Poultry (trade press, quoting NAMI)',type:'industry statement',date:'2015 (year not printed on the page)',url:'https://www.meatpoultry.com/articles/11987-industry-says-who-meat-cancer-report-alarmist',verified:true}
 ],
 source_check:{state:'partial',summary:'Checked 2026-10-03. Funding or interests are stated for 9 of 17 sources (EFSA 2017: funded by EFSA); the WCRF 2025 report and the IARC Q&A state none (Chan 2011: World Cancer Research Fund International, funder had no role, no competing interests declared; the IARC Lancet Oncology summary: WHO and US National Cancer Institute grants listed on PubMed, conflicts not shown). The IARC Q&A, the IARC Volume 114 news page and the WCRF 2025 report state no funding or conflicts for themselves. Organisation-level funding is stated elsewhere: WCRF says it takes no government funding and that most of its money comes from public donations through its charities; IARC lists the US National Cancer Institute, the US National Institute of Environmental Health Sciences and the European Commission. IARC\'s Preamble (2019 edition, after the 2015 meeting) requires a declaration of interests from every participant, assessment by IARC, publication of declared interests, and bars Observers from drafting text or taking part in evaluations; the Volume 114 participant list shows this was followed (see Round 4 notes). Funding for the Volume 114 meeting itself is not stated in any source found. WCRF 2025: the report PDF states no funding or interests, but its peer-reviewed companion paper on dietary-lifestyle patterns and colorectal cancer (American Journal of Clinical Nutrition, 2025) states it was funded by the WCRF network of charities (CUP Global commissioned grant 2021), that the funders had no role in design, analysis or reporting, and that the authors declare no conflicts of interest. EFSA: the 2017 opinion itself states no declarations; EFSA\'s published process screens every expert\'s declaration and excludes people employed by the food industry, the 2014-2017 panel roster is public, and individual declarations of past panel members are available only on request to EFSA (not requested or read). Crossref records no retraction, correction or expression of concern for Chan 2011 or the IARC Lancet Oncology summary. Crossref coverage of corrections is incomplete. The advocacy and industry items are positions, not studies. Searched 2026-10-03 for newer studies after 2015; the 2025 meta-analysis, UK Biobank, NutriNet-Santé, EPIC, the 2019 guideline and its critique, and a 2026 umbrella review were read as abstracts or extracts, not in full. The EFSA 2017 opinion was read in full on 2026-10-03; IARC Monograph 114 evaluation, summary and participant declarations were read in full on 2026-10-03 (colorectal chapter narrative and mechanistic chapter read 2026-10-03; table figures spot-checked); the Lancet Oncology paper was read as the open author version (the journal PDF could not be retrieved), so wording changes between that version and print were not compared.'},
 reviewed_by:'Reviewed by Jesse Pringle (owner); research by OpenLabel',
 owner_signoff:'2026-10-03 Jesse Pringle',
 review_state:'reviewed',
 reviewed_on:'2026-10-03',
 next_review:'2027-10-03',
 dossier:'docs/dossiers/cured-meats-colorectal-cancer.md',
 changelog:[{date:'2026-10-03',change:'First draft record from the dossier.',reason:'Owner chose cured meats as the first new topic.'},{date:'2026-10-03',change:'Added post-2015 studies and the 2019 guideline dispute.',reason:'Owner asked for the most up to date research.'},{date:'2026-10-03',change:'Read EFSA full opinion; corrected nitrosamine wording; added IARC priorities. Owner approved orange.',reason:'Closed open items; owner sign-off.'}]
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
  'California OEHHA (2021) assessed seven FDA-certified dyes (Blue 1, Blue 2, Green 3, Red 3, Red 40, Yellow 5, Yellow 6) and concluded the literature indicates synthetic food dyes can affect neurobehavior in some children, with sensitivity varying. It noted most human trials tested mixtures, so no single dye could be identified.',
  'California researchers\' 2022 review (Environmental Health) of 27 clinical trials (25 challenge, 2 elimination) found 16 of the 25 challenge studies had some evidence of an association and 13 had a statistically significant one.',
  'FDA revoked Red No. 3 for food on 2025-01-15 because of cancer in male rats at high levels, and says there is no evidence it causes cancer in humans.'
 ],
 does_not_show:[
  'Which single dye is responsible. Most trials tested mixtures, some with sodium benzoate.',
  'That dyes cause ADHD. A 2012 review concluded they are not a main cause of ADHD.',
  'Whether the small changes matter for schoolwork or daily life. EFSA said the clinical significance is unknown.',
  'Anything about adults.',
  'How strong the trials were. OEHHA noted the 27 trials averaged 44 participants, 24 of 27 were done before 2000, 16 had fewer than 20 children, and most used convenience samples.',
  'Whether newer research changes it. Our search for trials after 2021 found no new randomized trials of synthetic dyes and child behavior; newer papers (2022 to 2025) are reviews and commentary that restate older trials.',
  'Anything about the amount in this product, or that a product without these dyes is better in any other way.'
 ],
 sides:{
  for:['McCann 2007 (UK Food Standards Agency funded, randomized, double-blind, placebo-controlled): dye and benzoate mixtures increased hyperactivity in 3-year-olds and 8 to 9-year-olds.','OEHHA 2021: the current acceptable daily intakes are based on 35 to 70-year-old studies not designed to detect behavioral effects, and may not adequately protect children.','Nigg 2012 pooled analysis: small but significant effect on parent-rated behavior.'],
  against:['Joel Nigg, an author of the 2012 pooled analysis, was quoted in JAMA in 2025 saying the effects are small and dyes contribute a bit to ADHD but are not a major cause.','FDA\'s 2025 phase-out of six remaining petroleum-based dyes relies on voluntary industry action, and its tracker (current as of 2026-09-15) targets the end of 2027. It does not itself state that behavior effects are proven.','EFSA (2008) called the Southampton evidence limited, with a small effect that was not consistent across ages or mixtures, and did not change the acceptable daily intakes.','The trade group IACM states that FDA, JECFA and EFSA have concluded the evidence does not establish causation. This is an industry position that we have not checked.','IARC\'s 2025 to 2029 priorities report does not recommend evaluating Red No. 3, saying existing evidence does not support a first-time classification.','OEHHA itself cautions that existing acceptable daily intakes were not built on behavioral outcomes, so comparing intakes to them may not describe behavioral risk.','An FDA advisory committee voted 8 to 6 in 2011 against recommending a ban or warning label (as reported in a 2012 review).','The 2012 pooled analysis found no significant effect on teacher or observer ratings. Its work was funded by ILSI North America with partial funding from the National Confectioners Association.']
 },
 word_notes:[
  {match:'\\b(?:fd&c\\s*)?red\\s*(?:no\\.?\\s*|number\\s*|#\\s*)?3\\b|erythrosine|\\be127\\b',text:'Red No. 3: FDA revoked its use in food on 2025-01-15 (cancer in male rats at high levels; FDA says no evidence of cancer in humans). Food makers have until 2027-01-15, and products made earlier may still be sold.'},
  {match:'tartrazine|quinoline yellow|sunset yellow|carmoisine|azorubine|ponceau 4r|allura red|\\be10[24]\\b|\\be1(?:10|22|24|29)\\b|\\b(?:fd&c\\s*)?(?:yellow\\s*(?:no\\.?\\s*|#\\s*)?[56]|red\\s*(?:no\\.?\\s*|#\\s*)?40)\\b',text:'This is one of the dyes tested in the 2007 UK trial. The EU requires the warning may have an adverse effect on activity and attention in children on foods with six such colors (a July 2026 trade-press article says this still applies; the regulation text was not read).'}
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
  {title:'Compulsory warnings on colours in food and drink',publisher:'CMS law firm (UK update)',type:'legal summary',date:'2010-08-02',url:'https://cms.law/en/gbr/legal-updates/compulsory-warnings-on-colours-in-food-and-drink',verified:true},
  {title:'Potential impacts of synthetic food dyes on activity and attention in children: a review of the human and animal evidence',publisher:'Environmental Health (OEHHA authors)',type:'systematic review',date:'2022-04-29',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9052604/',verified:true,note:'Authors are from the agency that wrote the 2021 report, so it is not independent of that report.'},
  {title:'Why and how FDA wants to end use of synthetic food dyes',publisher:'JAMA (news article by Rita Rubin)',type:'news report',date:'2025-05-02',url:'https://jamanetwork.com/journals/jama/fullarticle/2833656',verified:true},
  {title:'How the EU regulates food colours',publisher:'FoodNavigator (trade press)',type:'trade press',date:'2026-07-20',url:'https://www.foodnavigator.com/Article/2026/07/20/how-the-eu-regulates-food-colours/',verified:true}
 ],
 source_check:{state:'partial',summary:'Checked 2026-10-03. Funding is stated for 3 of the 4 research sources (UK Food Standards Agency; ILSI North America with the National Confectioners Association; California Legislature). The 2012 Neurotherapeutics review states none on the page read. Crossref records no retraction or correction for the 2012 Nigg meta-analysis. The 2007 McCann trial has one Lancet correction notice (Department of Error, November 2007) fixing the description of the dye and sodium benzoate amounts in mix B; the notice does not say results changed. The industry statement, law-firm summary and trade-press item are positions or summaries, not studies. The OEHHA report text on study limitations was read on 2026-10-03. Searched 2026-10-03 for original trials after 2021 and found none; the 2022 review and later papers are reviews or commentary. The 2022 review shares authors with the OEHHA report.'},
 reviewed_by:'Reviewed by Jesse Pringle (owner); research by OpenLabel',
 owner_signoff:'2026-10-03 Jesse Pringle',
 review_state:'reviewed',
 reviewed_on:'2026-10-03',
 next_review:'2027-04-03',
 dossier:'docs/dossiers/synthetic-food-dyes-child-behavior.md',
 changelog:[{date:'2026-10-03',change:'First draft record from the dossier.',reason:'Owner chose food dyes as the second new topic.'},{date:'2026-10-03',change:'Added post-2021 review, JAMA 2025 and FDA phase-out status.',reason:'Owner asked for the most up to date research.'},{date:'2026-10-03',change:'Added OEHHA trial limitations and IARC priorities. Owner approved yellow.',reason:'Closed open items; owner sign-off.'}]
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
 var chip=r.status==='contested'?'Contested evidence · on your watch list':r.status==='unresolved'?'Unresolved evidence · on your watch list':r.status==='converging'?'Converging evidence · on your watch list':'On your watch list';
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

# Builds the quotation data and the page-text fixture for an ingredient batch written from NIH NCCIH pages.
# Used for ingredient-supplement-actives-1.js. Steps: (1) save each page with `curl -sSL --compressed <url> -o <key>.html` into one folder,
# (2) edit PAGES and E below (names, role, page key, sentence anchors for "what it is", "why it may be used", "limits"),
# (3) run `python3 -I build-nccih-batch.py` in that folder. It stops with an error unless every anchored sentence is found word for word,
# then writes rows.json (the data for the batch file) and fixture.json (copy it to tests/fixtures/). Quote only what the page says.
import json,re,html,sys
PAGES={'melatonin':('https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know','Melatonin: What You Need To Know','What is melatonin and how does it work?'),
'omega3':('https://www.nccih.nih.gov/health/omega3-supplements-what-you-need-to-know','Omega-3 Supplements: What You Need To Know','What are omega-3s?'),
'coq10':('https://www.nccih.nih.gov/health/coenzyme-q10','Coenzyme Q10','Coenzyme Q10 (CoQ10) is a substance'),
'probiotics':('https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety','Probiotics: Usefulness and Safety','What are probiotics?'),
'ginkgo':('https://www.nccih.nih.gov/health/ginkgo','Ginkgo: Usefulness and Safety','Common Names:'),
'turmeric':('https://www.nccih.nih.gov/health/turmeric','Turmeric: Usefulness and Safety','Common Names:'),
'ashwagandha':('https://www.nccih.nih.gov/health/ashwagandha','Ashwagandha: Usefulness and Safety','Common Names:')}
def norm(t):
    t=html.unescape(t); t=re.sub(r'\s+',' ',t).strip()
    t=re.sub(r'\s+([,.;:!?)])',r'\1',t); t=re.sub(r'\(\s+','(',t); return t
def page_text(key):
    h=open(key+'.html',encoding='utf-8',errors='replace').read()
    h=re.sub(r'<(script|style|nav|footer|header)[^>]*>.*?</\1>',' ',h,flags=re.S)
    t=norm(re.sub(r'<[^>]+>',' ',h)); s=t.find(PAGES[key][2]); assert s>=0,key
    e=t.find(' Share Email',s); t=t[s:(e if e>0 else len(t))]
    return t
TEXT={k:page_text(k) for k in PAGES}
def sents(t):
    t=t.replace('U.S.','U\x00S\x00'); out=[x.strip().replace('\x00','.') for x in re.split(r'(?<=[.!?])\s+(?=[A-Z“"(])',t) if x.strip()]
    return [x.replace('U.S','U.S.') if False else x for x in out]
def S(key):
    ss=[s.replace('U\x00S\x00','U.S.') for s in sents(TEXT[key])]; return ss
def pick(key,anchor):
    t=TEXT[key]; idx=[m.start() for m in re.finditer(re.escape(anchor),t)]
    assert idx,(key,anchor,'not found')
    prot=t.replace('U.S.','U\x01S\x01'); outs=set()
    for i in idx:
        m=re.search(r'[.!?](?=\s+[A-Z“"(]|\s*$)',prot[i:]); assert m,(key,anchor)
        outs.add(prot[i:i+m.end()].replace('U\x01S\x01','U.S.'))
    assert len(outs)==1,(key,anchor,'ambiguous',outs)   # repeated identical sentences are fine
    q=outs.pop(); assert '“' not in q and '”' not in q,('curly quote inside',q); assert q in t
    return q
def lastupd(key):
    m=re.search(r'Last Updated: ([A-Za-z]+ \d{4})',TEXT[key]); return m.group(1) if m else None

COMMON_O3=['For some health conditions, the evidence for benefits from seafood','There is some evidence that people with heart disease or high triglycerides may benefit','Several products containing omega-3s have been approved as prescription drugs','The composition of these products is not the same as that of typical omega-3 supplements','Side effects of omega-3 supplements are usually mild.','They include unpleasant taste']
E=[ # names, role, page, what anchors, use anchors, limit anchors, formUnspecified
 (['melatonin'],'Hormone (supplement ingredient)','melatonin',['Melatonin is a hormone that your brain produces','Melatonin dietary supplements can be made from animals'],['Melatonin supplements may help with certain conditions, such as jet lag'],['According to practice guidelines from the American Academy of Sleep Medicine (2017)','For melatonin supplements, particularly at doses higher','Short-term use of melatonin supplements appears to be safe','In particular, people with epilepsy and those taking blood thinner','There’s been a lack of research on the safety of melatonin use in pregnant','Some melatonin supplements may not contain what’s listed on the product label.','For most of the supplements, the amount of melatonin in the product didn’t match','In several other countries, melatonin is available only with a prescription'],False),
 (['omega-3','omega-3 fatty acids','omega 3 fatty acids'],'Omega-3 fatty acids','omega3',['Omega-3s (short for omega-3 fatty acids','Most of the research on omega-3s has focused on EPA'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],True),
 (['fish oil','fish oil concentrate'],'Fish oil (omega-3 source)','omega3',['Fish oil supplements contain EPA and DHA.','EPA and DHA are found in seafood, especially cold-water fish'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],True),
 (['epa','dha','eicosapentaenoic acid','docosahexaenoic acid'],'Omega-3 fatty acids (EPA and DHA)','omega3',['Most of the research on omega-3s has focused on EPA','EPA and DHA are found in seafood, especially cold-water fish'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],True),
 (['cod liver oil'],'Fish liver oil (omega-3 source)','omega3',['Fish liver oil supplements, such as cod liver oil','Vitamins A and D can be harmful in excessive amounts.'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],False),
 (['krill oil'],'Krill oil (omega-3 source)','omega3',['Krill oil contains omega-3s in the form of phospholipids.'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],False),
 (['algal oil'],'Algal oil (omega-3 source)','omega3',['Algal oils are a vegetarian source of DHA'],['There is some evidence that people with heart disease or high triglycerides may benefit'],COMMON_O3[:1]+COMMON_O3[2:],False),
 (['coenzyme q10','coq10'],'Coenzyme Q10','coq10',['Coenzyme Q10 (CoQ10) is a substance that is naturally present','It is sold in the United States as a dietary supplement.'],['Because CoQ10 has important functions'],['CoQ10 has not been shown to be of value in treating cancer','Only a few studies have looked at whether CoQ10 might help prevent heart disease','Although results of individual studies have varied','No serious side effects of CoQ10 have been reported.','Mild side effects such as insomnia','CoQ10 may interact with the anticoagulant'],False),
 (['probiotics','probiotic'],'Probiotic (live microorganisms)','probiotics',['Probiotics are live microorganisms that are intended to have health benefits','The most common are bacteria that belong to groups called Lactobacillus','Different types of probiotics may have different effects.'],['Probiotics have shown promise for a variety of health purposes'],['A great deal of research has been done on probiotics, but much remains to be learned','However, in most instances, we still don’t know which probiotics are helpful','Cases of severe or fatal infections have been reported in premature infants'],True),
 (['ginkgo','ginkgo biloba','ginkgo biloba extract','ginkgo biloba leaf extract','ginkgo leaf extract'],'Ginkgo (herbal extract)','ginkgo',['Today, ginkgo leaf, usually as an extract'],['Ginkgo is promoted as a dietary supplement for many conditions'],['There’s no conclusive evidence that ginkgo is helpful for any health condition.','Ginkgo has not been shown to be beneficial for preventing or slowing the progression of dementia.','For most adults, ginkgo leaf extracts are likely to be safe','Fresh ginkgo seeds are toxic','Ginkgo leaf extract is generally well tolerated','Ginkgo may increase the risk of bleeding','Ginkgo may be unsafe for use during pregnancy.'],True),
 (['curcumin','curcuminoids','turmeric root extract'],'Turmeric and curcumin (herbal)','turmeric',['Curcumin, a major component of turmeric, gives the spice its yellow color.','The health activities of turmeric are commonly attributed to curcuminoids'],['Today, oral (taken by mouth) turmeric is promoted as a dietary supplement'],['We don’t know enough to definitively conclude','Oral curcumin products vary in how much curcumin they actually contain','Combining curcumin with piperine','Highly bioavailable formulations of curcumin','Conventionally formulated oral turmeric or curcumin','Many curcumin products with increased bioavailability are on the market','If you notice any liver damage symptoms','The use of turmeric supplements during pregnancy may be unsafe.'],True),
 (['ashwagandha','ashwagandha root','ashwagandha root extract','withania somnifera'],'Ashwagandha (herbal root extract)','ashwagandha',['Ashwagandha is an evergreen shrub found in parts of India, Africa, and the Middle East.','It contains several bioactive compounds, including a group of substances known as withanolides.'],['Currently, ashwagandha supplements are often promoted for stress and anxiety','These supplements typically contain ashwagandha root, leaf, or root/leaf extracts.'],['However, many of the studies have had small sample sizes','Research shows that some ashwagandha preparations may be effective for insomnia and stress.','There isn’t enough evidence to determine if ashwagandha is helpful for any other health conditions','Ashwagandha may be safe when taken in the short term','There is not enough information to allow conclusions about its long-term safety','Although it is rare, there have been a number of cases that link liver injury','Ashwagandha should be avoided during pregnancy','There is evidence that ashwagandha might interact with some medications'],True)]
rows=[]
for names,role,page,w,u,l,fu in E:
    rows.append({'names':names,'role':role,'page':page,'what':[pick(page,a) for a in w],'use':[pick(page,a) for a in u],'limits':[pick(page,a) for a in l],'upd':lastupd(page),'fu':fu})
# fixture: the page texts that were used
used=sorted({r['page'] for r in rows})
fx={'_note':'Article text of NCCIH pages (public domain), fetched 2026-11-01 from nccih.nih.gov. Used only by tests/supplement-actives-1.test.js to check that every quotation in ingredient-supplement-actives-1.js appears word for word.','pages':{PAGES[k][0]:{'title':PAGES[k][1],'text':TEXT[k]} for k in used}}
json.dump(fx,open('fixture.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
json.dump({'pages':{k:PAGES[k][0] for k in PAGES},'rows':rows},open('rows.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
print(len(rows),'records;', sum(len(r['names']) for r in rows),'names; fixture pages:',used, {k:len(TEXT[k]) for k in used})
print({r['names'][0]:r['upd'] for r in rows})

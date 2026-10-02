/* Run: node tests/allergy-match.test.js  (needs jsdom: npm i jsdom). Tests ingredient-wording matching only. */
const {JSDOM}=require('jsdom');const fs=require('fs'),path=require('path');
const dom=new JSDOM('<body></body>',{runScripts:'outside-only',url:'https://x.test/',pretendToBeVisual:true});
const w=dom.window;w.requestAnimationFrame=f=>setTimeout(f,0);
w.eval(fs.readFileSync(path.join(__dirname,'..','ingredient-evidence.js'),'utf8'));
const M=w.OLAllergyMatch;let fail=0,n=0;
function t(allergies,custom,text,expectA,expectW,note){M.setProfile({allergies,custom});const h=M.match(text);const gotA=h.allergies.slice().sort().join(','),gotW=h.watch.slice().sort().join(',');n++;
  if(gotA!==expectA.slice().sort().join(',')||gotW!==expectW.slice().sort().join(',')){fail++;console.log('FAIL',JSON.stringify(text),'profile',allergies.join('/'),'| got A=['+gotA+'] W=['+gotW+'] expected A=['+expectA+'] W=['+expectW+']',note||'')}}
const ALL=['milk','egg','fish','shellfish','treenuts','peanuts','wheat','soy','sesame'];
// positive exact
t(['peanuts'],[],'peanuts',['Peanuts'],[]);t(['milk'],[],'whey',['Milk'],[]);t(['egg'],[],'egg',['Eggs'],[]);t(['wheat'],[],'wheat flour',['Wheat'],[]);
// compound wording
t(['peanuts'],[],'peanut oil',['Peanuts'],[]);t(['peanuts'],[],'peanut butter',['Peanuts'],[]);t(['milk'],[],'milk powder',['Milk'],[]);t(['soy'],[],'soy lecithin',['Soy'],[]);
t(['sesame'],[],'sesame seeds',['Sesame'],[]);t(['treenuts'],[],'almond flour',['Tree nuts'],[]);t(['fish'],[],'tuna',['Fish'],[]);t(['shellfish'],[],'shrimp paste',['Crustacean shellfish'],[]);
t(['milk'],[],'buttermilk',['Milk'],[]);t(['milk'],[],'lactose',['Milk'],[]);t(['milk'],[],'whey protein isolate',['Milk'],[]);
t(['milk'],[],'butter',['Milk'],[]);t(['milk'],[],'skim milk',['Milk'],[]);t(['milk'],[],'ice cream',['Milk'],[]);
// nested
t(ALL,[],'Sauce (water, soy sauce (wheat, soybeans))',['Soy','Wheat'],[]);
// negative / non-matching
t(ALL,[],'sugar',[],[]);t(ALL,[],'cocoa butter',[],[]);t(ALL,[],'rice flour',[],[]);t(ALL,[],'vanilla extract',[],[]);t(ALL,[],'water',[],[]);
t(['egg'],[],'eggplant',[],[]);t(['wheat'],[],'buckwheat flour',[],[]);t(['fish'],[],'chocolate',[],[]);
// plant milks and butters are not dairy, but their nut/seed words still match
t(['milk'],[],'coconut milk',[],[]);t(['milk'],[],'oat milk',[],[]);t(['milk'],[],'cream of tartar',[],[]);t(['milk'],[],'shea butter',[],[]);
t(['milk','treenuts'],[],'almond milk',['Tree nuts'],[]);t(['milk','peanuts'],[],'peanut butter',['Peanuts'],[]);t(['milk','soy'],[],'soy milk',['Soy'],[]);
// profile off
t([],[],'peanut oil',[],[]);
// custom watch words
t([],['salt'],'salt',[],['salt']);t([],['salt'],'sea salt',[],['salt']);t([],['salt'],'saltpeter',[],[]);t([],['palm oil'],'refined palm oil',[],['palm oil']);t([],['salt'],'sugar',[],[]);
// different profile selections do not leak
t(['peanuts'],[],'milk powder',[],[]);t(['milk'],[],'peanut oil',[],[]);
console.log(n+' cases, '+fail+' failed');process.exit(fail?1:0);

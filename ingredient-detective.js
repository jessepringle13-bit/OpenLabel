(function(){'use strict';
var STORAGE_KEY='openlabel-detective-v1';
var STYLE_ID='ol-detective-css';
var CARD_ID='olDetectiveCard';
var frame=0;

var FAMILIES=[
  {id:'emulsifiers',label:'Emulsifiers',re:/lecithin|polysorbate|mono-?\s*and\s*diglycerides|datem|stearoyl/i},
  {id:'sweeteners',label:'Sweeteners',re:/sucralose|aspartame|acesulfame|stevia|monk fruit|erythritol|allulose|xylitol|corn syrup/i},
  {id:'gums',label:'Gums & stabilizers',re:/xanthan|guar gum|carrageenan|gellan|locust bean|cellulose|pectin|acacia/i},
  {id:'preservatives',label:'Preservatives',re:/sorbate|benzoate|bht|bha|tbhq|nitrite|sulfite|propionate|tocopherol/i},
  {id:'colors',label:'Food colors',re:/red 40|yellow 5|yellow 6|blue 1|caramel color|annatto|titanium dioxide|beet juice/i},
  {id:'magnesium',label:'Magnesium forms',re:/magnesium\s+(oxide|citrate|glycinate|bisglycinate|malate|threonate|taurate|chloride)/i},
  {id:'bvitamins',label:'B-vitamin forms',re:/methylcobalamin|cyanocobalamin|methylfolate|folic acid|pyridoxal|pyridoxine|niacinamide/i},
  {id:'botanicals',label:'Botanicals & actives',re:/ashwagandha|turmeric|curcumin|ginkgo|melatonin|coq10|coenzyme q10|creatine|carnitine|probiotic/i}
];

var CARDS=[
  {q:'Does "Vitamin B12" on a label tell you if it is methylated?',a:'Not by itself. Look in the parentheses or ingredient list for methylcobalamin vs. cyanocobalamin.'},
  {q:'Does "Clinically Studied" mean the finished product was tested?',a:'Usually no—it often refers to a single ingredient at a specific dose, not the final blended product.'},
  {q:'Are all magnesium forms absorbed the same way?',a:'No. Forms like citrate, glycinate, and chloride generally dissolve and absorb differently than magnesium oxide.'},
  {q:'Does "Natural Flavors" mean a single whole-food ingredient?',a:'No. Under FDA rules, natural flavors can be complex mixtures of flavor compounds derived from plant or animal sources, plus carriers.'},
  {q:'Does "No Added Sugar" mean zero sugar?',a:'No. It means no sugars were added during processing, but naturally occurring sugars (like from fruit juice concentrate) still count.'},
  {q:'Does a high ingredient count automatically mean a food is unhealthy?',a:'No. Fortified foods (vitamins/minerals) or spice blends can have long ingredient lists without being ultra-processed.'}
];

function loadState(){
  try{
    var raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {ingredients:[],families:[]};
    var parsed=JSON.parse(raw);
    return {
      ingredients:Array.isArray(parsed.ingredients)?parsed.ingredients:[],
      families:Array.isArray(parsed.families)?parsed.families:[]
    };
  }catch(_){return {ingredients:[],families:[]}}
}

function saveState(state){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(_){}
}

function recordIngredient(name){
  var clean=(name||'').trim().toLowerCase();
  if(!clean||clean.length<2)return;
  var st=loadState();
  var changed=false;
  if(st.ingredients.indexOf(clean)===-1){
    st.ingredients.push(clean);
    changed=true;
  }
  for(var i=0;i<FAMILIES.length;i++){
    if(FAMILIES[i].re.test(clean)&&st.families.indexOf(FAMILIES[i].id)===-1){
      st.families.push(FAMILIES[i].id);
      changed=true;
    }
  }
  if(changed){
    saveState(st);
    schedule();
  }
}

function ensureCss(){
  if(document.getElementById(STYLE_ID))return;
  var l=document.createElement('link');
  l.id=STYLE_ID;
  l.rel='stylesheet';
  l.href='ingredient-detective.css?v=20261124-det1';
  document.head.appendChild(l);
}

function todayCard(){
  var day=Math.floor(Date.now()/86400000);
  return CARDS[day%CARDS.length];
}

function renderCard(){
  var st=loadState();
  var card=todayCard();
  var pct=Math.round((st.families.length/FAMILIES.length)*100);
  var el=document.createElement('section');
  el.id=CARD_ID;
  el.className='ol-det-card';
  el.setAttribute('aria-label','Label Literacy and Daily Myth Check');
  el.innerHTML=
    '<div class="ol-det-top">'+
      '<span class="ol-det-badge">Ingredient Detective</span>'+
      '<span class="ol-det-count">'+st.ingredients.length+' inspected · '+st.families.length+'/'+FAMILIES.length+' families</span>'+
    '</div>'+
    '<div class="ol-det-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'">'+
      '<div class="ol-det-fill" style="width:'+pct+'%"></div>'+
    '</div>'+
    '<details class="ol-det-myth">'+
      '<summary><strong>Daily label check:</strong> '+card.q+'</summary>'+
      '<p>'+card.a+'</p>'+
    '</details>';
  return el;
}

function sync(){
  frame=0;
  var host=document.getElementById('home')||document.getElementById('scan')||document.querySelector('main');
  if(!host)return;
  ensureCss();
  var existing=document.getElementById(CARD_ID);
  var fresh=renderCard();
  if(existing){
    if(existing.querySelector('details')&&existing.querySelector('details').open){
      fresh.querySelector('details').open=true;
    }
    existing.replaceWith(fresh);
  }else{
    host.appendChild(fresh);
  }
}

function schedule(){if(!frame)frame=requestAnimationFrame(sync)}

document.addEventListener('click',function(e){
  var row=e.target&&e.target.closest?e.target.closest('.ol-ing-row, button.ol-ing-btn, [data-ing-name]'):null;
  if(!row)return;
  var name=row.getAttribute('data-ing-name')||row.textContent||'';
  recordIngredient(name.split('\n')[0]);
});

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',schedule)}
else{schedule()}

window.OLIngredientDetective={loadState:loadState,recordIngredient:recordIngredient,sync:sync};
})();

(function(root){'use strict';
/* Plain foods: ingredients whose name simply identifies a food (an apple, rolled oats, garlic powder).
   Identification only. It says nothing about amount, variety, farming, processing or health, and it never
   overrides a reviewed entry. Deliberately conservative: oils, sugars, salt, extracts, isolates, concentrates,
   flavors, colors, additives, cultures and anything with a bracketed sub-list are never treated as plain foods. */
var SKIP=/\b(?:extracts?|isolates?|concentrates?|proteins?|flavou?rs?|flavou?rings?|colou?rs?|colou?red|modified|hydrolyzed|hydrogenated|enriched|fortified|artificial|natural|oils?|fats?|sugars?|salt|sweeteners?|preservatives?|acids?|syrups?|starch|gum|lecithin|blend|cultures?|cultured|enzymes?|capsules?|gelatin|mechanically|powdered|isolated|refined|instant)\b/;
var PREFIX=/^(?:(?:organic|fresh|dried|dry|raw|whole grain|whole|ground|roasted|unsalted|chopped|diced|sliced|crushed|minced|toasted|cooked|frozen|pasteurized|filtered|plain|unsweetened|rolled|steel cut|ripe|sweet)\s+)+/;
/* Multi-word foods, then single words. */
var PHRASES=('bell pepper|brussels sprout|green bean|sweet potato|chili pepper|bay leaf|brown rice|white rice|wild rice|black bean|kidney bean|pinto bean|sesame seed|sunflower seed|pumpkin seed|chia seed|hemp seed|poppy seed|egg yolk|egg white|skim milk|cheddar cheese|mozzarella cheese|parmesan cheese|romano cheese|swiss cheese|black pepper|cayenne pepper|red pepper|mustard seed|vanilla bean|distilled vinegar|white vinegar|apple cider vinegar|bakers yeast|carbonated water|sparkling water|spring water|mineral water|green tea|black tea|white tea|cocoa powder|cacao nib|garlic powder|onion powder|tomato powder|ginger powder|tomato paste|tomato puree|crushed tomato|lemon juice|lime juice|orange juice|apple juice|tomato juice|almond flour|oat flour|rice flour|corn flour|wheat flour|buckwheat flour').split('|');
var SINGLES=('apple apricot avocado banana blackberry blueberry cherry coconut cranberry date fig grape grapefruit guava kiwi lemon lime mango melon orange papaya peach pear pineapple plum pomegranate prune raisin raspberry strawberry tangerine watermelon olive asparagus beet broccoli cabbage carrot cauliflower celery corn cucumber eggplant garlic ginger kale leek lettuce mushroom onion pea potato pumpkin radish scallion shallot spinach squash tomato turnip zucchini jalapeno cilantro parsley basil oregano thyme rosemary sage mint dill chive seaweed kelp nori oat oatmeal rice quinoa barley millet rye wheat buckwheat cornmeal popcorn chickpea lentil soybean edamame peanut almond cashew walnut pecan pistachio hazelnut macadamia flaxseed tahini egg milk cream butter buttermilk yogurt beef pork chicken turkey lamb salmon tuna cod tilapia shrimp spice herb paprika turmeric cinnamon pepper cumin nutmeg clove coriander cardamom vinegar yeast water ice tea coffee cocoa vanilla').split(' ');
var SET=Object.create(null);PHRASES.concat(SINGLES).forEach(function(w){SET[w]=1});
function forms(n){var out=[n];if(/ies$/.test(n))out.push(n.slice(0,-3)+'y');if(/(?:s|x|z|ch|sh)es$/.test(n))out.push(n.slice(0,-2));if(/s$/.test(n))out.push(n.slice(0,-1));if(/oes$/.test(n))out.push(n.slice(0,-2));return out}
function has(label){var t=String(label||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9()\[\]\s-]/g,' ').replace(/\s+/g,' ').trim();
 if(!t||/[()\[\]]/.test(t)||SKIP.test(t))return false;
 var n=t.replace(PREFIX,'').trim();if(!n)return false;
 return forms(n).some(function(f){return SET[f]===1})}
var api={has:has,note:'The label names a plain food. That identifies what it is and nothing more: variety, amount, farming and processing are not stated, and no health assessment is made here.'};
if(typeof module==='object'&&module.exports){module.exports=api;return}
root.OLPlainFoods=api;
if(root.OLIngredientStatus&&root.OLIngredientStatus.refresh)root.OLIngredientStatus.refresh();
})(typeof window==='object'?window:globalThis);

(function(){'use strict';
function sync(){document.querySelectorAll('#olPanel .mc button.ne-tap').forEach(function(b){var names={'Learn about Calories':'Calories','Learn about Total carbohydrate':'Carbs','Learn about Protein':'Protein','Learn about Total fat':'Fat'},label=names[b.getAttribute('aria-label')];if(label&&b.textContent!==label)b.textContent=label})}
var pending=false;new MutationObserver(function(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;sync()})}).observe(document.body,{childList:true,subtree:true});sync();
})();

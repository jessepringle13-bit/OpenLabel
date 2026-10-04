(function(){'use strict';
var api=window.OLIngredients;if(!api||!api.render)return;
var css=document.createElement('link');css.rel='stylesheet';css.href='ingredients.css?v=20261004c';document.head.appendChild(css);
var frame=0,active=null;
function source(){var items=document.querySelectorAll('#labelFacts .source');for(var i=0;i<items.length;i++){var k=items[i].querySelector('strong'),v=items[i].querySelector('span');if(k&&v&&k.textContent.trim()==='Ingredients')return v.textContent.trim()}return ''}
function sync(){frame=0;var panel=document.getElementById('olPanel');if(!panel||panel.hidden){if(active){api.close();active=null}return}var body=panel.querySelector('.olp-body');if(!body)return;var heads=body.querySelectorAll('.olp-h'),heading=null;for(var i=0;i<heads.length;i++)if(heads[i].textContent.trim()==='Ingredients'){heading=heads[i];break}if(!heading)return;if(heading.parentNode&&heading.parentNode.classList.contains('olp-hw'))heading=heading.parentNode;var old=heading.nextElementSibling;if(!old||old.classList.contains('ol-ing-explore'))return;var text=source();if(!text)return;old.replaceWith(api.render(text));active=panel}
function schedule(){if(!frame)frame=requestAnimationFrame(sync)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});schedule();
})();

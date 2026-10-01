(function(){'use strict';
var api=window.OLIngredients;if(!api||!api.render)return;
var css=document.createElement('link');css.rel='stylesheet';css.href='ingredients.css';document.head.appendChild(css);
var active=null,frame=0;
function sync(){frame=0;var panel=document.getElementById('olPanel');if(!panel||panel.hidden){if(active){api.close();active=null}return}var body=panel.querySelector('.olp-body');if(!body)return;var headings=Array.prototype.slice.call(body.querySelectorAll('.olp-h'));var h=headings.find(function(n){return n.textContent.trim()==='Ingredients'});if(!h)return;var old=h.nextElementSibling;if(!old||old.classList.contains('ol-ing-explore'))return;var text=(document.querySelector('#labelFacts .source strong')&&Array.prototype.slice.call(document.querySelectorAll('#labelFacts .source')).map(function(n){return {key:n.querySelector('strong'),value:n.querySelector('span')}}).filter(function(p){return p.key&&p.value&&p.key.textContent.trim()==='Ingredients'}).map(function(p){return p.value.textContent.trim()})[0])||'';if(!text)return;var view=api.render(text);old.replaceWith(view);active=panel}
function schedule(){if(frame)return;frame=requestAnimationFrame(sync)}
var obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});schedule();
})();

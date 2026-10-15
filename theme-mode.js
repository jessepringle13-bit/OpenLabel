(function(){'use strict';
var doc=document,root=doc.documentElement,KEY='openlabel-theme-v1',choice,mode='light';
function valid(v){return v==='navy'?'navy':'light'}
try{mode=valid(localStorage.getItem(KEY))}catch(e){}
var themeMeta=doc.querySelector('meta[name="theme-color"]'),schemeMeta=doc.querySelector('meta[name="color-scheme"]'),lightColor=themeMeta&&themeMeta.getAttribute('content')||'#F4F6F7';
function apply(value,save){mode=valid(value);root.dataset.theme=mode;if(themeMeta)themeMeta.setAttribute('content',mode==='navy'?'#0b1424':lightColor);if(schemeMeta)schemeMeta.setAttribute('content',mode==='navy'?'dark':'light');if(choice)choice.value=mode;if(save){try{localStorage.setItem(KEY,mode)}catch(e){}}}
apply(mode,false);
var profile=doc.getElementById('profile');if(profile&&!profile.querySelector('.ol-theme-choice')){var card=doc.createElement('section');card.className='card ol-theme-choice';var label=doc.createElement('label');label.className='fieldlabel';label.htmlFor='ol-theme-select';label.textContent='Appearance';choice=doc.createElement('select');choice.id='ol-theme-select';choice.className='ol-theme-select';[['light','Light'],['navy','Dark navy']].forEach(function(p){var option=doc.createElement('option');option.value=p[0];option.textContent=p[1];choice.append(option)});choice.value=mode;choice.onchange=function(){apply(choice.value,true)};var note=doc.createElement('p');note.className='hint';note.textContent='Theme changes immediately. Your choice is remembered on this device when browser storage is available.';card.append(label,choice,note);profile.append(card)}
window.addEventListener('storage',function(e){if(e.key===KEY)apply(e.newValue,false)});
})();

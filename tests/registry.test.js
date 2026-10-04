var fs=require('fs'),d=JSON.parse(fs.readFileSync(__dirname+'/../registry.json','utf8')),n=0,f=0;
function t(m,ok){n++;if(!ok){f++;console.log('FAIL '+m)}}
var ids={};
d.entries.forEach(function(e){var id=e.id;t(id+' unique',!ids[id]);ids[id]=1;
['id','kind','match','title','tester','published','result','threshold','serving','caveats','source','ties','check'].forEach(function(k){t(id+' has '+k,e[k]!=null&&e[k]!=='')});
t(id+' kind',e.kind==='product'||e.kind==='category');
t(id+' product match brand+name',e.kind!=='product'||(e.match.brand&&e.match.name));
t(id+' category match any',e.kind!=='category'||(Array.isArray(e.match.any)&&e.match.any.length>0));
t(id+' caveats list',Array.isArray(e.caveats)&&e.caveats.length>=1);
t(id+' source url https',/^https:\/\//.test(e.source.url)&&!!e.source.label);
t(id+' ties not "not checked yet"',!/not checked yet/i.test(e.ties));
t(id+' no score or verdict words',!/\b(safe|unsafe|toxic|good|bad|healthy)\b/i.test(e.result.replace(/is safe to eat|remain safe|safe for human/gi,'')));
});
console.log(n+' cases, '+f+' failed');process.exit(f?1:0);

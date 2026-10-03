var R=require('../evidence-register.js');var n=0,f=0;
function t(name,ok){n++;if(!ok){f++;console.log('FAIL',name)}}
function clone(o){return JSON.parse(JSON.stringify(o))}
var base=clone(R.get('seed-oils-inflammation'));
var NOW=new Date('2026-10-03');
t('seed oils record valid',R.validate(base).length===0);
t('seed oils yellow when watched',R.resolve(base,{topics:['seedoils'],now:NOW}).color==='yellow');
t('seed oils grey when not watched',R.resolve(base,{topics:[],now:NOW}).color==='grey');
t('unwatched chip says Listed',R.resolve(base,{topics:[],now:NOW}).chip==='Listed');
t('no ctx is grey',R.resolve(base,{now:NOW}).color==='grey');
t('overdue goes grey',R.resolve(base,{topics:['seedoils'],now:new Date('2027-04-02')}).note==='overdue');
var r=clone(base);r.sources=[r.sources[0]];t('yellow with one source invalid',R.validate(r).length>0);
r=clone(base);r.status='converging';t('yellow with converging invalid',R.validate(r).some(function(x){return /yellow requires/.test(x)}));
r=clone(base);r.color='orange';t('orange with contested invalid',R.validate(r).some(function(x){return /orange requires status/.test(x)}));
r=clone(base);r.color='orange';r.status='converging';t('orange with no amount invalid',R.validate(r).some(function(x){return /amount or context/.test(x)}));
r=clone(base);r.color='orange';r.status='converging';r.amount='Above 400 mg per day for adults, per label amount';t('orange fully specified valid',R.validate(r).length===0);
r=clone(base);r.color='green';r.status='converging';t('green with incomplete check invalid',R.validate(r).some(function(x){return /complete source check/.test(x)}));
r=clone(base);r.color='green';t('green without scope invalid',R.validate(r).some(function(x){return /green_scope/.test(x)}));
r=clone(base);r.color='red';t('red from general research invalid',R.validate(r).length>0);
r=clone(base);r.color='red';r.scope_type='product-specific';r.red_basis='official-source';t('red official product-specific valid',R.validate(r).length===0);
r=clone(base);delete r.reviewed_by;t('missing reviewer invalid',R.validate(r).length>0);
r=clone(base);r.shows=[];t('empty shows invalid',R.validate(r).length>0);
r=clone(base);r.does_not_show=[];t('empty does_not_show invalid',R.validate(r).length>0);
r=clone(base);r.next_review='soon';t('bad date invalid',R.validate(r).length>0);
r=clone(base);r.color='purple';t('unknown color invalid',R.validate(r).length>0);
r=clone(base);r.source_check.state='ok';t('unknown check state invalid',R.validate(r).length>0);
r=clone(base);r.sources=[];var o=R.resolve(r,{topics:['seedoils'],now:NOW});t('invalid record resolves grey with message',o.color==='grey'&&o.note==='invalid');
t('not found is not a pass for green',(function(){var g=clone(base);g.color='green';g.status='converging';g.green_scope='x';g.owner_signoff='2026-10-03';g.source_check.state='not found';return R.validate(g).some(function(x){return /complete source check/.test(x)})})());
console.log(n+' cases, '+f+' failed');process.exit(f?1:0);

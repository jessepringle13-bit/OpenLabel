/* Run: node tests/persist-failure.test.js. Pulls persist() out of index.html. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const line=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8').split('\n').find(l=>l.startsWith('let saveWarned=false;function persist('));
assert.ok(line,'persist() not found');
function run(setItem){const toasts=[];const ctx={KEY:'k',state:{saved:[],history:[],live:{}},toast:t=>toasts.push(t),localStorage:{setItem}};vm.createContext(ctx);vm.runInContext(line,ctx);ctx.persist();ctx.persist();return {toasts,ctx}}
const ok=run(()=>{});assert.equal(ok.toasts.length,0);
const bad=run(()=>{throw new Error('QuotaExceededError')});assert.equal(bad.toasts.length,1,'warns once, not on every save');assert.match(bad.toasts[0],/could not save/);
console.log('3 save-failure assertions passed');

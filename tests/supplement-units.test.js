const api=require('../supplements/parser.js');
const assert=require('node:assert/strict');
const input=()=>({state:'source-response-unvalidated',raw:{id:1,fullName:'Synthetic unit fixture',servingSizes:[{order:1,minQuantity:1,maxQuantity:1,unit:'Capsule(s)'}],ingredientRows:[{name:'Test nutrient',quantity:[{quantity:25,unit:'mcg',operator:'=',servingSizeOrder:1,servingSizeQuantity:1,servingSizeUnit:'Capsule(s)'}]}]}});
const check=r=>api.parse(r).active[0].quantities[0];
for(const unit of ['g','mg','mcg','mcg DFE','IU','CFU']){let r=input();r.raw.ingredientRows[0].quantity[0].unit=unit;assert.equal(check(r).consistent,true)}
for(const unit of ['UNRECOGNIZED_UNIT','NP',' np ','','  ']){let r=input();r.raw.ingredientRows[0].quantity[0].unit=unit;assert.equal(check(r).consistent,false);assert.equal(check(r).amount,null)}
for(const unit of ['', '  ']){let r=input();r.raw.servingSizes[0].unit=unit;r.raw.ingredientRows[0].quantity[0].servingSizeUnit=unit;assert.equal(check(r).consistent,false)}
let r=input();r.raw.servingSizes[0].unit='mL';r.raw.ingredientRows[0].quantity[0].servingSizeUnit='mL';assert.equal(check(r).consistent,true);
r=input();r.raw.ingredientRows[0].quantity[0].quantity=0;assert.equal(check(r).consistent,true);
console.log('20 unit-validation assertions passed');

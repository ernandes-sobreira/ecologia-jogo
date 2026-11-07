/* Etapa 7 — análise de sensibilidade local e conservação da teia. */
'use strict';
const assert=require('node:assert/strict');
const sensitivity=require('../sensitivity-model.js');
const api={
 population:require('../sim-model.js'),
 hydrology:require('../flood-pulse.js'),
 biogeo:require('../biogeochemistry.js'),
 interactions:require('../interaction-model.js')
};
const nodes=[
 {id:'g',name:'Capim',role:'Produtor',count:240,mass:50,entityType:'grupo',countUnit:'indice'},
 {id:'c',name:'Capivara',role:'Consumidor',count:8,mass:120,countUnit:'individuos'},
 {id:'j',name:'Onça-pintada',role:'Predador',count:2,mass:100,countUnit:'individuos'}
];
const edges=[
 {id:'e1',a:'g',b:'c',kind:'direta',nature:'herbivoria',foodId:'g',weight:.7},
 {id:'e2',a:'c',b:'j',kind:'direta',nature:'consumo',foodId:'c',weight:.6}
];
const opts={focusId:'c',steps:20,
 model:{scenario:'equilibrio',intensity:50,reproduction:1,capacity:1,predation:1,competition:.5,lag:2},
 flood:{enabled:true,amplitude:100,start:'enchente'},
 bio:{enabled:true,load:45,microbes:100,aeration:55,temperature:50}
};
const before=JSON.stringify({nodes,edges,opts});
const res=sensitivity.evaluate(nodes,edges,opts,api);
assert.equal(res.focusId,'c');
assert.equal(res.steps,20);
assert.equal(res.parametersTested,6);
assert.ok(Number.isFinite(res.base.relative));
assert.ok(res.factors.every(f=>Number.isFinite(f.lowResult)&&Number.isFinite(f.highResult)));
assert.ok(res.factors.some(f=>f.key==='predation'&&f.amplitude>0),
 'Alterar predação muda o cenário com onça e capivara');
assert.ok(res.factors.some(f=>f.key==='capacity'&&f.amplitude>0));
assert.ok(res.factors.every(f=>f.amplitude>=0));
assert.equal(JSON.stringify({nodes,edges,opts}),before,'A simulação não deve modificar entrada');
const stable=sensitivity.run(nodes,edges,opts,api);
assert.ok(Number.isFinite(stable.oxygen));
assert.ok(stable.finalStep===20);
const noFlood={...opts,flood:{...opts.flood,enabled:false}};
assert.ok(sensitivity.evaluate(nodes,edges,noFlood,api).factors.every(f=>f.key!=='amplitude'));
const noBio={...opts,bio:{...opts.bio,enabled:false}};
assert.ok(sensitivity.evaluate(nodes,edges,noBio,api).factors.every(f=>f.key!=='load'));
const zero={...opts,focusId:'g',steps:10};
assert.ok(sensitivity.evaluate(nodes,edges,zero,api).factors.length>0);
assert.throws(()=>sensitivity.evaluate([{id:'x',name:'X',role:'Recurso',count:0}],[],{
 ...opts,focusId:'x'},api));
assert.throws(()=>sensitivity.evaluate([{id:'x',name:'X',role:'Comunidade',count:20,countUnit:'amostras'}],[],{
 ...opts,focusId:'x'},api));
console.log('ETAPA 7 — sensibilidade: cópias, 6 parâmetros, ±25%, sem mutação, guardas — OK');

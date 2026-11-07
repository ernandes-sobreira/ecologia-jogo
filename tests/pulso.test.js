/* node tests/pulso.test.js — sem dependências externas */
'use strict';
const assert=require('node:assert/strict');
const pulse=require('../flood-pulse.js');
const model=require('../sim-model.js');

const config={enabled:true,amplitude:100,start:'enchente'};
assert.equal(pulse.at(0,config).phase,'enchente');
assert.equal(pulse.at(15,config).phase,'cheia');
assert.equal(pulse.at(30,config).phase,'vazante');
assert.equal(pulse.at(45,config).phase,'seca');
assert.ok(pulse.at(23,config).connectivity>pulse.at(53,config).connectivity);
const fish={id:'f',name:'Lambari',role:'Consumidor',count:25,mass:10};
const grass={id:'g',name:'Capim',role:'Produtor',count:240,mass:80};
const full=pulse.at(22,config),dry=pulse.at(52,config);
assert.ok(pulse.habitat(fish,full).capacity>pulse.habitat(fish,dry).capacity);
assert.ok(pulse.habitat(grass,full).capacity<pulse.habitat(grass,dry).capacity);
assert.equal(pulse.at(33,{...config,enabled:false}).phase,'neutro');
assert.equal(pulse.habitat(fish,pulse.at(33,{enabled:false})).capacity,1);

const initial=[grass,fish,{id:'c',name:'Capivara',role:'Consumidor',count:8,mass:120}];
const edges=[{a:'g',b:'c',nature:'consumo',weight:.7,kind:'direta',foodId:'g'}];
function simulation(enabled){
 const nodes=initial.map(n=>({...n})),state0=model.init(nodes);
 let state=state0,latest;
 for(let step=1;step<=60;step++){
   const flood=pulse.at(step,{enabled,amplitude:100,start:'enchente'});
   const habitats=Object.fromEntries(nodes.map(n=>[n.id,pulse.habitat(n,flood)]));
   latest=model.advance(nodes,edges,state,{scenario:'equilibrio',flood,habitats});
   state=latest.state;
   assert.equal(state.step,step);
   assert.ok(latest.values.every(v=>Number.isFinite(v.count)&&v.count>=0));
   assert.ok(latest.reports.every(r=>Number.isFinite(r.after)&&r.after>=0));
   for(const v of latest.values){
     const n=nodes.find(n=>n.id===v.id);n.count=v.count;n.mass=v.mass;
   }
 }
 return latest;
}
const seasonal=simulation(true),neutral=simulation(false);
assert.notEqual(seasonal.state.pop.f,neutral.state.pop.f,
 'O ciclo deve modificar ao menos a abundância de lambaris');
assert.ok(seasonal.reports.find(r=>r.id==='f').habitatLabel);
console.log('Pulso do Pantanal: 4 fases, conectividade, habitat e 60 passos — OK');

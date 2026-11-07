/* Teia da Vida — testes das cinco missões pedagógicas, etapa 8.
 * node tests/missoes.test.js
 */
'use strict';
const assert=require('node:assert/strict');
const missions=require('../game-missions.js');
const metrics=require('../ecological-metrics.js');
const audit=require('../ecological-audit.js');
const evidence=require('../scientific-evidence.js');
const interactions=require('../interaction-model.js');
const biogeo=require('../biogeochemistry.js');
const flood=require('../flood-pulse.js');
const names={capim:'Capim',capivara:'Capivara','onca-pintada':'Onça-pintada',
  fitoplancton:'Fitoplâncton',zooplancton:'Zooplâncton','larvas-insetos-aquaticos':'Larvas de insetos aquáticos',
  lambari:'Lambari',traira:'Traíra',jacare:'Jacaré',
  serapilheira:'Serapilheira',fungos:'Fungos','bacterias-decompositoras':'Bactérias decompositoras'};
const roles={capim:'Produtor',capivara:'Consumidor','onca-pintada':'Predador',
  fitoplancton:'Produtor',zooplancton:'Consumidor','larvas-insetos-aquaticos':'Comunidade',
  lambari:'Consumidor',traira:'Predador',jacare:'Predador',
  serapilheira:'Recurso',fungos:'Decompositor','bacterias-decompositoras':'Decompositor'};
const catalog=metrics.ROWS.map((r,i)=>({id:'s'+i,slug:r[0],name:names[r[0]]||r[0],
 role:roles[r[0]]||'Consumidor',count:20,mass:5}));
const missionList=missions.MISSIONS;
assert.equal(missionList.length,5);
assert.deepEqual(missionList.map(m=>m.number),[1,2,3,4,5]);
assert.equal(new Set(missionList.map(m=>m.id)).size,5);
for(const m of missionList){
 assert.equal(m.options.filter(c=>c.valid).length,1,'Cada missão tem uma explicação adequada');
 assert.equal(m.options.length,3);
 const g=missions.buildPreset(m.id,catalog);
 assert.ok(g.nodes.length>=3);
 assert.ok(g.edges.every(e=>g.nodes.some(n=>n.id===e.a)&&g.nodes.some(n=>n.id===e.b)));
 assert.ok(g.nodes.every(n=>n.x>=0&&n.x<=1&&n.y>=0&&n.y<=1));
}
const p=missions.initialProgress();
assert.equal(missions.unlocked('cadeia',p),true);
assert.equal(missions.unlocked('alternativas',p),false);
p.completed.push('cadeia');
assert.equal(missions.unlocked('alternativas',p),true);
assert.equal(missions.unlocked('cheia',p),false);
p.completed.push('alternativas');
assert.equal(missions.unlocked('cheia',p),true);
const recovered=missions.normalizeProgress({
 completed:['cadeia','cadeia','invalid'],started:['cadeia','invalid'],
 active:'cadeia',presetActive:'cadeia',answers:{cadeia:'a',alternativas:'x'}});
assert.deepEqual(recovered.completed,['cadeia']);
assert.deepEqual(recovered.started,['cadeia']);
assert.equal(recovered.answers.cadeia,'a');
assert.equal(recovered.answers.alternativas,undefined);
assert.equal(recovered.presetActive,'cadeia');
const before=JSON.stringify(p);
const graph=missions.buildPreset('cadeia',catalog);
const node=(g,slug)=>g.nodes.find(n=>n.slug===slug);
const ctx=(g,step=0,bio=null,enabled=true)=>({
 graph:g,catalog,step,bio,
 bioEnabled:enabled,pulseEnabled:enabled,
 hydro:flood.at(step,{enabled,start:'enchente',amplitude:100}),
 audit:audit.analyze(g.nodes,g.edges,catalog,{metrics,interactions}),
 evidence:evidence.assess(g.nodes,g.edges,catalog)
});
function link(g,source,target,nature,extra={}){
 const a=node(g,source),b=node(g,target);
 const edge={id:'test-'+g.edges.length,a:a.id,b:b.id,nature,kind:'direta',direction:'forward',weight:.6,
   ...(extra.food?{foodId:node(g,extra.food).id}:{}),...(extra.actor?{actorId:node(g,extra.actor).id}:{})};
 g.edges.push(edge);
}
const incomplete=missions.evaluate('cadeia',ctx(graph),'a');
assert.equal(incomplete.complete,false,'Missão não pode ser concluída só por selecionar resposta');
assert.equal(incomplete.passed,1);
link(graph,'capim','capivara','herbivoria',{food:'capim'});
link(graph,'capivara','onca-pintada','consumo',{food:'capivara'});
assert.equal(missions.evaluate('cadeia',ctx(graph),'b').complete,false);
assert.equal(missions.evaluate('cadeia',ctx(graph),'a').complete,true);
let choices=missions.evaluate('cadeia',ctx(graph),'c');
assert.equal(choices.choiceCorrect,false);
assert.ok(choices.choiceExplanation.length>25);
let alt=missions.buildPreset('alternativas',catalog);
assert.equal(missions.evaluate('alternativas',ctx(alt,12),'a').complete,false);
link(alt,'larvas-insetos-aquaticos','lambari','consumo',{food:'larvas-insetos-aquaticos'});
assert.equal(missions.evaluate('alternativas',ctx(alt,4),'a').complete,false);
assert.equal(missions.evaluate('alternativas',ctx(alt,7),'a').complete,true);
const floodMission=missions.buildPreset('cheia',catalog);
assert.equal(missions.evaluate('cheia',ctx(floodMission,10),'a').complete,false);
assert.equal(missions.evaluate('cheia',ctx(floodMission,20),'a').complete,true);
assert.equal(missions.evaluate('cheia',ctx(floodMission,20,null,false),'a').complete,false);
const dequada=missions.buildPreset('dequada',catalog);
const cfg={enabled:true,load:100,microbes:150,aeration:5,temperature:90,edges:dequada.edges};
let bio=biogeo.init(dequada.nodes,cfg,flood.at(0,{enabled:true,start:'enchente'}));
for(let t=1;t<=12;t++)bio=biogeo.advance(dequada.nodes,bio,cfg,flood.at(t,{enabled:true,start:'enchente'})).state;
assert.ok(bio.oxygen<40,'Experimento extremo gera queda de índice O2');
assert.equal(missions.evaluate('dequada',ctx(dequada,12,bio),'a').complete,true);
assert.equal(missions.evaluate('dequada',ctx(dequada,12,bio,false),'a').complete,false);
const ecologist=missions.buildPreset('ecologo',catalog);
assert.equal(missions.evaluate('ecologo',ctx(ecologist),'a').complete,false);
assert.ok(ctx(ecologist).audit.issues.some(x=>x.code==='invalid-relation'));
ecologist.edges=ecologist.edges.filter(x=>!(
 x.nature==='decomposicao'&&node(ecologist,'capim').id===x.a));
assert.ok(!ctx(ecologist).audit.issues.some(x=>x.code==='invalid-relation'));
assert.equal(missions.evaluate('ecologo',ctx(ecologist),'a').complete,true);
assert.equal(missions.evaluate('ecologo',ctx(ecologist),'b').complete,false);
assert.equal(JSON.stringify(p),before,'Checagens não modificam progresso');
assert.throws(()=>missions.buildPreset('invalid',catalog));
assert.throws(()=>missions.evaluate('invalid',ctx(graph),'a'));
console.log('ETAPA 8 OK: 5 missões, objetivos, decisões, progressão, dequada, auditoria e compatibilidade');

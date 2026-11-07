/* Teia da Vida: avaliação científica didática — testes etapa 6.
 * node tests/auditoria.test.js 
 */
'use strict';
const assert=require('node:assert/strict');
const audit=require('../ecological-audit.js');
const metrics=require('../ecological-metrics.js');
const interactions=require('../interaction-model.js');
const catalog=[
 {id:'s0',slug:'capim',name:'Capim',role:'Produtor'},
 {id:'s1',slug:'capivara',name:'Capivara',role:'Consumidor'},
 {id:'s2',slug:'onca-pintada',name:'Onça-pintada',role:'Predador'},
 {id:'s8',slug:'serapilheira',name:'Serapilheira',role:'Recurso'},
 {id:'s5',slug:'minhoca',name:'Minhoca',role:'Detritívoro'},
 {id:'s29',slug:'fitoplancton',name:'Fitoplâncton',role:'Produtor'},
 {id:'s30',slug:'zooplancton',name:'Zooplâncton',role:'Consumidor'},
 {id:'s31',slug:'lambari',name:'Lambari',role:'Consumidor'},
 {id:'s17',slug:'abelha-nativa',name:'Abelha nativa',role:'Polinizador'}
];
const node=(id,specId,role=null,opts={})=>{
 const sp=catalog.find(x=>x.id===specId);
 return {id,specId,role:role||sp?.role||'Consumidor',name:sp?.name||'Elemento',
  count:20,...opts};
};
const e=(id,a,b,nature,opts={})=>({id,a,b,kind:'direta',direction:'forward',
 nature,weight:.65,...opts});
const run=(nodes,edges)=>audit.analyze(nodes,edges,catalog,{metrics,interactions});
const codes=x=>x.issues.map(y=>y.code);
// A valid producer → herbivore → predator chain has levels 1, 2 and 3.
{
 const n=[node('g','s0'),node('c','s1'),node('j','s2')];
 const l=[e('g-c','g','c','herbivoria',{foodId:'g'}),
          e('c-j','c','j','consumo',{foodId:'c'})];
 const result=run(n,l);
 assert.equal(result.status,'exploravel');
 assert.equal(result.metrics.trophic,2);
 assert.equal(result.metrics.isolated,0);
 assert.equal(result.metrics.components,1);
 assert.equal(result.levels.find(x=>x.id==='g').level,1);
 assert.equal(result.levels.find(x=>x.id==='c').level,2);
 assert.equal(result.levels.find(x=>x.id==='j').level,3);
 assert.equal(result.metrics.partialSpecies,2); // Capivara and jaguar; capim not a species
 assert.ok(!codes(result).includes('predator-no-food'));
 // The drawing arrow's orientation never changes food relations.
 const reversed=run(n,l.map(x=>({...x,direction:'reverse'})));
 assert.deepEqual(reversed.levels.map(x=>x.level),result.levels.map(x=>x.level));
}
// Legacy 'consumo' of plants is flagged, yet food flow remains analyzable.
{
 const n=[node('phy','s29'),node('zoo','s30'),node('fish','s31')];
 const l=[e('phy-zoo','phy','zoo','consumo'),
  e('zoo-fish','zoo','fish','consumo',{foodId:'zoo'})];
 const result=run(n,l);
 assert.equal(result.levels.find(x=>x.id==='phy').level,1);
 assert.equal(result.levels.find(x=>x.id==='zoo').level,2);
 assert.equal(result.levels.find(x=>x.id==='fish').level,3);
 assert.equal(result.foodEdges[0].nature,'herbivoria');
 assert.ok(codes(result).includes('food-unspecified'));
}
// Isolates & components are observations, not proofs of ecological mistakes.
{
 const n=[node('g','s0'),node('c','s1'),node('j','s2')];
 const result=run(n,[e('g-c','g','c','herbivoria',{foodId:'g'})]);
 assert.equal(result.metrics.isolated,1);
 assert.equal(result.metrics.components,2);
 assert.ok(codes(result).includes('isolated'));
 assert.ok(codes(result).includes('disconnected'));
 assert.ok(codes(result).includes('predator-no-food'));
 const issue=result.issues.find(x=>x.code==='isolated');
 assert.equal(issue.target.nodeId,'j');
}
// Broken endpoints, duplicates and biologically implausible decomposer links.
{
 const n=[node('g','s0'),node('c','s1'),node('j','s2')];
 const result=run(n,[
  e('ok','g','c','herbivoria',{foodId:'g'}),
  e('duplicate','g','c','herbivoria',{foodId:'g'}),
  e('broken','g','missing','consumo'),
  e('bad-decompose','g','j','decomposicao')
 ]);
 assert.equal(result.metrics.direct,1);
 for(const code of ['duplicate','missing-node','invalid-relation'])
  assert.ok(codes(result).includes(code),code);
 assert.equal(result.status,'estrutura');
}
// Detritivory is not a living-producer food chain; its actors retain undefined level.
{
 const n=[node('det','s8'),node('worm','s5')];
 const result=run(n,[e('det-worm','det','worm','detritivoria',{foodId:'det'})]);
 assert.equal(result.metrics.detrital,1);
 assert.equal(result.metrics.trophic,0);
 assert.equal(result.levels.find(x=>x.id==='worm').level,null);
 assert.ok(!codes(result).includes('basal-missing')); // legitimate detrital subweb
}
// Indirect: with a mediator versus without; it adds no trophic link.
{
 const n=[node('g','s0'),node('c','s1'),node('j','s2')];
 const direct=[e('g-c','g','c','herbivoria',{foodId:'g'}),e('c-j','c','j','consumo',{foodId:'c'})];
 const x=e('g-j','g','j','outro',{kind:'indireta'});
 const result=run(n,[...direct,x]);
 assert.equal(result.metrics.trophic,2);
 assert.equal(result.metrics.indirect,1);
 assert.equal(result.pathways[0].mediators[0],'Capivara');
 assert.ok(!codes(result).includes('indirect-unmediated'));
 assert.ok(codes(run(n,[x])).includes('indirect-unmediated'));
}
// Cycles can exist in nature; they require interpretation and need not yield a fabricated level.
{
 const n=[node('g','s0'),node('c','s1'),node('j','s2')];
 const edges=[e('g-c','g','c','herbivoria',{foodId:'g'}),
  e('c-j','c','j','consumo',{foodId:'c'}),
  e('j-c','j','c','consumo',{foodId:'j'})];
 const res=run(n,edges);
 assert.ok(codes(res).includes('trophic-cycle'));
}
// Sampling counts must be flagged as records, not biological population size.
{
 const n=[node('g','s0'),node('c','s1','Consumidor',{countUnit:'amostras'})];
 const result=run(n,[e('g-c','g','c','herbivoria',{foodId:'g'})]);
 assert.ok(codes(result).includes('sampling-link'));
 assert.ok(codes(result).includes('mixed-units'));
}
// Null/empty diagrams give usable feedback and all results are serializable.
{
 const empty=run([],[]);
 assert.equal(empty.status,'vazia');
 assert.ok(empty.issues.length>0);
 assert.doesNotThrow(()=>JSON.stringify(empty));
 const lone=run([node('g','s0')],[]);
 assert.equal(lone.levels[0].level,1);
 assert.equal(lone.metrics.elements,1);
}
console.log('ETAPA 6 OK: níveis, arestas, isolados, recursos, mediação, duplicatas, ciclos e unidades');

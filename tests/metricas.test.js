/* Teia da Vida — testes das medidas ecológicas (etapa 5).
   node tests/metricas.test.js */
'use strict';
const assert=require('node:assert/strict');
const metrics=require('../ecological-metrics.js');
const dynamics=require('../sim-model.js');
const interactions=require('../interaction-model.js');
assert.equal(metrics.ROWS.length,44,'Catálogo tem 44 registros');
assert.equal(new Set(metrics.ROWS.map(r=>r[0])).size,44,'Slugs únicos');
for(const [slug] of metrics.ROWS){
 const meta=metrics.META[slug];
 assert.ok(meta,'Metadados ausentes de '+slug);
 assert.ok(metrics.TYPES[meta.kind],'Tipo não reconhecido '+slug);
 assert.ok(metrics.UNITS[meta.unit],'Unidade não reconhecida '+slug);
 if(meta.kind==='especie')assert.ok(metrics.isBinomial(meta.scientificName),'Espécie sem binômio '+slug);
}
const identified=metrics.ROWS.filter(r=>r[1]==='especie');
assert.equal(identified.length,7,'Somente 7 táxons são especificados a espécie no catálogo');
assert.equal(metrics.META['minhoca'].kind,'grupo');
assert.equal(metrics.META['fitoplancton'].kind,'comunidade');
assert.equal(metrics.META['liquen'].kind,'associacao');
assert.equal(metrics.META['bacterias-decompositoras'].unit,'indice');
assert.equal(metrics.META['serapilheira'].unit,'nenhum');
assert.equal(metrics.META['ipê-amarelo']?.scientificName,undefined); // no corresponding slug
assert.equal(metrics.META['ipe-amarelo'].scientificName,'');
// No sum across individuals, ecological indices, sample counts and nonliving resources.
const specs=[
 {id:'s1',slug:'capivara'},
 {id:'s2',slug:'onca-pintada'},
 {id:'s29',slug:'fitoplancton'},
 {id:'s30',slug:'zooplancton'},
 {id:'s8',slug:'serapilheira'},
 {id:'s35',slug:'bacterias-decompositoras'}
];
const nodes=[
 {id:'a',specId:'s1',name:'Capivara',role:'Consumidor',count:8,mass:120},
 {id:'b',specId:'s2',name:'Onça-pintada',role:'Predador',count:2,mass:100},
 {id:'c',specId:'s29',name:'Fitoplâncton',role:'Comunidade',count:30,mass:2},
 {id:'d',specId:'s30',name:'Zooplâncton',role:'Comunidade',count:120,mass:null},
 {id:'e',specId:'s8',name:'Serapilheira',role:'Recurso',count:0,mass:20},
 {id:'f',specId:'s35',name:'Bactérias decompositoras',role:'Decompositor',count:90,mass:null}
];
const report=metrics.analyze(nodes,specs);
assert.equal(report.elements,6);
assert.equal(report.living,5);
assert.equal(report.resourceCount,1);
assert.equal(report.individuals,10,'Índices microbianos não são indivíduos');
assert.equal(report.biomass,222,'Matéria orgânica não é biomassa viva');
assert.equal(report.resourceStock,20);
assert.equal(report.speciesNamed,2,'Não chamar comunidade de uma espécie');
assert.equal(report.counts.comunidade,2);
assert.equal(report.counts.grupo,1);
assert.ok(report.issues.some(w=>w.includes('riqueza total')));
assert.equal(metrics.indexFor(6,8),75);
assert.equal(metrics.indexFor(20,10),200);
assert.equal(metrics.indexFor(10,0),null);
// A specimen label cannot be inflated by reclassifying a non-binomial name as species.
const fake={id:'x',name:'Peixe',role:'Consumidor',specId:'s1',count:5,
  entityType:'especie',scientificName:'Peixe',countUnit:'individuos'};
assert.equal(metrics.analyze([fake],specs).speciesNamed,0);
// Preserve old JSON nodes: metadata is supplied without deleting coordinates or links.
const legacy={id:'old',specId:'s29',name:'Fitoplâncton',role:'Comunidade',
  count:30,mass:2,x:.42,y:.51,customFlag:'saved'};
const enriched=metrics.enrichNode(legacy,{slug:'fitoplancton'});
assert.equal(enriched.x,.42);
assert.equal(enriched.customFlag,'saved');
assert.equal(enriched.entityType,'comunidade');
assert.equal(enriched.countUnit,'indice');
// Recorded samples do not reproduce, are not counted as organisms in predator effects.
const cohort=[
 {id:'sample',name:'Zooplâncton',role:'Comunidade',count:22,mass:2,countUnit:'amostras'},
 {id:'fish',name:'Lambari',role:'Consumidor',count:20,mass:10,countUnit:'individuos'}
];
const edges=[{a:'sample',b:'fish',nature:'consumo',kind:'direta',foodId:'sample',weight:.7}];
let state=dynamics.init(cohort);
for(let step=1;step<=20;step++){
 const eco=interactions.evaluate(cohort,edges,state);
 const res=dynamics.advance(cohort,edges,state,{interactions:eco});
 state=res.state;
 assert.equal(state.pop.sample,22,'Amostras permanecem fixas');
 assert.equal(res.reports.find(r=>r.id==='sample').change,0);
}
assert.ok(interactions.evaluate(cohort,edges,dynamics.init(cohort)).warnings.length>0,
 'Amostras não devem atuar como quantidade de presas');
console.log('ETAPA 5 OK: 44 registros, 7 espécies declaradas, unidades, biomassa, amostras fixas e teias legadas');

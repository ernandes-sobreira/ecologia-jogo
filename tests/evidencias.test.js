/* Etapa 7 — bibliografia e grau de evidência, sem bibliotecas externas. */
'use strict';
const assert=require('node:assert/strict');
const evidence=require('../scientific-evidence.js');
const nodes=[
 {id:'grass',specId:'s0',role:'Produtor',name:'Capim'},
 {id:'cap',specId:'s1',role:'Consumidor',name:'Capivara'},
 {id:'jag',specId:'s2',role:'Predador',name:'Onça-pintada'},
 {id:'acuri',specId:'s19',role:'Produtor',name:'Acuri (palmeira)'},
 {id:'anta',specId:'s16',role:'Consumidor',name:'Anta'},
 {id:'bee',specId:'s17',role:'Polinizador',name:'Abelha nativa'},
 {id:'ipe',specId:'s21',role:'Produtor',name:'Ipê-amarelo'},
 {id:'unknown',specId:'s31',role:'Consumidor',name:'Lambari'}];
const catalog=[['s0','capim'],['s1','capivara'],['s2','onca-pintada'],
 ['s19','acuri-palmeira'],['s16','anta'],['s17','abelha-nativa'],
 ['s21','ipe-amarelo'],['s31','lambari']].map(([id,slug])=>({id,slug}));
const link=(a,b,nature,extra={})=>({id:'edge-'+a+'-'+b,a,b,nature,kind:'direta',weight:.7,...extra});
assert.ok(Object.keys(evidence.SOURCES).length>=8);
assert.ok(evidence.PARAMETERS.length>=6);
assert.ok(evidence.OBSERVATIONS.length>=5,'Fichas empíricas com unidades e fontes');
for(const o of evidence.OBSERVATIONS){
 assert.ok(evidence.SOURCES[o.sourceId],'Fonte ausente para observação');
 assert.ok(o.value&&o.unit&&o.context&&o.caution);
}
assert.ok(evidence.OBSERVATIONS.some(o=>o.id==='dequada'&&o.value.includes('mg/L')));
assert.ok(evidence.OBSERVATIONS.some(o=>o.id==='phyto-density'&&o.value.includes('ind./mL')));
for(const source of Object.values(evidence.SOURCES)){
 assert.ok(/^https:\/\//.test(source.url),'Fonte sem URL HTTPS');
 assert.ok(source.title&&source.year);
}
const jaguar=link('cap','jag','consumo',{foodId:'cap'});
assert.equal(evidence.classify(nodes,jaguar,catalog).status,'pantanal');
const reversedDrawing={...jaguar,direction:'reverse'};
assert.equal(evidence.classify(nodes,reversedDrawing,catalog).status,'pantanal');
assert.equal(evidence.classify(nodes,{...jaguar,foodId:'jag'},catalog).roleIssue,true);
assert.equal(evidence.classify(nodes,link('grass','cap','herbivoria',{foodId:'grass'}),catalog).status,'outraRegiao');
assert.equal(evidence.classify(nodes,link('acuri','anta','dispersao',{actorId:'anta'}),catalog).status,'pantanal');
assert.equal(evidence.classify(nodes,link('ipe','bee','polinizacao',{actorId:'bee'}),catalog).status,'analogia');
assert.equal(evidence.classify(nodes,link('jag','unknown','consumo',{foodId:'unknown'}),catalog).status,'hipotese');
assert.equal(evidence.classify(nodes,{...jaguar,kind:'indireta'},catalog).status,'naoAplicavel');
const sample=evidence.assess(nodes,[jaguar,link('acuri','anta','dispersao',{actorId:'anta'}),
 link('grass','cap','herbivoria',{foodId:'grass'})],catalog);
assert.equal(sample.regional,2);
assert.equal(sample.outside,1);
assert.equal(sample.linked,3);
assert.ok(sample.sources.some(s=>s.id==='jaguarPantanal'));
assert.ok(evidence.PARAMETERS.every(x=>/Hipotético|conceitual|hipotéticos/.test(x.status+x.meaning+x.example)));
console.log('ETAPA 7 — evidências: níveis distintos, fontes, papéis e coeficientes não calibrados — OK');

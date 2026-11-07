/* Teia da Vida — testes de processos ecológicos distintos (etapa 4)
   Executar: node tests/interacoes.test.js */
'use strict';
const assert=require('node:assert/strict');
const eco=require('../interaction-model.js');
const pop=require('../sim-model.js');
const node=(id,name,role,count)=>({id,name,role,count,mass:null});
const edge=(a,b,nature,extra={})=>({id:'e'+a+'-'+b+'-'+nature,a,b,nature,weight:.85,kind:'direta',direction:'forward',...extra});
const a=(n)=>JSON.parse(JSON.stringify(n));
function test(nodes,edges=[],steps=1,options={}){
 const ns=a(nodes),es=a(edges),params={scenario:'equilibrio',intensity:0,
   reproduction:1,capacity:1,predation:1,competition:.75,lag:2,...options};
 let state=pop.init(ns),last,interactions;
 for(let i=0;i<steps;i++){
   interactions=eco.evaluate(ns,es,state,params);
   last=pop.advance(ns,es,state,{...params,interactions});
   state=last.state;
   for(const value of last.values){
     const n=ns.find(n=>n.id===value.id);n.count=value.count;n.mass=value.mass;
   }
   assert.ok(last.values.every(v=>Number.isFinite(v.count)&&v.count>=0));
 }
 return {state,report:last.reports,interactions,counts:last.values};
}
function value(result,id){return result.state.pop[id]}
function report(result,id){return result.report.find(x=>x.id===id)}
// Competição (-/-): custos em ambos os participantes.
{
 const n=[node('a','Capivara','Consumidor',20),node('b','Gafanhoto','Consumidor',40)];
 const normal=test(n),comp=test(n,[edge('a','b','competicao')]);
 assert.ok(value(comp,'a')<value(normal,'a'));
 assert.ok(value(comp,'b')<value(normal,'b'));
 assert.ok(report(comp,'a').explicitCompetition>0);
}
// Predação = mortalidade da presa; herbivoria = dano ao produtor, não caça animal.
{
 const n=[node('grass','Capim','Produtor',100),node('c','Capivara','Consumidor',20),
   node('j','Onça-pintada','Predador',5)];
 const base=test(n),grazing=test(n,[edge('grass','c','herbivoria',{foodId:'grass'})]);
 assert.ok(value(grazing,'grass')<value(base,'grass'));
 assert.ok(report(grazing,'grass').herbivory>0);
 assert.equal(report(grazing,'grass').predation,0);
 const hunting=test(n,[edge('c','j','consumo',{foodId:'c'})]);
 assert.ok(value(hunting,'c')<value(base,'c'));
 assert.ok(report(hunting,'c').predation>0);
 assert.equal(report(hunting,'c').herbivory,0);
}
// Parasitismo (+/-): hospedeiro prejudicado e parasita favorecido.
{
 const n=[node('host','Capivara','Consumidor',25),node('tick','Carrapato','Parasita',40)];
 const e=edge('host','tick','parasitismo',{actorId:'tick'});
 const base=test(n),infested=test(n,[e]);
 assert.ok(value(infested,'host')<value(base,'host'));
 assert.ok(value(infested,'tick')>value(base,'tick'));
 assert.ok(report(infested,'host').parasitism>0);
}
// Mutualismo (+/+) condicional à presença dos parceiros.
{
 const n=[node('a','Planta','Produtor',30),node('b','Fungo simbionte','Decompositor',30)];
 const base=test(n),mutual=test(n,[edge('a','b','mutualismo')]);
 assert.ok(value(mutual,'a')>value(base,'a'));
 assert.ok(value(mutual,'b')>value(base,'b'));
}
// Polinização e dispersão: recrutamento vegetal com atraso, não mortalidade.
{
 const n=[node('p','Ipê-amarelo','Produtor',25),node('b','Abelha nativa','Polinizador',40)];
 const e=edge('p','b','polinizacao',{actorId:'b'});
 const immediate=test(n,[e],1),baseline1=test(n,[],1);
 assert.equal(value(immediate,'p'),value(baseline1,'p'));
 const later=test(n,[e],4),baseline4=test(n,[],4);
 assert.ok(value(later,'p')>value(baseline4,'p'));
 assert.ok(value(later,'b')>value(baseline4,'b'));
 const ns=[node('p','Acuri (palmeira)','Produtor',25),node('d','Anta','Consumidor',16)];
 const dispersal=edge('p','d','dispersao',{actorId:'d'});
 const one=test(ns,[dispersal],1),zero=test(ns,[],1);
 assert.equal(value(one,'p'),value(zero,'p'));
 assert.ok(value(test(ns,[dispersal],5),'p')>value(test(ns,[],5),'p'));
}
// Detritivoria usa detritos e não mata seres vivos; necrofagia não mata a fonte das carcaças.
{
 const n=[node('detritus','Serapilheira','Recurso',0),node('worm','Minhoca','Detritívoro',30)];
 const e=edge('detritus','worm','detritivoria',{foodId:'detritus'});
 assert.ok(value(test(n,[e],5,{organicIndex:90}),'worm')>
           value(test(n,[e],5,{organicIndex:10}),'worm'));
 const animals=[node('c','Capivara','Consumidor',35),node('v','Urubu','Necrófago',10)];
 const carrion=edge('c','v','necrofagia',{foodId:'c'});
 const sim=test(animals,[carrion],3),base=test(animals,[],3);
 assert.equal(value(sim,'c'),value(base,'c'));
 assert.equal(report(sim,'c').predation,0);
}
// Direção visual não troca presa, hospedeiro ou polinizador.
{
 const nodes=[node('x','Capivara','Consumidor',20),node('y','Onça-pintada','Predador',4)];
 const f=edge('x','y','consumo',{foodId:'x',direction:'forward'});
 const reverse={...f,direction:'reverse'};
 assert.equal(value(test(nodes,[f],3),'x'),value(test(nodes,[reverse],3),'x'));
 assert.equal(value(test(nodes,[f],3),'y'),value(test(nodes,[reverse],3),'y'));
}
// O efeito indireto via dois elos diretos é registrado sem duplicar a força.
{
 const nodes=[node('g','Capim','Produtor',70),node('h','Gafanhoto','Consumidor',18),
   node('r','Rã','Consumidor',7)];
 const direct=[edge('g','h','herbivoria',{foodId:'g'}),edge('h','r','consumo',{foodId:'h'})];
 const indirect={...edge('g','r','outro'),kind:'indireta'};
 const a=test(nodes,direct,5),b=test(nodes,[...direct,indirect],5);
 for(const n of nodes)assert.equal(value(a,n.id),value(b,n.id));
 assert.equal(b.interactions.indirectPaths.length,1);
 assert.equal(b.interactions.indirectPaths[0].mediator,'Gafanhoto');
}
// Invalidação de relações biologicamente inadequadas.
{
 const nodes=[node('a','Acuri (palmeira)','Produtor',10),node('b','Capivara','Consumidor',20)];
 const bad=edge('a','b','parasitismo');
 const result=test(nodes,[bad]);
 assert.ok(result.interactions.warnings.length>0);
}
console.log('ETAPA 4 OK: processos distintos, atrasos, necrofagia, herbivoria, papéis e mediação indireta');

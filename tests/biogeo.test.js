/* Teia da Vida — testes do módulo biogeoquímico (sem dependências). 
   Execução: node tests/biogeo.test.js */
'use strict';
const assert=require('node:assert/strict');
const bio=require('../biogeochemistry.js');
const flood=require('../flood-pulse.js');
const dynamics=require('../sim-model.js');
const nodes=[
 {id:'litter',name:'Serapilheira',role:'Recurso',count:0,mass:20},
 {id:'micro',name:'Bactérias decompositoras',role:'Decompositor',count:60,mass:null},
 {id:'algae',name:'Fitoplâncton',role:'Comunidade',count:35,mass:3},
 {id:'fish',name:'Lambari',role:'Consumidor',count:25,mass:10},
 {id:'grass',name:'Capim',role:'Produtor',count:240,mass:50}
];
const edge={a:'litter',b:'micro',nature:'decomposicao',kind:'direta',weight:.6};
const cfg={enabled:true,load:45,microbes:100,aeration:55,temperature:50,edges:[edge]};
const high={...cfg,load:100,microbes:150,aeration:5,temperature:90};
const quiet={...cfg,load:100,microbes:0,aeration:5,temperature:90};
function run(config,edges=config.edges||[]){
 const current={...config,edges},hydro=step=>flood.at(step,{enabled:true,amplitude:100,start:'enchente'});
 let state=bio.init(nodes,current,hydro(0)),selected={};
 for(let i=1;i<=60;i++){
   const result=bio.advance(nodes,state,current,hydro(i));state=result.state;
   if([1,10,15,23,30,45,60].includes(i))selected[i]=result.report;
   assert.ok(['baixo','atenção','alto','desligado'].includes(result.report.risk));
   for(const key of ['organic','nutrients','oxygen','carbon'])
     assert.ok(Number.isFinite(state[key])&&state[key]>=0&&state[key]<=100,key+' out of [0,100]');
 }
 assert.equal(state.history.length,61);
 return {state,selected};
}
const normal=run(cfg),dequada=run(high),inactive=run(quiet);
assert.ok(normal.selected[1].oxygen>70,'Início de condição habitual mantém OD alto');
assert.notEqual(normal.selected[10].nutrients,normal.selected[1].nutrients);
assert.ok(dequada.selected[10].oxygen<30,'Carga elevada + baixa reaeração reduz O2');
assert.equal(dequada.selected[10].risk,'alto','Alerta de condições semelhantes à dequada');
assert.ok(inactive.selected[10].oxygen>dequada.selected[10].oxygen+30);
assert.ok(dequada.selected[10].nutrients>inactive.selected[10].nutrients);
const unl=run({...cfg,edges:[]});
assert.ok(normal.selected[1].decomposed>unl.selected[1].decomposed,
 'Conexão real entre serapilheira e bactérias intensifica decomposição');
assert.equal(bio.advance(nodes,null,{...cfg,enabled:false},flood.at(1,{enabled:true})).report.risk,'desligado');
const fish=nodes.find(n=>n.id==='fish');
const low={oxygen:16,nutrients:65},healthy={oxygen:82,nutrients:26};
const stressed=bio.effects(fish,low,cfg),notStressed=bio.effects(fish,healthy,cfg);
assert.ok(stressed.oxygenStress>notStressed.oxygenStress);
const alg=nodes.find(n=>n.id==='algae');
assert.ok(bio.effects(alg,{oxygen:80,nutrients:85},cfg).nutrientFactor>
          bio.effects(alg,{oxygen:80,nutrients:15},cfg).nutrientFactor);
const pop=[fish];
const one=effects=>dynamics.advance(pop,[],dynamics.init(pop),
  {scenario:'equilibrio',biogeoEffects:{fish:effects}});
assert.ok(one(stressed).state.pop.fish<one(notStressed).state.pop.fish,
 'Baixo O2 reduz sobrevivência de peixes no motor demográfico');
assert.equal(bio.effects(fish,{oxygen:0,nutrients:100},{enabled:false}).oxygenStress,0);
console.log('ETAPA 3 OK: matéria orgânica, decomposição, nutrientes, O2, CO2, dequada, ligações e efeitos populacionais');

/* Teia da Vida — sensibilidade local de parâmetros didáticos (etapa 7).
 * Reexecuta cópias descartáveis da teia. Não ajusta parâmetros, não usa dados
 * observados nem estabelece incerteza estatística de campo. Varia 25% para
 * cada lado, UM parâmetro por vez, mantendo os demais fixos.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaSensitivity=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number.isFinite(+n)?+n:a));
 const factors=[
  {key:'reproduction',label:'Reprodução',group:'model',low:.75,high:1.25,min:.25,max:2},
  {key:'capacity',label:'Capacidade de suporte',group:'model',low:.75,high:1.25,min:.65,max:2.5},
  {key:'predation',label:'Pressão de predação',group:'model',low:.75,high:1.25,min:0,max:2.5},
  {key:'competition',label:'Competição',group:'model',low:.75,high:1.25,min:0,max:1},
  {key:'amplitude',label:'Amplitude do pulso de inundação',group:'flood',low:.75,high:1.25,min:30,max:140},
  {key:'load',label:'Carga de matéria orgânica',group:'bio',low:.75,high:1.25,min:0,max:100}
 ];
 function cloneNodes(nodes){return nodes.map(n=>({...n}));}
 function run(nodes,edges,raw,api){
  const models={population:api.population,hydrology:api.hydrology,
   biogeo:api.biogeo,interactions:api.interactions};
  if(!models.population?.init||!models.population?.advance||
     !models.hydrology?.at||!models.hydrology?.habitat||
     !models.biogeo?.init||!models.biogeo?.advance||!models.interactions?.evaluate)
    throw Error('Módulos ecológicos não disponíveis para análise de sensibilidade.');
  const sample=cloneNodes(nodes),unchangedOriginal=nodes;
  const opts={
    model:{...raw.model},flood:{...raw.flood},bio:{...raw.bio},
    steps:Math.round(clamp(raw.steps??20,1,60)),
    focusId:raw.focusId||sample.find(n=>n.role!=='Recurso')?.id||''
  };
  let pop=models.population.init(sample);
  let hydro=models.hydrology.at(0,opts.flood);
  let bio=models.biogeo.init(sample,{...opts.bio,edges},hydro);
  for(let i=1;i<=opts.steps;i++){
   hydro=models.hydrology.at(i,opts.flood);
   const resBio=models.biogeo.advance(sample,bio,{...opts.bio,edges},hydro);
   bio=resBio.state;
   const modelOptions={
    ...opts.model,
    flood:hydro,
    habitats:Object.fromEntries(sample.map(n=>[n.id,models.hydrology.habitat(n,hydro)])),
    biogeoEffects:Object.fromEntries(sample.map(n=>[n.id,models.biogeo.effects(n,bio,opts.bio)])),
    organicIndex:bio.organic
   };
   modelOptions.interactions=models.interactions.evaluate(sample,edges,pop,modelOptions);
   const result=models.population.advance(sample,edges,pop,modelOptions);
   pop=result.state;
   for(const v of result.values){
    const n=sample.find(n=>n.id===v.id);
    if(n){n.count=v.count;n.mass=v.mass;}
   }
   if(!Number.isFinite(bio.oxygen)||!Object.values(pop.pop).every(Number.isFinite))
      throw Error('O modelo produziu valor inválido. Revise os parâmetros.');
  }
  const init=pop.initial[opts.focusId]?.count||0,final=pop.pop[opts.focusId];
  const relative=init>0&&Number.isFinite(final)?100*final/init:null;
  return {finalStep:opts.steps,focusId:opts.focusId,initial:init,
    final:final??null,relative,oxygen:bio.oxygen,organic:bio.organic,
    model:opts.model,flood:opts.flood,bio:opts.bio};
 }
 function evaluate(nodes,edges,raw,api){
  if(!Array.isArray(nodes)||!nodes.length)throw Error('Adicione organismos para investigar sensibilidade.');
  const focusId=raw.focusId;
  if(!nodes.some(n=>n.id===focusId))throw Error('Escolha um organismo presente na teia.');
  const focus=nodes.find(n=>n.id===focusId);
  if(focus.role==='Recurso'||(focus.countUnit==='amostras'||focus.countUnit==='colonias'))
    throw Error('Selecione uma população ou índice didático; amostras e recursos não são dinâmicos.');
  if(!(Number(focus.count)>0))throw Error('A população escolhida precisa começar com valor maior que zero.');
  const base={model:{...raw.model},flood:{...raw.flood},bio:{...raw.bio},
    steps:raw.steps??20,focusId};
  const baseline=run(nodes,edges,base,api);
  const outputs=[];
  for(const factor of factors){
   if(factor.group==='flood' && base.flood.enabled===false)continue;
   if(factor.group==='bio' && base.bio.enabled===false)continue;
   const original=Number(base[factor.group]?.[factor.key]);
   if(!Number.isFinite(original))continue;
   const low=clamp(original*factor.low,factor.min,factor.max);
   const high=clamp(original*factor.high,factor.min,factor.max);
   const loInput={...base,[factor.group]:{...base[factor.group],[factor.key]:low}};
   const hiInput={...base,[factor.group]:{...base[factor.group],[factor.key]:high}};
   const runLow=run(nodes,edges,loInput,api);
   const runHigh=run(nodes,edges,hiInput,api);
   const diffLow=baseline.relative==null||runLow.relative==null?null:runLow.relative-baseline.relative;
   const diffHigh=baseline.relative==null||runHigh.relative==null?null:runHigh.relative-baseline.relative;
   const amplitude=Math.max(Math.abs(diffLow||0),Math.abs(diffHigh||0));
   outputs.push({key:factor.key,label:factor.label,group:factor.group,original,
     low,high,baseline:baseline.relative,lowResult:runLow.relative,highResult:runHigh.relative,
     diffLow,diffHigh,amplitude,
     classification:amplitude>=10?'Resposta forte':amplitude>=3?'Resposta moderada':'Resposta pequena',
     oxygenLow:runLow.oxygen,oxygenHigh:runHigh.oxygen,
     unchanged:low===high});
  }
  outputs.sort((a,b)=>b.amplitude-a.amplitude);
  return {focusId,focusName:focus.name,steps:baseline.finalStep,base:baseline,
   factors:outputs,parametersTested:outputs.length,
   warning:'Sensibilidade local com variação de ±25% por vez. Não é intervalo de confiança nem calibração empírica.'};
 }
 return {run,evaluate,factors};
});
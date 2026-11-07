/* Teia da Vida — motor biogeoquímico CONCEITUAL, etapa 3.
  Estoques e fluxos em índices arbitrários de 0 a 100, não em mg/L ou kg/ha.
  Etapas: matéria orgânica submersa → decomposição microbiana → nutrientes
  + consumo de oxigênio + índice de CO₂. O pulso pode submergir vegetação.
  Não constitui previsão de dequada, anoxia ou mortalidade real. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaBiogeo=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const clamp=(v,low=0,high=100)=>Math.max(low,Math.min(high,Number.isFinite(Number(v))?Number(v):low));
 const bounded=(v)=>clamp(v,0,100);
 const defaults={enabled:true,load:45,microbes:100,aeration:55,temperature:50};
 function normalize(raw={}){
   return {enabled:raw.enabled!==false,
     load:clamp(raw.load??defaults.load),
     microbes:clamp(raw.microbes??defaults.microbes,0,150),
     aeration:clamp(raw.aeration??defaults.aeration),
     temperature:clamp(raw.temperature??defaults.temperature)};
 }
 function nameOf(n){return String(n?.name||'').toLowerCase();}
 function microbesPresent(nodes){
   const decomposers=nodes.filter(n=>n.role==='Decompositor' || /biofilme/i.test(nameOf(n))).length;
   // Presence, not sum of incompatible units (bacteria cells vs fungus colonies).
   return clamp(.42+.24*Math.min(4,decomposers),.42,1.38);
 }
 function organicSources(nodes){
   const resources=nodes.filter(n=>n.role==='Recurso' &&
     /serapilheira|folhas|palha|carcaça|fezes|detrito|madeira morta|fruto/i.test(nameOf(n))).length;
   const vegetation=nodes.some(n=>n.role==='Produtor' || /capim|aguapé|palmeira|carandá/i.test(nameOf(n)));
   return {resources:Math.min(5,resources),vegetation};
 }
 function aquaticPhotosynthesizers(nodes){
   // Potential primary production in water; not a numeric biomass sum.
   return nodes.filter(n=>/fitoplâncton|perifíton|biofilme|aguapé|vitória-régia/i.test(nameOf(n))).length;
 }
 function init(nodes=[],raw={},flood={}){
   const o=normalize(raw),w=clamp(flood?.inundated??.15,0,1);
   const start={step:0,organic:bounded(18+.48*o.load),oxygen:83,
     nutrients:26,carbon:14,previousFlood:w,
     cumulativeDecomposed:0,history:[]};
   start.history.push(snapshot(start,{decomposed:0,inputs:0,respiration:0,photosynthesis:0,reaeration:0,uptake:0,risk:'baixo',label:'Condição inicial',source:'Início do experimento'}));
   return start;
 }
 function snapshot(s,rate){
   return {step:s.step,organic:s.organic,oxygen:s.oxygen,nutrients:s.nutrients,carbon:s.carbon,
     decomposed:rate.decomposed||0,inputs:rate.inputs||0,respiration:rate.respiration||0,
     photosynthesis:rate.photosynthesis||0,reaeration:rate.reaeration||0,
     uptake:rate.uptake||0,risk:rate.risk||'baixo',label:rate.label||'',source:rate.source||''};
 }
 function advance(nodes=[],prior,raw={},flood={}){
   const opts=normalize(raw);
   if(!prior || !Array.isArray(prior.history))prior=init(nodes,raw,flood);
   if(!opts.enabled){
     const stable={...prior,step:prior.step+1,history:[...prior.history]};
     const last=snapshot(stable,{risk:'desligado',label:'Módulo desativado',source:'Estoques mantidos constantes'});
     stable.history.push(last);
     return {state:stable,report:last,options:opts};
   }
   const source=organicSources(nodes),microbes=microbesPresent(nodes);
   const wet=clamp(flood?.inundated??.35,0,1),connected=clamp(flood?.connectivity??.4,0,1);
   const rising=Math.max(0,wet-clamp(prior.previousFlood??wet,0,1));
   const temperature=.65+opts.temperature/100*.75;
   const organicFactor=opts.load/100;
   // External litter and submersion of previously dry biomass are distinct.
   const backgroundInput=organicFactor*(.22+.55*wet)*(source.vegetation?1.2:1);
   const resourcesInput=source.resources*organicFactor*.16;
   const submersionInput=organicFactor*78*rising*(source.vegetation?1.25:1);
   const inputs=clamp(backgroundInput+resourcesInput+submersionInput,0,26);
   const stock=bounded(prior.organic+inputs);
   const microbeActivity=(opts.microbes/100)*microbes*temperature;
   const aerobicGate=.24+.76*(prior.oxygen/100);
   const decomposed=Math.min(stock,stock*.048*microbeActivity*(.67+.50*wet)*aerobicGate);
   const organic=bounded(stock-decomposed);
   const primary=aquaticPhotosynthesizers(nodes);
   const photo=primary? (.40+.18*Math.min(3,primary))*(1-.42*wet)*(.75+.25*clamp(prior.nutrients,0,100)/60):.17;
   // O₂ consumption and reaeration are *indices per step*, not stoichiometric fluxes.
   const respiration=decomposed*2.20+.20+.14*microbeActivity;
   const reaeration=Math.max(0,82-prior.oxygen)*(.012+.075*opts.aeration/100)*(.55+.45*connected);
   const oxygen=bounded(prior.oxygen+reaeration+photo-respiration);
   const uptake=primary?(.20+.10*Math.min(3,primary))*Math.min(1.4,prior.nutrients/35):.08;
   const nutrients=bounded(prior.nutrients+decomposed*.64-uptake-Math.max(0,prior.nutrients-20)*.008);
   const degas=(.025+.055*opts.aeration/100)*(.65+.35*connected);
   const carbon=bounded(prior.carbon+decomposed*1.05+.20*microbeActivity-prior.carbon*degas);
   const nearDequada=!!flood?.enabled && wet>.32 && oxygen<30 && carbon>22;
   const risk=nearDequada?'alto':oxygen<46?'atenção':'baixo';
   const label=nearDequada?'Risco elevado de condições semelhantes à dequada':
     oxygen<46?'Atenção: oxigênio em queda':'Condição simulada sem alerta de hipóxia';
   const flowReason=nearDequada?'Matéria orgânica submersa e atividade microbiana aumentaram a demanda por oxigênio.':
     wet>.45?'O pulso modifica a submersão da matéria orgânica e as trocas na água.':
     'Os estoques se ajustam em resposta aos microrganismos e à disponibilidade de matéria orgânica.';
   const next={step:prior.step+1,organic,oxygen,nutrients,carbon,
     previousFlood:wet,cumulativeDecomposed:(prior.cumulativeDecomposed||0)+decomposed,
     history:[...prior.history]};
   const report=snapshot(next,{decomposed,inputs,respiration,photosynthesis:photo,
     reaeration,uptake,risk,label,source:flowReason});
   next.history.push(report);
   return {state:next,report,options:opts};
 }
 function effects(node,state,raw={}){
   const opts=normalize(raw);
   if(!opts.enabled || !state)return {oxygenStress:0,capacityFactor:1,nutrientFactor:1,reason:''};
   const n=nameOf(node),oxygen=clamp(state.oxygen),nutrients=clamp(state.nutrients);
   // Fish are the most direct sensitive organisms represented in this stage.
   const fish=/peixe|lambari|traíra|mandi/i.test(n);
   const otherAquatic=/zooplâncton|larvas de insetos aquáticos|caramujo aquático/i.test(n);
   const aquaticProducer=/fitoplâncton|perifíton|biofilme|aguapé|vitória-régia/i.test(n);
   const oxygenDeficit=clamp((54-oxygen)/54,0,1);
   const oxygenStress=(fish?.19:otherAquatic?.085:0)*Math.pow(oxygenDeficit,1.2);
   // Nutrients can benefit potential producer growth, limited by other resources.
   const nutrientFactor=aquaticProducer?clamp(.85+.30*nutrients/55,.80,1.32):1;
   const capacityFactor=fish?clamp(1-.32*oxygenDeficit,.68,1):
     otherAquatic?clamp(1-.15*oxygenDeficit,.85,1):nutrientFactor;
   return {oxygenStress,capacityFactor,nutrientFactor,reason:
     fish?'Oxigênio disponível condiciona a sobrevivência potencial de peixes.':
     aquaticProducer?'Disponibilidade de nutrientes altera a capacidade de suporte potencial dos produtores aquáticos.':
     otherAquatic?'Oxigênio pode limitar invertebrados aquáticos.':'Sem efeito limnológico específico neste grupo.'};
 }
 return {init,advance,effects,normalize,organicSources,microbesPresent,aquaticPhotosynthesizers};
});
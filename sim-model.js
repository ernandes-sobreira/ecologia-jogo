/* Teia da Vida — motor populacional didático, v4 com processos distintos por relação.
   Unidades: abundância por nó (com unidade definida pelo professor); um passo abstrato.
   Os coeficientes são ilustrativos e NÃO estimativas de campo do Pantanal.
   Escopo: reprodução, capacidade de suporte, competição por alimento, predação,
   escassez e resposta demográfica defasada. Sem simular ciclagem biogeoquímica. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.TeiaDynamics = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const RATE = Object.freeze({
    Produtor: { r: .13, m: .022, k: 1.60, crowd: .045 },
    Consumidor: { r: .095, m: .029, k: 1.75, crowd: .045 },
    Predador: { r: .075, m: .027, k: 1.75, crowd: .040 },
    Decompositor: { r: .105, m: .030, k: 1.65, crowd: .045 },
    Detritívoro: { r: .100, m: .030, k: 1.70, crowd: .045 },
    Necrófago: { r: .080, m: .029, k: 1.70, crowd: .045 },
    Polinizador: { r: .11, m: .036, k: 1.65, crowd: .045 },
    Parasita: { r: .11, m: .035, k: 1.80, crowd: .045 },
    Comunidade: { r: .100, m: .030, k: 1.65, crowd: .045 },
    Outro: { r: .085, m: .030, k: 1.70, crowd: .045 }
  });
  const minmax = (n,a,b) => Math.min(b,Math.max(a,n));
  const finite = (n,d=0) => Number.isFinite(Number(n)) ? Number(n) : d;
  function roleOf(n) {
    const id = String(n.specId||'');
    const name = String(n.name||'').toLowerCase();
    if (n.role==='Recurso') return 'Recurso';
    if (name.includes('fitoplâncton')||name.includes('perifíton')||name.includes('líquen')) return 'Produtor';
    if (name.includes('zooplâncton')||name.includes('larvas de insetos')) return 'Consumidor';
    return RATE[n.role] ? n.role : 'Outro';
  }
  function normalize(raw={}) {
    return {
      scenario: ['equilibrio','seca','recuperacao','predacao'].includes(raw.scenario) ? raw.scenario : 'equilibrio',
      intensity: minmax(finite(raw.intensity,50),0,100)/100,
      reproduction: minmax(finite(raw.reproduction,1),.25,2),
      capacity: minmax(finite(raw.capacity,1),.65,2.5),
      predation: minmax(finite(raw.predation,1),0,2.5),
      competition: minmax(finite(raw.competition,.5),0,1),
      lag: Math.round(minmax(finite(raw.lag,2),0,4)),
      flood: raw.flood?.enabled ? {enabled:true,phase:String(raw.flood.phase||''),water:minmax(finite(raw.flood.water,.45),0,1),inundated:minmax(finite(raw.flood.inundated,.45),0,1),connectivity:minmax(finite(raw.flood.connectivity,.45),0,1)} : {enabled:false},
      habitats: raw.habitats && typeof raw.habitats==='object' ? raw.habitats : {},
      biogeoEffects: raw.biogeoEffects && typeof raw.biogeoEffects==='object' ? raw.biogeoEffects : {},
      interactions: raw.interactions && typeof raw.interactions==='object' ? raw.interactions : null,
      organicIndex: minmax(finite(raw.organicIndex,50),0,100)
    };
  }
  function foodLink(edge,nodeById) {
    if (!edge || edge.kind==='indireta' || edge.nature!=='consumo') return null;
    const first=nodeById[edge.a],second=nodeById[edge.b];
    if(!first||!second||first.id===second.id)return null;
    // Quem é consumido é independente do sentido gráfico da seta.
    const rank=n=>({Recurso:0,Produtor:1,Decompositor:2,Detritívoro:2,Comunidade:2,Consumidor:2,Polinizador:2,Parasita:3,Necrófago:3,Predador:4}[roleOf(n)]??2);
    const foodId=edge.foodId===first.id||edge.foodId===second.id?edge.foodId:
      (rank(first)<rank(second)?first.id:rank(second)<rank(first)?second.id:first.id);
    const consumerId=foodId===first.id?second.id:first.id;
    if(nodeById[consumerId]?.role==='Recurso')return null;
    return {...edge,a:foodId,b:consumerId};
  }
  function init(nodes) {
    const initial={},pop={},foodHistory={},popHistory={};
    for (const n of nodes) {
      const N=Math.max(0,finite(n.count));
      initial[n.id]={count:N,mass:n.mass==null?null:Math.max(0,finite(n.mass)),role:n.role,name:n.name};
      pop[n.id]=N;
      foodHistory[n.id]=[1];
      popHistory[n.id]=[N];
    }
    return {step:0,initial,pop,foodHistory,popHistory,reports:[]};
  }
  function foodIndex(ratio) {
    const v=Math.max(0,ratio);
    return minmax(1.4*v/(.4+v),0,1.4);
  }
  function advance(nodes, edges, state, rawOptions={}) {
    const opts=normalize(rawOptions);
    if(!state || !state.initial || !state.pop) state=init(nodes);
    const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
    const initial=state.initial, old={}, foodHistory={}, popHistory={}, next={}, reports=[];
    const ecological=opts.interactions;
    const effects=ecological?.effects||{};
    const explicitCompetitors=new Set(edges.filter(e=>e.kind!=='indireta'&&e.nature==='competicao').flatMap(e=>[e.a+'|'+e.b,e.b+'|'+e.a]));
    for (const n of nodes) {
      old[n.id]=Math.max(0,finite(state.pop[n.id],n.count));
      if(!initial[n.id])initial[n.id]={count:Math.max(0,finite(n.count)),mass:n.mass==null?null:Math.max(0,finite(n.mass)),role:n.role,name:n.name};
      foodHistory[n.id]=Array.isArray(state.foodHistory[n.id])?[...state.foodHistory[n.id]]:[1];
      popHistory[n.id]=Array.isArray(state.popHistory?.[n.id])?[...state.popHistory[n.id]]:[old[n.id]];
    }
    const recordedUnit=n=>['amostras','colonias'].includes(n?.countUnit);
    // No biological recruitment can change a count of samples or colonies
    // recorded by the observer. Such observations also do not exert trophic
    // pressure as if they were numbers of organisms.
    const links=(Array.isArray(ecological?.trophicLinks)?
      ecological.trophicLinks:edges.map(e=>foodLink(e,byId)).filter(Boolean))
      .filter(e=>!recordedUnit(byId[e.a])&&!recordedUnit(byId[e.b]));
    const foodsByConsumer={},consumersByFood={};
    for (const e of links) {
      (foodsByConsumer[e.b] ||= []).push(e);
      (consumersByFood[e.a] ||= []).push(e);
    }
    // A disponibilidade de alimento é uma razão relativa à abundância inicial,
    // não uma soma de organismos de unidades ou massas incompatíveis.
    const currentFood={};
    for (const n of nodes) {
      const foods=foodsByConsumer[n.id]||[];
      const hf=opts.habitats[n.id]||{};
      const habitatFood=minmax(finite(hf.food,1),.45,1.5);
      if (!foods.length) {currentFood[n.id]=habitatFood;continue;}
      let weighted=0,total=0;
      for(const e of foods) {
        const source=byId[e.a],w=minmax(finite(e.weight,.6),.1,1);
        const ref=initial[e.a]?.count||0;
        let ratio=source.role==='Recurso' ? 1 : (ref>0?old[e.a]/ref:0);
        let quality=foodIndex(ratio);
        if(e.nature==='detritivoria'){
          // Only dead organic matter is a detrital resource. Depletion is a separate
          // biogeochemical process, not mortality of a living population.
          quality=source.role==='Recurso'?minmax(opts.organicIndex/50,0,1.4):0;
        }else if(e.nature==='necrofagia'){
          if(source.role==='Recurso')quality=/carcaça|restos animais/i.test(source.name||'')?1:0;
          else{
            const previous=state.reports?.find(r=>r.id===source.id);
            const losses=previous?(['natural','density','starvation','competition','predation','parasitism','waterQuality','climate','hydrology']
              .reduce((sum,key)=>sum+Math.max(0,finite(previous[key])),0)):
              Math.max(0,finite(old[e.a]))*.03;
            const baseline=Math.max(1,finite(initial[e.a]?.count,1));
            quality=minmax(losses/(baseline*.05),0,1.4);
          }
        }
        weighted+=w*quality;total+=w;
      }
      currentFood[n.id]=total?minmax((weighted/total)*habitatFood,0,1.4):habitatFood;
    }
    // Os efeitos da predação são proporcionais à população da presa e à pressão
    // relativa do consumidor, com saturação e teto de segurança numérica.
    const predationLoss={}, predationById={};
    for(const prey of nodes){predationLoss[prey.id]=0;predationById[prey.id]=[];}
    for (const e of links) {
      const prey=byId[e.a],hunter=byId[e.b];
      if(e.nature&&e.nature!=='consumo')continue; // Herbivoria, detritivoria e necrofagia têm mecanismos distintos.
      if(prey.role==='Recurso')continue; // estoque de detritos não tem dinâmica nesta fase
      const victim=old[prey.id]||0,pred=old[hunter.id]||0,predRef=initial[hunter.id]?.count||0;
      if(victim<=0||pred<=0)continue;
      const pressure=minmax(pred/Math.max(1,predRef),0,3);
      const ratio=initial[prey.id]?.count>0?victim/initial[prey.id].count:0;
      const sat=ratio/(.6+ratio);
      const w=minmax(finite(e.weight,.6),.1,1);
      const scenarioBoost=opts.scenario==='predacao'?1+1.8*opts.intensity:1;
      const vazanteExposure=opts.flood.enabled&&opts.flood.phase==='vazante'&&/peixe|mandi|lambari|traíra/i.test(prey.name||'') ? 1+.18*(1-opts.flood.connectivity) : 1;
      const fraction=.038*w*pressure*sat*opts.predation*scenarioBoost*vazanteExposure;
      const take=victim*fraction;
      predationById[prey.id].push({take,consumer:hunter.id});
      predationLoss[prey.id]+=take;
    }
    // Competição interespecífica: somente entre consumidores que compartilham
    // explicitamente um alimento na teia.
    for(const n of nodes){
      const id=n.id, N=old[id],role=roleOf(n),rated=RATE[role]||RATE.Outro;
      const eco=effects[id]||{};
      if(role==='Recurso'){next[id]=0;reports.push({id,name:n.name,role,before:0,after:0,change:0,reason:'Recurso sem contagem de indivíduos: não simulado nesta etapa.',capacity:null,food:null,laggedFood:null,births:0,natural:0,density:0,starvation:0,competition:0,predation:0,climate:0,hydrology:0,waterQuality:0,habitatLabel:null,herbivory:0,explicitCompetition:0,parasitism:0,mutualism:0,pollination:0,dispersal:0});continue;}
      if(recordedUnit(n)){
        // A sample or colony RECORD is not a model population.
        next[id]=N;
        reports.push({id,name:n.name,role,before:N,after:N,change:0,
          reason:'Registro amostral/colônia mantido fixo; escolha índice didático para simular dinâmica biológica.',
          capacity:null,food:null,laggedFood:null,births:0,natural:0,density:0,starvation:0,
          competition:0,explicitCompetition:0,predation:0,herbivory:0,parasitism:0,
          mutualism:0,pollination:0,dispersal:0,partnerBenefit:0,bioticGains:0,
          waterQuality:0,climate:0,hydrology:0,interactionCauses:[],indirectPaths:[]});
        continue;
      }
      const f=currentFood[id],hist=foodHistory[id];
      const idx=Math.max(0,hist.length-1-opts.lag);
      const lagged=opts.lag===0?f:hist[idx];
      const food=role!=='Produtor'?minmax(lagged,0,1.4):1;
      const h=opts.habitats[id]||{},floodCapacity=minmax(finite(h.capacity,1),.4,1.6),floodStress=opts.flood.enabled?minmax(finite(h.stress,0),0,.08):0;
      const waterEffect=opts.biogeoEffects[id]||{};
      const oxygenStress=minmax(finite(waterEffect.oxygenStress,0),0,.25);
      const waterCapacity=minmax(finite(waterEffect.capacityFactor,1),.5,1.5);
      let K=Math.max(2,(initial[id]?.count||N||1)*rated.k*opts.capacity);
      K*=floodCapacity*waterCapacity;
      let climate=0;
      if(role==='Produtor'){
        if(opts.scenario==='seca'){K*=Math.max(.26,1-1.25*opts.intensity);climate=N*.032*opts.intensity;}
        else if(opts.scenario==='recuperacao') K*=1+.85*opts.intensity;
      }
      // A capacidade de suporte de consumidores diminui com alimentos disponíveis,
      // após um atraso demográfico editável.
      if(role!=='Produtor' && (foodsByConsumer[id]||[]).length)K*=minmax(.30+.70*food,.30,1.3);
      if(N<=0){next[id]=0;reports.push({id,name:n.name,role,before:0,after:0,change:0,reason:'Extinto na simulação: sem recrutamento externo.',capacity:K,food:f,laggedFood:food,births:0,natural:0,density:0,starvation:0,competition:0,predation:0,climate:0,hydrology:0,waterQuality:0,habitatLabel:h.label||null,herbivory:0,explicitCompetition:0,parasitism:0,mutualism:0,pollination:0,dispersal:0});continue;}
      const birthFood=role==='Produtor'?1:minmax(.20+.80*food,.05,1.25);
      const births=N*rated.r*opts.reproduction*birthFood*Math.max(0,1-N/Math.max(1,K));
      const natural=N*rated.m;
      const density=N*rated.crowd*Math.max(0,N/K-.55);
      const starvation=role!=='Produtor'?N*.085*Math.max(0,1-food):0;
      const competitorFood=foodsByConsumer[id]||[];
      let competition=0;
      if(competitorFood.length&&opts.competition>0){
        let overlap=0,total=0;
        for(const e of competitorFood){
          const rivalLinks=(consumersByFood[e.a]||[]).filter(other=>other.b!==id&&!explicitCompetitors.has(id+'|'+other.b));
          const w=minmax(finite(e.weight,.6),.1,1);
          total+=w;
          for(const other of rivalLinks){
            const rivalPop=old[other.b]||0;
            const rivalRef=initial[other.b]?.count||1;
            overlap+=w*minmax(finite(other.weight,.6),.1,1)*minmax(rivalPop/Math.max(1,rivalRef),0,2);
          }
        }
        competition=N*.040*opts.competition*Math.min(2,overlap/Math.max(.1,total));
      }
      const predation=Math.min(N*.38,predationLoss[id]||0);
      const herbivory=minmax(finite(eco.herbivory),0,N*.20);
      const explicitCompetition=minmax(finite(eco.competition),0,N*.20);
      const parasitism=minmax(finite(eco.parasitism),0,N*.16);
      const mutualism=minmax(finite(eco.mutualism),0,N*.11);
      const pollination=minmax(finite(eco.pollination),0,N*.11);
      const dispersal=minmax(finite(eco.dispersal),0,N*.11);
      const partnerBenefit=minmax(
        finite(eco.parasiteBenefit)+finite(eco.pollinatorBenefit)+finite(eco.disperserBenefit),0,N*.10);
      // The delayed recruitment bonuses of pollination/dispersal do not represent
      // instant adult tree growth: each step is an abstract recruitment time unit.
      const bioticGains=minmax(mutualism+pollination+dispersal+partnerBenefit,0,N*.15);
      const hydrology=N*floodStress;
      const waterQuality=N*oxygenStress;
      let delta=births+bioticGains-natural-density-starvation-competition-explicitCompetition-predation-herbivory-parasitism-climate-hydrology-waterQuality;
      // Teto explícito para estabilidade do integrador Euler didático.
      delta=minmax(delta,-N*.29,N*.17);
      let result=minmax(N+delta,0,1e6);
      if(result<.35)result=0;
      next[id]=result;
      const causes=[
        [births,'reprodução'],[natural,'mortalidade natural'],[density,'densidade / capacidade de suporte'],
        [starvation,'escassez de alimento'],[competition,'competição por alimento'],
        [predation,'predação de animais'],[herbivory,'herbivoria (redução de recrutamento/tecido vegetal)'],
        [explicitCompetition,'competição direta'],[parasitism,'custo do parasitismo'],
        [climate,'estresse da seca'],
        [hydrology,'restrição de habitat no pulso de inundação'],
        [waterQuality,'estresse por baixo oxigênio na água'],
        [bioticGains,'benefícios ecológicos e recrutamento potencial']
      ].filter(x=>x[0]>.005).sort((a,b)=>b[0]-a[0]);
      const mainLoss=causes.filter(c=>!['reprodução','benefícios ecológicos e recrutamento potencial'].includes(c[1]))[0];
      const reason= delta>0.005?'Cresceu: '+(bioticGains>.005?'reprodução e benefícios ecológicos':'reprodução')+' superaram as perdas'+(food>1.05?' com maior oferta alimentar':'')+'.':
        delta<-.005?'Diminuiu sobretudo por '+(mainLoss?.[1]||'perdas demográficas')+'.':
        'Permaneceu quase estável: ganhos e perdas próximos.';
      reports.push({id,name:n.name,role,before:N,after:result,change:result-N,reason,capacity:K,food:f,laggedFood:food,births,natural,density,starvation,competition,predation,herbivory,explicitCompetition,parasitism,mutualism,pollination,dispersal,partnerBenefit,bioticGains,interactionCauses:eco.causes||[],indirectPaths:eco.indirectPaths||[],climate,
        implicitDiet:!(foodsByConsumer[id]||[]).length&&role!=='Produtor',hydrology,waterQuality,waterCapacity,nutrientFactor:minmax(finite(waterEffect.nutrientFactor,1),.7,1.5),waterReason:waterEffect.reason||'',habitatLabel:h.label||null,habitatNote:h.note||null,habitatCapacity:floodCapacity,floodPhase:opts.flood.enabled?opts.flood.phase:null});
    }
    for(const n of nodes){foodHistory[n.id].push(currentFood[n.id]);popHistory[n.id].push(next[n.id]??0);}
    const nextState={step:(state.step||0)+1,initial,pop:next,foodHistory,popHistory,reports};
    const values=nodes.map(n=>{
      const v=next[n.id]??0,ini=initial[n.id],rounded=Math.round(v),mass=n.role==='Recurso'?ini.mass:
        (ini.mass==null?null:(ini.count>0?Math.round(100*ini.mass*v/ini.count)/100:0));
      return {id:n.id,count:n.role==='Recurso'?0:rounded,mass};
    });
    return {state:nextState,values,reports,options:opts};
  }
  return {init,advance,normalize,roleOf};
});
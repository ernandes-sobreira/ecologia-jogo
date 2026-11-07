/* Teia da Vida — missões ecológicas, etapa 8.
 * Avaliação baseada em ações observáveis e interpretação; NÃO é classificação
 * científica universal, não é calibração e não certifica ocorrência local.
 * Estado do jogo armazenado separadamente das teias para não corromper dados.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaMissions=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const MISSIONS=[
 {id:'cadeia',number:1,title:'Quem alimenta quem?',tag:'Construa uma cadeia',
  story:'O capim alimenta a capivara. A onça pode predar a capivara. Faça a energia percorrer os três organismos.',
  task:'Monte as duas ligações e confirme o sentido biológico do alimento.',
  visuals:['capim','capivara','onca-pintada'],
  question:'Em uma seta alimentar, qual é o sentido do fluxo de energia?',
  options:[
    {id:'a',text:'Do alimento para quem o consome.',valid:true,
      explanation:'Correto: o fluxo de energia parte do recurso ou da presa para o consumidor. A direção visual da seta pode ser editada separadamente no aplicativo.'},
    {id:'b',text:'Do predador para a presa.',valid:false,
      explanation:'Isso inverte a transferência de energia. A onça obtém energia ao consumir a presa, não a fornece à capivara.'},
    {id:'c',text:'A energia retorna integralmente ao capim.',valid:false,
      explanation:'Matéria e nutrientes podem circular. Energia se dissipa em processos metabólicos e não é reciclada integralmente.'}
  ],
  hint:'Na Teia, use “Criar ligação”, clique primeiro num organismo e depois no outro. Escolha Herbivoria para capim–capivara e Consumo para capivara–onça; confirme quem é o alimento.'},
 {id:'alternativas',number:2,title:'Uma teia com alternativas',tag:'Mais de uma fonte',
  story:'Um lambari enfrenta mudanças na oferta de alimentos. Conecte ao menos dois recursos alimentares plausíveis, sem presumir que isso garanta estabilidade.',
  task:'Amplie a dieta desenhada do lambari, execute alguns passos e interprete o resultado.',
  visuals:['zooplancton','lambari','larvas-insetos-aquaticos'],
  question:'O que duas fontes alimentares podem significar para a população?',
  options:[
    {id:'a',text:'Podem amortecer a perda de um recurso, dependendo da dieta e do ambiente.',valid:true,
      explanation:'Exato: fontes alternativas podem reduzir dependência, mas a estabilidade depende da disponibilidade, da preferência alimentar e de outras interações.'},
    {id:'b',text:'A população ficará estável em qualquer seca.',valid:false,
      explanation:'Não há garantia de estabilidade: os recursos podem cair juntos, a predação pode aumentar e a dieta varia entre espécies e estágios.'},
    {id:'c',text:'Mais setas sempre indicam maior biodiversidade.',valid:false,
      explanation:'Número de setas não é riqueza de espécies. A rede contém também grupos, comunidades e recursos.'}
  ],
  hint:'O cenário já oferece zooplâncton → lambari. Falta ligar larvas de insetos aquáticos → lambari como alimento adicional. Depois vá a Simulações e avance pelo menos seis passos.'},
 {id:'cheia',number:3,title:'A enchente chegou!',tag:'Pulso de inundação',
  story:'A água sobe na planície. Observe a conectividade e investigue como peixes e habitats aquáticos podem responder.',
  task:'Ative o pulso e alcance a fase de cheia na simulação.',
  visuals:['aguape-florido','lambari','jacare'],
  question:'Qual previsão é coerente com o pulso de inundação nesta representação?',
  options:[
    {id:'a',text:'A conectividade lateral pode aumentar o acesso de peixes a habitats alagados.',valid:true,
      explanation:'Correto: a conectividade pode abrir acesso a áreas de alimentação, crescimento ou refúgio; a resposta demográfica não é igual em todas as espécies.'},
    {id:'b',text:'Todos os peixes necessariamente duplicam sua abundância.',valid:false,
      explanation:'Não: abundância depende de alimento, reprodução, movimentação, predação e outros fatores; não há crescimento obrigatório.'},
    {id:'c',text:'Toda enchente provoca dequada e morte dos peixes.',valid:false,
      explanation:'Dequada depende de um conjunto de condições físicas, químicas e biológicas; não ocorre em qualquer inundação.'}
  ],
  hint:'Abra Simulações, deixe o Pulso ligado, selecione Enchente como fase inicial e avance até um passo entre 15 e 29 para observar a Cheia.'},
 {id:'dequada',number:4,title:'A lagoa está sem ar',tag:'Investigue a dequada',
  story:'Uma subida das águas pode submergir matéria orgânica. Teste como sua decomposição e a reaeração podem afetar o oxigênio.',
  task:'Faça o experimento com carga orgânica elevada e explique o que causou a queda do oxigênio.',
  visuals:['serapilheira','bacterias-decompositoras','lambari'],
  question:'Qual hipótese explica a queda do oxigênio no cenário testado?',
  options:[
    {id:'a',text:'A decomposição microbiana pode consumir oxigênio mais rapidamente do que ele é reposto.',valid:true,
      explanation:'Correto: matéria orgânica, atividade microbiana, fotossíntese e reaeração influenciam o balanço de oxigênio. O alerta do jogo é conceitual.'},
    {id:'b',text:'Peixes consomem toda a água durante a enchente.',valid:false,
      explanation:'Peixes não consomem a água do ambiente. O oxigênio varia devido a processos como respiração, decomposição e trocas com a atmosfera.'},
    {id:'c',text:'A cheia sempre elimina bactérias e aumenta o oxigênio.',valid:false,
      explanation:'A inundação pode disponibilizar matéria orgânica para decomposição e, em algumas circunstâncias, aumentar a demanda por oxigênio.'}
  ],
  hint:'O cenário já tem serapilheira ligada a decompositores. Em Simulações, aplique a carga orgânica elevada, com maior atividade microbiana e pouca reaeração, e acompanhe o oxigênio.'},
 {id:'ecologo',number:5,title:'Torne-se um ecólogo',tag:'Audite sua pesquisa',
  story:'Uma teia de pesquisa contém uma ligação incoerente. Encontre-a, corrija o desenho e interprete o que a literatura consegue — ou não — validar.',
  task:'Revise a ligação incorreta, confirme uma cadeia alimentar e consulte uma evidência regional.',
  visuals:['capim','onca-pintada','fungos'],
  question:'O estudo que encontrou capivaras na dieta de onças permite concluir o quê?',
  options:[
    {id:'a',text:'A relação foi registrada, mas a taxa de predação usada pelo jogo continua hipotética.',valid:true,
      explanation:'Exato. Evidência de ocorrência ou frequência de presas não é parâmetro de mortalidade de capivaras por passo do simulador.'},
    {id:'b',text:'Todas as onças comem apenas capivaras.',valid:false,
      explanation:'Onças têm dietas variadas. Uma presa encontrada em estudo não demonstra exclusividade alimentar.'},
    {id:'c',text:'O parâmetro numérico do jogo está validado pelo artigo.',valid:false,
      explanation:'O artigo não calibra automaticamente coeficientes de reprodução, ataque ou mortalidade do motor do jogo.'}
  ],
  hint:'Abra Auditoria, encontre a ligação de “Decomposição” que conecta organismos incompatíveis e exclua-a. Preserve a cadeia capim → capivara → onça; depois consulte a aba Ciência.'}
 ];
 const byId=Object.fromEntries(MISSIONS.map(m=>[m.id,m]));
 const food=(edges,nature,prey,consumer)=>{
  return edges.some(e=>e.kind!=='indireta'&&
    (e.nature===nature||(nature==='herbivoria'&&e.nature==='consumo'))&&
    e.foodId===prey&&[e.a,e.b].includes(prey)&&[e.a,e.b].includes(consumer)&&e.a!==e.b);
 };
 const obj=(label,ok,detail)=>({label,ok:!!ok,detail});
 function evaluate(id,context={},answer=null){
  const mission=byId[id];if(!mission)throw Error('Missão não encontrada.');
  const nodes=context.graph?.nodes||[],edges=context.graph?.edges||[];
  const bySlug=Object.fromEntries(nodes.map(n=>[context.catalog?.find(s=>s.id===n.specId)?.slug||n.slug||'?',n]));
  const loc=slug=>bySlug[slug]?.id;
  let objectives=[];
  const step=Math.max(0,Number(context.step)||0);
  if(id==='cadeia'){
   objectives=[
    obj('Três organismos na cadeia',!!loc('capim')&&!!loc('capivara')&&!!loc('onca-pintada'),
      'Capim, capivara e onça devem estar no desenho.'),
    obj('Capim alimenta a capivara',!!(loc('capim')&&loc('capivara')&&
       edges.some(e=>e.kind!=='indireta'&&e.nature==='herbivoria'&&e.foodId===loc('capim')&&
       [e.a,e.b].includes(loc('capivara'))&&[e.a,e.b].includes(loc('capim')))),
       'Faça uma relação de Herbivoria e escolha o capim como alimento.'),
    obj('Capivara alimenta a onça',!!(loc('capivara')&&loc('onca-pintada')&&
        food(edges,'consumo',loc('capivara'),loc('onca-pintada'))),
       'Faça uma relação de Consumo e identifique a capivara como presa.')
   ];
  }else if(id==='alternativas'){
   const consumer=loc('lambari');
   const foods=new Set(edges.filter(e=>e.kind!=='indireta'&&
     ['consumo','herbivoria'].includes(e.nature)&&consumer&&[e.a,e.b].includes(consumer)&&
     [e.a,e.b].includes(e.foodId)&&e.foodId!==consumer).map(e=>e.foodId));
   objectives=[
    obj('Lambari com recursos alimentares',!!consumer&&!!loc('zooplancton')&&!!loc('larvas-insetos-aquaticos'),
      'Inclua lambari, zooplâncton e larvas de insetos aquáticos.'),
    obj('Duas fontes distintas ligadas ao lambari',foods.size>=2,
      'Crie ligações diretas de consumo com duas fontes diferentes e identifique cada alimento.'),
    obj('Populações observadas no simulador',step>=6,
      'Execute pelo menos seis passos para observar como a comunidade responde.')
   ];
  }else if(id==='cheia'){
   const hydro=context.hydro;
   objectives=[
    obj('Há ambiente aquático representado',!!loc('fitoplancton')&&!!loc('lambari'),
      'Inclua uma comunidade produtora e um peixe no cenário.'),
    obj('Pulso de inundação ligado',!!hydro?.enabled,
      'Ative o Pulso de inundação na aba Simulações.'),
    obj('Cheia observada no gráfico',step>=15&&hydro?.phase==='cheia'&&Number(hydro.connectivity)>.65,
      'Avance até a Cheia (passos 15–29 no ciclo padrão) e examine a conectividade.')
   ];
  }else if(id==='dequada'){
   const det=loc('serapilheira'),bacteria=loc('bacterias-decompositoras'),fungi=loc('fungos');
   const decomp=edges.some(e=>e.kind!=='indireta'&&e.nature==='decomposicao'&&
     [e.a,e.b].includes(det)&&([e.a,e.b].includes(bacteria)||[e.a,e.b].includes(fungi)));
   const oxy=Number(context.bio?.oxygen);
   objectives=[
    obj('Matéria orgânica ligada a decompositores',!!det&&decomp,
      'Use serapilheira e conecte-a diretamente a bactérias ou fungos como Decomposição.'),
    obj('Experimento limnológico ativado',context.bioEnabled===true&&context.pulseEnabled===true,
      'Ative os módulos de decomposição e pulso de inundação.'),
    obj('Queda do índice de oxigênio observada',step>=8&&context.bio!=null&&
      Number.isFinite(oxy)&&oxy<40,
      'Ajuste carga orgânica, atividade microbiana e reaeração e avance até observar O₂ abaixo de 40/100.')
   ];
  }else if(id==='ecologo'){
   const issues=context.audit?.issues||[];
   const invalid=issues.filter(x=>x.code==='invalid-relation'||x.code==='missing-node'||
     x.code==='resource-eater'||x.code==='self-link').length;
   const claims=context.evidence?.assessments||[];
   const supported=claims.some(x=>x.status==='pantanal'&&
     edges.some(e=>e.id===x.edgeId&&
       [e.a,e.b].includes(loc('capivara'))&&[e.a,e.b].includes(loc('onca-pintada'))));
   objectives=[
    obj('Teia contém cadeia alimentar confirmada',!!loc('capim')&&!!loc('capivara')&&!!loc('onca-pintada')&&
      food(edges,'consumo',loc('capivara'),loc('onca-pintada')),
      'Preserve a relação capivara → onça com a presa identificada.'),
    obj('Sem ligação estruturalmente incoerente',issues.length>=0&&
      context.audit!=null&&invalid===0,
      'Abra Auditoria e revise ou exclua relações marcadas como incompatíveis.'),
    obj('Há evidência regional diferenciada de hipótese',supported,
      'Mantenha a relação onça–capivara e consulte sua ficha na aba Ciência.')
   ];
  }
  const selected=mission.options.find(c=>c.id===answer);
  const answerCorrect=!!selected?.valid;
  return {id,mission,objectives,passed:objectives.filter(x=>x.ok).length,
    total:objectives.length,choice:answer||null,choiceCorrect:answerCorrect,
    choiceExplanation:selected?.explanation||'Escolha uma interpretação para receber devolutiva.',
    complete:objectives.length>0&&objectives.every(x=>x.ok)&&answerCorrect};
 }
 function buildPreset(id,catalog=[]){
  if(!byId[id])throw Error('Missão não encontrada');
  const presets={
   cadeia:['capim','capivara','onca-pintada'],
   alternativas:['fitoplancton','zooplancton','larvas-insetos-aquaticos','lambari','traira'],
   cheia:['capim','fitoplancton','zooplancton','lambari','jacare'],
   dequada:['capim','serapilheira','fungos','bacterias-decompositoras','fitoplancton','zooplancton','lambari','traira'],
   ecologo:['capim','capivara','onca-pintada','serapilheira','fungos']
  };
  const slugs=presets[id],by=Object.fromEntries(catalog.map(s=>[s.slug,s]));
  const nodes=slugs.map((slug,i)=>{
   const s=by[slug];if(!s)throw Error('Elemento ausente do catálogo: '+slug);
   return {id:'mission-'+id+'-'+slug,specId:s.id,slug:s.slug,name:s.name,role:s.role,
     count:s.role==='Recurso'?0:s.count,mass:s.mass,
     x:.17+(i%3)*.32,y:.18+Math.floor(i/3)*Math.min(.23,.58/Math.max(1,Math.floor((slugs.length-1)/3)))};
  });
  const nodeIds=Object.fromEntries(nodes.map(n=>[n.slug,n.id])),edges=[];
  const link=(a,b,nature,extra={})=>{
   if(!nodeIds[a]||!nodeIds[b])throw Error('O cenário está incompleto.');
   const e={id:'mission-edge-'+id+'-'+edges.length,a:nodeIds[a],b:nodeIds[b],
     kind:'direta',direction:'forward',nature,weight:.65,color:nature==='decomposicao'?'#91764e':'#158957'};
   if(extra.food)e.foodId=nodeIds[extra.food];
   if(extra.actor)e.actorId=nodeIds[extra.actor];
   edges.push(e);
  };
  if(id==='alternativas'){
   link('fitoplancton','zooplancton','herbivoria',{food:'fitoplancton'});
   link('zooplancton','lambari','consumo',{food:'zooplancton'});
   link('lambari','traira','consumo',{food:'lambari'});
  }else if(id==='cheia'){
   link('fitoplancton','zooplancton','herbivoria',{food:'fitoplancton'});
   link('zooplancton','lambari','consumo',{food:'zooplancton'});
   link('lambari','jacare','consumo',{food:'lambari'});
  }else if(id==='dequada'){
   link('serapilheira','fungos','decomposicao');
   link('serapilheira','bacterias-decompositoras','decomposicao');
   link('fitoplancton','zooplancton','herbivoria',{food:'fitoplancton'});
   link('zooplancton','lambari','consumo',{food:'zooplancton'});
   link('lambari','traira','consumo',{food:'lambari'});
  }else if(id==='ecologo'){
   link('capim','capivara','herbivoria',{food:'capim'});
   link('capivara','onca-pintada','consumo',{food:'capivara'});
   link('serapilheira','fungos','decomposicao');
   link('capim','onca-pintada','decomposicao'); // Intentional invalid link.
  }
  return {nodes,edges};
 }
 function initialProgress(){return {version:8,completed:[],active:null,presetActive:null,answers:{},started:[]};}
 function normalizeProgress(value){
  const p=initialProgress();
  if(!value||typeof value!=='object')return p;
  const ids=new Set(MISSIONS.map(x=>x.id));
  p.completed=Array.isArray(value.completed)?[...new Set(value.completed.filter(x=>ids.has(x)))]:[];
  p.started=Array.isArray(value.started)?[...new Set(value.started.filter(x=>ids.has(x)))]:[];
  p.active=ids.has(value.active)?value.active:null;
  p.presetActive=ids.has(value.presetActive)?value.presetActive:null;
  p.answers={};
  if(value.answers&&typeof value.answers==='object'){
   for(const m of MISSIONS){
    if(m.options.some(o=>o.id===value.answers[m.id]))p.answers[m.id]=value.answers[m.id];
   }
  }
  return p;
 }
 const unlocked=(id,progress)=>{
  const i=MISSIONS.findIndex(m=>m.id===id);if(i<0)return false;
  return i===0||progress.completed.includes(MISSIONS[i-1].id);
 };
 const next=id=>MISSIONS[MISSIONS.findIndex(x=>x.id===id)+1]?.id||null;
 return {MISSIONS,byId,buildPreset,evaluate,unlocked,next,initialProgress,normalizeProgress};
});
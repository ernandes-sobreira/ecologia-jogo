/* Teia da Vida — auditoria científica didática, etapa 6.
   NÃO certifica exatidão de campo nem identifica espécies automaticamente.
   Nível trófico: aproximação 1 + média dos níveis das presas, apenas
   quando uma cadeia direta de CONSUMO entre organismos alcança produtores.
   Detritos e recursos são vias distintas. Não somar relações indiretas.
*/
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaAudit=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const FEEDING=new Set(['consumo','herbivoria','detritivoria','necrofagia']);
 const DIRECT=new Set(['consumo','herbivoria','detritivoria','necrofagia','competicao',
  'parasitismo','mutualismo','polinizacao','dispersao','decomposicao']);
 const groupOrder={erro:0,revisar:1,contexto:2};
 const finite=x=>Number.isFinite(Number(x))?Math.max(0,Number(x)):0;
 const note=(severity,code,title,detail,target=null,suggestion='')=>
  ({severity,code,title,detail,target,suggestion});
 function analyze(nodes=[],edges=[],catalog=[],deps={}){
  const by=Object.fromEntries(nodes.filter(n=>n&&n.id).map(n=>[n.id,n]));
  const byCatalog=Object.fromEntries(catalog.map(x=>[x.id,x]));
  const metrics=deps.metrics,interactions=deps.interactions;
  const identity=n=>metrics?.resolve?.(n,byCatalog[n.specId])||
   {kind:n.role==='Recurso'?'recurso':'taxon',unit:'unidades',speciesNamed:false};
  const resource=n=>n?.role==='Recurso'||identity(n).kind==='recurso';
  const producer=n=>!resource(n)&&n?.role==='Produtor';
  const living=nodes.filter(n=>n&&n.id&&!resource(n));
  const found=[], strengths=[], valid=[], invalid=[], indirect=[];
  const add=(sev,code,title,detail,target=null,suggestion='')=>
    found.push(note(sev,code,title,detail,target,suggestion));
  if(!nodes.length){
   add('contexto','empty','Teia ainda vazia',
    'A auditoria começa quando você adiciona elementos e ligações.',
    null,'Adicione produtores e consumidores, depois escolha relações e seus papéis.');
   return {status:'vazia',label:'Comece sua teia',issues:found,strengths:[],metrics:
    {elements:0,living:0,resources:0,direct:0,trophic:0,indirect:0,isolated:0,components:0,partialSpecies:0,feedingLinksPerCompartment:null},
    levels:[],pathways:[],components:[],isolates:[],foodEdges:[],documentation:[]};
  }
  const suspiciousSelf=new Set();
  const duplicates=new Set();
  const allLinks=[];
  for(const e of edges){
   const a=by[e?.a],b=by[e?.b],eid=e?.id||'';
   const pair=a&&b?a.name+' / '+b.name:String(e?.a||'?')+' / '+String(e?.b||'?');
   if(!a||!b){
    invalid.push(e);
    add('erro','missing-node','Relação sem elemento de origem ou destino',
      'A ligação '+pair+' aponta para um nó que não existe mais.',
      {edgeId:eid},'Exclua a ligação quebrada ou recrie os dois participantes.');
    continue;
   }
   if(a.id===b.id){
    invalid.push(e);
    if(!suspiciousSelf.has(a.id)){
     suspiciousSelf.add(a.id);
     add('revisar','self-link','Relação de um elemento consigo mesmo',
      a.name+' foi ligado ao próprio nó. Canibalismo e autorrelações existem, mas este editor não distingue indivíduos de uma mesma população.',
      {edgeId:eid},'Especifique o processo ou use dois compartimentos biológicos distintos.');
    }
    continue;
   }
   if(e.kind==='indireta'){indirect.push(e);continue}
   if(!DIRECT.has(e.nature)){
    invalid.push(e);
    add('contexto','unmodelled-link','Ligação sem mecanismo ecológico definido',
      a.name+' / '+b.name+' usa “Outra”, sem efeito calculado.',{edgeId:eid},
      'Escolha o mecanismo que melhor descreve a interação, se houver evidência.');
    continue;
   }
   const check=interactions?.validate?.(nodes,e);
   if(check&&check.valid===false){
    invalid.push(e);
    add('revisar','invalid-relation','Relação precisa ser revisada',
     a.name+' / '+b.name+': '+check.reason,{edgeId:eid},
     'Abra a seta e confira os organismos, o tipo de relação e seus papéis.');
    continue;
   }
   if(['amostras','colonias'].includes(identity(a).unit)||['amostras','colonias'].includes(identity(b).unit)){
    invalid.push(e);
    add('revisar','sampling-link','Amostras não são populações demográficas',
     a.name+' / '+b.name+' contém uma contagem registrada de amostras/colônias; não equivale à abundância de organismos.',
     {edgeId:eid},'Se quer simular a comunidade, use um índice didático em vez de número de amostras.');
    continue;
   }
   const symmetricPair=[e.a,e.b].sort().join('|');
   const food=e.foodId===e.a?e.a:e.foodId===e.b?e.b:null;
   const eater=food?(food===e.a?e.b:e.a):null;
   // Predação recíproca representa dois fluxos distintos, não ligações duplicadas.
   const dedupe=FEEDING.has(e.nature)&&food?
    food+'>'+eater+'|'+e.nature:
    e.nature==='parasitismo'&&[e.a,e.b].includes(e.actorId)?
      e.actorId+'>'+([e.a,e.b].find(id=>id!==e.actorId))+'|'+e.nature:
      symmetricPair+'|'+e.nature;
   if(duplicates.has(dedupe)){
    add('revisar','duplicate','Interação duplicada entre dois elementos',
     a.name+' / '+b.name+' já têm ligação direta do mesmo tipo.',
     {edgeId:eid},'Confirme se são processos distintos; caso contrário, mantenha só uma ligação.');
    continue; // do not double-count
   }
   duplicates.add(dedupe);
   valid.push(e);allLinks.push([e.a,e.b]);
   if(FEEDING.has(e.nature)){
    const foodId=e.foodId;
    const food=foodId===e.a?a:foodId===e.b?b:null;
    if(!food){
     const ra=(resource(a)?0:producer(a)?1:a.role==='Predador'?4:a.role==='Consumidor'?2:3);
     const rb=(resource(b)?0:producer(b)?1:b.role==='Predador'?4:b.role==='Consumidor'?2:3);
     const ambiguous=ra===rb;
     add(ambiguous?'revisar':'contexto','food-unspecified',
      'Alimento ou presa não confirmado',
      'Na ligação '+pair+', o campo “Quem é o alimento/presa?” não está gravado. '+
       (ambiguous?'Não é seguro deduzir pela categoria funcional.':'O aplicativo pode inferir provisoriamente, mas a inferência precisa ser confirmada.'),
      {edgeId:eid},'Abra a seta e selecione explicitamente o elemento consumido.');
    }else{
     const eater=food.id===a.id?b:a;
     if(resource(eater)){
      add('erro','resource-eater','Recurso não vivo identificado como consumidor',
       eater.name+' não é um organismo consumidor.',{edgeId:eid},
       'Inverta o alimento e o consumidor ou corrija a natureza da ligação.');
     }
     if(e.nature==='consumo'&&producer(food)){
      add('revisar','plant-predation','Consumo vegetal registrado como predação',
       'A relação '+food.name+' → '+eater.name+' é provavelmente herbivoria, não caça de animais.',
       {edgeId:eid},'Use Herbivoria se a fonte alimentar for vegetação ou fitoplâncton.');
     }
    }
   }
   if(['polinizacao','dispersao'].includes(e.nature)){
    const actor=by[e.actorId]||(e.nature==='polinizacao'?
      (a.role==='Polinizador'?a:b.role==='Polinizador'?b:null):null);
    const host=actor?(actor.id===a.id?b:a):null;
    if(host&&resource(host)){
     add('contexto','plant-not-identified','Recurso reprodutivo sem planta identificada',
      a.name+' / '+b.name+' representa flor, fruto ou semente, mas não identifica necessariamente qual espécie vegetal se reproduz.',
      {edgeId:eid},'Conecte também a planta pertinente para investigar seu recrutamento.');
    }
   }
  }
  const neighborhood=new Map(nodes.map(n=>[n.id,new Set()]));
  for(const [a,b] of allLinks){neighborhood.get(a)?.add(b);neighborhood.get(b)?.add(a)}
  const isolates=nodes.filter(n=>!neighborhood.get(n.id)?.size).map(n=>({id:n.id,name:n.name,resource:resource(n)}));
  const livingIsolates=isolates.filter(x=>!x.resource);
  if(livingIsolates.length){
   add('revisar','isolated','Elementos biológicos sem relações diretas',
    livingIsolates.map(x=>x.name).slice(0,7).join(', ')+(livingIsolates.length>7?' e outros':'')+
    '. Estarem isolados no desenho não significa que estejam isolados na natureza.',
    {nodeId:livingIsolates[0].id},'Inclua relações biologicamente justificadas ou explique por que ficaram fora da subteia.');
  }
  const seen=new Set(),components=[];
  for(const n of nodes){
   if(seen.has(n.id))continue;
   const stack=[n.id],component=[];
   while(stack.length){
    const x=stack.pop();if(seen.has(x))continue;seen.add(x);component.push(x);
    for(const y of neighborhood.get(x)||[])if(!seen.has(y))stack.push(y);
   }
   components.push(component);
  }
  if(components.length>1&&valid.length){
   add('contexto','disconnected','Teia com sub-redes desconectadas',
    'Há '+components.length+' componentes na rede desenhada. Isso pode ser legítimo em habitats distintos, mas vale indicar se a separação foi intencional.',
    {nodeId:components.sort((a,b)=>a.length-b.length)[0][0]},
    'Conecte apenas quando existir interação documentada; evite inventar elos para completar o desenho.');
  }
  const named=metrics?.analyze?.(nodes,catalog);
  if(named?.unidentified){
   add('contexto','taxonomy','Riqueza de espécies não pode ser calculada',
    named.unidentified+' compartimentos são grupos, comunidades ou táxons não identificados a espécie. '+
    'Os '+named.speciesNamed+' nomes binomiais declarados não são a riqueza total.',
    null,'Informe espécies e método de amostragem antes de calcular S ou índices de diversidade.');
  }
  if((named?.units?.amostras||0)+(named?.units?.colonias||0)>0){
   add('contexto','mixed-units','Contagem amostral não equivale a abundância',
    'Números de amostras e colônias não devem ser somados aos de indivíduos e não simulam crescimento biológico.',
    null,'Use índices para grupos e comunidades; mantenha amostras como registros fixos.');
  }
  const documented=nodes.filter(n=>!resource(n)&&identity(n).unit==='individuos');
  const protocols=documented.map(n=>identity(n).samplingEffort).filter(Boolean);
  if(documented.length&&protocols.length<documented.length){
   add('contexto','sampling-effort','Esforço amostral não informado para todas as contagens',
    (documented.length-protocols.length)+' de '+documented.length+
    ' compartimentos em indivíduos não têm descrição de área, tempo ou método.',
    null,'Preencha o esforço amostral ao editar cada elemento se pretende comparar observações.');
  }
  const trophicEdges=[],detritalEdges=[],inferred=[];
  for(const e of valid){
   if(!FEEDING.has(e.nature))continue;
   let food=by[e.foodId];
   if(!food||!(food.id===e.a||food.id===e.b)){
    const a=by[e.a],b=by[e.b];
    const rank=n=>resource(n)?0:producer(n)?1:n.role==='Predador'?4:
     n.role==='Consumidor'?2:3;
    food=rank(a)<rank(b)?a:rank(b)<rank(a)?b:null;
    if(food)inferred.push(e.id);
   }
   if(!food)continue;
   const eater=food.id===e.a?by[e.b]:by[e.a];
   if(!eater||resource(eater))continue;
   const mechanism=e.nature==='consumo'&&producer(food)?'herbivoria':e.nature;
   const link={foodId:food.id,consumerId:eater.id,nature:mechanism,edgeId:e.id,
    source:food.name,destination:eater.name,inferred:inferred.includes(e.id)};
   if(mechanism==='consumo'&&producer(eater)){
    add('revisar','producer-consuming','Produtor registrado como consumidor de animal',
     eater.name+' aparece consumindo '+food.name+'. Pode haver mixotrofia ou uma inversão de papéis; a classificação precisa ser conferida.',
     {edgeId:e.id},'Confirme os papéis ecológicos e o alimento registrado.');
   }
   if(['detritivoria','necrofagia'].includes(mechanism)||resource(food)){
    detritalEdges.push(link);continue;
   }
   if(mechanism==='herbivoria'&&!producer(food))continue;
   if(!resource(food)&&!resource(eater))trophicEdges.push(link);
  }
  const basal=nodes.filter(producer);
  if(!basal.length&&trophicEdges.length){
   add('contexto','basal-missing','Não há produtor primário representado',
    'Nenhum produtor foi adicionado à teia. Isso não invalida uma subteia detrital ou recorte de consumidores, mas impede rastrear os níveis a partir de produtores.',
    null,'Para representar produção primária, adicione um produtor apenas se fizer parte do seu recorte.');
  }
  const inEdges=new Map(nodes.map(n=>[n.id,[]]));
  for(const l of trophicEdges)inEdges.get(l.consumerId)?.push(l);
  const memo=new Map(),cycles=new Set(),unknown=new Set();
  function getLevel(id,stack=new Set()){
   if(memo.has(id))return memo.get(id);
   if(stack.has(id)){
    for(const a of stack)cycles.add(a);cycles.add(id);
    return null;
   }
   const n=by[id];if(!n||resource(n))return null;
   if(producer(n)){
    const res={value:1,partial:false,paths:0,knownPrey:0,totalPrey:0};memo.set(id,res);return res;
   }
   const prey=inEdges.get(id)||[];
   if(!prey.length)return null;
   const next=new Set(stack);next.add(id);
   const levels=prey.map(p=>getLevel(p.foodId,next));
   const known=levels.filter(Boolean);
   if(!known.length)return null;
   const value=1+known.reduce((sum,l)=>sum+l.value,0)/known.length;
   const res={value,partial:known.length<prey.length||known.some(l=>l.partial),
    paths:1+Math.max(...known.map(l=>l.paths)),knownPrey:known.length,totalPrey:prey.length};
   memo.set(id,res);return res;
  }
  const levels=[];
  for(const n of living){
   const r=getLevel(n.id);
   levels.push({id:n.id,name:n.name,role:n.role,kind:identity(n).kind,
     level:r?.value==null?null:Math.round(r.value*100)/100,
     partial:!!r?.partial,steps:r?.paths??null,
     knownPrey:r?.knownPrey??0,totalPrey:(inEdges.get(n.id)||[]).length,
     status:producer(n)?'produtor':r?(r.partial?'parcial':'estimado'):'não estimado'});
   if(!r&&!producer(n))unknown.add(n.id);
  }
  const cycleSeen=new Set();
  function detectCycle(id,visited=new Set(),active=new Set()){
   if(active.has(id)){cycleSeen.add(id);return}
   if(visited.has(id))return;visited.add(id);active.add(id);
   for(const e of inEdges.get(id)||[])detectCycle(e.foodId,visited,active);
   active.delete(id);
  }
  const visited=new Set();for(const n of living)detectCycle(n.id,visited,new Set());
  const cyclicLevels=new Set([...cycleSeen,...cycles]);
  // A closed cycle has no uniquely determined level from its own prey average.
  // Never show a precise numeric level for a compartment involved in a detected cycle.
  for(const item of levels){
   if(!cyclicLevels.has(item.id))continue;
   item.level=null;item.partial=true;item.status='ciclo: não estimado';
   unknown.add(item.id);
  }
  if(cycleSeen.size||cycles.size){
   add('revisar','trophic-cycle','Circuito alimentar que exige interpretação',
    'Um ou mais consumidores têm uma cadeia circular de relações alimentares. Canibalismo ou predação recíproca podem ocorrer; a posição trófica não é estimada com segurança para esses caminhos.',
    {nodeId:[...cycleSeen,...cycles][0]},'Confira a dieta, as fases de vida e quem foi registrado como alimento.');
  }
  if(unknown.size&&trophicEdges.length){
   const names=[...unknown].map(id=>by[id]?.name).filter(Boolean);
   add('contexto','unknown-level','Níveis tróficos não estimados para todos',
    names.slice(0,6).join(', ')+(names.length>6?' e outros':'')+
    ': não existe uma cadeia direta suficiente que chegue a produtores, ou há ciclos.',
    {nodeId:[...unknown][0]},'Adicione somente elos alimentares demonstráveis e confirme os alimentos selecionados.');
  }
  const withoutFoods=living.filter(n=>n.role==='Predador'&&!(inEdges.get(n.id)||[]).length);
  if(withoutFoods.length){
   add('revisar','predator-no-food','Predador sem presa representada',
    withoutFoods.map(n=>n.name).join(', ')+
    '. Isso não significa que o animal não se alimenta, apenas que sua dieta ficou fora do desenho.',
    {nodeId:withoutFoods[0].id},'Inclua uma presa plausível e indique-a como alimento, se fizer parte da teia.');
  }
  if(!valid.length&&nodes.length>1){
   add('revisar','no-interactions','Ainda não há relações ecológicas diretas válidas',
    'Há elementos no diagrama, mas nenhuma interação foi reconhecida como funcional.',
    null,'Clique em “Criar ligação” e defina o tipo da relação para ao menos um par.');
  }
  const allIndirect=[];
  for(const e of indirect){
   const a=by[e.a],b=by[e.b];
   if(!a||!b)continue;
   const mediators=nodes.filter(m=>m.id!==a.id&&m.id!==b.id&&
    neighborhood.get(a.id)?.has(m.id)&&neighborhood.get(b.id)?.has(m.id));
   if(!mediators.length){
    add('revisar','indirect-unmediated','Relação indireta sem mediador registrado',
     a.name+' / '+b.name+' não tem um caminho de duas relações diretas que a conecte.',
     {edgeId:e.id},'Inclua os mecanismos intermediários ou trate-a como hipótese ainda não demonstrada.');
   }
   allIndirect.push({edgeId:e.id,a:a.name,b:b.name,mediators:mediators.map(x=>x.name)});
  }
  const linksPer= living.length>0?Math.round(trophicEdges.length/living.length*100)/100:null;
  if(valid.length>0)strengths.push('Há '+valid.length+' relações ecológicas diretas representadas.');
  if(basal.length&&trophicEdges.some(x=>producer(by[x.foodId])))
   strengths.push('A rede inclui alimentação a partir de produtores primários.');
  if(detritalEdges.length)strengths.push('Foram representadas '+detritalEdges.length+' ligações com recursos ou vias detritais.');
  if(levels.some(x=>x.level>=3))strengths.push('Há caminhos com consumidores em níveis tróficos superiores, estimados provisoriamente.');
  if(!livingIsolates.length&&valid.length)strengths.push('Todos os compartimentos biológicos têm ao menos uma ligação direta reconhecida.');
  if(indirect.length&&allIndirect.some(x=>x.mediators.length))
   strengths.push('A rede registra uma hipótese de efeito indireto com mediador desenhado.');
  const priority=found.filter(f=>f.severity==='erro').length;
  const review=found.filter(f=>f.severity==='revisar').length;
  const status=priority?'estrutura':review?'revisar':'exploravel';
  const label=priority?'Corrigir estrutura':review?'Relações a revisar':
    'Estrutura explorável';
  found.sort((a,b)=>groupOrder[a.severity]-groupOrder[b.severity]||a.title.localeCompare(b.title,'pt-BR'));
  return {status,label,issues:found,strengths,
   metrics:{elements:nodes.length,living:living.length,resources:nodes.length-living.length,
    direct:valid.length,trophic:trophicEdges.length,detrital:detritalEdges.length,
    indirect:indirect.length,isolated:livingIsolates.length,components:components.length,
    partialSpecies:named?.speciesNamed||0,feedingLinksPerCompartment:linksPer},
   levels,foodEdges:trophicEdges,detritalEdges,pathways:allIndirect,
   components:components.map(ids=>ids.map(id=>by[id].name)),isolates,
   documentation:named?.issues||[],producers:basal.map(n=>n.name)};
 }
 return {analyze};
});
/* Teia da Vida — interações ecológicas, etapa 4.
   Parâmetros ilustrativos e efeitos por passo abstrato; não são estimativas do Pantanal.
   A direção gráfica (edge.direction) nunca altera quem come, parasita, poliniza ou dispersa.
   Uma relação indireta é uma HIPÓTESE de mediação: efeitos emergem de duas relações diretas,
   não se acrescenta um novo fluxo para não contar o mesmo processo duas vezes. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.TeiaInteractions=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const cap=(x,a,b)=>Math.max(a,Math.min(b,Number.isFinite(+x)?+x:a));
  const normalizeNature=n=>(['consumo','herbivoria','detritivoria','necrofagia','competicao',
      'parasitismo','mutualismo','polinizacao','dispersao','decomposicao','outro'].includes(n)?n:'outro');
  const normalizeName=n=>String(n?.name||'').toLowerCase();
  const plant=n=>n?.role==='Produtor'||/fitoplâncton|perifíton|aguapé|vitória-régia|acuri|ipê|cambará|carandá|capim/i.test(normalizeName(n));
  const detritus=n=>n?.role==='Recurso'&&/serapilheira|fezes|detrito|carcaça|madeira morta|folhas mortas/i.test(normalizeName(n));
  const ranked=n=>{
    if(n?.role==='Recurso')return 0;
    if(plant(n))return 1;
    if(n?.role==='Predador')return 4;
    if(n?.role==='Necrófago'||n?.role==='Parasita')return 3;
    return 2;
  };
  const trophic=new Set(['consumo','herbivoria','detritivoria','necrofagia']);
  const positive=new Set(['mutualismo','polinizacao','dispersao']);
  const labels={consumo:'Predação / consumo',herbivoria:'Herbivoria',detritivoria:'Detritivoria',
    necrofagia:'Necrofagia',competicao:'Competição',parasitismo:'Parasitismo',
    mutualismo:'Mutualismo',polinizacao:'Polinização',dispersao:'Dispersão',
    decomposicao:'Decomposição',outro:'Outra / sem efeito calculado'};
  function validate(nodes,edge){
    const by=Object.fromEntries(nodes.map(n=>[n.id,n])),a=by[edge?.a],b=by[edge?.b];
    if(!a||!b||a.id===b.id)return {valid:false,reason:'Selecione dois elementos distintos.'};
    const nature=normalizeNature(edge.nature);
    if(['competicao','mutualismo','parasitismo'].includes(nature) &&
       (a.role==='Recurso'||b.role==='Recurso'))
      return {valid:false,reason:'Esta relação exige dois organismos, não um recurso não vivo.'};
    if(nature==='decomposicao' &&
       !((detritus(a)&&(b.role==='Decompositor'||/biofilme/i.test(normalizeName(b))))||
         (detritus(b)&&(a.role==='Decompositor'||/biofilme/i.test(normalizeName(a))))))
      return {valid:false,reason:'Decomposição exige detrito e fungo, bactéria ou biofilme decompositor.'};
    if(nature==='herbivoria'){
      const f=by[edge.foodId]|| (plant(a)?a:plant(b)?b:null);
      if(!f||(!plant(f)&&f.role!=='Recurso'))
        return {valid:false,reason:'Herbivoria requer planta ou parte vegetal como alimento.'};
    }
    if(nature==='detritivoria'){
      const f=by[edge.foodId]||(detritus(a)?a:detritus(b)?b:null);
      if(!detritus(f))return {valid:false,reason:'Detritivoria requer um recurso de matéria orgânica morta (ex.: serapilheira).'};
    }
    if(nature==='necrofagia'){
      const f=by[edge.foodId]||(a.role==='Necrófago'?b:a);
      if(f.role==='Recurso'&&!/carcaça|restos animais/i.test(normalizeName(f)))
        return {valid:false,reason:'Necrofagia requer carcaça ou origem animal potencial de carcaças; não serapilheira.'};
    }
    if(nature==='parasitismo'){
      const actor=by[edge.actorId] || (a.role==='Parasita'?a:b.role==='Parasita'?b:null);
      if(!actor)return {valid:false,reason:'Indique qual organismo é o parasita.'};
    }
    if(nature==='polinizacao'||nature==='dispersao'){
      const actor=by[edge.actorId]||(nature==='polinizacao'?(a.role==='Polinizador'?a:b.role==='Polinizador'?b:null):null);
      if(!actor || actor.role==='Recurso')
        return {valid:false,reason:'Escolha um organismo (não recurso) como polinizador ou dispersor.'};
      const host=actor.id===a.id?b:a;
      if(nature==='polinizacao' &&
         !plant(host) && !(/flor|néctar/.test(normalizeName(host)) && host.role==='Recurso'))
        return {valid:false,reason:'Polinização requer uma planta ou estrutura floral.'};
      if(nature==='dispersao' &&
         !plant(host) && !(/semente|fruto/.test(normalizeName(host)) && host.role==='Recurso'))
        return {valid:false,reason:'Dispersão requer uma planta, fruto ou semente como fonte.'};
    }
    return {valid:true,reason:''};
  }
  function evaluate(nodes=[],edges=[],state={},opts={}){
    const by=Object.fromEntries(nodes.map(n=>[n.id,n]));
    const initial=state?.initial||{},old=state?.pop||Object.fromEntries(nodes.map(n=>[n.id,n.count]));
    const history=state?.popHistory||{};
    const lag=Math.max(0,Math.round(cap(opts.lag??2,0,4)));
    const ratio=(n,delay=0)=>{
      if(!n)return 0;
      if(n.role==='Recurso')return 1;
      const count=cap(old[n.id]??n.count,0,1e6),ref=cap(initial[n.id]?.count??n.count,0,1e6);
      if(count<=0)return 0;
      if(!delay || !Array.isArray(history[n.id]))return cap(count/Math.max(1,ref),0,2);
      const arr=history[n.id],v=arr[Math.max(0,arr.length-1-delay)];
      return cap(v/Math.max(1,ref),0,2);
    };
    const effects=Object.fromEntries(nodes.map(n=>[n.id,{
      competition:0,parasitism:0,parasiteBenefit:0,mutualism:0,
      pollination:0,pollinatorBenefit:0,dispersal:0,disperserBenefit:0,
      herbivory:0,indirectPaths:[],causes:[],warnings:[]
    }]));
    const active=[],diet=[],ignored=[],warnings=[];
    function benefit(id,key,amount,label){
      if(!effects[id]||!Number.isFinite(amount)||amount<=0)return;
      effects[id][key]+=Math.min(amount,Math.max(0,old[id]||0)*.15);
      effects[id].causes.push(label);
    }
    const edgesDirect=edges.filter(e=>e.kind!=='indireta'&&by[e.a]&&by[e.b]&&e.a!==e.b);
    for(const e of edges){
      const a=by[e.a],b=by[e.b];if(!a||!b||a.id===b.id)continue;
      const nature=normalizeNature(e.nature),w=cap(e.weight??.6,.1,1);
      if(e.kind==='indireta'){ignored.push(e);continue}
      if(['amostras','colonias'].includes(a.countUnit)||['amostras','colonias'].includes(b.countUnit)){
        warnings.push({id:e.id||'',pair:a.name+' — '+b.name,
          text:'Registro de amostras/colônias: a ligação é visual e não entra na dinâmica de organismos; use índice didático ou indivíduos.'});
        continue;
      }
      const check=validate(nodes,e);
      if(!check.valid){warnings.push({id:e.id||'',text:check.reason,pair:a.name+' — '+b.name});continue}
      active.push({id:e.id||'',nature,from:a.id,to:b.id,weight:w});
      if(trophic.has(nature)){
        let food=by[e.foodId],consumer;
        if(!food||!(food.id===a.id||food.id===b.id)){
          food=ranked(a)<=ranked(b)?a:b;
        }
        consumer=food.id===a.id?b:a;
        if(consumer.role==='Recurso'){warnings.push({id:e.id||'',text:'O consumidor não pode ser um recurso não vivo.',pair:a.name+' — '+b.name});continue}
        if(nature==='herbivoria'&&!plant(food)&&food.role!=='Recurso')continue;
        if(nature==='detritivoria'&&!detritus(food))continue;
        if(nature==='necrofagia'&&food.role==='Recurso'&&!/carcaça|restos animais/.test(normalizeName(food)))continue;
        // Backward-compatible: older diagrams stored herbivory as generic 'consumo'.
        const mechanism=nature==='consumo'&&plant(food)?'herbivoria':nature;
        diet.push({...e,nature:mechanism,a:food.id,b:consumer.id,weight:w});
        if(mechanism==='herbivoria'&&food.role!=='Recurso'){
          const n=cap(old[food.id]??food.count,0,1e6),p=ratio(consumer);
          benefit(food.id,'herbivory',n*.023*w*p,'Redução de recrutamento/tecido vegetal por herbivoria');
        }
        continue;
      }
      if(nature==='competicao'){
        const na=cap(old[a.id]??a.count,0,1e6),nb=cap(old[b.id]??b.count,0,1e6);
        benefit(a.id,'competition',na*.026*w*ratio(b)*cap(opts.competition??.5,0,1),'Competição direta com '+b.name);
        benefit(b.id,'competition',nb*.026*w*ratio(a)*cap(opts.competition??.5,0,1),'Competição direta com '+a.name);
      }else if(nature==='parasitismo'){
        const parasite=by[e.actorId]||(a.role==='Parasita'?a:b.role==='Parasita'?b:b);
        const host=parasite.id===a.id?b:a;
        const nHost=cap(old[host.id]??host.count,0,1e6),nParasite=cap(old[parasite.id]??parasite.count,0,1e6);
        benefit(host.id,'parasitism',nHost*.016*w*ratio(parasite),'Custo do parasitismo por '+parasite.name);
        benefit(parasite.id,'parasiteBenefit',nParasite*.021*w*ratio(host),'Benefício da disponibilidade de hospedeiro '+host.name);
        if(ratio(host)<.15)benefit(parasite.id,'competition',nParasite*.035*w,'Escassez de hospedeiros');
      }else if(nature==='mutualismo'){
        const na=cap(old[a.id]??a.count,0,1e6),nb=cap(old[b.id]??b.count,0,1e6);
        benefit(a.id,'mutualism',na*.022*w*ratio(b),'Benefício do parceiro '+b.name);
        benefit(b.id,'mutualism',nb*.022*w*ratio(a),'Benefício do parceiro '+a.name);
      }else if(nature==='polinizacao'){
        const poll=by[e.actorId]||(a.role==='Polinizador'?a:b.role==='Polinizador'?b:b);
        const host=poll.id===a.id?b:a;
        if(plant(host)&&host.role!=='Recurso'&&Number(state.step||0)>=Math.max(1,lag)){
          const n=cap(old[host.id]??host.count,0,1e6);
          benefit(host.id,'pollination',n*.026*w*ratio(poll,Math.max(1,lag)),
            'Recrutamento potencial por visita de '+poll.name+' (com atraso)');
        }
        benefit(poll.id,'pollinatorBenefit',cap(old[poll.id]??poll.count,0,1e6)*.012*w*ratio(host),
          'Acesso a recursos florais de '+host.name);
      }else if(nature==='dispersao'){
        const disperser=by[e.actorId]||(a.role==='Consumidor'?a:b.role==='Consumidor'?b:b);
        const host=disperser.id===a.id?b:a;
        if(plant(host)&&host.role!=='Recurso'&&Number(state.step||0)>=Math.max(2,lag)){
          benefit(host.id,'dispersal',cap(old[host.id]??host.count,0,1e6)*.019*w*ratio(disperser,Math.max(2,lag)),
            'Recrutamento potencial pela dispersão por '+disperser.name+' (com atraso)');
        }
        benefit(disperser.id,'disperserBenefit',cap(old[disperser.id]??disperser.count,0,1e6)*.008*w*ratio(host),
          'Recompensa alimentar potencial relacionada a '+host.name);
      }
      // Decomposição = módulo biogeoquímico; outra = sem efeito demográfico atribuído.
    }
    // Registrar a mediação que está DE FATO desenhada em dois elos diretos.
    // Não somar "força indireta" à dinâmica: os elos diretos já a propagam ao longo do tempo.
    const paths=[];
    for(const e of ignored){
      for(const mid of nodes){
        if(mid.id===e.a||mid.id===e.b)continue;
        const via1=edgesDirect.some(x=>(x.a===e.a&&x.b===mid.id)||(x.b===e.a&&x.a===mid.id));
        const via2=edgesDirect.some(x=>(x.a===e.b&&x.b===mid.id)||(x.b===e.b&&x.a===mid.id));
        if(via1&&via2){
          const item={a:e.a,via:mid.id,b:e.b,mediator:mid.name};
          paths.push(item);
          effects[e.a]?.indirectPaths.push(item);
          effects[e.b]?.indirectPaths.push(item);
        }
      }
      if(!paths.some(p=>p.a===e.a&&p.b===e.b))
        warnings.push({id:e.id||'',text:'Relação indireta anotada sem mediador ligado aos dois participantes.',pair:by[e.a].name+' — '+by[e.b].name});
    }
    return {effects,trophicLinks:diet,active,indirectPaths:paths,warnings,
      counts:Object.fromEntries(Object.keys(labels).map(k=>[k,active.filter(a=>a.nature===k).length])),
      indirectAnnotations:ignored.length};
  }
  return {evaluate,validate,normalizeNature,labels,trophicKinds:[...trophic],plant,detritus};
});
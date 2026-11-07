/* Teia da Vida — ciclo hidrológico conceitual do Pantanal.
   Não são cotas, áreas inundadas medidas, meses nem previsões oficiais.
   Quatro fases: enchente → cheia → vazante → seca. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.TeiaFlood=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const PHASES=['enchente','cheia','vazante','seca'];
  const LABELS={enchente:'Enchente',cheia:'Cheia',vazante:'Vazante',seca:'Seca'};
  const NOTES={
    enchente:'As águas avançam sobre a planície. A conectividade lateral tende a aumentar e habitats aquáticos temporários se expandem.',
    cheia:'Áreas inundadas ficam mais conectadas. Muitos peixes acessam áreas de alimentação, crescimento e refúgio na planície.',
    vazante:'As águas retornam aos canais. O acesso lateral diminui; peixes podem se concentrar e retornar aos ambientes permanentes.',
    seca:'Predominam áreas expostas e corpos d’água mais isolados. Há menos habitat aquático temporário e maior acesso aos campos.'
  };
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(+v)?+v:a));
  const smooth=t=>t*t*(3-2*t);
  function at(step,opts={}){
    const enabled=opts.enabled!==false;
    const amplitude=clamp(opts.amplitude??100,30,140)/100;
    const offset={enchente:0,cheia:15,vazante:30,seca:45}[opts.start]??0;
    const elapsed=Math.max(0,Number(step)||0);
    const cycle=(elapsed+offset)%60;
    const phase=PHASES[Math.floor(cycle/15)%4];
    const t=(cycle%15)/15;
    let base;
    if(phase==='enchente')base=.18+.70*smooth(t);
    else if(phase==='cheia')base=.88+.07*Math.sin(Math.PI*t);
    else if(phase==='vazante')base=.88-.70*smooth(t);
    else base=.18-.03*Math.sin(Math.PI*t);
    const water=enabled?clamp(.18+(base-.18)*amplitude):.48;
    const inundated=enabled?clamp((water-.12)/.81):.45;
    const connectivity=enabled?clamp((water-.23)/.68):.45;
    return {enabled,phase:enabled?phase:'neutro',label:enabled?LABELS[phase]:'Pulso desligado',
      note:enabled?NOTES[phase]:'Nível e conectividade de referência mantidos constantes.',
      water,inundated,connectivity,step:elapsed,amplitude:Math.round(amplitude*100),
      start:opts.start||'enchente'};
  }
  function guild(n){
    const name=String(n.name||'').toLowerCase();
    if(/fitoplâncton|perifíton|biofilme/.test(name))return 'produtor-aquatico';
    if(/aguapé|vitória-régia/.test(name))return 'macrofita';
    if(/zooplâncton|peixe|mandi|lambari|traíra|caramujo aquático|larvas de insetos aquáticos/.test(name))return 'aquatico';
    if(/capivara|jacaré|sucuri|rã|garça|martim-pescador|tuiuiú|anta/.test(name))return 'semiaquatico';
    if(/capim/.test(name))return 'campo-inundavel';
    if(n.role==='Decompositor'||n.role==='Recurso')return 'nao-modelado';
    return 'terrestre';
  }
  function habitat(n,hydro){
    const group=guild(n);
    if(!hydro?.enabled || group==='nao-modelado')
      return {guild:group,label:'Referência estável',capacity:1,food:1,stress:0,note:'Sem efeito hidrológico específico nesta etapa.'};
    const w=hydro.water,c=hydro.connectivity,a=hydro.inundated;
    let capacity=1,food=1,label='',note='';
    if(group==='aquatico'){
      capacity=.72+.58*c;food=.78+.46*c;label='Habitat aquático e conectividade';
      note='A conectividade modifica o acesso a habitats aquáticos temporários.';
    }else if(group==='produtor-aquatico'){
      capacity=.82+.32*w;food=1;label='Ambiente aquático';
      note='A inundação altera a área potencial de desenvolvimento, sem garantir aumento da produção.';
    }else if(group==='macrofita'){
      capacity=.80+.40*w;food=1;label='Habitat de macrófitas';
      note='Disponibilidade potencial de água para plantas aquáticas.';
    }else if(group==='semiaquatico'){
      capacity=.85+.30*w;food=.91+.18*w;label='Mosaico água–terra';
      note='Alteração relativa no acesso a habitats e recursos da planície.';
    }else if(group==='campo-inundavel'){
      capacity=1.14-.54*a;food=1;label='Campo inundável';
      note='O alagamento reduz a disponibilidade de pastagem terrestre neste modelo.';
    }else{
      capacity=1.08-.24*a;food=1-.10*a;label='Área terrestre acessível';
      note='Parte da planície fica temporariamente inacessível durante a cheia.';
    }
    const stress=clamp(1-capacity,0,1)*.045;
    return {guild:group,label,capacity:clamp(capacity,.4,1.6),
      food:clamp(food,.5,1.4),stress,note};
  }
  function cycle(opts={}){return Array.from({length:61},(_,i)=>at(i,opts));}
  return {at,cycle,guild,habitat,PHASES,LABELS};
});
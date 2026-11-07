/* Teia da Vida — etapa 7: proveniência científica das relações.
 * Registro CURADO de referências verificáveis; nunca valida automaticamente a
 * ocorrência local, os coeficientes numéricos ou uma espécie não identificada.
 * Dados de estudos de dieta não são taxas de predação do simulador.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaEvidence=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const SOURCES=Object.freeze({
  jaguarPantanal:{id:'jaguarPantanal',title:'Can Scat Analysis Describe the Feeding Habits of Big Cats? A Case Study with Jaguars in Southern Pantanal',authors:'Estudo de dieta de onças no Pantanal Sul',year:2016,type:'estudo de dieta',
   url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4803351/',scope:'Pantanal Sul, presas identificadas'},
  tapirAcuri:{id:'tapirAcuri',title:'Attalea phalerata: aspectos botânicos, ecológicos, etnobotânicos e agronômicos',authors:'Revisão de Attalea phalerata',year:2015,type:'revisão científica',
   url:'https://new.scielo.br/j/cflo/a/Jp4hz9FfWtrpHJSQYVdngdr/',scope:'Acuri e dispersão por vertebrados, incluindo anta'},
  tapirPantanal:{id:'tapirPantanal',title:'Frugivoria por Tapirus terrestris em três regiões do Pantanal, Brasil',authors:'B. T. Zorzi (dissertação, UFMS)',year:2009,type:'dieta e dispersão',
   url:'https://repositorio.ufms.br/handle/123456789/524',scope:'Três regiões do Pantanal; frugivoria de anta'},
  capybaraDiet:{id:'capybaraDiet',title:'Diet of the capybara Hydrochaeris hydrochaeris in Caño Limón, Arauca, Colombia',authors:'Forero-Montaña et al.',year:2003,type:'dieta observada fora do Pantanal',
   url:'https://pubmed.ncbi.nlm.nih.gov/15162750/',scope:'Savanas inundáveis da Colômbia, NÃO Pantanal'},
  beesPantanal:{id:'beesPantanal',title:'Bees and flowers in natural forest patches of southern Pantanal',authors:'Boff, Araujo & Pott',year:2013,type:'levantamento de visitas florais',
   url:'https://www.biotaneotropica.org.br/BN/article/view/1240',scope:'Pantanal Sul; visitas florais, não toda efetividade de polinização'},
  trairaPantanal:{id:'trairaPantanal',title:'Alimentação de Hoplias malabaricus no rio Vermelho, Pantanal Sul-Mato-Grossense',authors:'Carvalho, Fernandes & Moreira',year:2002,type:'conteúdo estomacal',
   url:'https://periodicos.ufjf.br/index.php/zoociencias/article/view/24241',scope:'Espécie Hoplias malabaricus consumindo pequenos caracídeos no Pantanal Sul'},
  fitoplancton:{id:'fitoplancton',title:'Phytoplankton abundance, biomass and diversity within and between Pantanal wetland habitats',authors:'Estudo de limnologia do Pantanal',year:2012,type:'comunidades e conectividade',
   url:'https://doi.org/10.1016/j.limno.2012.01.002',scope:'Comparação entre ambientes aquáticos do Pantanal; não quantifica alimentação entre pares'},
  seasonalFish:{id:'seasonalFish',title:'Stress hídrico determina a dieta de Tetragonopterus argenteus no Pantanal Norte',authors:'Estudo da ictiofauna de Cáceres/MT',year:2019,type:'dieta sazonal',
   url:'https://cienciasambientais.com/index.php/rica/article/view/CBPC2179-6858.2019.004.0016',scope:'Rio Paraguai em Cáceres: espécie identificada, variação sazonal da dieta'},
  dequada:{id:'dequada',title:'Alterações limnológicas no Rio Paraguai (dequada) e o fenômeno natural de mortandade de peixes',authors:'Calheiros & Ferreira, Embrapa Pantanal',year:1996,type:'processo limnológico',
   url:'https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/792189',scope:'Decomposição da matéria orgânica inundada, queda de O2, aumento de CO2 e risco para peixes'}
 });
 const STATUS=Object.freeze({
  pantanal:'Registrada no Pantanal',
  outraRegiao:'Evidência fora do Pantanal',
  grupo:'Mecanismo ou grupo registrado',
  analogia:'Analogia regional (par específico não confirmado)',
  hipotese:'Hipótese sem fonte específica cadastrada',
  naoAplicavel:'Não é uma relação direta avaliada'
 });
 const RULES=[
  {pair:['capivara','onca-pintada'],natures:['consumo'],food:'capivara',
   status:'pantanal',sourceIds:['jaguarPantanal'],
   note:'Capivara foi registrada entre as presas de onça no Pantanal Sul; não representa dieta exclusiva nem taxa de predação.'},
  {pair:['capim','capivara'],natures:['herbivoria','consumo'],food:'capim',
   status:'outraRegiao',sourceIds:['capybaraDiet'],
   note:'Capivaras consomem gramíneas em savanas inundáveis da Colômbia; “capim” do jogo não identifica espécie nem comprova consumo local no Pantanal.'},
  {pair:['acuri-palmeira','anta'],natures:['dispersao'],actor:'anta',
   status:'pantanal',sourceIds:['tapirAcuri','tapirPantanal'],
   note:'O acuri é citado como fruto consumido/disperso por antas; dispersão não garante germinação ou recrutamento.'},
  {pair:['frutos-acuri','anta'],natures:['consumo'],food:'frutos-acuri',
   status:'pantanal',sourceIds:['tapirAcuri'],
   note:'Consumo de frutos de acuri por antas é registrado; a quantidade ingerida não está parametrizada.'},
  {pair:['flores','abelha-nativa'],natures:['polinizacao'],actor:'abelha-nativa',
   status:'grupo',sourceIds:['beesPantanal'],
   note:'Estudo registra abelhas nativas visitando plantas floridas no Pantanal. Visita não prova polinização efetiva de qualquer flor genérica.'},
  {pair:['ipe-amarelo','abelha-nativa'],natures:['polinizacao'],actor:'abelha-nativa',
   status:'analogia',sourceIds:['beesPantanal'],
   note:'Estudo de abelhas e flores no Pantanal não comprova aqui a visita por espécie de abelha a uma espécie de ipê específica.'},
  {pair:['serapilheira','bacterias-decompositoras'],natures:['decomposicao'],
   status:'grupo',sourceIds:['dequada'],
   note:'Decomposição bacteriana de matéria orgânica submersa é documentada no fenômeno de dequada, sem taxa aplicável à ligação do jogo.'},
  {pair:['serapilheira','fungos'],natures:['decomposicao'],
   status:'analogia',sourceIds:['dequada'],
   note:'A fonte sustenta o processo geral de decomposição na cheia, mas não mede a contribuição dos fungos deste catálogo.'},
  {pair:['traira','lambari'],natures:['consumo'],food:'lambari',
   status:'analogia',sourceIds:['trairaPantanal'],
   note:'Hoplias malabaricus preda pequenos caracídeos no Pantanal; “traíra” e “lambari” sem espécie identificada não garantem este par específico.'},
  {pair:['fitoplancton','zooplancton'],natures:['consumo','herbivoria'],food:'fitoplancton',
   status:'analogia',sourceIds:['fitoplancton'],
   note:'O estudo caracteriza comunidades de fitoplâncton/zooplâncton, mas não documenta diretamente este fluxo alimentar nem sua intensidade.'},
  {pair:['acuri-palmeira','frutos-acuri'],natures:['outro'],
   status:'grupo',sourceIds:['tapirAcuri'],
   note:'Frutos são estruturas produzidas pela palmeira; essa seta não representa transferência trófica entre dois organismos.'}
 ];
 const lookup=slug=>String(slug||'').trim();
 function classify(nodes,edge,catalog=[]){
  const nodeMap=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const sp=Object.fromEntries(catalog.map(s=>[s.id,s]));
  const a=nodeMap[edge?.a],b=nodeMap[edge?.b];
  const first=a?sp[a.specId]?.slug||a.slug||'':'',second=b?sp[b.specId]?.slug||b.slug||'':'';
  const original={edgeId:edge?.id||'',a:a?.name||'?',b:b?.name||'?',nature:edge?.nature||'outro'};
  if(!a||!b)return {...original,status:'hipotese',statusLabel:STATUS.hipotese,
     note:'Falta um participante no diagrama. Não é possível atribuir fonte específica.',sourceIds:[],requiresReview:true};
  if(edge.kind==='indireta')return {...original,status:'naoAplicavel',statusLabel:STATUS.naoAplicavel,
     note:'Linha indireta: a evidência exige investigar a cadeia mediadora, não apenas este par.',sourceIds:[],requiresReview:false};
  const key=[lookup(first),lookup(second)].sort().join('|');
  const rule=RULES.find(r=>[...r.pair].sort().join('|')===key && r.natures.includes(edge.nature));
  if(!rule)return {...original,status:'hipotese',statusLabel:STATUS.hipotese,
     note:'Nenhuma fonte específica deste par e mecanismo foi cadastrada. Isso não significa que a relação seja falsa.',
     sourceIds:[],requiresReview:true};
  const food=rule.food&&[a,b].find(n=>sp[n.specId]?.slug===rule.food);
  const actor=rule.actor&&[a,b].find(n=>sp[n.specId]?.slug===rule.actor);
  const foodMismatch=!!food && edge.foodId!==food.id;
  const actorMismatch=!!actor&&edge.actorId!==actor.id;
  if(foodMismatch||actorMismatch)return {...original,status:'hipotese',statusLabel:STATUS.hipotese,
    note:'O artigo descreve um mecanismo para este par, mas os papéis/alimento gravados na seta não estão confirmados ou estão invertidos.',
    sourceIds:rule.sourceIds,requiresReview:true,roleIssue:true};
  return {...original,status:rule.status,statusLabel:STATUS[rule.status],
    note:rule.note,sourceIds:rule.sourceIds,requiresReview:rule.status!=='pantanal'&&rule.status!=='grupo'};
 }
 function assess(nodes,edges,catalog=[]){
  const assessments=edges.map(e=>classify(nodes,e,catalog));
  const counts=Object.fromEntries(Object.keys(STATUS).map(k=>[k,0]));
  for(const e of assessments)counts[e.status]++;
  const refs=[...new Set(assessments.flatMap(e=>e.sourceIds))].map(id=>SOURCES[id]).filter(Boolean);
  return {assessments,counts,total:assessments.length,linked:assessments.filter(e=>e.sourceIds.length).length,
    regional:counts.pantanal,general:counts.grupo,outside:counts.outraRegiao,analogies:counts.analogia,
    unclassified:counts.hipotese,sources:refs};
 }
 const PARAMETERS=Object.freeze([
  {name:'Reprodução, mortalidade e capacidade de suporte por papel funcional',module:'sim-model.js',example:'r ≈ 0,075–0,13 por passo; mortalidade basal ≈ 0,022–0,036',
    status:'Hipotético',meaning:'Constantes genéricas por função, não taxas específicas estimadas no Pantanal.'},
  {name:'Pressão de predação',module:'sim-model.js',example:'coeficiente didático de 0,038 na função de consumo',
    status:'Hipotético',meaning:'Não vem de frequência de presas nos estudos: dieta observada não é taxa de mortalidade da presa.'},
  {name:'Herbivoria, parasitismo e competição',module:'interaction-model.js',example:'custos relativos ≈ 0,016–0,026 por passo',
    status:'Hipotético',meaning:'O sinal ecológico tem base conceitual; magnitude não foi calibrada por espécie.'},
  {name:'Polinização e dispersão',module:'interaction-model.js',example:'ganhos relativos ≈ 0,019–0,026, com atraso',
    status:'Hipotético',meaning:'Visitas e frugivoria não fornecem diretamente recrutamento populacional por passo.'},
  {name:'Pulso de inundação',module:'flood-pulse.js',example:'60 passos; água e conectividade em índices 0–100',
    status:'Curva conceitual',meaning:'Não corresponde a cotas observadas, meses ou hectares inundados.'},
  {name:'Decomposição, oxigênio e CO₂',module:'biogeochemistry.js',example:'índices relativos de 0–100; alertas hipotéticos',
    status:'Mecanismo apoiado na literatura; coeficientes hipotéticos',meaning:'Dequada documentada, mas o jogo não calcula concentração em mg/L nem mortalidade observada.'}
 ]);
 return {SOURCES,RULES,STATUS,PARAMETERS,classify,assess};
});
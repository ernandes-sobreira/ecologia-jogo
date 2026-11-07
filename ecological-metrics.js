/* Teia da Vida — identidade biológica e medição ecológica (etapa 5).
  Classificação do CATÁLOGO, não identificação automática por imagem.
  Nomes de espécie explícitos são interpretações de rótulos do catálogo
  corroboradas por literatura; os demais nomes comuns não asseguram espécie.
  Abundância em indivíduos, amostras e colônias NÃO é somada indiscriminadamente.
*/
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TeiaMetrics=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const LABELS={
   especie:'Espécie identificada (no catálogo)',
   taxon:'Táxon sem espécie definida',
   grupo:'Grupo funcional / taxonômico',
   comunidade:'Comunidade de múltiplos táxons',
   associacao:'Associação biológica / simbiose',
   recurso:'Recurso não vivo / estrutura'
 };
 const UNIT_LABELS={
  individuos:'indivíduos',indice:'índice didático (unidades-modelo)',amostras:'amostras registradas',
  colonias:'colônias',unidades:'unidades de modelo',nenhum:'sem contagem'
 };
 // name, kind, units, scientificName, function detail
 const ROWS=[
 ['capim','grupo','indice','','Gramíneas produtoras; conjunto de plantas, não uma espécie única.'],
 ['capivara','especie','individuos','Hydrochoerus hydrochaeris','Herbívoro semiaquático; também dispersa sementes.'],
 ['onca-pintada','especie','individuos','Panthera onca','Predador de topo.'],
 ['jacare','taxon','individuos','','Jacaré genérico: espécies distintas têm dietas e tamanhos diferentes.'],
 ['peixe','grupo','indice','','Peixe genérico, não espécie nem população única.'],
 ['minhoca','grupo','individuos','','Detritívora do solo; fragmenta detritos, não é decompositora microbiana.'],
 ['fungos','grupo','indice','','Conjunto de fungos; espécies, colônias ou amostras não identificadas.'],
 ['musgo','grupo','indice','','Conjunto de briófitas; amostras, não indivíduos comparáveis.'],
 ['serapilheira','recurso','nenhum','','Matéria orgânica morta: estoque, não organismo vivo.'],
 ['perifiton','comunidade','indice','','Comunidade aderida que reúne produtores e heterótrofos.'],
 ['liquen','associacao','indice','','Associação entre fungo e parceiro(s) fotossintetizantes; pode incluir outros organismos.'],
 ['biofilme','comunidade','indice','','Comunidade microbiana aderida, com funções variadas.'],
 ['tuiuiu','especie','individuos','Jabiru mycteria','Ave aquática; consumidor de presas animais.'],
 ['garca-branca','taxon','individuos','','Nome comum usado para mais de uma garça, sem espécie definida.'],
 ['martim-pescador','taxon','individuos','','Nome comum de diversas espécies de ave piscívora.'],
 ['quati','taxon','individuos','','Quati genericamente indicado; onívoro e dispersor potencial.'],
 ['anta','especie','individuos','Tapirus terrestris','Herbívoro e dispersor de sementes.'],
 ['abelha-nativa','grupo','individuos','','Muitas espécies podem ser abelhas nativas; não representa riqueza de 1 espécie.'],
 ['aguape-florido','taxon','individuos','','Macrófita aquática; o nome comum sozinho não define a espécie.'],
 ['acuri-palmeira','especie','individuos','Attalea phalerata','Palmeira produtora de frutos, recurso para fauna.'],
 ['frutos-acuri','recurso','nenhum','','Frutos: recurso alimentar, não organismo independente.'],
 ['ipe-amarelo','taxon','individuos','','Nome comum partilhado por diferentes espécies de árvores.'],
 ['cambara','especie','individuos','Vochysia divergens','Árvore do Pantanal: produtora primária.'],
 ['caranda','especie','individuos','Copernicia alba','Palmeira de carandazais.'],
 ['vitoria-regia','taxon','individuos','','Nome comum de macrófitas do gênero Victoria; identificação não definida.'],
 ['mandi','taxon','individuos','','Nome comum de diferentes bagres; dieta depende da espécie.'],
 ['flores','recurso','nenhum','','Flores e estruturas reprodutivas são recursos, não espécie.'],
 ['nectar','recurso','nenhum','','Néctar é recurso energético; não indivíduo biológico.'],
 ['sementes','recurso','nenhum','','Sementes: propágulos e recurso alimentar; não taxa independentes.'],
 ['fitoplancton','comunidade','indice','','Comunidade planctônica produtora; precisa identificar espécies para riqueza.'],
 ['zooplancton','comunidade','indice','','Conjunto planctônico de consumidores; amostras não são indivíduos.'],
 ['lambari','taxon','individuos','','Nome comum para diversos peixes, não espécie única.'],
 ['traira','taxon','individuos','','Traíra indica grupo/complexo de espécies, sem identificação definida.'],
 ['gafanhoto','grupo','individuos','','Conjunto de insetos herbívoros de diferentes espécies.'],
 ['ra','grupo','individuos','','Rãs não identificadas a espécie; dieta varia com espécie e estágio.'],
 ['bacterias-decompositoras','grupo','indice','','Grupo funcional bacteriano; amostras não são células/espécies.'],
 ['caramujo-aquatico','taxon','individuos','','Molusco aquático sem espécie identificada.'],
 ['sucuri','taxon','individuos','','Sucuri genérica; não equivale a espécie especificada.'],
 ['lagarta','grupo','individuos','','Fase larval de várias espécies de lepidópteros, não táxon único.'],
 ['larvas-insetos-aquaticos','grupo','indice','','Conjunto de diferentes insetos/estágios e funções alimentares.'],
 ['besouro-rola-bosta','grupo','individuos','','Grupo coprófago com várias espécies, não espécie única.'],
 ['urubu','grupo','individuos','','Várias espécies de urubus, com necrofagia predominante.'],
 ['carrapato','grupo','individuos','','Ectoparasitas de várias espécies e hospedeiros.'],
 ['gaviao','grupo','individuos','','Várias aves de rapina com hábitos alimentares distintos.']
 ];
 const META=Object.fromEntries(ROWS.map(r=>[r[0],Object.freeze({
  kind:r[1],unit:r[2],scientificName:r[3],ecology:r[4]
 })]));
 const TYPES=Object.freeze(LABELS),UNITS=Object.freeze(UNIT_LABELS);
 const validKind=x=>Object.prototype.hasOwnProperty.call(TYPES,x);
 const validUnit=x=>Object.prototype.hasOwnProperty.call(UNITS,x);
 const finite=x=>Number.isFinite(Number(x))?Math.max(0,Number(x)):0;
 const normalizeName=x=>String(x??'').trim().replace(/\s+/g,' ');
 const binomial=name=>/^[A-Z][a-zA-Z-]+ [a-z][a-zA-Z-]+(?:\s+.*)?$/.test(name);
 function forSpec(spec={}){
  const m=META[spec.slug];
  if(!m) return {kind:'taxon',unit:'unidades',scientificName:'',ecology:'Identificação e unidade não especificadas.'};
  return {...m};
 }
 function resolve(n={},spec={}){
  const def=forSpec(spec);
  const kind=validKind(n.entityType)?n.entityType:def.kind;
  const scientificName=n.scientificName==null?def.scientificName:normalizeName(n.scientificName);
  const unit=validUnit(n.countUnit)?n.countUnit:def.unit;
  const samplingEffort=normalizeName(n.samplingEffort||'');
  return {kind,unit,scientificName,samplingEffort,ecology:def.ecology,
   massNature:kind==='recurso'||n.role==='Recurso'?'estoque':'biomassa',
   speciesNamed:kind==='especie'&&binomial(scientificName)};
 }
 function enrichNode(n,spec){
  const r=resolve(n,spec);
  return {...n,entityType:r.kind,countUnit:r.unit,
   scientificName:r.scientificName,samplingEffort:r.samplingEffort};
 }
 function analyze(nodes=[],catalog=[]){
  const byId=Object.fromEntries(catalog.map(s=>[s.id,s]));
  const counts={especie:0,taxon:0,grupo:0,comunidade:0,associacao:0,recurso:0};
  const units={individuos:0,indice:0,amostras:0,colonias:0,unidades:0,nenhum:0};
  const identified=new Set();let individuals=0,biomass=0,biomassRows=0,resourceStock=0,
   resourceStockRows=0,living=0,undefinedCount=0,undefinedMass=0,ambiguousCount=0,
   unidentified=0,positiveOnly=0;
  const efforts=new Set();
  const details=nodes.map(n=>{
    const r=resolve(n,byId[n.specId]),count=finite(n.count),mass=n.mass==null?null:finite(n.mass);
    counts[r.kind]++;units[r.unit]++;
    if(r.speciesNamed)identified.add(r.scientificName);
    if(r.kind!=='especie'&&r.kind!=='recurso')unidentified++;
    const isResource=r.kind==='recurso'||n.role==='Recurso';
    if(!isResource){
      living++;
      if(r.unit==='individuos'){individuals+=count;positiveOnly++;if(r.samplingEffort)efforts.add(r.samplingEffort);}
      else if(r.unit==='nenhum')undefinedCount++;
      else ambiguousCount++;
      if(mass!=null){biomass+=mass;biomassRows++}else undefinedMass++;
    }else if(mass!=null){resourceStock+=mass;resourceStockRows++}
    return {...r,id:n.id,name:n.name,count,mass,isResource};
  });
  const issues=[];
  if(unidentified)issues.push(unidentified+' elementos ainda representam táxons não identificados a espécie, grupos, comunidades ou associações: não é possível obter a riqueza total de espécies da teia.');
  if(ambiguousCount)issues.push(ambiguousCount+' nós usam índices didáticos, amostras, colônias ou outras unidades: suas contagens não são somadas a indivíduos.');
  if(undefinedMass)issues.push(undefinedMass+' nós biológicos não informaram biomassa em kg; a soma é parcial.');
  if(units.amostras||units.colonias)issues.push('Amostras e colônias são unidades de registro e não crescem por reprodução no modelo. Para simular comunidades, utilize o índice didático.');
  if(individuals>0)issues.push('Soma de indivíduos é ilustrativa; sem área, período e esforço de amostragem padronizados não equivale a densidade ou abundância observada.');
  if(efforts.size>1)issues.push('Há diferentes protocolos de amostragem informados: padronize antes de comparar densidades.');
  const includedIdentified=identified.size;
  return {elements:nodes.length,living,resourceCount:counts.recurso,speciesNamed:includedIdentified,
    speciesList:[...identified].sort(),individuals,biomass,biomassRows,resourceStock,resourceStockRows,
    undefinedMass,unidentified,ambiguousCount,undefinedCount,counts,units,issues,details};
 }
 function indexFor(count,initialCount){
  if(!Number.isFinite(Number(initialCount))||Number(initialCount)<=0)return null;
  return 100*Math.max(0,finite(count))/Number(initialCount);
 }
 return {META,ROWS,TYPES,UNITS,forSpec,resolve,enrichNode,analyze,indexFor,
   isBinomial:binomial,normalizeName};
});
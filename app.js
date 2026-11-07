(()=>{'use strict';
const $=id=>document.getElementById(id), esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=x=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:2});
const base=[
['Capim','capim','Produtor',240,50,'Gramíneas do Pantanal'],['Capivara','capivara','Consumidor',8,120,'Herbívoro semiaquático'],['Onça-pintada','onca-pintada','Predador',2,100,'Predador de topo'],['Jacaré','jacare','Predador',4,80,'Jacaré pantaneiro'],['Peixe','peixe','Consumidor',30,18,'Peixe de água doce (representação didática)'],['Minhoca','minhoca','Detritívoro',25,2,'Detritívoro do solo; fragmenta matéria orgânica morta'],['Fungos','fungos','Decompositor',12,5,'Grupo de fungos (unidade didática)'],['Musgo','musgo','Produtor',15,1,'Briófitas (unidades de amostragem)'],['Serapilheira','serapilheira','Recurso',0,20,'Matéria orgânica morta'],['Perifíton','perifiton','Comunidade',20,4,'Comunidade aderida a superfícies'],['Líquen','liquen','Comunidade',8,1,'Associação simbiótica'],['Biofilme','biofilme','Comunidade',15,3,'Comunidade microbiana'],['Tuiuiú','tuiuiu','Consumidor',5,25,'Ave símbolo do Pantanal'],['Garça-branca','garca-branca','Consumidor',7,12,'Ave aquática'],['Martim-pescador','martim-pescador','Consumidor',5,2,'Ave piscívora'],['Quati','quati','Consumidor',6,20,'Mamífero onívoro'],['Anta','anta','Consumidor',3,450,'Herbívoro e dispersor'],['Abelha nativa','abelha-nativa','Polinizador',90,1,'Abelha polinizadora (ilustração conceitual)'],['Aguapé florido','aguape-florido','Produtor',25,20,'Macrófita aquática'],['Acuri (palmeira)','acuri-palmeira','Produtor',12,150,'Palmeira de ambientes pantaneiros'],['Frutos de acuri','frutos-acuri','Recurso',0,15,'Recurso alimentar, não espécie'],['Ipê-amarelo','ipe-amarelo','Produtor',5,200,'Árvore florida'],['Cambará','cambara','Produtor',8,250,'Árvore do Pantanal'],['Carandá','caranda','Produtor',6,300,'Palmeira pantaneira'],['Vitória-régia','vitoria-regia','Produtor',12,24,'Planta aquática'],['Mandi','mandi','Consumidor',25,10,'Peixe bagre de água doce'],['Flores','flores','Recurso',0,2,'Estruturas reprodutivas, não espécie'],['Néctar','nectar','Recurso',0,.4,'Recurso para polinizadores'],['Sementes','sementes','Recurso',0,5,'Recurso para dispersores'],['Fitoplâncton','fitoplancton','Produtor',30,2,'Comunidade planctônica'],
['Zooplâncton','zooplancton','Consumidor',120,null,'Microcrustáceos e outros consumidores planctônicos; abundância ilustrativa em unidades de amostragem.'],['Lambari','lambari','Consumidor',25,null,'Peixe pequeno geralmente onívoro; posição trófica depende da dieta e da espécie.'],['Traíra','traira','Predador',4,null,'Peixe predador, principalmente piscívoro quando adulto.'],['Gafanhoto','gafanhoto','Consumidor',36,null,'Inseto herbívoro; recurso para anfíbios e aves insetívoras.'],['Rã','ra','Consumidor',10,null,'Anfíbio; adultos de muitas espécies consomem insetos e outros invertebrados.'],['Bactérias decompositoras','bacterias-decompositoras','Decompositor',90,null,'Microrganismos decompositores; não representam uma única espécie nem indivíduos comparáveis.'],['Caramujo aquático','caramujo-aquatico','Detritívoro',30,null,'Molusco raspador ou detritívoro; a dieta varia conforme a espécie.'],['Sucuri','sucuri','Predador',2,null,'Serpente predadora semiaquática do Pantanal.'],['Lagarta','lagarta','Consumidor',20,null,'Fase larval de lepidóptero; muitas espécies se alimentam de folhas.'],['Larvas de insetos aquáticos','larvas-insetos-aquaticos','Comunidade',65,null,'Conjunto de larvas com dietas distintas: detritívoras, herbívoras e predadoras.'],['Besouro rola-bosta','besouro-rola-bosta','Detritívoro',15,null,'Coleóptero coprófago: alimenta-se e utiliza fezes de vertebrados.'],['Urubu','urubu','Necrófago',5,null,'Ave predominantemente necrófaga; fonte alimentar principal são carcaças.'],['Carrapato','carrapato','Parasita',18,null,'Ectoparasita hematófago; o hospedeiro depende da espécie de carrapato.'],['Gavião','gaviao','Predador',3,null,'Ave de rapina; dieta varia entre espécies de gavião.']
].map((s,i)=>({id:'s'+i,name:s[0],slug:s[1],role:s[2],count:s[3],mass:s[4],note:s[5],image:(new Set(['capivara','capim','onca-pintada','jacare','peixe','tuiuiu','garca-branca','martim-pescador','quati','anta']).has(s[1])?'assets/organismos-transparentes/'+s[1]+'.png':'assets/organismos-transparentes/'+s[1]+'.webp'),realisticImage:'assets/organismos-realistas/'+s[1]+'.webp',fallbackImage:'assets/organismos/'+s[1]+(i>=30?'.svg':'.webp')}));
document.addEventListener('error',function(ev){
 const im=ev.target;
 if(!im||im.tagName!=='IMG')return;
 const subject=base.find(item=>im.src.includes('/organismos-transparentes/'+item.slug+'.png')||im.src.includes('/organismos-transparentes/'+item.slug+'.webp')||im.src.includes('/organismos-realistas/'+item.slug+'.webp'));
 if(!subject)return;
 if(im.src.includes('/organismos-transparentes/')){im.src=subject.realisticImage;return}
 if(im.src.includes('/organismos-realistas/'))im.src=subject.fallbackImage;
},true);
const colors={Produtor:'#2eaa4b',Consumidor:'#e69b16',Predador:'#d64d40',Decompositor:'#9256af',Polinizador:'#d69d19',Recurso:'#5f9581',Comunidade:'#477f96',Detritívoro:'#99744b',Necrófago:'#745765',Parasita:'#ac4e47'};
const store='teia-da-vida-pantanal-v3';let graph={nodes:[],edges:[]};try{const saved=JSON.parse(localStorage.getItem(store));if(saved&&Array.isArray(saved.nodes)&&Array.isArray(saved.edges))graph=saved}catch(e){}
// Migração não destrutiva: correção de uma função ecológica antiga. Os demais campos, nós e ligações são preservados.
for(const n of graph.nodes){
 if(n.specId==='s5'&&n.role==='Decompositor')n.role='Detritívoro';
 if(n.specId==='s29'&&n.role==='Comunidade')n.role='Produtor';
 if(n.specId==='s30'&&n.role==='Comunidade')n.role='Consumidor';
}
let current='painel',selected=null,preset='s1',filter='Todos',connectMode=false,firstNode=null,edgeSelection=null,zoom=1,simTimer=null,simStep=0,simInitial=null,simHistory={},simSnapshot=null,simModelState=null,simReports=[],bioState=null,bioReport=null,lastInteractions=null;
const persist=()=>{try{localStorage.setItem(store,JSON.stringify(graph))}catch(e){}};
let toastTimer;function toast(t){$('toast').textContent=t;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600)}
function nodeById(id){return graph.nodes.find(n=>n.id===id)}function spec(id){return base.find(s=>s.id===id)}function edgeId(){return 'e'+Date.now()+Math.random().toString(36).slice(2,7)}
function selectedSpec(){return spec(preset)}
function switchView(view){current=view;document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===view));if(view==='teia')requestAnimationFrame(()=>{drawEdges();renderFlood()});if(view==='simulacoes')requestAnimationFrame(()=>{drawChart();renderFlood();renderBio()});window.scrollTo({top:0,behavior:'instant'})}
function roleCss(role){return /^[\wÀ-ÿ ]+$/.test(role)?role:'Outro'}
function itemTile(s){
 const d=window.TeiaMetrics.forSpec(s);
 const kindShort={especie:'Espécie',taxon:'Táxon',grupo:'Grupo',comunidade:'Comunidade',
  associacao:'Associação',recurso:'Recurso'};
 return '<button class="tile'+(s.id===preset?' selected':'')+'" data-spec="'+esc(s.id)+
 '" draggable="true" title="'+esc(s.name)+' — '+esc(window.TeiaMetrics.TYPES[d.kind])+'"><img src="'+s.image+
 '" alt="Ilustração de '+esc(s.name)+'" draggable="false"><b>'+esc(s.name)+
 '</b><span class="role-tag '+roleCss(s.role)+'">'+esc(s.role)+'</span>'+
 '<span class="eco-kind-badge">'+kindShort[d.kind]+'</span></button>';
}
function renderLibrary(){
 let q=$('search').value.trim().toLocaleLowerCase('pt-BR');
 let visible=base.filter(s=>{
 const meta=window.TeiaMetrics.forSpec(s);
 const matches=filter==='Todos'||s.role===filter||
  (filter==='Consumidores'&&['Consumidor','Predador','Detritívoro','Necrófago','Parasita'].includes(s.role))||
  (filter==='Espécies'&&meta.kind==='especie')||
  (filter==='Grupos'&&meta.kind==='grupo')||
  (filter==='Comunidades'&&meta.kind==='comunidade')||
  (filter==='Associações'&&meta.kind==='associacao')||
  (filter==='Recurso'&&meta.kind==='recurso');
 return matches&&(s.name.toLocaleLowerCase('pt-BR').includes(q)||
  meta.scientificName.toLocaleLowerCase('pt-BR').includes(q));
});
 $('library').innerHTML=visible.map(itemTile).join('');
 $('library').querySelectorAll('.tile').forEach(el=>attachTile(el));
}
function renderCatalog(){
 $('catalogGrid').innerHTML=base.map(s=>{
  const meta=window.TeiaMetrics.forSpec(s),type=window.TeiaMetrics.TYPES[meta.kind];
  const sc=meta.scientificName?'<p class="catalog-scientific"><i>'+esc(meta.scientificName)+'</i></p>':'';
  return '<article class="catalog-card"><img src="'+s.image+'" alt="Ilustração de '+esc(s.name)+'"><b>'+esc(s.name)+
  '</b><span class="role-tag '+roleCss(s.role)+'">'+esc(s.role)+'</span>'+
  '<div class="eco-type-label">'+esc(type)+'</div>'+sc+
  '<p>'+esc(meta.ecology)+'</p><small class="eco-unit-label">Unidade inicial: '+esc(window.TeiaMetrics.UNITS[meta.unit])+
  '</small><button data-addcat="'+s.id+'">Adicionar à teia</button></article>';
 }).join('');
 $('catalogGrid').querySelectorAll('[data-addcat]').forEach(b=>b.onclick=()=>{
  const s=spec(b.dataset.addcat);addNode(s,.2+Math.random()*.6,.22+Math.random()*.55);switchView('teia');
 });
}
function selectSpec(s){if(!s)return;preset=s.id;selected=graph.nodes.find(n=>n.specId===s.id)?.id||null;populateControls();renderLibrary()}
function selectNode(id){const n=nodeById(id);if(!n)return;selected=n.id;preset=n.specId;populateControls();renderLibrary();drawNodes()}
function identityOf(n,s){return window.TeiaMetrics.resolve(n||{},s||spec(n?.specId)||{})}
function populateControls(){
 const s=spec(preset),n=selected?nodeById(selected):null;
 const d=identityOf(n,s);
 $('pickedLabel').textContent=s?.name||'Selecione um elemento';
 $('nValue').value=n?.count??s?.count??0;
 $('bValue').value=n?.mass??s?.mass??'';
 $('roleValue').value=n?.role??s?.role??'Consumidor';
 $('entityTypeValue').value=d.kind;
 $('unitValue').value=d.unit;
 $('scientificValue').value=d.scientificName;
 $('sampleValue').value=d.samplingEffort;
 updateIdentityHint();
}
function updateIdentityHint(){
 const s=selectedSpec(),kind=$('entityTypeValue').value,unit=$('unitValue').value;
 const d=window.TeiaMetrics.forSpec(s);
 const isResource=kind==='recurso'||$('roleValue').value==='Recurso';
 const summary=d.ecology;
 $('massFieldLabel').textContent=isResource?'Estoque do recurso (kg)':'Biomassa viva informada (kg)';
 $('countFieldLabel').textContent=unit==='individuos'?'Indivíduos (N)':unit==='indice'?'Índice didático inicial':unit==='amostras'?'Amostras registradas':unit==='colonias'?'Colônias registradas':unit==='nenhum'?'Sem contagem':'Unidades do modelo';
 $('nValue').disabled=unit==='nenhum'||isResource;
 $('ecoIdentityHint').textContent=summary+' · '+(unit==='amostras'||unit==='colonias'?'Registros amostrais permanecem fixos nas simulações.':unit==='indice'||unit==='unidades'?'Unidades-modelo: não representam indivíduos ou número de amostras.':'Números ilustrativos: informe área, época e método para comparar observações.')+
 (kind==='especie'?' O nome binomial é informado, mas não verificado automaticamente.':'');
}
function newNode(s,x,y){
 const n={id:'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  specId:s.id,name:s.name,role:s.role,
  count:s.role==='Recurso'?0:s.count,mass:s.mass,x,y};
 return window.TeiaMetrics.enrichNode(n,s);
}
function addNode(s,x=.25+Math.random()*.5,y=.25+Math.random()*.5){if(!s)return;cancelSimulation();let n=graph.nodes.find(n=>n.specId===s.id);if(n){n.x=x;n.y=y;toast(s.name+' reposicionado')}else{n=newNode(s,x,y);graph.nodes.push(n);toast(s.name+' adicionado')}persist();selectNode(n.id);renderAll()}
function deleteNode(id){cancelSimulation();graph.nodes=graph.nodes.filter(n=>n.id!==id);graph.edges=graph.edges.filter(e=>e.a!==id&&e.b!==id);if(selected===id)selected=null;if(firstNode===id)firstNode=null;closeEdge();persist();renderAll();toast('Elemento e relações associadas excluídos')}
function cleanGraph(){if(graph.nodes.length&&!confirm('Criar uma nova teia vazia? Exporte seu trabalho antes, se desejar.'))return;cancelSimulation();graph={nodes:[],edges:[]};selected=null;firstNode=null;closeEdge();persist();renderAll();switchView('teia')}
function example(){if(graph.nodes.length&&!confirm('Substituir a teia atual pelo exemplo?'))return;cancelSimulation();graph={nodes:[],edges:[]};let ids=[0,1,2,3,8,6,17,18,19,20,25];ids.forEach((i,k)=>{let s=base[i],n=newNode(s,.14+(k%4)*.23,.22+Math.floor(k/4)*.29);n.id='demo'+i;graph.nodes.push(n)});const link=(a,b,w,nature='consumo')=>graph.edges.push({id:edgeId(),a:'demo'+a,b:'demo'+b,weight:w,color:'#158b56',direction:'forward',kind:'direta',nature});link(0,1,.7,'herbivoria');link(1,2,.7);link(25,3,.45);link(8,6,.5,'decomposicao');link(19,20,.6,'outro');link(18,17,.5,'polinizacao');selected=null;persist();renderAll();switchView('teia');toast('Exemplo carregado — edite livremente')}

function exampleHabitat(type){
 if(graph.nodes.length&&!confirm('Substituir a teia atual por um exemplo didático?'))return;
 cancelSimulation();graph={nodes:[],edges:[]};
 const aquatic=type==='aquatica',inds=aquatic?[29,30,31,32,3,9,36,39,14,35,8]:[0,33,34,43,26,17,27,19,20,16,15,42];
 const ncols=aquatic?4:4;
 inds.forEach((i,k)=>{const s=base[i],n=newNode(s,.13+(k%ncols)*.235,.22+Math.floor(k/ncols)*.29);n.id='hab'+i;graph.nodes.push(n)});
 const link=(a,b,weight,nature='consumo',kind='direta')=>graph.edges.push({id:edgeId(),a:'hab'+a,b:'hab'+b,weight,color:nature==='consumo'?'#16834a':'#b58e42',direction:'forward',kind,nature});
 if(aquatic){
  link(29,30,.7);link(30,31,.75);link(31,32,.8);link(32,3,.4);
  link(9,36,.5);link(39,31,.5);link(31,14,.6);
  link(8,35,.6,'decomposicao');link(8,39,.35,'detritivoria');
 }else{
  link(0,33,.7,'herbivoria');link(33,34,.55);link(34,43,.3);
  link(27,17,.65);link(17,26,.65,'polinizacao');
  link(19,20,.5,'outro');link(20,15,.6);link(20,16,.55);
  link(42,16,.5,'parasitismo');
 }
 selected=null;persist();renderAll();switchView('teia');toast('Teia '+(aquatic?'aquática':'terrestre')+' didática carregada');
}
function exampleInteractions(){
 if(graph.nodes.length&&!confirm('Substituir sua teia pelo exemplo de interações ecológicas? Exporte sua teia antes, se desejar.'))return;
 cancelSimulation();
 graph={nodes:[],edges:[]};
 const ids=[0,1,2,6,8,16,17,19,20,21,33,34,42];
 ids.forEach((i,k)=>{const n=newNode(base[i],.14+(k%4)*.235,.17+Math.floor(k/4)*.28);n.id='int'+i;graph.nodes.push(n)});
 const link=(a,b,w,nature,extra={})=>graph.edges.push({id:edgeId(),a:'int'+a,b:'int'+b,
   weight:w,color:nature==='parasitismo'?'#aa5945':nature==='polinizacao'||nature==='dispersao'?'#c89e36':
     nature==='decomposicao'?'#90754b':'#198359',
   direction:'forward',kind:'direta',nature,...extra});
 link(0,1,.7,'herbivoria',{foodId:'int0'});
 link(0,33,.65,'herbivoria',{foodId:'int0'});
 link(33,34,.65,'consumo',{foodId:'int33'});
 link(1,2,.6,'consumo',{foodId:'int1'});
 link(1,42,.6,'parasitismo',{actorId:'int42'});
 link(21,17,.65,'polinizacao',{actorId:'int17'});
 link(19,16,.7,'dispersao',{actorId:'int16'});
 link(20,16,.5,'consumo',{foodId:'int20'});
 link(8,6,.6,'decomposicao');
 link(1,33,.35,'competicao');
 link(0,34,.35,'outro',{kind:'indireta'});
 selected=null;persist();renderAll();switchView('teia');
 toast('Exemplo funcional carregado: explore as ligações e simule seus efeitos.');
}
function exampleDecomposition(){
 if(graph.nodes.length&&!confirm('Substituir sua teia pelo exemplo de decomposição? Exporte seu trabalho antes, se desejar.'))return;
 cancelSimulation();
 graph={nodes:[],edges:[]};
 const indices=[0,8,6,35,29,30,31,32,3];
 indices.forEach((i,k)=>{const n=newNode(base[i],.17+(k%3)*.32,.20+Math.floor(k/3)*.30);n.id='bioDemo'+i;graph.nodes.push(n)});
 const link=(a,b,w,nature)=>{
   graph.edges.push({id:edgeId(),a:'bioDemo'+a,b:'bioDemo'+b,weight:w,
     color:nature==='decomposicao'?'#a47a46':'#248c56',
     direction:'forward',kind:'direta',nature,
     ...(nature==='consumo'?{foodId:'bioDemo'+a}:{})});
 };
 link(0,8,.45,'outro');link(8,6,.8,'decomposicao');link(8,35,.8,'decomposicao');
 link(29,30,.7,'consumo');link(30,31,.65,'consumo');link(31,32,.7,'consumo');link(31,3,.35,'consumo');
 selected=null;persist();renderAll();switchView('simulacoes');
 toast('Exemplo carregado. Compare o oxigênio com diferentes cargas orgânicas e reaeração.');
}
function renderStats(){
 const stats=window.TeiaMetrics.analyze(graph.nodes,base);
 $('statRich').textContent=stats.elements;
 $('statN').textContent=fmt(stats.individuals);
 $('statBio').textContent=stats.biomassRows?fmt(stats.biomass):'—';
 $('statSpecies').textContent=stats.speciesNamed;
 $('statResources').textContent=stats.resourceCount;
 $('statEdges').textContent=graph.edges.length;
}
function renderEcoDiagnostic(){
 const stats=window.TeiaMetrics.analyze(graph.nodes,base);
 const items=Object.entries(stats.counts).filter(([name,count])=>count>0);
 $('ecoGroups').innerHTML=items.length?items.map(([kind,count])=>
  '<div class="eco-group"><b>'+count+'</b><span>'+esc(window.TeiaMetrics.TYPES[kind])+'</span></div>').join(''):
  '<p class="eco-placeholder">Monte uma teia para analisar a identidade ecológica dos seus elementos.</p>';
 $('ecoNamedSpecies').innerHTML=stats.speciesList.length?
  '<strong>Espécies com nome científico declarado ('+stats.speciesNamed+')</strong><p>'+
  stats.speciesList.map(name=>'<i>'+esc(name)+'</i>').join(' · ')+
  '</p><small>Lista de nomes declarados ou fornecidos no catálogo; não é a riqueza total nem validação taxonômica automática.</small>':
  '<strong>Espécies identificadas</strong><p>Nenhuma espécie com nome binomial declarado nesta teia. Não é possível calcular S usando apenas nomes genéricos.</p>';
 $('ecoWarnings').innerHTML=stats.issues.length?
  '<strong>Cuidados ao interpretar os resultados</strong><ul>'+
  stats.issues.map(msg=>'<li>'+esc(msg)+'</li>').join('')+'</ul>':'';
}

function dots(n){
 const d=identityOf(n,spec(n.specId));
 if(d.massNature==='estoque'||!['individuos','indice','unidades'].includes(d.unit))return '';
 let nDots=Math.max(0,Math.min(8,Math.ceil(n.count/Math.max(1,Math.ceil(n.count/8)))));
 return '<div class="dots" style="--dot:'+(colors[n.role]||'#4d9b64')+'">'+Array.from({length:nDots},()=>'<i></i>').join('')+'</div>';
}
function nodeCaption(n){
 const d=identityOf(n,spec(n.specId));
 if(d.massNature==='estoque')return '<small>Recurso / estoque de matéria</small><small>'+
   (n.mass==null?'Estoque não informado':fmt(n.mass)+' kg de recurso')+'</small>';
 const qty=d.unit==='nenhum'?'Sem contagem':fmt(n.count)+' '+window.TeiaMetrics.UNITS[d.unit];
 return '<small>'+esc(qty)+'</small><small>'+
   (n.mass==null?'Biomassa não informada':fmt(n.mass)+' kg biomassa')+'</small>';
}
function drawNodes(){
 $('emptyHint').hidden=graph.nodes.length>0;
 $('nodesLayer').innerHTML=graph.nodes.map(n=>{
  let s=spec(n.specId),d=identityOf(n,s);
  return '<div class="node'+(selected===n.id?' selected':'')+(firstNode===n.id?' connect-first':'')+
  '" data-node="'+esc(n.id)+'" tabindex="0" role="button" aria-label="'+esc(n.name)+
  '" title="'+esc(window.TeiaMetrics.TYPES[d.kind])+(d.scientificName?' · '+esc(d.scientificName):'')+
  '"><button class="remove-node" data-delete="'+esc(n.id)+'" aria-label="Excluir '+esc(n.name)+
  '">×</button><img src="'+(s?.image||'')+'" alt="'+esc(n.name)+'" draggable="false"><b>'+
  esc(n.name)+'</b>'+nodeCaption(n)+dots(n)+'</div>';
 }).join('');
 $('nodesLayer').querySelectorAll('[data-delete]').forEach(el=>{
  el.onpointerdown=e=>e.stopPropagation();
  el.onclick=e=>{e.stopPropagation();deleteNode(el.dataset.delete)};
 });
 $('nodesLayer').querySelectorAll('[data-node]').forEach(el=>{
  el.onclick=()=>handleNodeClick(el.dataset.node);
  el.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();handleNodeClick(el.dataset.node)}};
  el.onpointerdown=e=>{
   if(e.button!==0||connectMode)return;
   let n=nodeById(el.dataset.node),dragged=false;if(!n)return;
   el.setPointerCapture(e.pointerId);
   el.onpointermove=ev=>{
    if(!el.hasPointerCapture(ev.pointerId))return;
    dragged=true;
    let r=$('webContent').getBoundingClientRect();
    n.x=Math.max(.07,Math.min(.93,(ev.clientX-r.left)/r.width));
    n.y=Math.max(.1,Math.min(.9,(ev.clientY-r.top)/r.height));
    el.style.left=n.x*100+'%';el.style.top=n.y*100+'%';
    drawEdges();
   };
   el.onpointerup=()=>{el.onpointermove=null;if(dragged)persist()};
   el.onpointercancel=()=>{el.onpointermove=null};
  };
  let n=nodeById(el.dataset.node);
  el.style.left=n.x*100+'%';el.style.top=n.y*100+'%';
 });
}
function handleNodeClick(id){if(connectMode){if(!firstNode){firstNode=id;$('connectHint').textContent='Agora clique no segundo elemento.';drawNodes();return}if(firstNode===id){firstNode=null;drawNodes();return}let e=graph.edges.find(x=>(x.a===firstNode&&x.b===id)||(x.b===firstNode&&x.a===id));if(!e){e={id:edgeId(),a:firstNode,b:id,direction:'forward',kind:'direta',nature:'consumo',color:'#16834a',weight:.6};graph.edges.push(e)}firstNode=null;connectMode=false;setConnectState();persist();renderAll();openEdge(e.id);return}selectNode(id)}
function setConnectState(){$('connectMode').classList.toggle('primary',!connectMode);$('connectMode').textContent=connectMode?'✓ Clique em dois nós':'⌁ Criar ligação';$('connectHint').hidden=!connectMode;if(connectMode)$('connectHint').textContent='Clique no primeiro elemento e depois no segundo.'}
function drawEdges(){const root=$('webContent'),r=root.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h)return;let defs='<defs>',paths='';graph.edges.forEach((e,i)=>{let color=/^#[0-9a-fA-F]{6}$/.test(e.color||'')?e.color:'#16834a';defs+='<marker id="head'+i+'" markerWidth="14" markerHeight="14" refX="12" refY="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L14 7L0 14Z" fill="'+color+'"/></marker>'});defs+='</defs>';graph.edges.forEach((e,i)=>{const a=nodeById(e.direction==='reverse'?e.b:e.a),b=nodeById(e.direction==='reverse'?e.a:e.b);if(!a||!b)return;const x=a.x*w,y=a.y*h,dx=(b.x-a.x)*w,dy=(b.y-a.y)*h,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l;const radius=window.innerWidth<760?49:67,start=radius+5,end=radius+17;const x1=x+ux*start,y1=y+uy*start,x2=b.x*w-ux*end,y2=b.y*h-uy*end;if(Math.hypot(x2-x1,y2-y1)<22)return;const cx=(x1+x2)/2-uy*18,cy=(y1+y2)/2+ux*18;const d='M'+x1+' '+y1+'Q'+cx+' '+cy+' '+x2+' '+y2;const weight=Math.min(1,Math.max(.1,Number(e.weight)||.6)),stroke=(1.5+5.2*weight).toFixed(1),color=e.color||'#16834a',dash=e.kind==='indireta'?'stroke-dasharray="8 7"':'';paths+='<path d="'+d+'" stroke="'+color+'" stroke-width="'+stroke+'" fill="none" stroke-linecap="round" '+dash+' marker-end="url(#head'+i+')"/>';paths+='<path data-edge="'+esc(e.id)+'" class="edge-hit" d="'+d+'" stroke="transparent" stroke-width="24" fill="none" tabindex="0" role="button" aria-label="Editar ligação"/>'});$('edgeSvg').setAttribute('viewBox','0 0 '+w+' '+h);$('edgeSvg').innerHTML=defs+paths;$('edgeSvg').querySelectorAll('[data-edge]').forEach(el=>{el.onclick=ev=>{ev.stopPropagation();openEdge(el.dataset.edge)};el.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openEdge(el.dataset.edge)}}})}
function defaultFoodId(a,b){
 if(!a||!b)return a?.id||b?.id||'';
 const rank=n=>{let name=String(n.name||'').toLowerCase();if(n.role==='Recurso')return 0;if(n.role==='Produtor'||name.includes('fitoplâncton')||name.includes('perifíton')||name.includes('líquen'))return 1;if(n.role==='Predador')return 4;if(n.role==='Necrófago'||n.role==='Parasita')return 3;return 2};
 return rank(a)<=rank(b)?a.id:b.id;
}
function actorDefault(e){
 const a=nodeById(e.a),b=nodeById(e.b);
 if(e.nature==='parasitismo')return a?.role==='Parasita'?a.id:b?.role==='Parasita'?b.id:e.b;
 if(e.nature==='polinizacao')return a?.role==='Polinizador'?a.id:b?.role==='Polinizador'?b.id:e.b;
 if(e.nature==='dispersao'){
  if(a?.role==='Consumidor'&&b?.role==='Produtor')return a.id;
  if(b?.role==='Consumidor'&&a?.role==='Produtor')return b.id;
 }
 return e.b;
}
function updateFoodFields(e){
 const a=nodeById(e.a),b=nodeById(e.b),field=$('edgeFood');
 const eligible=['consumo','herbivoria','detritivoria','necrofagia'].includes(e.nature);
 $('edgeFoodWrap').hidden=!eligible;if(!eligible)return;
 const titles={consumo:'Quem é o alimento / presa?',herbivoria:'Qual é a planta ou parte vegetal?',
  detritivoria:'Qual é a matéria orgânica morta?',necrofagia:'De qual animal vêm as carcaças?'};
 $('edgeFoodTitle').textContent=titles[e.nature];
 field.innerHTML='<option value="'+esc(e.a)+'">'+esc(a?.name||'Primeiro')+'</option><option value="'+esc(e.b)+'">'+esc(b?.name||'Segundo')+'</option>';
 field.value=e.foodId===e.a||e.foodId===e.b?e.foodId:defaultFoodId(a,b);
 const eater=field.value===e.a?b:a;
 $('edgeFoodConsumer').textContent=(eater?.name?'Quem consome: '+eater.name+'. ':'')+
 (e.nature==='necrofagia'?'Não causa a morte: utiliza carcaças.':
  e.nature==='detritivoria'?'Exige serapilheira ou outro detrito.':
  e.nature==='herbivoria'?'A planta pode perder tecido e recrutamento, não morrer automaticamente.':'');
}
function updateActorFields(e){
 const show=['parasitismo','polinizacao','dispersao'].includes(e.nature);
 $('edgeActorWrap').hidden=!show;if(!show)return;
 const a=nodeById(e.a),b=nodeById(e.b),field=$('edgeActor');
 const name={parasitismo:'Quem é o parasita?',polinizacao:'Quem poliniza?',dispersao:'Quem dispersa as sementes?'};
 const help={parasitismo:'O hospedeiro sofre custo; o parasita pode ganhar recursos.',
  polinizacao:'A visita pode beneficiar o polinizador e o recrutamento da planta com atraso.',
  dispersao:'O benefício de recrutamento vegetal é representado com atraso.'};
 $('edgeActorTitle').textContent=name[e.nature];
 field.innerHTML='<option value="'+esc(e.a)+'">'+esc(a?.name||'Primeiro')+'</option><option value="'+esc(e.b)+'">'+esc(b?.name||'Segundo')+'</option>';
 field.value=e.actorId===e.a||e.actorId===e.b?e.actorId:actorDefault(e);
 $('edgeActorHelp').textContent=help[e.nature];
}
function updateMechanismHint(e){
 const note={consumo:'Predação: morte potencial da presa e alimento para o predador.',
  herbivoria:'Herbivoria: recurso vegetal para o herbívoro; perda de tecido/recrutamento na planta.',
  detritivoria:'Detritivoria: uso de matéria morta, sem matar organismos vivos.',
  necrofagia:'Necrofagia: acesso a carcaças geradas por mortalidade, não predação direta.',
  competicao:'Competição (−/−): custos para os dois participantes.',
  parasitismo:'Parasitismo (+/−): escolha parasita e hospedeiro.',
  mutualismo:'Mutualismo (+/+): benefícios limitados a ambos os parceiros.',
  polinizacao:'Polinização: recursos florais e recrutamento potencial com atraso.',
  dispersao:'Dispersão: recrutamento vegetal potencial com atraso.',
  decomposicao:'Decomposição: ciclagem de matéria e efeitos limnológicos da etapa 3.',
  outro:'Outra: anotação visual sem efeito calculado.'};
 $('edgeMechanismHint').textContent=(e.kind==='indireta'?
  'Indireta: uma hipótese de efeito mediado por outros organismos; não soma força extra. ':'')+
  (note[e.nature]||'Escolha a relação.')+
  ' O sentido gráfico da seta NÃO altera os papéis ecológicos.';
}
function updateEdgeFields(e){updateFoodFields(e);updateActorFields(e);updateMechanismHint(e);}
function openEdge(id){
 edgeSelection=id;const e=graph.edges.find(x=>x.id===id);if(!e)return;
 const a=nodeById(e.a),b=nodeById(e.b);
 $('edgeName').textContent=(a?.name||'Origem')+' ↔ '+(b?.name||'Destino');
 $('edgeDirection').innerHTML='<option value="forward">'+esc(a?.name||'Origem')+' → '+esc(b?.name||'Destino')+'</option><option value="reverse">'+esc(b?.name||'Destino')+' → '+esc(a?.name||'Origem')+'</option>';
 $('edgeDirection').value=e.direction||'forward';
 $('edgeKind').value=e.kind||'direta';
 $('edgeNature').value=e.nature||'outro';
 $('edgeWeight').value=e.weight??.6;
 $('edgeWeightOut').textContent=fmt(e.weight??.6);
 $('edgeColor').value=e.color||'#16834a';
 updateEdgeFields(e);$('edgeEditor').hidden=false;
}
function changeEdge(key,value){
 const e=graph.edges.find(x=>x.id===edgeSelection);if(!e)return;
 const ecological=['kind','nature','weight','foodId','actorId'].includes(key);
 if(ecological)cancelSimulation();
 e[key]=value;
 if(key==='nature')e.actorId=actorDefault(e);
 if(['kind','nature','foodId','actorId'].includes(key))updateEdgeFields(e);
 persist();drawEdges();
 if(ecological)renderAll();
}
function closeEdge(){edgeSelection=null;$('edgeEditor').hidden=true}
function deleteEdge(){graph.edges=graph.edges.filter(e=>e.id!==edgeSelection);closeEdge();persist();renderAll();toast('Ligação excluída')}
function renderAll(){renderStats();renderEcoDiagnostic();drawNodes();drawEdges();drawChart();renderMini();renderTable();renderDrivers();renderFlood();renderBio();renderInteractions()}
function attachTile(el){let id=el.dataset.spec;el.onclick=()=>{if(el.dataset.justDragged==='1'){el.dataset.justDragged='0';return}selectSpec(spec(id));addNode(spec(id))};el.ondragstart=ev=>{ev.dataTransfer.setData('text/plain',id);ev.dataTransfer.effectAllowed='copy'};el.onpointerdown=ev=>{if(ev.pointerType==='mouse')return;const s=spec(id),ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML='<img src="'+s.image+'"><b>'+esc(s.name)+'</b>';document.body.appendChild(ghost);function move(e){ghost.style.left=e.clientX+10+'px';ghost.style.top=e.clientY-35+'px';let r=$('board').getBoundingClientRect();$('board').classList.toggle('drop-active',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}function done(e){const travel=Math.hypot(e.clientX-ev.clientX,e.clientY-ev.clientY);if(travel>10){el.dataset.justDragged='1';setTimeout(()=>el.dataset.justDragged='0',500)}window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',done);window.removeEventListener('pointercancel',done);ghost.remove();$('board').classList.remove('drop-active');let r=$('board').getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){let c=dropPoint(e);addNode(s,c.x,c.y);switchView('teia')}}move(ev);window.addEventListener('pointermove',move);window.addEventListener('pointerup',done);window.addEventListener('pointercancel',done)}}
function dropPoint(ev){let r=$('webContent').getBoundingClientRect();return {x:Math.max(.08,Math.min(.92,(ev.clientX-r.left)/r.width)),y:Math.max(.12,Math.min(.88,(ev.clientY-r.top)/r.height))}}
function exampleNames(){return graph.nodes.map(n=>n.name).join(', ')}
function download(){let data=new Blob([JSON.stringify({version:3,app:'Teia da Vida Pantanal',...graph},null,2)],{type:'application/json'}),url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download='teia-da-vida-pantanal.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Teia exportada')}
function pulseOptions(){return {enabled:!!$('pulseEnabled')?.checked,amplitude:Number($('pulseAmplitude')?.value||100),start:$('pulseStart')?.value||'enchente'}}
function pulseAt(step=simStep){return window.TeiaFlood?.at(step,pulseOptions())||null}
function modelOptions(step=simStep){const flood=pulseAt(step);return {
 scenario:$('scenario').value,intensity:Number($('intensity').value),
 reproduction:Number($('reproFactor').value),capacity:Number($('capacityFactor').value),
 predation:Number($('predationFactor').value),competition:Number($('competitionFactor').value),lag:Number($('lagSteps').value),
 flood,habitats:flood&&window.TeiaFlood?Object.fromEntries(graph.nodes.map(n=>[n.id,window.TeiaFlood.habitat(n,flood)])):{}
}}
function renderFlood(){
 const svg=$('floodSvg');if(!svg)return;
 const hydro=pulseAt(simStep);if(!hydro){$('floodDescription').textContent='O módulo hidrológico ainda não carregou. Recarregue a página.';return}
 const opts=pulseOptions(),profile=window.TeiaFlood.cycle(opts),x=k=>45+k*580/60,y=v=>105-v*80;
 const path=profile.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v.water).toFixed(1)).join(' ');
 const area=path+'L625 105L45 105Z';
 let out='<defs><linearGradient id="floodShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#72bcd5" stop-opacity=".40"/><stop offset="1" stop-color="#72bcd5" stop-opacity=".03"/></linearGradient></defs>';
 for(let i=0;i<4;i++){const left=x(i*15),labels=profile[i*15]?.label;out+='<rect x="'+left+'" y="12" width="'+(580/4)+'" height="96" fill="'+(i%2?'#f3faf8':'#fafdfb')+'"/><text x="'+(left+580/8)+'" y="129" fill="#527d70" text-anchor="middle" font-size="11">'+esc(labels)+'</text>'}
 for(let i=0;i<=2;i++){let v=i/2,yy=y(v);out+='<path d="M45 '+yy+'H625" stroke="#d8e7e1" stroke-width="1"/><text x="39" y="'+(yy+4)+'" fill="#658577" text-anchor="end" font-size="11">'+Math.round(v*100)+'</text>'}
 out+='<path d="'+area+'" fill="url(#floodShade)"/><path d="'+path+'" stroke="'+(opts.enabled?'#1683aa':'#93aaa2')+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"/>';
 const markerStep=Math.min(60,simStep),mx=x(markerStep),my=y(hydro.water);
 out+='<path d="M'+mx+' 12V108" stroke="#dd9134" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="'+mx+'" cy="'+my+'" r="6" fill="#dd9134" stroke="#fff" stroke-width="2"/>';
 svg.innerHTML=out;
 const pct=v=>Math.round(v*100)+' / 100';
 $('floodPhaseLabel').textContent=hydro.label;
 $('floodStepLabel').textContent='Passo '+simStep+' / 60';
 $('floodWaterValue').textContent=pct(hydro.water);
 $('floodAreaValue').textContent=pct(hydro.inundated);
 $('floodConnectivityValue').textContent=pct(hydro.connectivity);
 $('floodNote').textContent=hydro.enabled?'Fase inicial: '+window.TeiaFlood.LABELS[opts.start]+'. Amplitude: '+opts.amplitude+'% da curva didática. Os passos são abstratos.':'Pulso desligado: ambiente de referência constante.';
 $('floodDescription').textContent=hydro.note;
 $('pulseAmplitudeOut').textContent=opts.amplitude+'%';
 document.querySelectorAll('[data-pulse-phase]').forEach(button=>{
  const active=hydro.phase===button.dataset.pulsePhase,starting=opts.start===button.dataset.pulsePhase;
  button.classList.toggle('active',active);button.classList.toggle('start',starting);
  button.setAttribute('aria-pressed',String(starting));
  button.title='Começar o ciclo na fase '+button.textContent;
 });
 const waterOverlay=$('floodWaterOverlay'),badge=$('floodBoardChip');
 if(waterOverlay)waterOverlay.style.height=hydro.enabled?Math.round(9+52*hydro.inundated)+'%':'0';
 if(badge){badge.hidden=!hydro.enabled;badge.textContent=hydro.label+' · conectividade '+Math.round(hydro.connectivity*100)+'/100';}
}

function bioOptions(){return {
 enabled:!!$('bioEnabled')?.checked,
 load:Number($('bioLoad')?.value||0),
 microbes:Number($('bioMicrobes')?.value||0),
 aeration:Number($('bioAeration')?.value||0),
 temperature:Number($('bioTemperature')?.value||0),edges:graph.edges
}}
function renderBio(){
 if(!$('bioChart'))return;
 const options=bioOptions(),hydro=pulseAt(simStep),
  initial=window.TeiaBiogeo?.init(graph.nodes,options,hydro)||null;
 const state=bioState||initial;
 if(!state){$('bioStatusText').textContent='Módulo não carregado. Atualize a página.';return}
 const report=bioReport||state.history[state.history.length-1];
 const metrics={Organic:state.organic,Oxygen:state.oxygen,Nutrients:state.nutrients,Carbon:state.carbon};
 for(const [name,value] of Object.entries(metrics)){
   const metric=$('bio'+name),bar=$('bio'+name+'Bar');
   if(metric)metric.textContent=fmt(Math.max(0,Math.min(100,value)))+' / 100';
   if(bar)bar.style.width=Math.min(100,Math.max(0,value))+'%';
 }
 const risk=options.enabled?report.risk:'desligado';
 $('bioStatus').dataset.status=risk;
 $('bioStatusTitle').textContent=options.enabled?(report.label||'Condição inicial'):'Módulo desativado';
 $('bioStatusText').textContent=options.enabled?(report.source||'Matéria orgânica e processos microbianos controlam os índices da água.'):
   'Os estoques ficam constantes e não causam efeitos demográficos.';
 const hist=state.history||[];
 const series=[
  {field:'oxygen',color:'#1294b7'},
  {field:'organic',color:'#9f8658'},
  {field:'nutrients',color:'#55a04c'},
  {field:'carbon',color:'#ac6fa1'}
 ];
 let chart='<path d="M42 10V145H640" stroke="#c8d8d1" stroke-width="1.4" fill="none"/>';
 for(let i=0;i<=4;i++){const v=i*25,y=145-v*1.25;chart+='<path d="M42 '+y+'H640" stroke="#edf1eb" stroke-width="1"/><text x="37" y="'+(y+4)+'" font-size="11" fill="#7b8e80" text-anchor="end">'+v+'</text>'}
 for(let i=0;i<=3;i++){const x=42+i*20*598/60;chart+='<text x="'+x+'" y="163" text-anchor="middle" font-size="11" fill="#7b8e80">'+i*20+'</text>'}
 for(const serie of series){
   const d=hist.map((v,i)=>(i?'L':'M')+(42+Math.min(60,v.step)*598/60).toFixed(1)+' '+(145-Math.max(0,Math.min(100,v[serie.field]))*1.25).toFixed(1)).join(' ');
   chart+='<path d="'+d+'" fill="none" stroke="'+serie.color+'" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
   if(hist.length===1)chart+='<circle cx="42" cy="'+(145-hist[0][serie.field]*1.25)+'" r="3.3" fill="'+serie.color+'"/>';
 }
 chart+='<text x="341" y="181" text-anchor="middle" fill="#6e8174" font-size="11">Passos abstratos da simulação</text>';
 $('bioChart').innerHTML=chart;
 const processes=$('bioProcess');
 if(processes){
  const orgs=graph.nodes.filter(n=>n.role==='Decompositor'||/biofilme/i.test(n.name)).length;
  if(bioState && options.enabled){
    processes.innerHTML='<strong>Fluxos do passo '+simStep+'</strong><p>'+esc(report.source||'')+'</p>'+
    '<div class="bio-flow"><span>Entrada orgânica: +'+fmt(report.inputs)+'</span><span>Decomposição: '+fmt(report.decomposed)+'</span>'+
    '<span>Demanda de O₂: '+fmt(report.respiration)+'</span><span>Reaeração: +'+fmt(report.reaeration)+'</span>'+
    '<span>Fotossíntese (potencial): +'+fmt(report.photosynthesis)+'</span><span>Absorção de nutrientes: '+fmt(report.uptake)+'</span></div>'+
    '<p class="bio-small">Elementos decompositores/biofilmes na teia: <b>'+orgs+'</b> · Ligações de decomposição: <b>'+(report.decompositionLinks||0)+'</b> · Ligações de detritivoria: <b>'+(report.detritivoreLinks||0)+'</b>. Detritívoros facilitam a fragmentação, não substituem a mineralização microbiana. Pesos são didáticos.</p>';
  }else{
    processes.innerHTML='<strong>Como os processos funcionam</strong><p>Matéria orgânica submersa → decomposição microbiana → nutrientes e CO₂ relativos; a decomposição pode consumir oxigênio, enquanto fotossíntese e reaeração podem repô-lo.</p><p class="bio-small">Elementos decompositores/biofilmes na teia: <b>'+orgs+'</b>.</p>';
  }
 }
 for(const [id,value,suffix] of [
  ['bioLoadOut',options.load,' / 100'],
  ['bioMicrobesOut',options.microbes,'%'],
  ['bioAerationOut',options.aeration,'%'],
  ['bioTemperatureOut',options.temperature,' / 100']
 ])if($(id))$(id).textContent=value+suffix;
 const overlay=$('waterQualityOverlay'),chip=$('waterQualityChip');
 if(overlay){
   const opacity=options.enabled?Math.min(.42,Math.max(0,(55-state.oxygen)/100)) :0;
   overlay.style.opacity=opacity;overlay.style.height=Math.round(10+(hydro?.inundated||.3)*50)+'%';
 }
 if(chip){
   chip.hidden=!options.enabled||!bioState||state.oxygen>=46;
   if(!chip.hidden)chip.textContent='Oxigênio '+fmt(state.oxygen)+'/100 · '+(risk==='alto'?'risco elevado no modelo':'atenção no modelo');
 }
}
function cancelSimulation(){
 stopTimer();
 if(simInitial)graph.nodes.forEach(n=>{const first=simInitial[n.id];if(first){n.count=first.count;n.mass=first.mass}});
 simInitial=null;simModelState=null;simReports=[];simStep=0;simHistory={};bioState=null;bioReport=null;lastInteractions=null;
 $('timeSlider').value=0;$('stepOut').textContent='0 / 60';
}
function ensureSim(){
 if(simInitial)return;
 simInitial=Object.fromEntries(graph.nodes.map(n=>[n.id,{count:n.count,mass:n.mass}]));
 simModelState=window.TeiaDynamics.init(graph.nodes);
 if(window.TeiaBiogeo)bioState=window.TeiaBiogeo.init(graph.nodes,bioOptions(),pulseAt(0));
 simHistory=Object.fromEntries(graph.nodes.map(n=>[n.id,[n.count]]));
}
function advance(){
 if(simStep>=60){stopTimer();return}
 if(!window.TeiaDynamics){stopTimer();toast('Motor ecológico indisponível; atualize a página.');return}
 if(!graph.nodes.some(n=>n.role!=='Recurso')){stopTimer();toast('Adicione pelo menos um organismo para simular.');return}
 ensureSim();
 let options=modelOptions(simStep+1);
 if(window.TeiaBiogeo){
   const bio=window.TeiaBiogeo.advance(graph.nodes,bioState,bioOptions(),options.flood);
   bioState=bio.state;bioReport=bio.report;
   options.biogeoEffects=Object.fromEntries(graph.nodes.map(n=>[n.id,window.TeiaBiogeo.effects(n,bio.state,bioOptions())]));
   options.organicIndex=bio.state.organic;
 }
 if(window.TeiaInteractions){
   lastInteractions=window.TeiaInteractions.evaluate(graph.nodes,graph.edges,simModelState,options);
   options.interactions=lastInteractions;
 }
 const outcome=window.TeiaDynamics.advance(graph.nodes,graph.edges,simModelState,options);
 simModelState=outcome.state;simReports=outcome.reports;simStep=outcome.state.step;
 for(const v of outcome.values){
   const n=nodeById(v.id);
   if(!n)continue;
   n.count=v.count;n.mass=v.mass;
   (simHistory[v.id]||=([])).push(v.count);
 }
 $('stepOut').textContent=simStep+' / 60';$('timeSlider').value=simStep;
 persist();renderAll();
 if(simStep>=60)stopTimer();
}
function stopTimer(){if(simTimer){clearInterval(simTimer);simTimer=null}}
function resetSim(){cancelSimulation();persist();renderAll()}
function renderInteractions(){
 const root=$('interactionSummary'),warn=$('interactionWarnings'),paths=$('interactionPaths');
 if(!root||!warn||!paths)return;
 if(!window.TeiaInteractions){root.innerHTML='<p>Motor de interações indisponível. Atualize a página.</p>';return}
 const opts=modelOptions();
 const info=lastInteractions||window.TeiaInteractions.evaluate(graph.nodes,graph.edges,simModelState,opts);
 const labels=window.TeiaInteractions.labels;
 const summaries={
 consumo:'Presa ↓ · Predador recebe alimento; mortalidade animal.',
 herbivoria:'Planta perde tecido/recrutamento · Herbívoro recebe alimento.',
 detritivoria:'Detritos disponíveis alimentam detritívoro, sem mortalidade da presa.',
 necrofagia:'Carcaças decorrentes de mortalidade alimentam necrófago.',
 competicao:'Custos recíprocos (−/−) quando ambos compartilham demanda.',
 parasitismo:'Hospedeiro sofre custo · Parasita recebe benefício (+/−).',
 mutualismo:'Benefícios para ambos (+/+), limitados pela abundância do parceiro.',
 polinizacao:'Recursos florais e recrutamento da planta com atraso.',
 dispersao:'Recrutamento vegetal com atraso e recompensa potencial ao dispersor.',
 decomposicao:'Ativa ciclagem no módulo de matéria orgânica e oxigênio.',
 outro:'Sem alteração demográfica automática.'
 };
 const shown=Object.entries(info.counts||{}).filter(([k,v])=>v>0);
 root.innerHTML=shown.length?shown.map(([kind,count])=>
 '<div class="interaction-card"><strong>'+esc(labels[k]||kind)+' <span>'+count+' ligação(ões)</span></strong><small>'+esc(summaries[k]||'')+'</small></div>').join(''):
 '<div class="interaction-empty">Adicione dois organismos, crie uma ligação e escolha sua natureza para investigar seus efeitos.</div>';
 const indirect=info.indirectAnnotations||0,mediated=info.indirectPaths||[];
 paths.innerHTML=indirect?'<strong>Relações indiretas: '+indirect+'</strong><p>'+
 (mediated.length?'Caminhos mediadores identificados: '+esc([...new Set(mediated.map(x=>x.mediator))].join(', '))+'.':
 'Ainda não há caminho de dois elos diretos que comprove a mediação anotada.')+
 ' Elas não adicionam um fluxo duplicado. As cascatas aparecem ao longo dos passos.</p>':'';
 warn.innerHTML=(info.warnings||[]).length?'<strong>Relações que precisam de revisão:</strong>'+
 info.warnings.map(w=>'<p>'+esc(w.pair)+': '+esc(w.text)+'</p>').join(''):'';
}
function renderDrivers(){
 const focus=$('simFocus'),area=$('simCauses'),summary=$('simDriversSummary');
 if(!focus||!area||!summary)return;
 const visible=graph.nodes.filter(n=>n.role!=='Recurso');
 let chosen=focus.value;
 if(!visible.some(n=>n.id===chosen))chosen=visible[0]?.id||'';
 focus.innerHTML=visible.map(n=>'<option value="'+esc(n.id)+'">'+esc(n.name)+'</option>').join('');
 if(chosen)focus.value=chosen;
 if(!visible.length){
   area.innerHTML='<div class="sim-causes-empty">Adicione organismos à teia para investigar reprodução, capacidade de suporte, alimento, competição e predação.</div>';
   summary.innerHTML='';return;
 }
 if(!simReports.length){
   area.innerHTML='<div class="sim-causes-empty"><strong>Escolha um cenário e avance um passo.</strong> O modelo vai decompor a variação de cada população em reprodução e causas de mortalidade. Ligue alimento → consumidor e marque a natureza da relação como “Consumo” para ativar a dinâmica alimentar.</div>';
   summary.innerHTML='';return;
 }
 const report=simReports.find(x=>x.id===chosen);
 if(!report){area.innerHTML='';summary.innerHTML='';return}
 const delta=report.change,sign=delta>.005?'+':'',classification=delta<-.005?'loss':delta>.005?'':'stable';
 const factors=[
  ['Reprodução',report.births,false],
  ['Mortalidade natural',report.natural,true],
  ['Limite de densidade / K',report.density,true],
  ['Escassez de alimento',report.starvation,true],
  ['Competição por alimento',report.competition,true],
  ['Predação de animais',report.predation,true],
  ['Herbivoria / perda de recrutamento vegetal',report.herbivory||0,true],
  ['Competição direta',report.explicitCompetition||0,true],
  ['Custo do parasitismo',report.parasitism||0,true],
  ['Benefícios do mutualismo',report.mutualism||0,false],
  ['Recrutamento por polinização',report.pollination||0,false],
  ['Recrutamento por dispersão',report.dispersal||0,false],
  ['Benefício alimentar de parceiros',report.partnerBenefit||0,false],
  ['Estresse ambiental da seca',report.climate,true],
  ['Restrição de habitat pelo pulso',report.hydrology||0,true],
  ['Estresse por oxigênio reduzido',report.waterQuality||0,true]
 ];
 const rows=factors.filter(x=>x[1]>.0005).map(([label,value,loss])=>
   '<div class="sim-factor'+(loss?' loss':'')+'"><span>'+label+'</span><b>'+(loss?'−':'+')+fmt(value)+'</b></div>').join('');
 const opts=modelOptions(),f=report.food!=null?fmt(report.food*100)+'%':'—',lagF=report.laggedFood!=null?fmt(report.laggedFood*100)+'%':'—';
 area.innerHTML='<div class="sim-cause-head"><strong>'+esc(report.name)+': '+fmt(report.before)+' → '+fmt(report.after)+' unidades modeladas</strong><span class="sim-delta '+classification+'">'+sign+fmt(delta)+' neste passo</span></div>'+
 '<p class="sim-cause-caption">'+esc(report.reason)+'</p>'+
 '<div class="sim-factors">'+rows+'</div>'+
 '<p class="sim-eco-footnote">Capacidade de suporte estimada (K): <b>'+(report.capacity==null?'—':fmt(report.capacity))+'</b> unidades · Alimento disponível agora: <b>'+f+'</b> da referência · Efeito alimentar aplicado à reprodução: <b>'+lagF+'</b> · Atraso configurado: <b>'+opts.lag+' passo(s)</b>.'+
 (report.implicitDiet?' Esta população não tem ligação de consumo: o modelo assume alimentação externa não cadastrada.':'')+
 (opts.flood?.enabled&&report.habitatLabel?' Habitat: <b>'+esc(report.habitatLabel)+'</b> · fator de capacidade pelo pulso: <b>'+fmt(report.habitatCapacity||1)+'×</b>.':'')+
 (bioState&&bioOptions().enabled?' Oxigênio relativo: <b>'+fmt(bioState.oxygen)+'/100</b> · capacidade por qualidade da água: <b>'+fmt(report.waterCapacity||1)+'×</b>.' : '')+
 (report.interactionCauses?.length?'<br>Interações que contribuíram: '+esc([...new Set(report.interactionCauses)].slice(0,3).join('; '))+'.':'')+
 (report.indirectPaths?.length?'<br>Efeitos indiretos anotados via: '+esc([...new Set(report.indirectPaths.map(p=>p.mediator))].slice(0,3).join(', '))+'. Não são somados novamente.':'')+
 ' Os valores internos têm decimais; os nós arredondam a abundância para facilitar a leitura.</p>';
 const ranked=simReports.filter(x=>x.role!=='Recurso'&&Math.abs(x.change)>.0005).sort((a,b)=>Math.abs(b.change/Math.max(1,b.before))-Math.abs(a.change/Math.max(1,a.before))).slice(0,3);
 summary.innerHTML=ranked.map(x=>'<div class="sim-why-card"><strong>'+esc(x.name)+' '+(x.change>0?'↑':'↓')+' '+fmt(Math.abs(x.change/Math.max(1,x.before)*100))+'%</strong><small>'+esc(x.reason)+'</small></div>').join('');
}
function drawChart(){
 const root=$('chartSvg');if(!root)return;
 const indexed=graph.nodes.filter(n=>{
  const d=identityOf(n,spec(n.specId));
  return d.massNature!=='estoque' && !['amostras','colonias','nenhum'].includes(d.unit) &&
   Number(simInitial?.[n.id]?.count??n.count)>0;
 }).slice(0,7);
 const palette=['#1e9349','#e6a21c','#c64f39','#2888b1','#9356b4','#699b3e','#ad735e'];
 const series=indexed.map((n,i)=>{
  const ref=Number(simInitial?.[n.id]?.count??n.count);
  const values=(simHistory[n.id]||[n.count]).map(value=>window.TeiaMetrics.indexFor(value,ref));
  return {n,values,color:palette[i]};
 });
 const ymax=Math.max(125,Math.ceil(Math.max(100,...series.flatMap(x=>x.values.filter(Number.isFinite)))/25)*25);
 let out='';
 for(let j=0;j<=5;j++){
  const y=320-j*55;
  out+='<path d="M66 '+y+'H730" stroke="#e0e9e1" stroke-width="1"/><text x="56" y="'+(y+4)+
   '" text-anchor="end" font-size="12" fill="#627768">'+fmt(ymax*j/5)+'</text>';
 }
 for(let j=0;j<=6;j++){
  const x=66+j*110.66;
  out+='<path d="M'+x+' 44V320" stroke="#edf0ec"/><text x="'+x+'" y="342" text-anchor="middle" font-size="12" fill="#627768">'+j*10+'</text>';
 }
 const y100=320-100/ymax*276;
 out+='<path d="M66 '+y100+'H730" stroke="#7cae9a" stroke-width="1.4" stroke-dasharray="5 5"/>'+
 '<text x="397" y="367" text-anchor="middle" font-size="13" fill="#4e735a">Tempo (passos abstratos)</text>'+
 '<text x="17" y="175" transform="rotate(-90 17 175)" text-anchor="middle" font-size="12" fill="#4e735a">Índice relativo (início = 100)</text>';
 series.forEach(({n,values,color})=>{
  const d=values.map((v,j)=>Number.isFinite(v)?
   (j?'L':'M')+(66+j/60*664).toFixed(2)+' '+(320-v/ymax*276).toFixed(2):'').join(' ');
  out+='<path d="'+d+'" stroke="'+color+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(values.length===1)out+='<circle cx="66" cy="'+(320-values[0]/ymax*276)+'" r="4" fill="'+color+'"/>';
 });
 root.innerHTML=out;
 $('chartLegend').innerHTML=series.length?
  series.map(({n,color})=>'<span><i style="background:'+color+'"></i>'+esc(n.name)+'</span>').join(''):
  '<span>Adicione elementos com unidades-modelo ou indivíduos e valor inicial positivo. Amostras e colônias não são séries populacionais.</span>';
}
function renderTable(){
 const rows=graph.nodes;
 $('simTable').innerHTML=rows.length?
  '<table><thead><tr><th>Elemento</th><th>Identidade</th><th>Quantidade</th><th>Unidade</th><th>kg informados</th></tr></thead><tbody>'+
  rows.map(n=>{
   const d=identityOf(n,spec(n.specId));
   const qty=d.massNature==='estoque'?'—':fmt(n.count);
   return '<tr><td>'+esc(n.name)+'</td><td>'+esc(window.TeiaMetrics.TYPES[d.kind])+
     '</td><td>'+qty+'</td><td>'+esc(window.TeiaMetrics.UNITS[d.unit])+'</td><td>'+
     (n.mass==null?'—':fmt(n.mass)+(d.massNature==='estoque'?' (estoque)':' (biomassa)'))+'</td></tr>';
  }).join('')+'</tbody></table>':
  '<p>Adicione elementos na Teia da Vida para começar.</p>';
}
function renderMini(){
 $('miniNodes').innerHTML=graph.nodes.slice(0,10).map(n=>{
  let s=spec(n.specId),d=identityOf(n,s);
  return '<div class="mini-card"><img src="'+(s?.image||'')+'" alt=""><b>'+esc(n.name)+
   '</b><div>'+(d.massNature==='estoque'?'Recurso':fmt(n.count)+' '+esc(window.TeiaMetrics.UNITS[d.unit]))+
   '</div></div>';
 }).join('');
}
function wire(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>switchView(b.dataset.nav));document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>switchView(b.dataset.jump));$('sidebarToggle').onclick=()=>{const v=$('sidebar').classList.toggle('hidden');document.querySelector('.app').classList.toggle('sidebar-closed',v);setTimeout(drawEdges,70)};$('search').oninput=renderLibrary;let fs=['Todos','Produtor','Consumidores','Decompositor','Detritívoro','Necrófago','Parasita','Polinizador','Espécies','Grupos','Comunidades','Associações','Recurso'];$('filters').innerHTML=fs.map(f=>'<button data-filter="'+f+'" class="'+(filter===f?'active':'')+'">'+(f==='Consumidores'?'Consumidores':f==='Produtor'?'Produtores':f==='Recurso'?'Recursos':f==='Comunidade'?'Comunidades':f==='Polinizador'?'Polinizadores':f==='Detritívoro'?'Detritívoros':f==='Necrófago'?'Necrófagos':f==='Parasita'?'Parasitas':f)+'</button>').join('');$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$('filters').querySelectorAll('button').forEach(c=>c.classList.toggle('active',c===b));renderLibrary()});$('addPicked').onclick=()=>{const s=selectedSpec();addNode(s);switchView('teia')};$('updatePicked').onclick=()=>{
 const n=selected?nodeById(selected):null;
 if(!n)return toast('Selecione um elemento da teia.');
 cancelSimulation();
 n.role=$('roleValue').value;
 n.entityType=$('entityTypeValue').value;
 n.countUnit=$('unitValue').value;
 n.scientificName=window.TeiaMetrics.normalizeName($('scientificValue').value);
 n.samplingEffort=window.TeiaMetrics.normalizeName($('sampleValue').value);
 n.count=Math.max(0,Math.round(Number($('nValue').value)||0));
 n.mass=$('bValue').value===''?null:Math.max(0,Number($('bValue').value));
 if(n.entityType==='recurso'||n.role==='Recurso'){
  n.entityType='recurso';n.role='Recurso';n.countUnit='nenhum';n.count=0;
 }
 persist();populateControls();renderAll();
 if(n.entityType==='especie'&&!window.TeiaMetrics.isBinomial(n.scientificName))
  toast('Informe o nome científico binomial para contar uma espécie nomeada.');
 else toast('Unidade, identidade e propriedades atualizadas.');
};$('deletePicked').onclick=()=>{if(selected)deleteNode(selected)};
for(const id of ['unitValue','entityTypeValue','roleValue'])$(id).onchange=updateIdentityHint;
for(let id of ['exampleHome','exampleTeia'])$(id).onclick=example;
for(let id of ['exampleInteractions','exampleInteractionsTeia'])$(id).onclick=exampleInteractions;for(let id of ['exampleAquatic','exampleAquaticTeia'])$(id).onclick=()=>exampleHabitat('aquatica');for(let id of ['exampleTerrestrial','exampleTerrestrialTeia'])$(id).onclick=()=>exampleHabitat('terrestre');$('startBlank').onclick=cleanGraph;$('clearTeia').onclick=cleanGraph;$('connectMode').onclick=()=>{connectMode=!connectMode;firstNode=null;setConnectState();drawNodes()};$('board').ondragover=e=>{e.preventDefault();$('board').classList.add('drop-active')};$('board').ondragleave=()=>$('board').classList.remove('drop-active');$('board').ondrop=e=>{e.preventDefault();$('board').classList.remove('drop-active');let s=spec(e.dataTransfer.getData('text/plain'));if(s){const p=dropPoint(e);addNode(s,p.x,p.y);switchView('teia')}};$('arrangeNodes').onclick=()=>{graph.nodes.forEach((n,i)=>{n.x=.18+(i%4)*.21;n.y=.22+Math.floor(i/4)*.22});persist();renderAll()};$('zoomMinus').onclick=()=>{zoom=Math.max(.8,zoom-.05);$('webContent').style.transform='scale('+zoom+')'};$('zoomPlus').onclick=()=>{zoom=Math.min(1.15,zoom+.05);$('webContent').style.transform='scale('+zoom+')'};
$('edgeActor').onchange=e=>changeEdge('actorId',e.target.value);$('edgeDirection').onchange=e=>changeEdge('direction',e.target.value);$('edgeKind').onchange=e=>changeEdge('kind',e.target.value);$('edgeNature').onchange=e=>changeEdge('nature',e.target.value);$('edgeFood').onchange=e=>changeEdge('foodId',e.target.value);$('edgeColor').oninput=e=>changeEdge('color',e.target.value);$('edgeWeight').oninput=e=>{let w=Number(e.target.value);changeEdge('weight',w);$('edgeWeightOut').textContent=fmt(w)};document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{$('edgeColor').value=b.dataset.color;changeEdge('color',b.dataset.color)});$('closeEdge').onclick=closeEdge;$('doneEdge').onclick=closeEdge;$('deleteEdge').onclick=deleteEdge;
for(let id of ['exportTop'])$(id).onclick=download;const importButton=document.createElement('button');importButton.textContent='Importar JSON';importButton.id='importJson';importButton.onclick=()=>file.click();document.querySelector('.top-actions').appendChild(importButton);const file=document.createElement('input');file.type='file';file.accept='.json,application/json';file.hidden=true;file.onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.nodes)||!Array.isArray(x.edges))throw Error();cancelSimulation();graph={nodes:x.nodes.filter(n=>spec(n.specId)).map(n=>{
 if(n.specId==='s5'&&n.role==='Decompositor')n.role='Detritívoro';
 if(n.specId==='s29'&&n.role==='Comunidade')n.role='Produtor';
 if(n.specId==='s30'&&n.role==='Comunidade')n.role='Consumidor';
 return n;
 }),edges:x.edges};persist();renderAll();switchView('teia');toast('Teia importada')}catch(err){toast('Arquivo JSON inválido')}file.value=''};document.body.appendChild(file);
for(const id of ['bioEnabled','bioLoad','bioMicrobes','bioAeration','bioTemperature']){
 const el=$(id);
 if(el)el.onchange=resetSim;
 if(el&&id!=='bioEnabled')el.oninput=renderBio;
}
$('exampleDecomposition').onclick=exampleDecomposition;
$('bioExperiment').onclick=()=>{
 $('bioEnabled').checked=true;
 $('pulseEnabled').checked=true;
 $('bioLoad').value=100;
 $('bioMicrobes').value=150;
 $('bioAeration').value=5;
 $('bioTemperature').value=90;
 $('scenario').value='equilibrio';
 resetSim();
 toast('Experimento preparado: carga orgânica elevada, alta atividade microbiana e baixa reaeração.');
};
$('pulseEnabled').onchange=resetSim;
$('pulseStart').onchange=resetSim;
$('pulseAmplitude').oninput=()=>renderFlood();
$('pulseAmplitude').onchange=resetSim;
document.querySelectorAll('[data-pulse-phase]').forEach(b=>b.onclick=()=>{$('pulseStart').value=b.dataset.pulsePhase;resetSim()});
$('intensity').oninput=()=>$('intensityOut').textContent=$('intensity').value+'%';
$('scenario').onchange=resetSim;$('intensity').onchange=resetSim;
const sliders=[['reproFactor','reproOut',true],['capacityFactor','capacityOut',true],['predationFactor','predationOut',true],['competitionFactor','competitionOut',false]];
for(const [inputId,outputId,multiplier] of sliders){
 const el=$(inputId),output=$(outputId);
 el.oninput=()=>output.textContent=multiplier?fmt(Number(el.value))+'×':Math.round(Number(el.value)*100)+'%';
 el.onchange=resetSim;
}
$('lagSteps').onchange=resetSim;$('simFocus').onchange=renderDrivers;
$('runSim').onclick=()=>{stopTimer();advance();if(simStep<60&&simInitial)simTimer=setInterval(advance,500)};$('pauseSim').onclick=stopTimer;$('stepSim').onclick=()=>{stopTimer();advance()};$('resetSim').onclick=resetSim;$('resetSimTop').onclick=resetSim;$('timeSlider').onchange=e=>{const target=Number(e.target.value);stopTimer();if(target<simStep)resetSim();while(simStep<target)advance()};$('helpBtn').onclick=()=>$('helpDialog').showModal();$('closeHelp').onclick=$('okHelp').onclick=()=>$('helpDialog').close();window.addEventListener('resize',drawEdges)}
wire();renderLibrary();renderCatalog();populateControls();renderAll();switchView('painel');
})();

(()=>{'use strict';
const $=id=>document.getElementById(id), esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=x=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:2});
const base=[
['Capim','capim','Produtor',240,50,'Gramíneas do Pantanal'],['Capivara','capivara','Consumidor',8,120,'Herbívoro semiaquático'],['Onça-pintada','onca-pintada','Predador',2,100,'Predador de topo'],['Jacaré','jacare','Predador',4,80,'Jacaré pantaneiro'],['Peixe','peixe','Consumidor',30,18,'Peixe de água doce (representação didática)'],['Minhoca','minhoca','Decompositor',25,2,'Detritívoro do solo'],['Fungos','fungos','Decompositor',12,5,'Grupo de fungos (unidade didática)'],['Musgo','musgo','Produtor',15,1,'Briófitas (unidades de amostragem)'],['Serapilheira','serapilheira','Recurso',0,20,'Matéria orgânica morta'],['Perifíton','perifiton','Comunidade',20,4,'Comunidade aderida a superfícies'],['Líquen','liquen','Comunidade',8,1,'Associação simbiótica'],['Biofilme','biofilme','Comunidade',15,3,'Comunidade microbiana'],['Tuiuiú','tuiuiu','Consumidor',5,25,'Ave símbolo do Pantanal'],['Garça-branca','garca-branca','Consumidor',7,12,'Ave aquática'],['Martim-pescador','martim-pescador','Consumidor',5,2,'Ave piscívora'],['Quati','quati','Consumidor',6,20,'Mamífero onívoro'],['Anta','anta','Consumidor',3,450,'Herbívoro e dispersor'],['Abelha nativa','abelha-nativa','Polinizador',90,1,'Abelha polinizadora (ilustração conceitual)'],['Aguapé florido','aguape-florido','Produtor',25,20,'Macrófita aquática'],['Acuri (palmeira)','acuri-palmeira','Produtor',12,150,'Palmeira de ambientes pantaneiros'],['Frutos de acuri','frutos-acuri','Recurso',0,15,'Recurso alimentar, não espécie'],['Ipê-amarelo','ipe-amarelo','Produtor',5,200,'Árvore florida'],['Cambará','cambara','Produtor',8,250,'Árvore do Pantanal'],['Carandá','caranda','Produtor',6,300,'Palmeira pantaneira'],['Vitória-régia','vitoria-regia','Produtor',12,24,'Planta aquática'],['Mandi','mandi','Consumidor',25,10,'Peixe bagre de água doce'],['Flores','flores','Recurso',0,2,'Estruturas reprodutivas, não espécie'],['Néctar','nectar','Recurso',0,.4,'Recurso para polinizadores'],['Sementes','sementes','Recurso',0,5,'Recurso para dispersores'],['Fitoplâncton','fitoplancton','Comunidade',30,2,'Comunidade planctônica'],
['Zooplâncton','zooplancton','Comunidade',120,null,'Microcrustáceos e outros consumidores planctônicos; abundância ilustrativa em unidades de amostragem.'],['Lambari','lambari','Consumidor',25,null,'Peixe pequeno geralmente onívoro; posição trófica depende da dieta e da espécie.'],['Traíra','traira','Predador',4,null,'Peixe predador, principalmente piscívoro quando adulto.'],['Gafanhoto','gafanhoto','Consumidor',36,null,'Inseto herbívoro; recurso para anfíbios e aves insetívoras.'],['Rã','ra','Consumidor',10,null,'Anfíbio; adultos de muitas espécies consomem insetos e outros invertebrados.'],['Bactérias decompositoras','bacterias-decompositoras','Decompositor',90,null,'Microrganismos decompositores; não representam uma única espécie nem indivíduos comparáveis.'],['Caramujo aquático','caramujo-aquatico','Detritívoro',30,null,'Molusco raspador ou detritívoro; a dieta varia conforme a espécie.'],['Sucuri','sucuri','Predador',2,null,'Serpente predadora semiaquática do Pantanal.'],['Lagarta','lagarta','Consumidor',20,null,'Fase larval de lepidóptero; muitas espécies se alimentam de folhas.'],['Larvas de insetos aquáticos','larvas-insetos-aquaticos','Comunidade',65,null,'Conjunto de larvas com dietas distintas: detritívoras, herbívoras e predadoras.'],['Besouro rola-bosta','besouro-rola-bosta','Detritívoro',15,null,'Coleóptero coprófago: alimenta-se e utiliza fezes de vertebrados.'],['Urubu','urubu','Necrófago',5,null,'Ave predominantemente necrófaga; fonte alimentar principal são carcaças.'],['Carrapato','carrapato','Parasita',18,null,'Ectoparasita hematófago; o hospedeiro depende da espécie de carrapato.'],['Gavião','gaviao','Predador',3,null,'Ave de rapina; dieta varia entre espécies de gavião.']
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
let current='painel',selected=null,preset='s1',filter='Todos',connectMode=false,firstNode=null,edgeSelection=null,zoom=1,simTimer=null,simStep=0,simInitial=null,simHistory={},simSnapshot=null,simModelState=null,simReports=[];
const persist=()=>{try{localStorage.setItem(store,JSON.stringify(graph))}catch(e){}};
let toastTimer;function toast(t){$('toast').textContent=t;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600)}
function nodeById(id){return graph.nodes.find(n=>n.id===id)}function spec(id){return base.find(s=>s.id===id)}function edgeId(){return 'e'+Date.now()+Math.random().toString(36).slice(2,7)}
function selectedSpec(){return spec(preset)}
function switchView(view){current=view;document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===view));if(view==='teia')requestAnimationFrame(()=>{drawEdges();renderFlood()});if(view==='simulacoes')requestAnimationFrame(()=>{drawChart();renderFlood()});window.scrollTo({top:0,behavior:'instant'})}
function roleCss(role){return /^[\wÀ-ÿ ]+$/.test(role)?role:'Outro'}
function itemTile(s){return '<button class="tile'+(s.id===preset?' selected':'')+'" data-spec="'+esc(s.id)+'" draggable="true" title="'+esc(s.name)+'"><img src="'+s.image+'" alt="Ilustração de '+esc(s.name)+'" draggable="false"><b>'+esc(s.name)+'</b><span class="role-tag '+roleCss(s.role)+'">'+esc(s.role)+'</span></button>'}
function renderLibrary(){let q=$('search').value.trim().toLocaleLowerCase('pt-BR');let visible=base.filter(s=>(filter==='Todos'||s.role===filter||(filter==='Consumidores'&&['Consumidor','Predador','Detritívoro','Necrófago','Parasita'].includes(s.role)))&&s.name.toLocaleLowerCase('pt-BR').includes(q));$('library').innerHTML=visible.map(itemTile).join('');$('library').querySelectorAll('.tile').forEach(el=>attachTile(el));}
function renderCatalog(){ $('catalogGrid').innerHTML=base.map(s=>'<article class="catalog-card"><img src="'+s.image+'" alt="Ilustração de '+esc(s.name)+'"><b>'+esc(s.name)+'</b><span class="role-tag '+roleCss(s.role)+'">'+esc(s.role)+'</span><p>'+esc(s.note)+'</p><button data-addcat="'+s.id+'">Adicionar à teia</button></article>').join('');$('catalogGrid').querySelectorAll('[data-addcat]').forEach(b=>b.onclick=()=>{const s=spec(b.dataset.addcat);addNode(s,.2+Math.random()*.6,.22+Math.random()*.55);switchView('teia')})}
function selectSpec(s){if(!s)return;preset=s.id;selected=graph.nodes.find(n=>n.specId===s.id)?.id||null;populateControls();renderLibrary()}
function selectNode(id){const n=nodeById(id);if(!n)return;selected=n.id;preset=n.specId;populateControls();renderLibrary();drawNodes()}
function populateControls(){const s=spec(preset),n=selected?nodeById(selected):null;$('pickedLabel').textContent=s?.name||'Selecione um organismo';$('nValue').value=n?.count??s?.count??0;$('bValue').value=n?.mass??s?.mass??'';$('roleValue').value=n?.role??s?.role??'Consumidor'}
function newNode(s,x,y){return {id:'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),specId:s.id,name:s.name,role:s.role,count:s.role==='Recurso'?0:s.count,mass:s.mass,x,y}}
function addNode(s,x=.25+Math.random()*.5,y=.25+Math.random()*.5){if(!s)return;cancelSimulation();let n=graph.nodes.find(n=>n.specId===s.id);if(n){n.x=x;n.y=y;toast(s.name+' reposicionado')}else{n=newNode(s,x,y);graph.nodes.push(n);toast(s.name+' adicionado')}persist();selectNode(n.id);renderAll()}
function deleteNode(id){cancelSimulation();graph.nodes=graph.nodes.filter(n=>n.id!==id);graph.edges=graph.edges.filter(e=>e.a!==id&&e.b!==id);if(selected===id)selected=null;if(firstNode===id)firstNode=null;closeEdge();persist();renderAll();toast('Elemento e relações associadas excluídos')}
function cleanGraph(){if(graph.nodes.length&&!confirm('Criar uma nova teia vazia? Exporte seu trabalho antes, se desejar.'))return;cancelSimulation();graph={nodes:[],edges:[]};selected=null;firstNode=null;closeEdge();persist();renderAll();switchView('teia')}
function example(){if(graph.nodes.length&&!confirm('Substituir a teia atual pelo exemplo?'))return;cancelSimulation();graph={nodes:[],edges:[]};let ids=[0,1,2,3,8,6,17,18,19,20,25];ids.forEach((i,k)=>{let s=base[i],n=newNode(s,.14+(k%4)*.23,.22+Math.floor(k/4)*.29);n.id='demo'+i;graph.nodes.push(n)});const link=(a,b,w,nature='consumo')=>graph.edges.push({id:edgeId(),a:'demo'+a,b:'demo'+b,weight:w,color:'#158b56',direction:'forward',kind:'direta',nature});link(0,1,.7);link(1,2,.7);link(25,3,.45);link(8,6,.5,'decomposicao');link(19,20,.6,'outro');link(18,17,.5,'polinizacao');selected=null;persist();renderAll();switchView('teia');toast('Exemplo carregado — edite livremente')}

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
  link(0,33,.7);link(33,34,.55);link(34,43,.3);
  link(27,17,.65);link(17,26,.65,'polinizacao');
  link(19,20,.5,'outro');link(20,15,.6);link(20,16,.55);
  link(42,16,.5,'parasitismo');
 }
 selected=null;persist();renderAll();switchView('teia');toast('Teia '+(aquatic?'aquática':'terrestre')+' didática carregada');
}
function renderStats(){let real=graph.nodes.filter(n=>n.role!=='Recurso');$('statRich').textContent=real.length;$('statN').textContent=fmt(real.reduce((sum,n)=>sum+n.count,0));const ms=graph.nodes.filter(n=>n.mass!==null&&Number.isFinite(Number(n.mass)));$('statBio').textContent=ms.length?fmt(ms.reduce((sum,n)=>sum+Number(n.mass),0)):'—';$('statEdges').textContent=graph.edges.length}
function dots(n){if(n.role==='Recurso')return '';let nDots=Math.max(0,Math.min(8,Math.ceil(n.count/Math.max(1,Math.ceil(n.count/8)))));return '<div class="dots" style="--dot:'+(colors[n.role]||'#4d9b64')+'">'+Array.from({length:nDots},()=>'<i></i>').join('')+'</div>'}
function drawNodes(){$('emptyHint').hidden=graph.nodes.length>0;$('nodesLayer').innerHTML=graph.nodes.map(n=>{let s=spec(n.specId);return '<div class="node'+(selected===n.id?' selected':'')+(firstNode===n.id?' connect-first':'')+'" data-node="'+esc(n.id)+'" tabindex="0" role="button" aria-label="'+esc(n.name)+'"><button class="remove-node" data-delete="'+esc(n.id)+'" aria-label="Excluir '+esc(n.name)+'">×</button><img src="'+(s?.image||'')+'" alt="'+esc(n.name)+'" draggable="false"><b>'+esc(n.name)+'</b><small>'+(n.role==='Recurso'?'Recurso':fmt(n.count)+' unidades')+'</small><small>'+(n.mass===null?'Biomassa não informada':fmt(n.mass)+' kg')+'</small>'+dots(n)+'</div>'}).join('');$('nodesLayer').querySelectorAll('[data-delete]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();el.onclick=e=>{e.stopPropagation();deleteNode(el.dataset.delete)}});$('nodesLayer').querySelectorAll('[data-node]').forEach(el=>{el.onclick=()=>handleNodeClick(el.dataset.node);el.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();handleNodeClick(el.dataset.node)}};el.onpointerdown=e=>{if(e.button!==0||connectMode)return;let n=nodeById(el.dataset.node),dragged=false;if(!n)return;el.setPointerCapture(e.pointerId);el.onpointermove=ev=>{if(!el.hasPointerCapture(ev.pointerId))return;dragged=true;let r=$('webContent').getBoundingClientRect();n.x=Math.max(.07,Math.min(.93,(ev.clientX-r.left)/r.width));n.y=Math.max(.1,Math.min(.9,(ev.clientY-r.top)/r.height));el.style.left=n.x*100+'%';el.style.top=n.y*100+'%';drawEdges()};el.onpointerup=()=>{el.onpointermove=null;if(dragged)persist()};el.onpointercancel=()=>{el.onpointermove=null}};let n=nodeById(el.dataset.node);el.style.left=n.x*100+'%';el.style.top=n.y*100+'%'})}
function handleNodeClick(id){if(connectMode){if(!firstNode){firstNode=id;$('connectHint').textContent='Agora clique no segundo elemento.';drawNodes();return}if(firstNode===id){firstNode=null;drawNodes();return}let e=graph.edges.find(x=>(x.a===firstNode&&x.b===id)||(x.b===firstNode&&x.a===id));if(!e){e={id:edgeId(),a:firstNode,b:id,direction:'forward',kind:'direta',nature:'consumo',color:'#16834a',weight:.6};graph.edges.push(e)}firstNode=null;connectMode=false;setConnectState();persist();renderAll();openEdge(e.id);return}selectNode(id)}
function setConnectState(){$('connectMode').classList.toggle('primary',!connectMode);$('connectMode').textContent=connectMode?'✓ Clique em dois nós':'⌁ Criar ligação';$('connectHint').hidden=!connectMode;if(connectMode)$('connectHint').textContent='Clique no primeiro elemento e depois no segundo.'}
function drawEdges(){const root=$('webContent'),r=root.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h)return;let defs='<defs>',paths='';graph.edges.forEach((e,i)=>{let color=/^#[0-9a-fA-F]{6}$/.test(e.color||'')?e.color:'#16834a';defs+='<marker id="head'+i+'" markerWidth="14" markerHeight="14" refX="12" refY="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L14 7L0 14Z" fill="'+color+'"/></marker>'});defs+='</defs>';graph.edges.forEach((e,i)=>{const a=nodeById(e.direction==='reverse'?e.b:e.a),b=nodeById(e.direction==='reverse'?e.a:e.b);if(!a||!b)return;const x=a.x*w,y=a.y*h,dx=(b.x-a.x)*w,dy=(b.y-a.y)*h,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l;const radius=window.innerWidth<760?49:67,start=radius+5,end=radius+17;const x1=x+ux*start,y1=y+uy*start,x2=b.x*w-ux*end,y2=b.y*h-uy*end;if(Math.hypot(x2-x1,y2-y1)<22)return;const cx=(x1+x2)/2-uy*18,cy=(y1+y2)/2+ux*18;const d='M'+x1+' '+y1+'Q'+cx+' '+cy+' '+x2+' '+y2;const weight=Math.min(1,Math.max(.1,Number(e.weight)||.6)),stroke=(1.5+5.2*weight).toFixed(1),color=e.color||'#16834a',dash=e.kind==='indireta'?'stroke-dasharray="8 7"':'';paths+='<path d="'+d+'" stroke="'+color+'" stroke-width="'+stroke+'" fill="none" stroke-linecap="round" '+dash+' marker-end="url(#head'+i+')"/>';paths+='<path data-edge="'+esc(e.id)+'" class="edge-hit" d="'+d+'" stroke="transparent" stroke-width="24" fill="none" tabindex="0" role="button" aria-label="Editar ligação"/>'});$('edgeSvg').setAttribute('viewBox','0 0 '+w+' '+h);$('edgeSvg').innerHTML=defs+paths;$('edgeSvg').querySelectorAll('[data-edge]').forEach(el=>{el.onclick=ev=>{ev.stopPropagation();openEdge(el.dataset.edge)};el.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openEdge(el.dataset.edge)}}})}
function defaultFoodId(a,b){
 if(!a||!b)return a?.id||b?.id||'';
 const rank=n=>{let name=String(n.name||'').toLowerCase();if(n.role==='Recurso')return 0;if(n.role==='Produtor'||name.includes('fitoplâncton')||name.includes('perifíton')||name.includes('líquen'))return 1;if(n.role==='Predador')return 4;if(n.role==='Necrófago'||n.role==='Parasita')return 3;return 2};
 return rank(a)<=rank(b)?a.id:b.id;
}
function updateFoodFields(e){
 if(!e)return;
 const a=nodeById(e.a),b=nodeById(e.b),field=$('edgeFood');
 $('edgeFoodWrap').hidden=e.nature!=='consumo';
 field.innerHTML='<option value="'+esc(e.a)+'">'+esc(a?.name||'Origem')+'</option><option value="'+esc(e.b)+'">'+esc(b?.name||'Destino')+'</option>';
 field.value=e.foodId===e.a||e.foodId===e.b?e.foodId:defaultFoodId(a,b);
 const consumer=field.value===e.a?b:a;
 $('edgeFoodConsumer').textContent=consumer?.name?'Quem consome: '+consumer.name:'';
}
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
 updateFoodFields(e);$('edgeEditor').hidden=false;
}
function changeEdge(key,value){
 const e=graph.edges.find(x=>x.id===edgeSelection);if(!e)return;
 if(['kind','nature','weight','foodId'].includes(key))cancelSimulation();
 e[key]=value;
 if(key==='nature'||key==='foodId')updateFoodFields(e);
 persist();drawEdges();
 if(['kind','nature','weight','foodId'].includes(key))renderAll();
}
function closeEdge(){edgeSelection=null;$('edgeEditor').hidden=true}
function deleteEdge(){graph.edges=graph.edges.filter(e=>e.id!==edgeSelection);closeEdge();persist();renderAll();toast('Ligação excluída')}
function renderAll(){renderStats();drawNodes();drawEdges();drawChart();renderMini();renderTable();renderDrivers();renderFlood()}
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

function cancelSimulation(){
 stopTimer();
 if(simInitial)graph.nodes.forEach(n=>{const first=simInitial[n.id];if(first){n.count=first.count;n.mass=first.mass}});
 simInitial=null;simModelState=null;simReports=[];simStep=0;simHistory={};
 $('timeSlider').value=0;$('stepOut').textContent='0 / 60';
}
function ensureSim(){
 if(simInitial)return;
 simInitial=Object.fromEntries(graph.nodes.map(n=>[n.id,{count:n.count,mass:n.mass}]));
 simModelState=window.TeiaDynamics.init(graph.nodes);
 simHistory=Object.fromEntries(graph.nodes.map(n=>[n.id,[n.count]]));
}
function advance(){
 if(simStep>=60){stopTimer();return}
 if(!window.TeiaDynamics){stopTimer();toast('Motor ecológico indisponível; atualize a página.');return}
 if(!graph.nodes.some(n=>n.role!=='Recurso')){stopTimer();toast('Adicione pelo menos um organismo para simular.');return}
 ensureSim();
 const outcome=window.TeiaDynamics.advance(graph.nodes,graph.edges,simModelState,modelOptions(simStep+1));
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
  ['Herbivoria / predação',report.predation,true],
  ['Estresse ambiental da seca',report.climate,true],
  ['Restrição de habitat pelo pulso',report.hydrology||0,true]
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
 ' Os valores internos têm decimais; os nós arredondam a abundância para facilitar a leitura.</p>';
 const ranked=simReports.filter(x=>x.role!=='Recurso'&&Math.abs(x.change)>.0005).sort((a,b)=>Math.abs(b.change/Math.max(1,b.before))-Math.abs(a.change/Math.max(1,a.before))).slice(0,3);
 summary.innerHTML=ranked.map(x=>'<div class="sim-why-card"><strong>'+esc(x.name)+' '+(x.change>0?'↑':'↓')+' '+fmt(Math.abs(x.change/Math.max(1,x.before)*100))+'%</strong><small>'+esc(x.reason)+'</small></div>').join('');
}
function drawChart(){let root=$('chartSvg');if(!root)return;const series=graph.nodes.filter(n=>n.role!=='Recurso').slice(0,7),palette=['#1e9349','#e6a21c','#c64f39','#2888b1','#9356b4','#699b3e','#ad735e'],max=Math.max(1,...series.flatMap(n=>simHistory[n.id]||[n.count]));let out='';for(let j=0;j<=5;j++){const y=320-j*55;out+='<path d="M66 '+y+'H730" stroke="#e0e9e1" stroke-width="1"/><text x="56" y="'+(y+4)+'" text-anchor="end" font-size="12" fill="#627768">'+Math.round(max*j/5)+'</text>'}for(let j=0;j<=6;j++){const x=66+j*110.66;out+='<path d="M'+x+' 44V320" stroke="#edf0ec"/><text x="'+x+'" y="342" text-anchor="middle" font-size="12" fill="#627768">'+j*10+'</text>'}out+='<text x="397" y="367" text-anchor="middle" font-size="13" fill="#4e735a">Tempo (passos)</text><text x="17" y="175" transform="rotate(-90 17 175)" text-anchor="middle" font-size="13" fill="#4e735a">Abundância (N)</text>';series.forEach((n,i)=>{const arr=simHistory[n.id]||[n.count],d=arr.map((v,j)=>(j?'L':'M')+(66+j/60*664).toFixed(2)+' '+(320-v/max*276).toFixed(2)).join(' ');out+='<path d="'+d+'" stroke="'+palette[i]+'" stroke-width="3.1" fill="none" stroke-linecap="round"/>';if(arr.length===1)out+='<circle cx="66" cy="'+(320-arr[0]/max*276)+'" r="4" fill="'+palette[i]+'"/>'});root.innerHTML=out;$('chartLegend').innerHTML=series.map((n,i)=>'<span><i style="background:'+palette[i]+'"></i>'+esc(n.name)+'</span>').join('')}
function renderTable(){const rows=graph.nodes.filter(n=>n.role!=='Recurso');$('simTable').innerHTML=rows.length?'<table><thead><tr><th>Organismo</th><th>Abundância</th><th>Biomassa (kg)</th></tr></thead><tbody>'+rows.map(n=>'<tr><td>'+esc(n.name)+'</td><td>'+fmt(n.count)+'</td><td>'+(n.mass===null?'—':fmt(n.mass))+'</td></tr>').join('')+'</tbody></table>':'<p>Adicione organismos na Teia da Vida para começar.</p>'}
function renderMini(){$('miniNodes').innerHTML=graph.nodes.slice(0,10).map(n=>{let s=spec(n.specId);return '<div class="mini-card"><img src="'+(s?.image||'')+'" alt=""><b>'+esc(n.name)+'</b><div>N: '+fmt(n.count)+'</div></div>'}).join('')}
function wire(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>switchView(b.dataset.nav));document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>switchView(b.dataset.jump));$('sidebarToggle').onclick=()=>{const v=$('sidebar').classList.toggle('hidden');document.querySelector('.app').classList.toggle('sidebar-closed',v);setTimeout(drawEdges,70)};$('search').oninput=renderLibrary;let fs=['Todos','Produtor','Consumidores','Decompositor','Detritívoro','Necrófago','Parasita','Polinizador','Comunidade','Recurso'];$('filters').innerHTML=fs.map(f=>'<button data-filter="'+f+'" class="'+(filter===f?'active':'')+'">'+(f==='Consumidores'?'Consumidores':f==='Produtor'?'Produtores':f==='Recurso'?'Recursos':f==='Comunidade'?'Comunidades':f==='Polinizador'?'Polinizadores':f==='Detritívoro'?'Detritívoros':f==='Necrófago'?'Necrófagos':f==='Parasita'?'Parasitas':f)+'</button>').join('');$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$('filters').querySelectorAll('button').forEach(c=>c.classList.toggle('active',c===b));renderLibrary()});$('addPicked').onclick=()=>{const s=selectedSpec();addNode(s);switchView('teia')};$('updatePicked').onclick=()=>{const n=selected?nodeById(selected):null;if(!n)return toast('Selecione um elemento da teia.');cancelSimulation();n.count=Math.max(0,Math.round(Number($('nValue').value)||0));n.mass=$('bValue').value===''?null:Math.max(0,Number($('bValue').value));n.role=$('roleValue').value;persist();renderAll();toast('Elemento atualizado')};$('deletePicked').onclick=()=>{if(selected)deleteNode(selected)};
for(let id of ['exampleHome','exampleTeia'])$(id).onclick=example;for(let id of ['exampleAquatic','exampleAquaticTeia'])$(id).onclick=()=>exampleHabitat('aquatica');for(let id of ['exampleTerrestrial','exampleTerrestrialTeia'])$(id).onclick=()=>exampleHabitat('terrestre');$('startBlank').onclick=cleanGraph;$('clearTeia').onclick=cleanGraph;$('connectMode').onclick=()=>{connectMode=!connectMode;firstNode=null;setConnectState();drawNodes()};$('board').ondragover=e=>{e.preventDefault();$('board').classList.add('drop-active')};$('board').ondragleave=()=>$('board').classList.remove('drop-active');$('board').ondrop=e=>{e.preventDefault();$('board').classList.remove('drop-active');let s=spec(e.dataTransfer.getData('text/plain'));if(s){const p=dropPoint(e);addNode(s,p.x,p.y);switchView('teia')}};$('arrangeNodes').onclick=()=>{graph.nodes.forEach((n,i)=>{n.x=.18+(i%4)*.21;n.y=.22+Math.floor(i/4)*.22});persist();renderAll()};$('zoomMinus').onclick=()=>{zoom=Math.max(.8,zoom-.05);$('webContent').style.transform='scale('+zoom+')'};$('zoomPlus').onclick=()=>{zoom=Math.min(1.15,zoom+.05);$('webContent').style.transform='scale('+zoom+')'};
$('edgeDirection').onchange=e=>changeEdge('direction',e.target.value);$('edgeKind').onchange=e=>changeEdge('kind',e.target.value);$('edgeNature').onchange=e=>changeEdge('nature',e.target.value);$('edgeFood').onchange=e=>changeEdge('foodId',e.target.value);$('edgeColor').oninput=e=>changeEdge('color',e.target.value);$('edgeWeight').oninput=e=>{let w=Number(e.target.value);changeEdge('weight',w);$('edgeWeightOut').textContent=fmt(w)};document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{$('edgeColor').value=b.dataset.color;changeEdge('color',b.dataset.color)});$('closeEdge').onclick=closeEdge;$('doneEdge').onclick=closeEdge;$('deleteEdge').onclick=deleteEdge;
for(let id of ['exportTop'])$(id).onclick=download;const importButton=document.createElement('button');importButton.textContent='Importar JSON';importButton.id='importJson';importButton.onclick=()=>file.click();document.querySelector('.top-actions').appendChild(importButton);const file=document.createElement('input');file.type='file';file.accept='.json,application/json';file.hidden=true;file.onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.nodes)||!Array.isArray(x.edges))throw Error();cancelSimulation();graph={nodes:x.nodes.filter(n=>spec(n.specId)),edges:x.edges};persist();renderAll();switchView('teia');toast('Teia importada')}catch(err){toast('Arquivo JSON inválido')}file.value=''};document.body.appendChild(file);
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

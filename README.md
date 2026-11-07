# Teia da Vida — Pantanal

Plataforma educacional independente (HTML, CSS e JavaScript, sem bibliotecas externas) para construir teias ecológicas e explorar simulações didáticas.

## Como publicar no GitHub Pages
1. Este projeto já está no repositório [`ernandes-sobreira/ecologia-jogo`](https://github.com/ernandes-sobreira/ecologia-jogo).
2. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)` (caso ainda não esteja habilitado).
3. Abra `https://ernandes-sobreira.github.io/ecologia-jogo/`.

A plataforma não depende do repositório da aula e não possui links de volta a ela.

## Funcionalidades
- Catálogo com **44 elementos**: 30 ilustrações WebP originais e 14 ilustrações SVG naturalistas adicionais, todos locais em `assets/organismos/` (sem fotografias externas).
- Novos grupos: detritívoros, necrófagos e parasitas; novos exemplos editáveis de teias **aquática** e **terrestre**.
- Arrastar, soltar, reposicionar, excluir organismos.
- Criar setas clicando em dois nós; editar direção, cor, peso e relação direta/indireta; excluir setas.
- Separação real entre Painel, Teia da Vida, Simulações e Catálogo.
- Contadores de elementos, abundância, biomassa e relações.
- Simulações didáticas de seca, recuperação e predação, agora com reprodução, capacidade de suporte, mortalidade por densidade, competição alimentar, escassez, defasagem e explicação dos ganhos e perdas.
- Dados guardados no armazenamento local do navegador e exportação/importação JSON.

## Motor de dinâmica populacional (versão didática 1)

A aba **Simulações** usa `sim-model.js` e não mais uma alteração fixa arbitrária nas populações. Cada passo calcula, para os elementos vivos da teia:

- **Reprodução** com redução do crescimento conforme a abundância se aproxima da **capacidade de suporte K**;
- **Mortalidade natural e dependente da densidade** quando há superlotação;
- **Disponibilidade de alimento** calculada a partir da variação relativa das presas e da força de cada ligação de **consumo direto**;
- **Herbivoria e predação**, que reduzem a população consumida e afetam o consumidor;
- **Competição interespecífica** apenas quando dois consumidores compartilham explicitamente um mesmo alimento;
- **Escassez alimentar**, que diminui a reprodução e pode aumentar a mortalidade;
- **Atraso demográfico ajustável** de 0 a 4 passos: os consumidores podem responder depois da alteração dos recursos.

Os parâmetros Reprodução, K, Predação, Competição e Atraso podem ser ajustados na seção **Parâmetros ecológicos da simulação**. O painel **Por que as populações mudaram?** apresenta ganhos, perdas, disponibilidade alimentar e capacidade de suporte de cada elemento, além de destacar as maiores mudanças.

Para a ligação de consumo, o aluno pode indicar **quem é o alimento ou presa** sem alterar a direção gráfica da seta, porque a direção usada para desenhar uma interação pode ter convenções distintas do fluxo de energia.

**Interpretação:** são modelos determinísticos, discretos, fenomenológicos, com parâmetros ilustrativos e sem calibração; um passo não equivale a um dia ou ano. A variação de abundância mantém internamente casas decimais, enquanto a interface exibe valores arredondados. Não representam estimativas de reprodução, predação ou abundância das espécies reais.

**Limites:** relações indiretas, parasitismo, dispersão, polinização, decomposição e ciclagem de nutrientes ainda **não** são modelados como processos populacionais específicos; recursos (ex.: serapilheira) continuam como estoques sem dinâmica nesta etapa. Se a teia não possui alimento para determinado consumidor, o simulador assume recurso alimentar externo não cadastrado e informa isso na explicação. A oferta de alimento é um índice relativo, não soma de indivíduos incompatíveis. Não há imigração, estrutura etária, aleatoriedade ou espacialização.

Referência didática sobre crescimento logístico, regulação dependente da densidade e competição: [OpenStax — Population Dynamics and Regulation](https://openstax.org/books/biology-2e/pages/45-4-population-dynamics-and-regulation).

## Pulso de inundação do Pantanal (etapa 2)

- Na aba **Simulações**, ative **Pulso de inundação** para percorrer as quatro fases: **enchente, cheia, vazante e seca**.
- Clique nas fases para escolher a fase inicial, ou use **Fase inicial**. A amplitude é ajustável entre 30% e 140% da curva *hipotética*. Cada ciclo tem 60 passos abstratos.
- O painel mostra **nível relativo**, **índice de área inundada** e **conectividade relativa** (escalas de 0 a 100). **Não são metros, hectares nem porcentagens observadas do Pantanal.**
- A teia recebe um véu azul discreto que acompanha o índice de inundação. As imagens e ligações permanecem visíveis.
- O módulo `flood-pulse.js` fornece uma curva de pulso e caracteriza ambientes aquáticos, macrófitas, campos inundáveis, organismos semiaquáticos e outros ambientes.
- O módulo `sim-model.js` recebe as condições hidrológicas em cada passo: altera a capacidade de suporte de cada grupo, o acesso relativo a alimentos/habitats e, em alguns casos, o estresse ambiental e a exposição à predação durante a vazante.
- Para verificar, carregue o **exemplo aquático**, execute a simulação e compare os indicadores e populações com **Pulso ligado** e **Pulso desligado**. O cenário **Sem pressão adicional** permite observar o efeito do ciclo, sem misturá-lo a uma seca excepcional.
- A simulação **não modela oxigênio dissolvido, dequada, deslocamentos espaciais reais, chuva e vazão observadas nem mortalidade por enchentes individuais**. As respostas servem para formular hipóteses didáticas e exigiriam calibração e dados para uso científico quantitativo.

**Base conceitual:** estudos sobre conectividade lateral e comunidades de peixes nas lagoas do Pantanal, como [Boletim do Instituto de Pesca (2018)](https://institutodepesca.org/index.php/bip/pt_BR/article/view/1276) e materiais da Embrapa Pantanal.

## Etapa 3 — decomposição e ciclagem de nutrientes (motor conceitual)

A aba **Simulações** oferece um laboratório de `Matéria orgânica → decomposição microbiana → nutrientes + CO₂ → consumo de oxigênio`.

- Os índices **matéria orgânica, oxigênio, nutrientes e CO₂** variam de 0 a 100 e **não** são concentrações, massas ou fluxos medidos.
- Controles: **carga orgânica inicial**, **atividade microbiana**, **reaeração da água** e **temperatura relativa**.
- Clique **Carregar exemplo de decomposição** para uma teia com capim, serapilheira, fungos, bactérias, fitoplâncton, zooplâncton, lambari, traíra e jacaré. Depois clique **Testar carga orgânica elevada** e **Executar**.
- A presença de fungos/bactérias e de detritos na teia modifica o modelo; ligações **diretas** marcadas **Decomposição**, entre detritos e decompositores, também aumentam uma atividade de decomposição *hipotética*.
- A subida das águas pode submergir matéria orgânica e aumentar a demanda microbiana por oxigênio. A reaeração e a fotossíntese podem repor oxigênio.
- O **índice de oxigênio** entra no cálculo da sobrevivência de peixes e de alguns invertebrados aquáticos. Os nutrientes podem modificar a capacidade de suporte potencial de produtores aquáticos.
- O alerta **risco elevado de condições semelhantes à dequada** é acionado apenas quando os índices ecológicos e o pulso satisfazem condições didáticas específicas; **não** é diagnóstico, previsão ou classificação regulatória.
- A mudança do estoque de um nó para o estoque de detritos não corresponde a um balanço de massa físico. Não se misturam contagens de algas, bactérias, peixes e plantas nem se convertem unidades amostrais automaticamente em kg.
- Os fluxos de matéria orgânica, decomposição, oxigênio e CO₂ **não são calibrados** com observações; o modelo não calcula pH, OD em mg/L, CO₂ livre em mg/L, CH₄, estratificação, transporte, respiração individual por espécie ou toxicidade.

**Fontes científicas de referência:** Calheiros e Ferreira (1996), [Alterações limnológicas no Rio Paraguai ("dequada")](https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/792189); Oliveira, Calheiros e Padovani (2013), [Mapeamento e descrição das áreas de ocorrência dos eventos de decoada no Pantanal](https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/958791).

**Testes reproduzíveis:** `node tests/biogeo.test.js` e `node tests/pulso.test.js`.

## Etapa 4 — relações ecológicas com mecanismos diferentes

Na aba **Teia da Vida**, clique **Criar ligação**, selecione dois nós e, no editor da seta, escolha a **natureza ecológica**, o **papel dos participantes**, o **peso** e se a relação é **direta** ou **indireta**. O sentido e a cor da seta são opções visuais e **não** trocam as funções biológicas.

- **Predação / consumo animal (+/−):** reduz a população da presa; o consumidor obtém acesso alimentar. Quem é consumido deve ser explicitado em *Alimento/presa*.
- **Herbivoria (+/−):** o consumidor obtém alimento vegetal; a planta pode perder tecido ou recrutamento no modelo. Não é tratada como morte imediata de cada árvore ou capim.
- **Competição (−/−):** gera custos para ambos, conforme suas abundâncias relativas e o peso. O modelo também reconhece competição por alimento compartilhado, evitando aplicar duas penalizações ao mesmo par.
- **Parasitismo (+/−):** escolha *Quem é o parasita?*; representa custo ao hospedeiro e benefício dependente de hospedeiros ao parasita. Não equivale à predação instantânea.
- **Mutualismo (+/+):** benefícios limitados e dependentes da presença dos dois parceiros; não são garantias de que qualquer associação seja mutualística.
- **Polinização:** escolha *Quem poliniza?*; pode beneficiar recursos dos polinizadores e o **recrutamento potencial** da planta, após atraso configurado. Não representa produção imediata de árvores adultas.
- **Dispersão:** escolha *Quem dispersa?*; o animal pode receber recursos alimentares e a planta obter maior recrutamento potencial após atraso (mínimo de 2 passos).
- **Detritivoria:** alimentação sobre material orgânico morto, **sem morte de organismo vivo**; pode aumentar a disponibilidade energética do detritívoro e facilitar a fragmentação que altera a decomposição microbiana.
- **Necrofagia:** o urubu ou outro necrófago utiliza carcaças originadas na mortalidade de vertebrados. O consumo das carcaças **não acrescenta mortes** à população de origem. A oferta é aproximada pelas perdas demográficas do passo anterior.
- **Decomposição:** ligada ao módulo `biogeochemistry.js`, que modela matéria orgânica, nutrientes e índices relativos de oxigênio e CO₂. Não é o mesmo que detritivoria.
- **Relação indireta:** desenhada por linha tracejada e tratada como hipótese mediada. Quando há um caminho de dois elos diretos, o painel indica o organismo mediador. **Não é adicionada uma força independente**, para evitar contar duas vezes a mesma cascata.
- **Outra:** anotação visual sem efeito calculado.

Use o botão **Interações ecológicas** no painel ou **Interações** na teia para carregar um exemplo contendo herbivoria, predação, parasitismo, polinização, dispersão, competição, decomposição e um caminho indireto. Em **Simulações → O que cada interação faz?**, examine mecanismos ativos, relações inválidas e mediações. Em **Por que as populações mudaram?**, os processos aparecem em parcelas separadas.

**Limitações:** sinais (+/−) são classificações conceituais gerais, mas respostas empíricas podem variar com espécie, estágio, estação e contexto. O modelo não calibra parâmetros por espécie nem estima taxas de predação, parasitismo, fecundidade, germinação ou dispersão medidas no Pantanal. Os passos são abstratos e os valores de abundância e biomassa iniciais continuam ilustrativos. Relações indiretas são analisadas por caminhos simples de dois elos e efeitos dinâmicos transmitidos pelas diretas; redes complexas exigiriam modelagem específica.

**Leituras de referência:** Stevens (2010), [Predation, Herbivory, and Parasitism](https://www.nature.com/scitable/knowledge/library/predation-herbivory-and-parasitism-13261134/); [Population ecology](https://doi.org/10.1036/1097-8542.538150); [Simple Mechanisms of Plant Reproductive Benefits Yield Different Dynamics in Pollination and Seed Dispersal Mutualisms](https://pubmed.ncbi.nlm.nih.gov/35905405/); Rogers et al. (2021), [Cascading Impacts of Seed Disperser Loss](https://www.annualreviews.org/content/journals/10.1146/annurev-ecolsys-012221-111742); [parasitism meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10099232/).

**Testes reproduzíveis:** `node tests/interacoes.test.js`, `node tests/pulso.test.js` e `node tests/biogeo.test.js`.

## Limitações científicas
A simulação continua conceitual e não foi calibrada com observações de campo. A etiqueta "elementos biológicos" não é riqueza de espécies quando se incluem grupos, comunidades, associações ou táxons genéricos. A serapilheira, flores, frutos, néctar e sementes são recursos, não organismos individuais. As abundâncias e biomassas iniciais são ilustrativas e editáveis; não representam estimativas reais. Os novos elementos foram cadastrados com biomassa não informada até o estudante atribuir um valor. Grupos como zooplâncton, larvas aquáticas e bactérias decompositoras não são uma única espécie; por isso as suas unidades de contagem precisam ser definidas conforme o método de amostragem. Exemplos mostram relações possíveis, cuja ocorrência local depende de espécies e condições. As interações diretas agora têm regras didáticas distintas; efeitos indiretos são registrados como caminhos mediados e não acrescentam forças independentes, para evitar duplicidade. Isso não equivale a um modelo demográfico calibrado para espécies do Pantanal.

## Privacidade
Os dados ficam no próprio navegador (localStorage), sem servidor, login ou compartilhamento automático. Exporte seu JSON para fazer cópias.

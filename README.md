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

## Limitações científicas
A simulação é conceitual e não foi calibrada com observações de campo. A etiqueta "elementos biológicos" não é riqueza de espécies quando se incluem grupos, comunidades, associações ou táxons genéricos. A serapilheira, flores, frutos, néctar e sementes são recursos, não organismos individuais. As abundâncias e biomassas iniciais são ilustrativas e editáveis; não representam estimativas reais. Os novos elementos foram cadastrados com biomassa não informada até o estudante atribuir um valor. Grupos como zooplâncton, larvas aquáticas e bactérias decompositoras não são uma única espécie; por isso as suas unidades de contagem precisam ser definidas conforme o método de amostragem. Exemplos mostram relações possíveis, cuja ocorrência local depende de espécies e condições. As simulações dinâmicas representam principalmente ligações diretas de consumo; decomposição, parasitismo, polinização e relações indiretas podem ser desenhadas, mas não são modeladas como processos demográficos específicos.

## Privacidade
Os dados ficam no próprio navegador (localStorage), sem servidor, login ou compartilhamento automático. Exporte seu JSON para fazer cópias.

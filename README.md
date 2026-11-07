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
- Simulações didáticas de seca, recuperação e predação com gráfico atualizado.
- Dados guardados no armazenamento local do navegador e exportação/importação JSON.

## Limitações científicas
A simulação é conceitual e não foi calibrada com observações de campo. A etiqueta "elementos biológicos" não é riqueza de espécies quando se incluem grupos, comunidades, associações ou táxons genéricos. A serapilheira, flores, frutos, néctar e sementes são recursos, não organismos individuais. As abundâncias e biomassas iniciais são ilustrativas e editáveis; não representam estimativas reais. Os novos elementos foram cadastrados com biomassa não informada até o estudante atribuir um valor. Grupos como zooplâncton, larvas aquáticas e bactérias decompositoras não são uma única espécie; por isso as suas unidades de contagem precisam ser definidas conforme o método de amostragem. Exemplos mostram relações possíveis, cuja ocorrência local depende de espécies e condições. As simulações dinâmicas representam principalmente ligações diretas de consumo; decomposição, parasitismo, polinização e relações indiretas podem ser desenhadas, mas não são modeladas como processos demográficos específicos.

## Privacidade
Os dados ficam no próprio navegador (localStorage), sem servidor, login ou compartilhamento automático. Exporte seu JSON para fazer cópias.

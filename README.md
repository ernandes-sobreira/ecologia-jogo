# Teia da Vida — Pantanal

Plataforma educacional independente (HTML, CSS e JavaScript, sem bibliotecas externas) para construir teias ecológicas e explorar simulações didáticas.

## Como publicar no GitHub Pages
1. Crie um repositório público denominado `teia-da-vida-pantanal` em sua conta.
2. Envie **o conteúdo desta pasta** para a raiz do repositório (index.html, styles.css, app.js e pasta assets).
3. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Abra `https://SEU-USUARIO.github.io/teia-da-vida-pantanal/`.

A plataforma não depende do repositório da aula e não possui links de volta a ela.

## Funcionalidades
- 30 ilustrações originais padronizadas do Pantanal em `assets/organismos`.
- Arrastar, soltar, reposicionar, excluir organismos.
- Criar setas clicando em dois nós; editar direção, cor, peso e relação direta/indireta; excluir setas.
- Separação real entre Painel, Teia da Vida, Simulações e Catálogo.
- Contadores de elementos, abundância, biomassa e relações.
- Simulações didáticas de seca, recuperação e predação com gráfico atualizado.
- Dados guardados no armazenamento local do navegador e exportação/importação JSON.

## Limitações científicas
A simulação é conceitual e não foi calibrada com observações de campo. A etiqueta "elementos biológicos" não é riqueza de espécies quando se incluem grupos, comunidades, associações ou táxons genéricos. A serapilheira, flores, frutos, néctar e sementes são recursos, não organismos individuais. As abundâncias e biomassas iniciais são ilustrativas e editáveis; não representam estimativas reais.

## Privacidade
Os dados ficam no próprio navegador (localStorage), sem servidor, login ou compartilhamento automático. Exporte seu JSON para fazer cópias.

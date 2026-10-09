# Prévia: Lumina Class Barbearia

Prévia de demonstração criada por Crociatti Digital. **Não é o site oficial.**
A página tem `noindex, nofollow` e não deve aparecer no Google.

HTML, CSS e JavaScript puros: não precisa instalar nada nem rodar build.

## Estrutura

```
index.html      estrutura das seções (não precisa mexer)
config.js       TODOS os dados da barbearia: troque só este arquivo
css/styles.css  visual
js/app.js       monta a página a partir do config.js
assets/         fotos
```

## Usar para outra barbearia

1. Copie a pasta inteira.
2. Edite só o `config.js`: marca, cores, unidades, horários, serviços, links.
3. Valor `null` é uma **pendência**. Com `mostrarPendencias: false` (padrão) ela
   some da página junto com a linha, o botão ou a foto dela. Com `true`, aparece
   como **[CONFIRMAR]** / **[FOTO DO AMBIENTE]** para revisão. Para revisar sem
   mexer no arquivo, acrescente `?pendencias=1` ao endereço.
4. Em títulos e frases, `*palavra*` vira a caixa vermelha de destaque. Use pouco
   (hoje só no topo e na assinatura): repetida em todo título ela perde a força.
5. Seções: topo, unidades, serviços, barboterapia, assinatura, escola e rodapé.
   Para tirar uma (ex.: `escola`, `assinatura`), apague o bloco dela no `config.js`.
   Se todas as unidades têm o mesmo horário, a tabela aparece uma vez só, acima
   dos cartões. Do cardápio, só a primeira categoria aparece na página.
6. O mapa das unidades é desenhado a partir de `lat`/`lng`: não precisa de chave
   de API nem biblioteca. O fundo (`assets/mapa-butanta.svg`) usa os limites reais
   dos distritos (Prefeitura de SP). Para outra região, troque a imagem e os
   `limites` no bloco `mapa` do `config.js`, ou apague o bloco para usar um
   quadro esquemático.
7. Tema: `tema: "claro"` ou `"escuro"`, com as cores em `cores.claro` e
   `cores.escuro` (fundo e texto) e `cores.destaque`. Para comparar sem publicar,
   use `?tema=escuro` ou `?tema=claro` no endereço. A versão clara de antes das
   mudanças de enxugar a página está guardada na branch `versao-clara`.
8. Para um site oficial (não prévia), troque `previa.ativo` para `false`
   e remova as duas linhas `robots`/`googlebot` do `index.html`.

### Fotos

Nesta prévia as fotos vêm direto da galeria pública da Lumina no AppBarber
(só ambiente e detalhes, sem rosto de cliente). Se a barbearia trocar as fotos
lá, elas somem daqui: para fixar, salve as imagens em `assets/` e troque o
`src` no `config.js` (ex.: `"assets/bonfiglioli.jpg"`, até ~300 KB, horizontal).

O campo `posicao` ajusta o enquadramento (ex.: `"15% center"` corta a direita).
Foto `null` mostra o espaço [FOTO DO AMBIENTE].
Não use fotos com rosto de clientes sem autorização.

## Testar no computador

Dê dois cliques no `index.html`. Para testar a localização, use um servidor local:

```bash
python -m http.server 5173
```

e abra `http://localhost:5173`.

### Simular horário (selo Aberto/Fechado)

Acrescente `?agora=dia-HH:MM` ao endereço. Exemplos:

- `?agora=sab-17:30` → aberto, fecha às 18h
- `?agora=dom-14:00` → fechado, abre amanhã às 9h

Dias: `dom seg ter qua qui sex sab`. Feriados não são considerados.

## Publicar no GitHub Pages

1. Envie os arquivos para o repositório `demoLandpageLumina` no GitHub.
2. No GitHub: **Settings → Pages → Build and deployment**.
3. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e salve.
4. Em 1 a 2 minutos o site fica em `https://fcrociatti.github.io/demoLandpageLumina/`.

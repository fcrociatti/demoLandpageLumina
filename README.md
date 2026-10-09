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
3. Qualquer valor `null` aparece na página como **[CONFIRMAR]**.
   Foto `null` aparece como **[FOTO DO AMBIENTE]**.
4. Em títulos e frases, `*palavra*` vira a caixa vermelha de destaque.
5. Para tirar uma seção inteira (ex.: `escola`, `assinatura`, `faq`), apague o bloco
   dela no `config.js`. A numeração das seções se ajusta sozinha.
6. O mapa das unidades é desenhado a partir de `lat`/`lng`: não precisa de chave
   de API nem biblioteca.
7. Para um site oficial (não prévia), troque `previa.ativo` para `false`
   e remova as duas linhas `robots`/`googlebot` do `index.html`.

### Fotos

Coloque a imagem em `assets/` (ex.: `assets/bonfiglioli.jpg`, até ~300 KB,
formato horizontal) e informe o caminho no campo `foto` do `config.js`.
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

1. Envie os arquivos para o repositório `previa-lumina` no GitHub.
2. No GitHub: **Settings → Pages → Build and deployment**.
3. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e salve.
4. Em 1 a 2 minutos o site fica em `https://fcrociatti.github.io/previa-lumina/`.

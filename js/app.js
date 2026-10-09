/*
 * Monta a página a partir de window.SITE_CONFIG (config.js).
 * Não precisa editar este arquivo para trocar de barbearia.
 */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const DIAS_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const DIAS_LABEL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const REDUZIR = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilidades de texto ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // *palavra* = caixa vermelha · _palavra_ = itálico
  const fmt = (s) =>
    esc(s)
      .replace(/\*(.+?)\*/g, "<mark>$1</mark>")
      .replace(/_(.+?)_/g, '<em class="it">$1</em>');
  const semMarcas = (s) => String(s).replace(/[*_]/g, "");

  function confirmar(rotulo) {
    return `<span class="confirmar">[CONFIRMAR${rotulo ? " " + esc(rotulo) : ""}]</span>`;
  }

  // Valor do config ou o marcador [CONFIRMAR]
  function val(v, rotulo) {
    return v === null || v === undefined || v === "" ? confirmar(rotulo) : esc(v);
  }

  const icon = (id, extra = "") => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const preco = (n) => "R$ " + n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  const nota = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // foto: "url" | { src, posicao } | null (vira o espaço [FOTO DO AMBIENTE])
  function foto(f, alt, extraClass = "", attrs = "") {
    const src = f && (typeof f === "string" ? f : f.src);
    if (!src) {
      return `<div class="photo photo--empty ${extraClass}" ${attrs} role="img" aria-label="Espaço para foto do ambiente">${icon("camera")}<span>[FOTO DO AMBIENTE]</span></div>`;
    }
    // A foto do topo carrega logo; as demais só perto da tela
    const carga = extraClass.includes("hero__img") ? 'fetchpriority="high"' : 'loading="lazy"';
    const pos = f.posicao ? ` style="object-position:${esc(f.posicao)}"` : "";
    return `<div class="photo ${extraClass}" ${attrs}><img src="${esc(src)}" alt="${esc(alt)}" ${carga} decoding="async"${pos}></div>`;
  }

  const ICONES_COMODIDADE = { "Wi-Fi": "wifi", Estacionamento: "car", "Atende crianças": "kid", Acessibilidade: "access" };

  /* ---------- Links ---------- */

  const linkWa = (num, msg) => `https://wa.me/${num}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;
  const linkTel = (tel) => "tel:+55" + tel.replace(/\D/g, "");
  const linkRota = (u) => `https://www.google.com/maps/dir/?api=1&destination=${u.lat},${u.lng}`;
  const linkGoogle = (u) =>
    u.google || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${C.marca.nomeCompleto} ${u.endereco} ${u.cidade || ""}`)}`;

  const ext = 'target="_blank" rel="noopener"';

  function botao({ href, classe, texto, ico, falta }) {
    if (!href) {
      return `<span class="btn ${classe}" aria-disabled="true">${ico ? icon(ico) : ""}${esc(texto)} ${confirmar(falta)}</span>`;
    }
    return `<a class="btn ${classe}" href="${esc(href)}" ${href.startsWith("http") ? ext : ""}>${ico ? icon(ico) : ""}${esc(texto)}</a>`;
  }

  /* ---------- Horário (fuso da barbearia) ---------- */

  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  function hora(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
  }

  // Permite simular um horário para testes: ?agora=sab-17:30
  function simulado() {
    const q = new URLSearchParams(location.search).get("agora");
    const m = q && q.toLowerCase().replace("á", "a").match(/^([a-z]{3})-(\d{1,2}):(\d{2})$/);
    if (!m || DIAS_CURTO.indexOf(m[1]) < 0) return null;
    return { dia: DIAS_CURTO.indexOf(m[1]), min: Number(m[2]) * 60 + Number(m[3]) };
  }

  function agora() {
    const sim = simulado();
    if (sim) return sim;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: C.fuso || "America/Sao_Paulo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { dia, min: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  function status(horario) {
    const { dia, min } = agora();
    const hoje = horario[dia] || [];
    for (const [ini, fim] of hoje) {
      if (min >= toMin(ini) && min < toMin(fim)) return { aberto: true, detalhe: `Fecha às ${hora(fim)}` };
    }
    for (const [ini] of hoje) {
      if (min < toMin(ini)) return { aberto: false, detalhe: `Abre hoje às ${hora(ini)}` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      const ints = horario[d] || [];
      if (ints.length) {
        const quando = i === 1 ? "amanhã" : DIAS_LABEL[d].toLowerCase();
        return { aberto: false, detalhe: `Abre ${quando} às ${hora(ints[0][0])}` };
      }
    }
    return { aberto: false, detalhe: "" };
  }

  // Agrupa dias com o mesmo horário: [{rotulo: "Seg a sex", horas: "9h–20h", dias: [1..5]}]
  function gruposHorario(horario) {
    const chave = (d) => (horario[d] || []).map(([a, b]) => `${hora(a)}–${hora(b)}`).join(", ") || "Fechado";
    const grupos = [];
    for (const d of [1, 2, 3, 4, 5, 6, 0]) {
      const k = chave(d);
      const ult = grupos[grupos.length - 1];
      if (ult && ult.horas === k) ult.dias.push(d);
      else grupos.push({ horas: k, dias: [d] });
    }
    return grupos.map((g) => ({
      ...g,
      rotulo: g.dias.length === 1 ? DIAS_LABEL[g.dias[0]] : `${DIAS_LABEL[g.dias[0]]} a ${DIAS_LABEL[g.dias[g.dias.length - 1]].toLowerCase()}`,
    }));
  }

  /* ---------- Render ---------- */

  function aplicarTema() {
    const r = document.documentElement.style;
    if (C.cores && C.cores.destaque) r.setProperty("--red", C.cores.destaque);
    document.title = C.previa && C.previa.ativo ? `Prévia · ${C.marca.nomeCompleto}` : C.marca.nomeCompleto;
  }

  function renderPrevia() {
    const bar = $("#preview-bar");
    if (!C.previa || !C.previa.ativo) return;
    bar.innerHTML = `<b>PRÉVIA</b><span>${esc(C.previa.texto)}</span>`;
    bar.hidden = false;
    const atualizar = () => document.documentElement.style.setProperty("--bar-h", bar.offsetHeight + "px");
    atualizar();
    window.addEventListener("resize", atualizar, { passive: true });
  }

  function partesNome() {
    const [p1, ...resto] = C.marca.nome.split(" ");
    return [p1, resto.join(" ")];
  }

  // Links do menu: só seções que existem no config
  function navLinks() {
    return [
      ["#servicos", "Serviços", C.servicos],
      ["#barboterapia", "Barboterapia", C.destaque],
      ["#unidades", "Unidades", true],
      ["#assinatura", "Assinatura", C.assinatura],
      ["#escola", "Escola", C.escola],
    ]
      .filter((l) => l[2])
      .map(([h, t]) => `<a href="${h}">${t}</a>`)
      .join("");
  }

  function renderTopo() {
    const m = C.marca;
    const [n1, n2] = partesNome();
    const notas = C.unidades
      .filter((u) => typeof u.notaGoogle === "number")
      .map((u) => `<a href="${esc(linkGoogle(u))}" ${ext}>${icon("star")} <strong>${nota(u.notaGoogle)}</strong> ${esc(u.nome)}</a>`)
      .join("");
    // Preços dos primeiros serviços: mostrar o valor cedo ajuda a decidir
    const itens = (C.servicos && C.servicos.categorias && C.servicos.categorias[0].itens) || [];
    const precos = itens
      .filter((i) => typeof i.preco === "number")
      .slice(0, 3)
      .map((i) => `<span>${esc(i.nome)} <strong>${preco(i.preco)}</strong></span>`)
      .join("");
    const f = m.foto;
    $("#topo").innerHTML = `
      <div class="wrap">
        <header class="masthead">
          <a class="wordmark" href="#topo" aria-label="${esc(m.nomeCompleto)}">${esc(n1)} <span>${esc(n2)}</span></a>
          <nav class="nav" aria-label="Seções">${navLinks()}</nav>
          <a class="btn btn--ink" href="#unidades" data-escolher-unidade>${icon("cal")} Agendar</a>
        </header>
        <div class="hero__grid">
          <div class="hero__copy">
            <p class="hero__status" data-status-geral aria-live="polite"></p>
            <h1 class="hero__title" id="hero-titulo">${fmt(m.frase)}.</h1>
            ${m.lead ? `<p class="hero__lead">${esc(m.lead)}</p>` : ""}
            <div class="hero__ctas">
              <a class="btn btn--primary btn--lg" href="#unidades" data-escolher-unidade>${icon("cal")} Agendar horário</a>
              <a class="link" href="#servicos">Ver todos os preços ${icon("arrow")}</a>
            </div>
            ${precos ? `<p class="hero__prices" aria-label="Alguns preços">${precos}</p>` : ""}
            ${notas ? `<div class="ratings" aria-label="Notas no Google">${notas}<span class="ratings-src">no Google</span></div>` : ""}
          </div>
          <figure class="hero__photo">
            ${foto(f, f && f.legenda ? f.legenda : `Ambiente da ${m.nomeCompleto}`, "hero__img")}
            ${f && f.legenda ? `<figcaption class="caption">${esc(f.legenda)}</figcaption>` : ""}
          </figure>
        </div>
      </div>`;
  }

  function renderSobre() {
    const s = C.sobre;
    if (!s) return $("#sobre").remove();
    const fotos = s.fotos || [];
    $("#sobre").innerHTML = `
      <div class="wrap about">
        <div>
          <h2 class="title" id="sobre-titulo">${fmt(s.titulo)}</h2>
          <div class="about__text">${s.texto.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        </div>
        ${fotos.length ? `<div class="about__photos">
          ${fotos.map((f) => `<figure>${foto(f, f.legenda || "")}${f.legenda ? `<figcaption class="caption">${esc(f.legenda)}</figcaption>` : ""}</figure>`).join("")}
        </div>` : ""}
      </div>`;
  }

  /* --- Unidades + mapa --- */

  function renderUnidades() {
    const t = C.textoUnidades || { titulo: "Unidades", lead: "" };
    $("#unidades").innerHTML = `
      <div class="wrap">
        <div class="units-head">
          <div>
            <h2 class="title" id="unidades-titulo">${fmt(t.titulo)}</h2>
            <p class="lead">${esc(t.lead || "")}</p>
            <div class="nearest">
              <button type="button" class="btn btn--ink" id="btn-perto">${icon("pin")}<span>Qual fica mais perto de mim?</span></button>
              <p class="nearest__msg" id="perto-msg" aria-live="polite"></p>
            </div>
          </div>
          <div class="map" id="mapa"></div>
        </div>
        <div class="units" id="lista-unidades">
          ${C.unidades.map(cartaoUnidade).join("")}
        </div>
      </div>`;

    renderMapa(null);
    atualizarStatus();
    setInterval(atualizarStatus, 60 * 1000);
    document.addEventListener("visibilitychange", () => !document.hidden && atualizarStatus());
  }

  function cartaoUnidade(u) {
    const tel = u.telefone
      ? `<a href="${linkTel(u.telefone)}">${icon("phone")} ${esc(u.telefone)}</a>`
      : `<span>${icon("phone")} ${confirmar("telefone")}</span>`;
    const google =
      typeof u.notaGoogle === "number"
        ? `<a href="${esc(linkGoogle(u))}" ${ext}>${icon("star", "icon-star")} ${nota(u.notaGoogle)} no Google</a>`
        : "";
    const chips = (u.comodidades || [])
      .map((c) => `<span class="chip">${icon(ICONES_COMODIDADE[c] || "check")} ${esc(c)}</span>`)
      .join("");
    const horas = gruposHorario(u.horario)
      .map((g) => `<div class="hours__row" data-dias="${g.dias.join(",")}"><span>${esc(g.rotulo)}</span><span>${esc(g.horas)}</span></div>`)
      .join("");

    return `
      <article class="unit" id="unidade-${esc(u.id)}" aria-labelledby="nome-${esc(u.id)}">
        <span class="unit__flag">Mais perto de você</span>
        ${u.foto !== undefined ? foto(u.foto, `Unidade ${u.nome}`, "unit__photo") : ""}
        <div class="unit__body">
          <h3 class="unit__name" id="nome-${esc(u.id)}">${esc(u.nome)}</h3>
          <div class="unit__status"><span class="status" data-status-de="${esc(u.id)}">…</span><span class="unit__when" data-when></span></div>
          <p class="unit__addr">${val(u.endereco, "endereço")}<small>${[u.bairro, u.cidade].filter(Boolean).map(esc).join(" · ")}</small></p>
          ${chips ? `<div class="chips">${chips}</div>` : ""}
          <div class="unit__meta">${tel}${google}</div>
          <div class="hours" aria-label="Horário de funcionamento">${horas}</div>
          <p class="unit__dist" data-dist></p>
          <div class="unit__actions">
            ${botao({ href: u.agendar, classe: "btn--primary", texto: "Agendar", ico: "cal", falta: "link" })}
            <div class="row">
              ${botao({ href: u.whatsapp && linkWa(u.whatsapp), classe: "btn--wa", texto: "WhatsApp", ico: "wa", falta: "número" })}
              ${botao({ href: linkRota(u), classe: "btn--line", texto: "Como chegar", ico: "route" })}
            </div>
          </div>
        </div>
      </article>`;
  }

  function atualizarStatus() {
    const { dia } = agora();
    const todos = C.unidades.map((u) => ({ u, s: status(u.horario) }));
    for (const { u, s } of todos) {
      $$(`[data-status-de="${u.id}"]`).forEach((el) => {
        el.textContent = s.aberto ? "Aberto agora" : "Fechado";
        el.className = "status " + (s.aberto ? "is-open" : "is-closed");
      });
      const card = document.getElementById("unidade-" + u.id);
      if (!card) continue;
      $("[data-when]", card).textContent = s.detalhe;
      $$(".hours__row", card).forEach((r) => r.classList.toggle("is-today", r.dataset.dias.split(",").includes(String(dia))));
    }

    // Resumo no topo: "Aberto agora nas 3 unidades · fecha às 20h"
    const geral = $("[data-status-geral]");
    if (!geral) return;
    const abertas = todos.filter((t) => t.s.aberto);
    const n = todos.length;
    const igual = (lista) => lista.every((t) => t.s.detalhe === lista[0].s.detalhe);
    let txt;
    if (abertas.length === n) txt = `Aberto agora ${n > 1 ? `nas ${n} unidades` : ""}${igual(todos) ? ` · ${todos[0].s.detalhe.toLowerCase()}` : ""}`;
    else if (abertas.length) txt = `${abertas.length} de ${n} unidades abertas agora`;
    else txt = `Fechado agora${igual(todos) && todos[0].s.detalhe ? ` · ${todos[0].s.detalhe.toLowerCase()}` : ""}`;
    geral.textContent = txt.replace(/\s+/g, " ");
    geral.classList.toggle("is-open", abertas.length > 0);
  }

  // Mapa das unidades sem biblioteca: lat/lng projetados num quadro.
  // Com C.mapa, o fundo é o desenho real dos distritos; sem ele, um quadro esquemático.
  function renderMapa(eu) {
    const box = $("#mapa");
    if (!box) return;
    const M = C.mapa && C.mapa.limites ? C.mapa : null;
    const pts = C.unidades.map((u) => ({ u, lat: u.lat, lng: u.lng }));
    let W = 600, H = 320, proj, dentro = () => true, fundo = "", rotulos = "";

    if (M) {
      const { oeste, sul, leste, norte } = M.limites;
      const k = Math.cos((((sul + norte) / 2) * Math.PI) / 180);
      H = Math.round((W * (norte - sul)) / ((leste - oeste) * k));
      proj = (p) => [((p.lng - oeste) / (leste - oeste)) * W, ((norte - p.lat) / (norte - sul)) * H];
      dentro = (p) => p.lng > oeste && p.lng < leste && p.lat > sul && p.lat < norte;
      fundo = `<image href="${esc(M.imagem)}" width="${W}" height="${H}" preserveAspectRatio="none"/>`;
      rotulos = (M.rotulos || [])
        .map((r) => {
          const [x, y] = proj(r);
          return `<text class="map__area" x="${x}" y="${y}" text-anchor="middle">${esc(r.texto)}</text>`;
        })
        .join("");
    } else {
      const PX = 130, PY = 80;
      const todos = eu ? [...pts, eu] : pts;
      const k = Math.cos((pts[0].lat * Math.PI) / 180);
      const xs = todos.map((p) => p.lng * k), ys = todos.map((p) => -p.lat);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const escala = Math.min((W - 2 * PX) / (maxX - minX || 1), (H - 2 * PY) / (maxY - minY || 1));
      const offX = (W - (maxX - minX) * escala) / 2, offY = (H - (maxY - minY) * escala) / 2;
      proj = (p) => [offX + (p.lng * k - minX) * escala, offY + (-p.lat - minY) * escala];
      for (let x = 0; x <= W; x += 40) fundo += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
      for (let y = 0; y <= H; y += 40) fundo += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
      fundo = `<g class="map__grid">${fundo}</g>`;
    }

    const pontos = pts
      .map(({ u }) => {
        const [x, y] = proj(u);
        const dir = x > W * 0.8;
        const tx = dir ? x - 20 : x + 20;
        const anchor = dir ? "end" : "start";
        return `<g class="map__pt" tabindex="0" role="link" aria-label="Ver unidade ${esc(u.nome)}" data-alvo="unidade-${esc(u.id)}">
          <circle cx="${x}" cy="${y}" r="36" fill="transparent"/>
          <circle class="dot" cx="${x}" cy="${y}" r="10"/>
          <text class="map__name" x="${tx}" y="${y + 2}" text-anchor="${anchor}">${esc(u.nome)}</text>
          ${typeof u.notaGoogle === "number" ? `<text class="sub" x="${tx}" y="${y + 22}" text-anchor="${anchor}">${nota(u.notaGoogle)} no Google</text>` : ""}
        </g>`;
      })
      .join("");

    let me = "";
    if (eu && dentro(eu)) {
      const [x, y] = proj(eu);
      me = `<g class="map__me"><circle class="dot" cx="${x}" cy="${y}" r="8"/>
        <text x="${x}" y="${y + 30}" text-anchor="middle">Você</text></g>`;
    }

    box.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Mapa das unidades no Butantã">
        ${fundo}${rotulos}${pontos}${me}
      </svg>
      <p class="map__note">${M && M.fonte ? esc(M.fonte) : "Mapa esquemático, posições reais"}</p>`;

    $$(".map__pt", box).forEach((g) => {
      const ir = () => document.getElementById(g.dataset.alvo).scrollIntoView({ behavior: REDUZIR ? "auto" : "smooth", block: "start" });
      g.addEventListener("click", ir);
      g.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), ir()));
    });
  }

  function renderPassos() {
    const p = C.passos;
    if (!p) return $("#como-agendar").remove();
    $("#como-agendar").innerHTML = `
      <div class="wrap">
        <div>
          <h2 class="title" id="passos-titulo">${fmt(p.titulo)}</h2>
        </div>
        <ol class="steps">
          ${p.itens.map((s) => `<li class="step"><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></li>`).join("")}
        </ol>
      </div>`;
  }

  /* --- Cardápio com abas --- */

  function itemCardapio(i) {
    const valor = typeof i.preco === "number" ? preco(i.preco) : confirmar("valor");
    const desc = [i.desc && esc(i.desc), i.min && `${i.min} min`].filter(Boolean).join(" · ");
    return `<li class="menu-item">
      <span class="menu-item__name">${esc(i.nome)}${i.unidade ? `<span class="menu-item__tag">${esc(i.unidade)}</span>` : ""}</span>
      <span class="menu-item__dots" aria-hidden="true"></span>
      <span class="menu-item__price">${i.aPartirDe ? "<small>a partir de</small>" : ""}${valor}</span>
      ${desc ? `<span class="menu-item__desc">${desc}</span>` : ""}
    </li>`;
  }

  function renderServicos() {
    const s = C.servicos;
    if (!s) return $("#servicos").remove();
    const cats = s.categorias || [{ nome: "Serviços", itens: s.itens || [] }];
    const sec = $("#servicos");
    sec.innerHTML = `
      <div class="wrap">
        <div class="menu-head">
          <div>
            <h2 class="title" id="servicos-titulo">${fmt(s.titulo)}</h2>
          </div>
          <p class="menu-note">${esc(s.aviso)}</p>
        </div>
        <div class="tabs" role="tablist" aria-label="Categorias de serviço">
          ${cats.map((c, i) => `<button type="button" class="tab" role="tab" id="tab-${i}" aria-controls="painel-servicos" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(c.nome)}</button>`).join("")}
        </div>
        <ul class="menu-list" id="painel-servicos" role="tabpanel" aria-labelledby="tab-0"></ul>
        <div class="menu-cta">
          <button type="button" class="btn btn--paper btn--lg" data-escolher-unidade>${esc(s.botao)} ${icon("arrow")}</button>
        </div>
      </div>`;

    const painel = $("#painel-servicos");
    const abas = $$(".tab", sec);
    const mostrar = (idx, foco) => {
      abas.forEach((a, i) => {
        a.setAttribute("aria-selected", i === idx);
        a.tabIndex = i === idx ? 0 : -1;
      });
      painel.setAttribute("aria-labelledby", "tab-" + idx);
      painel.innerHTML = cats[idx].itens.map(itemCardapio).join("");
      if (foco) abas[idx].focus();
      const lista = abas[idx].parentElement;
      if (lista.scrollWidth > lista.clientWidth) lista.scrollTo({ left: abas[idx].offsetLeft - 20, behavior: REDUZIR ? "auto" : "smooth" });
    };
    abas.forEach((a, i) => {
      a.addEventListener("click", () => mostrar(i));
      a.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") mostrar((i + 1) % abas.length, true);
        if (e.key === "ArrowLeft") mostrar((i - 1 + abas.length) % abas.length, true);
      });
    });
    mostrar(0);
  }

  /* --- Barboterapia --- */

  function renderDestaque() {
    const d = C.destaque;
    if (!d) return $("#barboterapia").remove();
    $("#barboterapia").innerHTML = `
      <div class="wrap feature">
        <div class="feature__copy">
          <h2 class="title" id="barboterapia-titulo">${fmt(d.titulo)}</h2>
          <p class="feature__sub">${esc(d.subtitulo)}</p>
          <p class="lead">${esc(d.texto)}</p>
          ${d.duracao ? `<p class="feature__time"><strong>Até ${d.duracao} min</strong> na cadeira, conforme a necessidade da barba.</p>` : ""}
          <ul class="checklist">${d.itens.map((i) => `<li>${icon("check")} ${esc(i)}</li>`).join("")}</ul>
          ${d.incluidaEm ? `<div class="included"><p>Incluída em</p><div class="chips">${d.incluidaEm.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>` : ""}
          <button type="button" class="btn btn--primary btn--lg" data-escolher-unidade>${icon("cal")} Agendar barba</button>
        </div>
        ${"foto" in d ? `<div class="feature__photo">${foto(d.foto, "Barboterapia com toalha quente")}</div>` : ""}
      </div>`;
  }

  function renderAssinatura() {
    const a = C.assinatura;
    if (!a) return $("#assinatura").remove();
    const href = a.whatsapp ? linkWa(a.whatsapp, a.mensagem) : null;
    $("#assinatura").innerHTML = `
      <div class="wrap plan">
        <div>
          <h2 class="title" id="assinatura-titulo">${fmt(a.titulo)}</h2>
          <p class="plan__text">${esc(a.texto)}</p>
          ${a.servicosPlano ? `<div class="plan__services"><p>${esc(a.servicosNota || "Serviços do plano")}</p>
            <div class="chips">${a.servicosPlano.map((s) => `<span class="chip">${icon("check")} ${esc(s)}</span>`).join("")}</div></div>` : ""}
        </div>
        <div class="plan__card">
          <p class="plan__card-label">Valor mensal</p>
          <p class="plan__value">${val(a.valor, "valor")}</p>
          <p class="plan__name">Plano: ${val(a.plano, "plano")}</p>
          ${botao({ href, classe: "btn--primary btn--lg btn--block", texto: "Assinar pelo WhatsApp", ico: "wa", falta: "número" })}
          ${a.whatsappConfirmar ? `<p class="plan__note">${confirmar(a.whatsappConfirmar)}</p>` : ""}
        </div>
      </div>`;
  }

  function renderComodidades() {
    const c = C.comodidades;
    if (!c) return $("#comodidades").remove();
    const pg = c.pagamento;
    $("#comodidades").innerHTML = `
      <div class="wrap">
        <div>
          <h2 class="title" id="comodidades-titulo">${fmt(c.titulo)}</h2>
        </div>
        <ul class="amenities">
          ${c.itens
            .map(
              (i) => `<li class="amenity">
                ${icon(i.icone)}
                <p class="amenity__name">${esc(i.nome)}</p>
                <p class="amenity__text">${val(i.texto, i.confirmar)}</p>
              </li>`
            )
            .join("")}
        </ul>
        ${pg ? `<div class="payments">
          <h3>${esc(pg.titulo)}</h3>
          <div class="chips">${pg.itens.map((p) => `<span class="chip">${esc(p)}</span>`).join("")}</div>
          ${pg.nota ? `<p>${esc(pg.nota)}</p>` : ""}
        </div>` : ""}
      </div>`;
  }

  function renderEscola() {
    const e = C.escola;
    if (!e) return $("#escola").remove();
    const wa = e.whatsapp && linkWa(e.whatsapp, e.mensagem);
    $("#escola").innerHTML = `
      <div class="wrap">
        <div class="school">
          ${e.foto ? `<div class="school__photo">${foto(e.foto, `Aula na ${semMarcas(e.titulo)}`)}</div>` : ""}
          <div class="school__intro">
            <h2 class="title" id="escola-titulo">${fmt(e.titulo)}</h2>
            ${e.subtitulo ? `<p class="school__sub">${esc(e.subtitulo)}</p>` : ""}
            <p class="school__text">${esc(e.texto)}</p>
            ${e.paraQuem ? `<p class="school__text">${esc(e.paraQuem)}</p>` : ""}
            ${e.fatos ? `<ul class="school__facts">${e.fatos.map((t) => `<li>${icon("check")} ${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>
          <div class="school__side">
            ${e.detalhes ? `<dl class="school__sheet">${e.detalhes.map((d) => `<div><dt>${esc(d.rotulo)}</dt><dd>${val(d.valor)}</dd></div>`).join("")}</dl>` : ""}
            <div class="school__actions">
              ${botao({ href: e.linktree, classe: "btn--paper btn--lg", texto: "Cursos e inscrições", ico: "link", falta: "Linktree" })}
              ${botao({ href: wa, classe: "btn--wa btn--lg", texto: "WhatsApp da escola", ico: "wa", falta: "número" })}
              ${botao({ href: e.instagram, classe: "btn--ghost-light btn--lg", texto: "@lucchesiacademy", ico: "ig", falta: "link" })}
            </div>
            ${e.detalhe ? `<p class="school__detail">${esc(e.detalhe)}${e.whatsappTexto ? ` <span class="nowrap">${esc(e.whatsappTexto)}</span>` : ""}</p>` : ""}
          </div>
        </div>
      </div>`;
  }

  function renderFaq() {
    const f = C.faq;
    if (!f || !f.itens.length) return $("#faq").remove();
    $("#faq").innerHTML = `
      <div class="wrap faq-grid">
        <div>
          <h2 class="title" id="faq-titulo">${fmt(f.titulo)}</h2>
        </div>
        <div class="faq-list">
          ${f.itens.map((q) => `<details class="faq-item"><summary>${esc(q.p)} ${icon("plus")}</summary><p>${esc(q.r)}</p></details>`).join("")}
        </div>
      </div>`;
  }

  function renderInstagram() {
    const ig = C.redes && C.redes.instagram;
    const t = C.instagram;
    if (!ig || !t) return $("#instagram").remove();
    $("#instagram").innerHTML = `
      <div class="wrap ig">
        <h2 class="ig__handle" id="ig-titulo">${esc(ig.usuario)}</h2>
        <p class="ig__text">${esc(t.texto)}</p>
        <a class="btn btn--ink btn--lg" href="${esc(ig.url)}" ${ext}>${icon("ig")} Seguir no Instagram</a>
      </div>`;
  }

  function renderRodape() {
    const [n1, n2] = partesNome();
    const ig = C.redes && C.redes.instagram;
    const tc = C.trabalheConosco;
    const rod = $("#rodape");
    rod.innerHTML = `
      <div class="wrap">
        <p class="footer__phrase">${esc(semMarcas(C.marca.frase))}.</p>
        <div class="footer__units">
          ${C.unidades
            .map(
              (u) => `<div class="footer__unit">
                <h3>${esc(u.nome)}</h3>
                <p>${val(u.endereco, "endereço")}</p>
                <p>${u.telefone ? `<a href="${linkTel(u.telefone)}">${esc(u.telefone)}</a>` : confirmar("telefone")}</p>
                ${typeof u.notaGoogle === "number" ? `<p><a href="${esc(linkGoogle(u))}" ${ext}>${nota(u.notaGoogle)} no Google</a></p>` : ""}
              </div>`
            )
            .join("")}
        </div>
        <nav class="footer__links" aria-label="Links">
          ${ig ? `<a href="${esc(ig.url)}" ${ext}>${icon("ig")} ${esc(ig.usuario)}</a>` : ""}
          ${tc ? `<a href="${esc(tc.url)}" ${ext}>Trabalhe conosco ${tc.confirmar ? confirmar(tc.confirmar) : ""}</a>` : ""}
          <a href="#topo">Voltar ao topo</a>
        </nav>
        <div class="footer__base">
          <p class="footer__mark" aria-hidden="true">${esc(n1)} <span>${esc(n2)}</span></p>
          ${C.previa && C.previa.ativo ? `<p class="footer__credit">${esc(C.previa.texto)}</p>` : ""}
        </div>
      </div>`;
  }

  /* ---------- Escolher unidade (cardápio / barboterapia) ---------- */

  function iniciarDialogo() {
    const dlg = $("#dialog-unidade");
    $("#dialog-lista").innerHTML = C.unidades
      .map((u) => {
        const corpo = `<span class="pick__main"><strong>${esc(u.nome)}</strong><small>${val(u.endereco, "endereço")}</small></span>
          <span class="pick__side"><span class="status" data-status-de="${esc(u.id)}">…</span>${
            typeof u.notaGoogle === "number" ? `<span class="pick__rate">${icon("star")} ${nota(u.notaGoogle)}</span>` : ""
          }</span>`;
        return u.agendar
          ? `<a class="pick" href="${esc(u.agendar)}" ${ext}>${corpo}<span class="pick__go">Agendar ${icon("arrow")}</span></a>`
          : `<div class="pick is-off">${corpo}<span class="pick__go">${confirmar("link")}</span></div>`;
      })
      .join("");
    atualizarStatus();

    document.addEventListener("click", (ev) => {
      const gatilho = ev.target.closest("[data-escolher-unidade]");
      if (gatilho) {
        if (!dlg || typeof dlg.showModal !== "function") return; // sem <dialog>: segue o link para #unidades
        ev.preventDefault();
        dlg.showModal();
        return;
      }
      if (ev.target.closest("[data-fechar]")) dlg.close();
    });
    dlg.addEventListener("click", (ev) => ev.target === dlg && dlg.close());
  }

  /* ---------- Unidade mais perto ---------- */

  function distanciaKm(a, b) {
    const rad = (x) => (x * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }

  function fmtKm(km) {
    if (km < 1) return `${Math.round((km * 1000) / 50) * 50} m`;
    return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
  }

  function iniciarPerto() {
    const btn = $("#btn-perto");
    const msg = $("#perto-msg");
    const rotulo = $("span", btn);
    const textoOriginal = rotulo.textContent;

    if (!("geolocation" in navigator)) {
      btn.hidden = true;
      return;
    }

    btn.addEventListener("click", () => {
      btn.disabled = true;
      rotulo.textContent = "Procurando…";
      msg.textContent = "";

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const eu = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          let melhor = null;
          for (const u of C.unidades) {
            const card = document.getElementById("unidade-" + u.id);
            const km = distanciaKm(eu, u);
            $("[data-dist]", card).textContent = `≈ ${fmtKm(km)} de você (em linha reta)`;
            card.classList.remove("is-nearest");
            if (!melhor || km < melhor.km) melhor = { u, km, card };
          }
          melhor.card.classList.add("is-nearest");
          msg.textContent = `A unidade ${melhor.u.nome} é a mais perto de você.`;
          // Só desenha "você" no mapa se estiver na região
          renderMapa(melhor.km < 15 ? eu : null);
          rotulo.textContent = textoOriginal;
          btn.disabled = false;
          melhor.card.scrollIntoView({ behavior: REDUZIR ? "auto" : "smooth", block: "start" });
        },
        (err) => {
          rotulo.textContent = textoOriginal;
          btn.disabled = false;
          msg.textContent =
            err.code === err.PERMISSION_DENIED
              ? "Tudo bem! Sem a localização, é só escolher a unidade na lista abaixo."
              : "Não conseguimos achar sua localização agora. Escolha a unidade na lista abaixo.";
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }

  /* ---------- Botão flutuante "Agendar" (celular) ---------- */

  function iniciarFab() {
    const fab = $("#fab-agendar");
    const alvos = [$("#topo"), $("#unidades")].filter(Boolean);
    if (!("IntersectionObserver" in window) || !alvos.length) return;
    fab.hidden = false;
    const visiveis = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target);
        fab.classList.toggle("is-hidden", visiveis.size > 0);
      },
      { threshold: 0.02 }
    );
    alvos.forEach((a) => io.observe(a));
  }

  /* ---------- Início ---------- */

  aplicarTema();
  renderPrevia();
  renderTopo();
  renderSobre();
  renderUnidades();
  renderPassos();
  renderServicos();
  renderDestaque();
  renderAssinatura();
  renderComodidades();
  renderEscola();
  renderFaq();
  renderInstagram();
  renderRodape();
  iniciarDialogo();
  iniciarPerto();
  iniciarFab();
})();

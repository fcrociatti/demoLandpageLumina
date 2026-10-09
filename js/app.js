/*
 * Monta a página a partir de window.SITE_CONFIG (config.js).
 * Não precisa editar este arquivo para trocar de barbearia.
 */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const DIAS_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const DIAS_LABEL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  /* ---------- Utilidades de texto ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // *palavra* vira caixa vermelha
  function fmt(s) {
    return esc(s).replace(/\*(.+?)\*/g, "<mark>$1</mark>");
  }

  function confirmar(rotulo) {
    return `<span class="confirmar">[CONFIRMAR${rotulo ? " " + esc(rotulo).toUpperCase() : ""}]</span>`;
  }

  // Valor do config ou o marcador [CONFIRMAR]
  function val(v, rotulo) {
    return v === null || v === undefined || v === "" ? confirmar(rotulo) : esc(v);
  }

  function icon(id, extra = "") {
    return `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  }

  function preco(n) {
    return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function nota(n) {
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function foto(src, alt, extraClass = "") {
    if (src) return `<figure class="photo-slot ${extraClass}" style="margin:0"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></figure>`;
    return `<div class="photo-slot ${extraClass}" role="img" aria-label="Espaço para foto do ambiente">[FOTO DO AMBIENTE]</div>`;
  }

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
    if (!q) return null;
    const m = q.toLowerCase().match(/^([a-zá]{3})-(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const dia = DIAS_CURTO.map((d) => d.replace("á", "a")).indexOf(m[1].replace("á", "a"));
    if (dia < 0) return null;
    return { dia, min: Number(m[2]) * 60 + Number(m[3]) };
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
      if (min >= toMin(ini) && min < toMin(fim)) {
        return { aberto: true, detalhe: `Fecha às ${hora(fim)}` };
      }
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

  // ["Seg a sex 9h–20h", "Sáb 9h–18h", "Dom 10h–13h"]
  function resumoHorario(horario) {
    const ordem = [1, 2, 3, 4, 5, 6, 0];
    const chave = (d) => (horario[d] || []).map(([a, b]) => `${hora(a)}–${hora(b)}`).join(", ") || "Fechado";
    const grupos = [];
    for (const d of ordem) {
      const k = chave(d);
      const ult = grupos[grupos.length - 1];
      if (ult && ult.k === k) ult.fim = d;
      else grupos.push({ k, ini: d, fim: d });
    }
    return grupos
      .map((g) => (g.ini === g.fim ? DIAS_LABEL[g.ini] : `${DIAS_LABEL[g.ini]} a ${DIAS_LABEL[g.fim].toLowerCase()}`) + " " + g.k);
  }

  /* ---------- Render ---------- */

  function aplicarTema() {
    const r = document.documentElement.style;
    if (C.cores) {
      if (C.cores.fundo) r.setProperty("--bg", C.cores.fundo);
      if (C.cores.texto) r.setProperty("--fg", C.cores.texto);
      if (C.cores.destaque) r.setProperty("--red", C.cores.destaque);
    }
    const tituloBase = C.marca.nomeCompleto;
    document.title = C.previa && C.previa.ativo ? `Prévia · ${tituloBase}` : tituloBase;
  }

  function renderPrevia() {
    const bar = $("#preview-bar");
    if (!C.previa || !C.previa.ativo) return;
    bar.textContent = C.previa.texto;
    bar.hidden = false;
    const atualizar = () => document.documentElement.style.setProperty("--bar-h", bar.offsetHeight + "px");
    atualizar();
    window.addEventListener("resize", atualizar, { passive: true });
  }

  function renderTopo() {
    const m = C.marca;
    const [p1, ...resto] = m.nome.split(" ");
    const notas = C.unidades
      .filter((u) => typeof u.notaGoogle === "number")
      .map(
        (u) => `<li><a class="rating" href="${esc(linkGoogle(u))}" ${ext} aria-label="${esc(u.nome)}: nota ${nota(u.notaGoogle)} no Google">
          ${icon("star")} <strong>${nota(u.notaGoogle)}</strong> ${esc(u.nome)}</a></li>`
      )
      .join("");

    $("#topo").innerHTML = `
      <div class="wrap hero__grid">
        <div>
          <h1 class="hero__name" id="hero-titulo"><span>${esc(p1)}</span>${resto.length ? `<span>${esc(resto.join(" "))}</span>` : ""}</h1>
          <p class="hero__phrase">${fmt(m.frase)}</p>
          <p class="hero__seal">${esc(m.selo)}</p>
          ${notas ? `<ul class="ratings" aria-label="Notas no Google">${notas}</ul><p class="ratings-src">Notas no Google · toque para ver</p>` : ""}
          <a class="btn btn--primary btn--lg hero__cta" href="#unidades">${icon("cal")} Agendar agora</a>
        </div>
        <div class="hero__photo">${foto(m.foto, `Ambiente da ${m.nomeCompleto}`)}</div>
      </div>`;
  }

  function renderUnidades() {
    if (C.textoUnidades) {
      $("#unidades-titulo").innerHTML = fmt(C.textoUnidades.titulo);
      $("#unidades .section__lead").textContent = C.textoUnidades.lead || "";
    }
    const lista = $("#lista-unidades");
    lista.innerHTML = C.unidades
      .map((u) => {
        const tel = u.telefone
          ? `<a href="${linkTel(u.telefone)}">${icon("phone")} ${esc(u.telefone)}</a>`
          : `<span>${icon("phone")} ${confirmar("telefone")}</span>`;
        const google =
          typeof u.notaGoogle === "number"
            ? `<a href="${esc(linkGoogle(u))}" ${ext}>${icon("star", "icon-star")} ${nota(u.notaGoogle)} · ver no Google</a>`
            : "";
        return `
        <article class="unit" id="unidade-${esc(u.id)}" data-id="${esc(u.id)}" aria-labelledby="nome-${esc(u.id)}">
          <span class="unit__flag">Mais perto de você</span>
          <div class="unit__head">
            <h3 class="unit__name" id="nome-${esc(u.id)}">${esc(u.nome)}</h3>
            <span class="status" data-status>…</span>
          </div>
          <p class="unit__when" data-when></p>
          <p class="unit__addr">${val(u.endereco, "endereço")}${u.cidade ? `<small>${esc(u.cidade)}</small>` : ""}</p>
          <div class="unit__meta">${tel}${google}</div>
          <p class="unit__hours">${resumoHorario(u.horario).map((g) => `<span>${esc(g)}</span>`).join(" · ")}</p>
          <p class="unit__dist" data-dist></p>
          ${u.foto !== undefined ? foto(u.foto, `Unidade ${u.nome}`, "unit__photo") : ""}
          <div class="unit__actions">
            ${botao({ href: u.agendar, classe: "btn--primary", texto: "Agendar", ico: "cal", falta: "link" })}
            <div class="row">
              ${botao({ href: u.whatsapp && linkWa(u.whatsapp), classe: "btn--wa", texto: "WhatsApp", ico: "wa", falta: "número" })}
              ${botao({ href: linkRota(u), classe: "btn--ghost", texto: "Como chegar", ico: "route" })}
            </div>
          </div>
        </article>`;
      })
      .join("");

    atualizarStatus();
    setInterval(atualizarStatus, 60 * 1000);
    document.addEventListener("visibilitychange", () => !document.hidden && atualizarStatus());
  }

  function atualizarStatus() {
    for (const u of C.unidades) {
      const card = document.getElementById("unidade-" + u.id);
      if (!card) continue;
      const s = status(u.horario);
      const el = $("[data-status]", card);
      el.textContent = s.aberto ? "Aberto agora" : "Fechado";
      el.className = "status " + (s.aberto ? "is-open" : "is-closed");
      $("[data-when]", card).textContent = s.detalhe;
    }
  }

  function renderServicos() {
    const s = C.servicos;
    const itens = s.itens
      .map(
        (i) => `<li class="service">
          <span class="service__name">${esc(i.nome)}</span>
          <span class="service__dots" aria-hidden="true"></span>
          <span class="service__price">${i.aPartirDe ? "<small>a partir de</small>" : ""}${typeof i.preco === "number" ? preco(i.preco) : confirmar("valor")}</span>
        </li>`
      )
      .join("");

    $("#servicos").innerHTML = `
      <div class="wrap services-layout">
        <div>
          <h2 class="section__title" id="servicos-titulo">${fmt(s.titulo)}</h2>
          <p class="services-note">${esc(s.aviso)}</p>
          <button type="button" class="btn btn--primary" data-escolher-unidade>${esc(s.botao)} ${icon("arrow")}</button>
        </div>
        <ul class="services">${itens}</ul>
      </div>`;
  }

  function renderDestaque() {
    const d = C.destaque;
    if (!d) return $("#barboterapia").remove();
    $("#barboterapia").innerHTML = `
      <div class="wrap feature">
        <div>
          <span class="eyebrow">O diferencial</span>
          <h2 class="section__title" id="barboterapia-titulo">${fmt(d.titulo)}</h2>
          <p class="feature__sub">${esc(d.subtitulo)}</p>
          <p class="feature__text">${esc(d.texto)}</p>
          <ul class="checklist">${d.itens.map((i) => `<li>${icon("check")} ${esc(i)}</li>`).join("")}</ul>
          <button type="button" class="btn btn--primary" data-escolher-unidade>${icon("cal")} Agendar barba</button>
        </div>
        ${foto(d.foto, "Barboterapia com toalha quente")}
      </div>`;
  }

  function renderAssinatura() {
    const a = C.assinatura;
    if (!a) return $("#assinatura").remove();
    const href = a.whatsapp ? linkWa(a.whatsapp, a.mensagem) : null;
    $("#assinatura").innerHTML = `
      <div class="wrap">
        <div class="plan">
          <h2 class="section__title" id="assinatura-titulo">${fmt(a.titulo)}</h2>
          <p class="plan__text">${esc(a.texto)}</p>
          <div class="plan__box">
            <div class="plan__row"><span>Plano</span>${val(a.plano, "plano")}</div>
            <div class="plan__row"><span>Valor</span><span class="plan__value">${val(a.valor, "valor")}</span></div>
          </div>
          ${botao({ href, classe: "btn--light btn--lg btn--block", texto: "Quero assinar pelo WhatsApp", ico: "wa", falta: "número" })}
          ${a.whatsappConfirmar ? `<p class="plan__note">${confirmar(a.whatsappConfirmar)}</p>` : ""}
        </div>
      </div>`;
  }

  function renderComodidades() {
    const c = C.comodidades;
    if (!c) return $("#comodidades").remove();
    $("#comodidades").innerHTML = `
      <div class="wrap">
        <h2 class="section__title" id="comodidades-titulo">${fmt(c.titulo)}</h2>
        <ul class="amenities">
          ${c.itens
            .map(
              (i) => `<li class="amenity">
                <span class="amenity__icon">${icon(i.icone)}</span>
                <div><p class="amenity__name">${esc(i.nome)}</p><p class="amenity__text">${val(i.texto)}</p></div>
              </li>`
            )
            .join("")}
        </ul>
      </div>`;
  }

  function renderEscola() {
    const e = C.escola;
    if (!e) return $("#escola").remove();
    $("#escola").innerHTML = `
      <div class="wrap school">
        <div>
          <span class="eyebrow">${esc(e.subtitulo)}</span>
          <h2 class="section__title" id="escola-titulo">${fmt(e.titulo)}</h2>
          <p class="feature__text">${esc(e.texto)}</p>
          <div class="school__actions">
            ${botao({ href: e.whatsapp && linkWa(e.whatsapp, e.mensagem), classe: "btn--wa", texto: `WhatsApp ${e.whatsappTexto || ""}`.trim(), ico: "wa", falta: "número" })}
            ${botao({ href: e.instagram, classe: "btn--ghost", texto: "Instagram da escola", ico: "ig", falta: "link" })}
          </div>
        </div>
        <div class="school__media">${foto(e.foto, e.titulo.replace(/\*/g, ""))}</div>
      </div>`;
  }

  function renderRodape() {
    const [p1, ...resto] = C.marca.nome.split(" ");
    const ig = C.redes && C.redes.instagram;
    const tc = C.trabalheConosco;
    $("#rodape").innerHTML = `
      <div class="wrap">
        <p class="footer__brand">${esc(p1)} <span>${esc(resto.join(" "))}</span></p>
        <div class="footer__units">
          ${C.unidades
            .map(
              (u) => `<div class="footer__unit">
                <h3>${esc(u.nome)}</h3>
                <p>${val(u.endereco, "endereço")}</p>
                <p>${u.telefone ? `<a href="${linkTel(u.telefone)}">${esc(u.telefone)}</a>` : confirmar("telefone")}</p>
                ${typeof u.notaGoogle === "number" ? `<p><a href="${esc(linkGoogle(u))}" ${ext}>★ ${nota(u.notaGoogle)} · ver no Google</a></p>` : ""}
              </div>`
            )
            .join("")}
        </div>
        <nav class="footer__links" aria-label="Links">
          ${ig ? `<a href="${esc(ig.url)}" ${ext}>${icon("ig")} ${esc(ig.usuario)}</a>` : ""}
          ${tc ? `<a href="${esc(tc.url)}" ${ext}>Trabalhe conosco ${tc.confirmar ? confirmar(tc.confirmar) : ""}</a>` : ""}
        </nav>
        ${C.previa && C.previa.ativo ? `<p class="footer__credit">${esc(C.previa.texto)}</p>` : ""}
      </div>`;
  }

  /* ---------- Escolher unidade (serviços / barboterapia) ---------- */

  function iniciarDialogo() {
    const dlg = $("#dialog-unidade");
    $("#dialog-lista").innerHTML = C.unidades
      .map((u) =>
        u.agendar
          ? `<a class="btn btn--ghost btn--block" href="${esc(u.agendar)}" ${ext}><span>${esc(u.nome)}</span>${icon("arrow")}</a>`
          : `<span class="btn btn--block" aria-disabled="true">${esc(u.nome)} ${confirmar("link")}</span>`
      )
      .join("");

    document.addEventListener("click", (ev) => {
      if (!ev.target.closest("[data-escolher-unidade]")) return;
      if (dlg && typeof dlg.showModal === "function") dlg.showModal();
      else document.getElementById("unidades").scrollIntoView();
    });
    // Fecha ao tocar fora
    dlg.addEventListener("click", (ev) => {
      if (ev.target === dlg) dlg.close();
    });
  }

  /* ---------- Unidade mais perto ---------- */

  function distanciaKm(a, b) {
    const R = 6371;
    const rad = (x) => (x * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function fmtKm(km) {
    if (km < 1) return `${Math.round(km * 1000 / 50) * 50} m`;
    return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
  }

  function iniciarPerto() {
    const btn = $("#btn-perto");
    const msg = $("#perto-msg");
    const label = $("span", btn);
    const textoOriginal = label.textContent;

    if (!("geolocation" in navigator)) {
      btn.hidden = true;
      return;
    }

    btn.addEventListener("click", () => {
      btn.disabled = true;
      label.textContent = "Procurando…";
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
          label.textContent = textoOriginal;
          btn.disabled = false;
          const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
          melhor.card.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
        },
        (err) => {
          label.textContent = textoOriginal;
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

  /* ---------- Efeito Lumina (foco de luz) ---------- */

  function iniciarLuz() {
    const layer = $(".lumina-light");
    const spot = $(".lumina-light__spot");
    const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduzir || !temMouse) {
      // Celular: brilho ambiente lento (CSS). Reduzir movimento: brilho parado.
      layer.classList.add("is-ambient", "is-on");
      return;
    }

    let x = innerWidth / 2, y = innerHeight * 0.3;
    let tx = x, ty = y, rodando = false;

    function passo() {
      // Suaviza o movimento para a luz "seguir" o cursor
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      spot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(passo);
      else rodando = false;
    }

    window.addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        layer.classList.add("is-on");
        if (!rodando) {
          rodando = true;
          requestAnimationFrame(passo);
        }
      },
      { passive: true }
    );
    document.documentElement.addEventListener("mouseleave", () => layer.classList.remove("is-on"));
    spot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    layer.classList.add("is-on");
  }

  /* ---------- Botão flutuante "Agendar" (celular) ---------- */

  function iniciarFab() {
    const fab = $("#fab-agendar");
    const alvos = [$("#topo"), $("#unidades")].filter(Boolean);
    if (!("IntersectionObserver" in window) || !alvos.length) return;
    fab.hidden = false;
    fab.classList.add("is-hidden");
    const visiveis = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target);
        fab.classList.toggle("is-hidden", visiveis.size > 0);
      },
      { threshold: 0.05 }
    );
    alvos.forEach((a) => io.observe(a));
  }

  /* ---------- Início ---------- */

  aplicarTema();
  renderPrevia();
  renderTopo();
  renderUnidades();
  renderServicos();
  renderDestaque();
  renderAssinatura();
  renderComodidades();
  renderEscola();
  renderRodape();
  iniciarDialogo();
  iniciarPerto();
  iniciarLuz();
  iniciarFab();
})();

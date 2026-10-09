/*
 * CONFIGURAÇÃO DO SITE
 * ------------------------------------------------------------------
 * Este é o único arquivo que precisa mudar para usar esta base em
 * outra barbearia. O resto (index.html, css, js) lê daqui.
 *
 * Convenções:
 * - Valor null é uma pendência. Com mostrarPendencias: false ele some da
 *   página (com a linha, o botão ou a foto dele). Com true, aparece como
 *   [CONFIRMAR] / [FOTO DO AMBIENTE] para revisão. ?pendencias=1 no
 *   endereço mostra as pendências sem mudar este arquivo.
 * - Em títulos, *palavra* vira a caixa vermelha (use pouco: topo e assinatura)
 *   e _palavra_ vira itálico.
 * - WhatsApp: só dígitos, com 55 + DDD (ex.: "5511999999999").
 * - Horário: dias 0=domingo ... 6=sábado; cada dia é uma lista de
 *   intervalos ["HH:MM", "HH:MM"]. Lista vazia = fechado.
 * - Para esconder uma seção inteira, apague o bloco dela (ou use null).
 *
 * Fontes dos dados da Lumina: briefing, perfil do Instagram e as
 * páginas das 3 unidades no AppBarber (out/2026).
 */

// Fotos públicas da galeria da Lumina no AppBarber (só ambiente/detalhe, sem rosto de cliente).
// Para usar fotos próprias, coloque o arquivo em assets/ e troque por "assets/nome.jpg".
const FOTOS = "https://s3-sa-east-1.amazonaws.com/img-appbarber-appbeleza/";

// Horário igual nas três unidades da Lumina.
const HORARIO_LUMINA = {
  0: [["10:00", "13:00"]],
  1: [["09:00", "20:00"]],
  2: [["09:00", "20:00"]],
  3: [["09:00", "20:00"]],
  4: [["09:00", "20:00"]],
  5: [["09:00", "20:00"]],
  6: [["09:00", "18:00"]],
};

window.SITE_CONFIG = {
  // Faixa de prévia. Em um site oficial, troque ativo para false.
  previa: {
    ativo: true,
    texto: "Prévia de demonstração criada por Crociatti Digital. Não é o site oficial.",
  },

  // false: esconde tudo que ainda falta confirmar. true: mostra [CONFIRMAR].
  mostrarPendencias: false,

  fuso: "America/Sao_Paulo",

  // "claro" ou "escuro". Para comparar sem publicar: ?tema=escuro ou ?tema=claro no endereço.
  // Para voltar ao visual claro de sempre, basta "claro".
  tema: "claro",

  cores: {
    destaque: "#E10600",
    claro: { fundo: "#F3F3F1", texto: "#0B0B0B" },
    escuro: { fundo: "#0B0B0B", texto: "#FFFFFF" },
  },

  marca: {
    nome: "LUMINA CLASS",
    nomeCompleto: "Lumina Class Barbearia",
    monograma: "LC",
    chamada: "Barbearia · Butantã · desde 2016",
    frase: "Conforto, *autoestima* e elegância",
    selo: "10 anos · 3 unidades no Butantã",
    lead: "Três barbearias no Butantã para cortar, fazer a barba com toalha quente e sair melhor do que entrou. E sempre com uma cerveja gelada ou um café expresso esperando por você.",
    // Foto grande do topo. posicao = enquadramento (CSS object-position).
    foto: { src: FOTOS + "barbearialumina-jaud/68f020f29a205.png", legenda: "Unidade Jd. Esther", posicao: "center 60%" },
  },

  textoUnidades: {
    titulo: "Escolha sua unidade",
    lead: "Três endereços no Butantã, mesmo horário. Agende online pelo AppBarber, direto na unidade.",
  },

  // Fundo do mapa das unidades: limites reais dos distritos (Prefeitura de SP, GeoSampa).
  // Os pinos são posicionados por lat/lng dentro destes limites.
  // Sem este bloco, o mapa vira um quadro esquemático simples.
  mapa: {
    imagem: "assets/mapa-butanta.svg",
    limites: { oeste: -46.792, sul: -23.612, leste: -46.692, norte: -23.545 },
    fonte: "Distritos: Prefeitura de São Paulo",
    rotulos: [
      { texto: "Butantã", lat: -23.5655, lng: -46.7235 },
      { texto: "Rio Pequeno", lat: -23.5625, lng: -46.7620 },
      { texto: "Vila Sônia", lat: -23.5990, lng: -46.7390 },
      { texto: "Raposo Tavares", lat: -23.5965, lng: -46.7735 },
      { texto: "Morumbi", lat: -23.5975, lng: -46.7110 },
      { texto: "Jaguaré", lat: -23.5490, lng: -46.7470 },
    ],
  },

  unidades: [
    {
      id: "bonfiglioli",
      nome: "Bonfiglioli",
      endereco: "Av. Comendador Alberto Bonfiglioli, 775",
      bairro: "Jardim Bonfiglioli · 05593-001",
      cidade: "São Paulo - SP",
      lat: -23.57827,
      lng: -46.74078,
      notaGoogle: 5.0,
      telefone: "(11) 2362-6204",
      whatsapp: "5511964391648",
      agendar: "https://sites.appbarber.com.br/luminaclassbarb-41rp",
      horario: HORARIO_LUMINA,
      comodidades: ["Wi-Fi", "Estacionamento", "Atende crianças"],
      foto: { src: FOTOS + "luminaclassbarb-41rp/68ffefe759875.png", posicao: "center 70%" },
    },
    {
      id: "corifeu",
      nome: "Corifeu",
      endereco: "Av. Corifeu de Azevedo Marques, 795",
      bairro: "Butantã · 05581-000",
      cidade: "São Paulo - SP",
      lat: -23.57235,
      lng: -46.72175,
      notaGoogle: 4.9,
      telefone: "(11) 2476-1153",
      whatsapp: null,
      agendar: "https://sites.appbarber.com.br/agendamento/barbearialumina-zhfp",
      horario: HORARIO_LUMINA,
      comodidades: ["Wi-Fi", "Estacionamento", "Atende crianças", "Acessibilidade"],
      foto: { src: FOTOS + "barbearialumina-zhfp/68f022ab34f0a.png", posicao: "center 35%" },
    },
    {
      id: "esther",
      nome: "Jd. Esther",
      endereco: "R. José Filipe da Silva, 497",
      bairro: "Jardim Ester · 05372-040",
      cidade: "São Paulo - SP",
      lat: -23.58289,
      lng: -46.76152,
      notaGoogle: 4.7,
      telefone: "(11) 2309-9546",
      whatsapp: null,
      agendar: "https://sites.appbarber.com.br/agendamento/barbearialumina-jaud",
      horario: HORARIO_LUMINA,
      comodidades: ["Wi-Fi", "Estacionamento", "Atende crianças"],
      foto: { src: FOTOS + "barbearialumina-jaud/68f020f29a205.png", posicao: "center 70%" },
    },
  ],

  // Cardápio. Só a primeira categoria aparece na página; a lista completa
  // fica na agenda online ("Ver todos e agendar").
  // aPartirDe: mostra "a partir de"; unidade: serviço de uma unidade só.
  servicos: {
    titulo: "O cardápio",
    aviso: "Valores de referência do AppBarber. Podem variar por unidade.",
    botao: "Ver todos e agendar",
    categorias: [
      {
        nome: "Principais",
        itens: [
          { nome: "Corte", preco: 65, min: 30 },
          { nome: "Barba", preco: 65, min: 30 },
          { nome: "Barba e cabelo", preco: 110, min: 60, desc: "Corte + barba com barboterapia" },
          { nome: "Corte à máquina", preco: 50, min: 30, desc: "Uma numeração de pente" },
          { nome: "Corte customizado", preco: 80, min: 60, desc: "Penteado definido, riscos e desenhos" },
          { nome: "Corte infantil", preco: 65, min: 30 },
          { nome: "Barba e pezinho", preco: 75, min: 60, desc: "Barba com barboterapia + contorno na navalha" },
          { nome: "Coloração e química", preco: 50, aPartirDe: true },
        ],
      },
      {
        nome: "Cabelo",
        itens: [
          { nome: "Corte", preco: 65, min: 30 },
          { nome: "Corte à máquina", preco: 50, min: 30 },
          { nome: "Corte customizado", preco: 80, min: 60 },
          { nome: "Corte cabelo cacheado", preco: 120, aPartirDe: true, min: 120 },
          { nome: "Corte infantil", preco: 65, min: 30 },
          { nome: "Pezinho", preco: 25, min: 30, desc: "Acabamento com navalha" },
          { nome: "Risquinho", preco: 15, aPartirDe: true, min: 30 },
          { nome: "Penteado", preco: 30, min: 30 },
        ],
      },
      {
        nome: "Barba",
        itens: [
          { nome: "Barba", preco: 65, min: 30 },
          { nome: "Barba express", preco: 40, min: 30 },
          { nome: "Barba e pezinho", preco: 75, min: 60 },
          { nome: "Pigmentação na barba", preco: 50, aPartirDe: true, min: 30 },
        ],
      },
      {
        nome: "Combos",
        itens: [
          { nome: "Barba e cabelo", preco: 110, min: 60 },
          { nome: "Corte à máquina e barba", preco: 90, min: 60 },
          { nome: "Cabelo e barba terapia com ozônio", preco: 135, min: 90, unidade: "Corifeu" },
        ],
      },
      {
        nome: "Química",
        itens: [
          { nome: "Hidratação", preco: 25, min: 30 },
          { nome: "Matização", preco: 30, min: 30 },
          { nome: "Pigmentação no cabelo", preco: 60, aPartirDe: true, min: 30 },
          { nome: "Relaxamento capilar", preco: 50, aPartirDe: true, min: 60 },
          { nome: "Redução de volume (botox)", preco: 100, aPartirDe: true, min: 90 },
          { nome: "Selagem térmica", preco: 110, aPartirDe: true },
          { nome: "Descoloração", preco: 110, aPartirDe: true },
          { nome: "Reflexo / luzes", preco: 120, aPartirDe: true, min: 120 },
        ],
      },
      {
        nome: "Rosto",
        itens: [
          { nome: "Design de sobrancelha", preco: 25, min: 30 },
          { nome: "Limpeza de pele", preco: 35, min: 30 },
          { nome: "Depilação de nariz", preco: 25, min: 30, desc: "Cera quente" },
          { nome: "Depilação de orelha", preco: 25, min: 30, desc: "Cera quente" },
          { nome: "Depilação nariz e orelha", preco: 35, aPartirDe: true, min: 30 },
        ],
      },
    ],
  },

  destaque: {
    titulo: "Barboterapia",
    subtitulo: "A barba do jeito Lumina",
    texto:
      "Barba feita com toalha quente e produtos que cuidam da hidratação da pele. Mais do que tirar o excesso: é um momento para relaxar na cadeira.",
    itens: ["Toalha quente", "Hidratação da pele", "Relaxamento", "Barba bem feita"],
    duracao: 40, // minutos
    incluidaEm: ["Barba e cabelo", "Barba e pezinho", "Corte à máquina e barba"],
    foto: null, // pendência: barba com toalha quente, sem rosto
  },

  assinatura: {
    titulo: "Assinatura *mensal*",
    texto: "Mantenha o corte e a barba em dia pagando um valor fixo por mês.",
    servicosPlano: ["Corte", "Barba", "Barba e cabelo", "Corte à máquina"],
    servicosNota: "Planos indicados no AppBarber da Bonfiglioli",
    plano: null, // ex.: "Corte ilimitado"
    valor: null, // ex.: "R$ 99,99/mês"
    whatsapp: "5511964391648",
    whatsappConfirmar: "canal da assinatura", // remova quando o número estiver confirmado
    mensagem: "Olá! Quero saber mais sobre a assinatura mensal.",
  },

  // Linha do rodapé: o que mais tem na Lumina e como pagar.
  // Item { texto, confirmar } é pendência: só aparece com mostrarPendencias.
  rodape: {
    extras: ["Cerveja gelada ou café expresso", { texto: "Tatuagem", confirmar: "unidade" }],
    pagamento: {
      itens: ["dinheiro", "cartão de crédito", "cartão de débito", "transferência"],
      nota: "PIX na Bonfiglioli",
    },
  },

  escola: {
    titulo: "Lucchesi Academy",
    subtitulo: "Escola de barbeiros",
    texto:
      "A formação de barbeiros da rede Lumina. Para quem quer fazer da barbearia uma profissão, aprendendo dentro de uma rede com 10 anos de cadeira.",
    // Ficha do curso. Linha com valor null só aparece com mostrarPendencias.
    detalhes: [
      { rotulo: "Cursos", valor: null },
      { rotulo: "Formato e carga horária", valor: null },
      { rotulo: "Próximas turmas", valor: null },
      { rotulo: "Investimento", valor: null },
      { rotulo: "Certificado", valor: null },
    ],
    // Fatos curtos sobre a escola (opcional, só o que é confirmado).
    // fatos: ["..."],
    detalhe: "Turmas, datas e valores: fale direto com a escola.",
    cursos: "http://felipelucchesi.com.br/descomplica/", // página de cursos e inscrições (link da bio)
    // foto: { src: "assets/escola.jpg" }, // opcional: aula na bancada, sem rosto de cliente
    instagram: "https://instagram.com/lucchesiacademy",
    whatsapp: "5511981166533",
    whatsappTexto: "(11) 98116-6533",
    mensagem: "Olá! Quero saber sobre o curso de barbeiro.",
  },

  redes: {
    instagram: { usuario: "@luminaclassbarbearia", url: "https://instagram.com/luminaclassbarbearia" },
  },

  // Com "confirmar", o link só aparece com mostrarPendencias. Apague "confirmar" quando o destino for o certo.
  trabalheConosco: {
    url: "https://instagram.com/luminaclassbarbearia",
    confirmar: "destino",
  },
};

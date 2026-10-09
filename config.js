/*
 * CONFIGURAÇÃO DO SITE
 * ------------------------------------------------------------------
 * Este é o único arquivo que precisa mudar para usar esta base em
 * outra barbearia. O resto (index.html, css, js) lê daqui.
 *
 * Convenções:
 * - Qualquer valor null aparece na página como [CONFIRMAR] em destaque.
 * - Foto null aparece como o espaço [FOTO DO AMBIENTE].
 * - Em textos, *palavra* vira a caixa vermelha de destaque.
 * - WhatsApp: só dígitos, com 55 + DDD (ex.: "5511999999999").
 * - Horário: dias 0=domingo ... 6=sábado; cada dia é uma lista de
 *   intervalos ["HH:MM", "HH:MM"]. Lista vazia = fechado.
 */

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

  fuso: "America/Sao_Paulo",

  cores: {
    fundo: "#0B0B0B",
    texto: "#FFFFFF",
    destaque: "#E10600",
  },

  marca: {
    nome: "LUMINA CLASS",
    nomeCompleto: "Lumina Class Barbearia",
    frase: "Conforto, *autoestima* e elegância",
    selo: "10 anos · 3 unidades no Butantã",
  },

  textoUnidades: {
    titulo: "Escolha sua *unidade*",
    lead: "Agendamento online pelo AppBarber, direto na unidade.",
  },

  unidades: [
    {
      id: "bonfiglioli",
      nome: "Bonfiglioli",
      endereco: "Av. Comendador Alberto Bonfiglioli, 775",
      cidade: "São Paulo - SP",
      lat: -23.57827,
      lng: -46.74078,
      notaGoogle: 5.0,
      telefone: "(11) 2362-6204",
      whatsapp: "5511964391648",
      agendar: "https://sites.appbarber.com.br/luminaclassbarb-41rp",
      horario: HORARIO_LUMINA,
      foto: null,
    },
    {
      id: "corifeu",
      nome: "Corifeu",
      endereco: "Av. Corifeu de Azevedo Marques, 795",
      cidade: "São Paulo - SP",
      lat: -23.57235,
      lng: -46.72175,
      notaGoogle: 4.9,
      telefone: "(11) 2476-1153",
      whatsapp: null,
      agendar: "https://sites.appbarber.com.br/agendamento/barbearialumina-zhfp",
      horario: HORARIO_LUMINA,
      foto: null,
    },
    {
      id: "esther",
      nome: "Jd. Esther",
      endereco: "R. José Filipe da Silva, 497",
      cidade: "São Paulo - SP",
      lat: -23.58289,
      lng: -46.76152,
      notaGoogle: 4.7,
      telefone: "(11) 2309-9546",
      whatsapp: null,
      agendar: "https://sites.appbarber.com.br/agendamento/barbearialumina-jaud",
      horario: HORARIO_LUMINA,
      foto: null,
    },
  ],

  servicos: {
    titulo: "Serviços *principais*",
    aviso: "Valores podem variar por unidade.",
    botao: "Ver todos e agendar",
    itens: [
      { nome: "Corte", preco: 65 },
      { nome: "Barba", preco: 65 },
      { nome: "Barba e cabelo", preco: 110 },
      { nome: "Corte à máquina", preco: 50 },
      { nome: "Corte customizado", preco: 80 },
      { nome: "Corte infantil", preco: 65 },
      { nome: "Barba e pezinho", preco: 75 },
      { nome: "Coloração e química", preco: 50, aPartirDe: true },
    ],
  },

  destaque: {
    titulo: "*Barboterapia*",
    subtitulo: "A barba do jeito Lumina",
    texto:
      "Barba feita com toalha quente e produtos que cuidam da hidratação da pele. Mais do que tirar o excesso: é um momento para relaxar na cadeira.",
    itens: ["Toalha quente", "Hidratação da pele", "Relaxamento", "Pode durar até 40 min"],
    foto: null,
  },

  assinatura: {
    titulo: "Assinatura *mensal*",
    texto: "Mantenha o corte e a barba em dia pagando um valor fixo por mês.",
    plano: null, // ex.: "Corte ilimitado"
    valor: null, // ex.: "R$ 99,99/mês"
    whatsapp: "5511964391648",
    whatsappConfirmar: "canal da assinatura", // remova quando o número estiver confirmado
    mensagem: "Olá! Quero saber mais sobre a assinatura mensal.",
  },

  comodidades: {
    titulo: "Também na *Lumina*",
    itens: [
      { icone: "tattoo", nome: "Tatuagem", texto: null },
      { icone: "wifi", nome: "Wi-Fi", texto: null },
      { icone: "car", nome: "Estacionamento", texto: null },
    ],
  },

  escola: {
    titulo: "Lucchesi *Academy*",
    subtitulo: "Escola de barbeiros",
    texto:
      "A formação de barbeiros da rede Lumina. Para saber sobre turmas, datas e valores, fale direto com a escola.",
    instagram: "https://instagram.com/lucchesiacademy",
    whatsapp: "5511981166533",
    whatsappTexto: "(11) 98116-6533",
    mensagem: "Olá! Quero saber sobre o curso de barbeiro.",
    foto: null,
  },

  redes: {
    instagram: { usuario: "@luminaclassbarbearia", url: "https://instagram.com/luminaclassbarbearia" },
  },

  trabalheConosco: {
    url: "https://instagram.com/luminaclassbarbearia",
    confirmar: "destino",
  },
};

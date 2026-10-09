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
 * - Para esconder uma seção inteira, apague o bloco dela (ou use null).
 *
 * Fontes dos dados da Lumina: briefing, perfil do Instagram e as
 * páginas das 3 unidades no AppBarber (out/2026).
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
    monograma: "LC",
    chamada: "Barbearia · Butantã · desde 2016",
    frase: "Conforto, *autoestima* e elegância",
    selo: "10 anos · 3 unidades no Butantã",
    seloGiratorio: "BARBEARIA · DESDE 2016 · BUTANTÃ · ", // ~35 letras
    fotos: [null, null, null], // colagem do topo (3 fotos)
  },

  // Faixa de números do topo. Só dados reais.
  numeros: [
    { valor: "10", sufixo: "anos", rotulo: "Desde 2016" },
    { valor: "3", sufixo: "unidades", rotulo: "No Butantã" },
    { valor: "5,0", sufixo: "★", rotulo: "Nota Google · Bonfiglioli" },
    { valor: "1", sufixo: "escola", rotulo: "Lucchesi Academy" },
  ],

  // Palavras que correm na faixa vermelha
  faixa: ["Corte", "Barba", "Barboterapia", "Coloração", "Sobrancelha", "Corte infantil", "Escola de barbeiros"],

  sobre: {
    titulo: "Corte de qualidade e *barboterapia*",
    texto: [
      "Desde 2016 no Butantã, a Lumina Class une corte de qualidade e barboterapia: barba com toalha quente e produtos que cuidam da pele.",
      "Do corte à máquina ao customizado, da coloração à sobrancelha. E sempre com uma cerveja gelada ou um café expresso esperando por você.",
    ],
  },

  textoUnidades: {
    titulo: "Escolha sua *unidade*",
    lead: "Três endereços no Butantã, mesmo horário. Agende online pelo AppBarber, direto na unidade.",
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
      foto: null,
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
      foto: null,
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
      foto: null,
    },
  ],

  passos: {
    titulo: "Agendar leva *1 minuto*",
    itens: [
      { titulo: "Escolha a unidade", texto: "A mais perto de casa ou do trabalho. O botão de localização ajuda." },
      { titulo: "Escolha no AppBarber", texto: "Serviço, profissional e horário livre, tudo na agenda online da unidade." },
      { titulo: "É só chegar", texto: "Senta, relaxa e deixa com a gente." },
    ],
  },

  // Cardápio. A primeira categoria aparece aberta.
  // aPartirDe: mostra "a partir de"; unidade: serviço de uma unidade só.
  servicos: {
    titulo: "O *cardápio*",
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
    titulo: "*Barboterapia*",
    subtitulo: "A barba do jeito Lumina",
    texto:
      "Barba feita com toalha quente e produtos que cuidam da hidratação da pele. Mais do que tirar o excesso: é um momento para relaxar na cadeira.",
    itens: ["Toalha quente", "Hidratação da pele", "Relaxamento", "Barba bem feita"],
    duracao: 40, // minutos, mostrado no relógio
    incluidaEm: ["Barba e cabelo", "Barba e pezinho", "Corte à máquina e barba"],
    foto: null,
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

  comodidades: {
    titulo: "Também na *Lumina*",
    itens: [
      { icone: "beer", nome: "Cerveja e café", texto: "Cerveja gelada ou café expresso" },
      { icone: "wifi", nome: "Wi-Fi", texto: "Nas 3 unidades" },
      { icone: "car", nome: "Estacionamento", texto: "Nas 3 unidades" },
      { icone: "kid", nome: "Atende crianças", texto: "Corte infantil nas 3 unidades" },
      { icone: "access", nome: "Acessibilidade", texto: "Unidade Corifeu" },
      { icone: "tattoo", nome: "Tatuagem", texto: null, confirmar: "unidade" },
    ],
    pagamento: {
      titulo: "Formas de pagamento",
      itens: ["Dinheiro", "Cartão de crédito", "Cartão de débito", "Transferência"],
      nota: "Na Bonfiglioli também PIX.",
    },
  },

  escola: {
    titulo: "Lucchesi *Academy*",
    subtitulo: "Escola de barbeiros",
    fundo: "ACADEMY",
    texto:
      "A formação de barbeiros da rede Lumina. Para quem quer fazer da barbearia uma profissão, aprendendo dentro de uma rede com 10 anos de cadeira.",
    detalhe: "Turmas, datas e valores: fale direto com a escola.",
    instagram: "https://instagram.com/lucchesiacademy",
    whatsapp: "5511981166533",
    whatsappTexto: "(11) 98116-6533",
    mensagem: "Olá! Quero saber sobre o curso de barbeiro.",
    foto: null,
  },

  faq: {
    titulo: "Perguntas *frequentes*",
    itens: [
      {
        p: "Como faço para agendar?",
        r: "Escolha a unidade na lista acima e toque em Agendar. Você cai na agenda online da unidade no AppBarber e escolhe serviço, profissional e horário.",
      },
      {
        p: "Qual o horário de funcionamento?",
        r: "Nas 3 unidades: segunda a sexta das 9h às 20h, sábado das 9h às 18h e domingo das 10h às 13h.",
      },
      {
        p: "Vocês atendem crianças?",
        r: "Sim. Corte infantil nas 3 unidades.",
      },
      {
        p: "Quais as formas de pagamento?",
        r: "Dinheiro, cartão de crédito, cartão de débito e transferência. Na Bonfiglioli também PIX.",
      },
      {
        p: "Tem estacionamento?",
        r: "Sim, as 3 unidades informam estacionamento no cadastro do AppBarber.",
      },
      {
        p: "O que é a barboterapia?",
        r: "É a barba feita com toalha quente e produtos de hidratação, pensada para relaxar. Pode durar até 40 minutos, conforme a necessidade.",
      },
    ],
  },

  instagram: {
    titulo: "Veja os *cortes*",
    texto: "Acompanhe os trabalhos, conheça os barbeiros nos destaques e fale com a gente pelo direct.",
  },

  redes: {
    instagram: { usuario: "@luminaclassbarbearia", url: "https://instagram.com/luminaclassbarbearia" },
  },

  trabalheConosco: {
    url: "https://instagram.com/luminaclassbarbearia",
    confirmar: "destino",
  },
};

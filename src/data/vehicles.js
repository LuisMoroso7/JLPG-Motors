export const initialVehicles = [
  // POPULARES
  {
    id: '1', name: 'Volkswagen Gol 1.6', brand: 'Volkswagen', model: 'Gol 1.6', year: 2020, price: 52900, km: 61000,
    transmission: 'Manual', fuel: 'Flex', category: 'Hatch Popular', color: 'Prata',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
    description: 'O carro mais vendido do Brasil por décadas. Econômico, confiável e fácil de manter. Motor 1.6 flex com câmbio manual de 5 marchas. Ótima opção para o dia a dia urbano.', featured: false, stock: 2,
  },
  {
    id: '2', name: 'Chevrolet Onix Plus Premier', brand: 'Chevrolet', model: 'Onix Plus Premier', year: 2022, price: 89900, km: 28000,
    transmission: 'Automático', fuel: 'Flex', category: 'Sedan Popular', color: 'Branco Summit',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    description: 'Sedan compacto líder de vendas no Brasil. Versão Premier com motor turbo 1.0 de 116 cv, câmbio automático CVT, multimídia com CarPlay e Android Auto.', featured: true, stock: 1,
  },
  {
    id: '3', name: 'Hyundai HB20 Evolution', brand: 'Hyundai', model: 'HB20 Evolution', year: 2023, price: 82900, km: 18000,
    transmission: 'Automático', fuel: 'Flex', category: 'Hatch Popular', color: 'Vermelho Creta',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    description: 'Hatch moderno com design arrojado. Motor 1.0 turbo de 120 cv, câmbio automático de 6 velocidades, multimídia 10.25" e sistema de segurança SmartSense.', featured: false, stock: 2,
  },
  {
    id: '4', name: 'Volkswagen Polo Highline', brand: 'Volkswagen', model: 'Polo Highline', year: 2022, price: 96900, km: 32000,
    transmission: 'Automático', fuel: 'Flex', category: 'Hatch Popular', color: 'Azul Biscay',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    description: 'Hatch premium da VW com motor TSI 1.0 turbo de 116 cv, câmbio automático de 6 marchas, interior refinado com quadro de instrumentos digital e teto solar.', featured: false, stock: 1,
  },
  {
    id: '5', name: 'Fiat Argo Trekking', brand: 'Fiat', model: 'Argo Trekking', year: 2023, price: 79900, km: 22000,
    transmission: 'Manual', fuel: 'Flex', category: 'Hatch Popular', color: 'Verde Urban',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    description: 'Versão aventureira do Argo com suspensão elevada, motor 1.3 Firefly de 109 cv, visual off-road com apliques e proteções, multimídia Uconnect 7".', featured: false, stock: 1,
  },
  {
    id: '6', name: 'Renault Kwid Intense', brand: 'Renault', model: 'Kwid Intense', year: 2023, price: 62900, km: 14000,
    transmission: 'Manual', fuel: 'Flex', category: 'Hatch Popular', color: 'Laranja',
    images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    description: 'Mini SUV urbano com estilo moderno e consumo baixíssimo. Motor 1.0 SCe de 71 cv, porta-malas espaçoso para o segmento e visual de SUV compacto.', featured: false, stock: 3,
  },
  // SEDANS
  {
    id: '7', name: 'Volkswagen Jetta 250 TSI', brand: 'Volkswagen', model: 'Jetta 250 TSI', year: 2021, price: 129900, km: 41000,
    transmission: 'Automático DSG', fuel: 'Gasolina', category: 'Sedan', color: 'Cinza Platinum',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    description: 'Sedan premium com motor TSI 1.4 turbo de 150 cv, câmbio DSG de 6 velocidades, interior sofisticado com painel digital Active Info Display e assistência de frenagem.', featured: true, stock: 1,
  },
  {
    id: '8', name: 'Toyota Corolla XEi', brand: 'Toyota', model: 'Corolla XEi', year: 2022, price: 139900, km: 31500,
    transmission: 'Automático CVT', fuel: 'Flex', category: 'Sedan', color: 'Prata',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    description: 'Referência em confiabilidade e liquidez. Motor 2.0 flex de 177 cv com câmbio CVT suave e econômico, Toyota Safety Sense de série e interior premium.', featured: false, stock: 2,
  },
  {
    id: '9', name: 'Honda Civic Touring', brand: 'Honda', model: 'Civic Touring', year: 2022, price: 159900, km: 24000,
    transmission: 'Automático CVT', fuel: 'Gasolina', category: 'Sedan', color: 'Azul Sonic',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    description: 'Sedan esportivo com motor turbo 1.5 VTEC de 173 cv, Honda Sensing completo, head-up display, bancos de couro e visual agressivo de última geração.', featured: true, stock: 1,
  },
  {
    id: '10', name: 'Chevrolet Cruze Sport6 LTZ', brand: 'Chevrolet', model: 'Cruze Sport6 LTZ', year: 2020, price: 109900, km: 53000,
    transmission: 'Automático', fuel: 'Flex', category: 'Sedan', color: 'Preto Ouro Negro',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: 'Hatch/sedan esportivo com motor turbo 1.4 de 153 cv, câmbio automático de 6 velocidades, teto solar panorâmico e MyLink 8" com CarPlay.', featured: false, stock: 1,
  },
  {
    id: '11', name: 'Volkswagen Virtus GTS', brand: 'Volkswagen', model: 'Virtus GTS', year: 2023, price: 119900, km: 12000,
    transmission: 'Automático DSG', fuel: 'Gasolina', category: 'Sedan Popular', color: 'Branco Cristal',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    description: 'Versão GTS com motor turbo 1.0 TSI de 116 cv, visual esportivo com detalhes vermelhos, rodas 16", bancos semiesportivos e multimídia VW Play 8".', featured: false, stock: 2,
  },
  // SEDANS PREMIUM
  {
    id: '12', name: 'BMW 320i M Sport', brand: 'BMW', model: '320i M Sport', year: 2021, price: 189900, km: 42000,
    transmission: 'Automático', fuel: 'Gasolina', category: 'Sedan Premium', color: 'Preto Safira',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    description: 'Sedan premium com acabamento M Sport, motor turbo de 184 cv, câmbio automático de 8 velocidades, sistema iDrive e conforto excepcional.', featured: true, stock: 1,
  },
  {
    id: '13', name: 'Audi A3 Sedan Prestige', brand: 'Audi', model: 'A3 Sedan Prestige', year: 2020, price: 159900, km: 50000,
    transmission: 'Automático S-tronic', fuel: 'Gasolina', category: 'Sedan Premium', color: 'Branco Glacier',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    description: 'Design sofisticado com Virtual Cockpit digital, MMI embarcado, motor TFSI 1.4 turbo de 150 cv e acabamento interno de alto padrão.', featured: true, stock: 1,
  },
  // SUVs NACIONAIS
  {
    id: '14', name: 'Chevrolet Tracker Premier', brand: 'Chevrolet', model: 'Tracker Premier', year: 2023, price: 119900, km: 16000,
    transmission: 'Automático', fuel: 'Flex', category: 'SUV', color: 'Vermelho Granada',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    description: 'SUV compacto top de linha com motor turbo 1.2 de 133 cv, câmbio automático de 6 marchas, teto solar, bancos em couro e MyLink 10.1".', featured: false, stock: 2,
  },
  {
    id: '15', name: 'Volkswagen T-Cross Highline', brand: 'Volkswagen', model: 'T-Cross Highline', year: 2022, price: 114900, km: 27000,
    transmission: 'Automático DSG', fuel: 'Flex', category: 'SUV', color: 'Azul Biscay',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    description: 'SUV urbano versátil com motor TSI 1.0 turbo de 116 cv, câmbio DSG de 6 marchas, quadro de instrumentos digital, Park Assist e câmera de ré.', featured: false, stock: 1,
  },
  {
    id: '16', name: 'Jeep Compass Limited', brand: 'Jeep', model: 'Compass Limited', year: 2023, price: 179900, km: 18000,
    transmission: 'Automático', fuel: 'Flex', category: 'SUV', color: 'Cinza Granite',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    description: 'SUV completo com tração 4x4, central multimídia UConnect 10.1", assistência de direção e câmera 360°. Ideal para família.', featured: false, stock: 1,
  },
  {
    id: '17', name: 'Hyundai Creta Ultimate', brand: 'Hyundai', model: 'Creta Ultimate', year: 2022, price: 134900, km: 29000,
    transmission: 'Automático', fuel: 'Flex', category: 'SUV', color: 'Branco Atlas',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    description: 'SUV com design renovado, motor 2.0 flex de 167 cv, teto solar panorâmico, sistema de som Bose, SmartSense e conectividade wireless.', featured: true, stock: 1,
  },
  {
    id: '18', name: 'Nissan Kicks Exclusive', brand: 'Nissan', model: 'Kicks Exclusive', year: 2023, price: 124900, km: 11000,
    transmission: 'Automático CVT', fuel: 'Flex', category: 'SUV', color: 'Azul Persia',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'SUV compacto estiloso com teto flutuante bicolor, motor 1.6 de 114 cv, câmbio CVT, Nissan Intelligent Mobility e porta-malas de 432 litros.', featured: false, stock: 2,
  },
  // SUVs PREMIUM
  {
    id: '19', name: 'Mercedes-Benz GLC 300', brand: 'Mercedes-Benz', model: 'GLC 300', year: 2021, price: 349900, km: 28000,
    transmission: 'Automático 9G-Tronic', fuel: 'Gasolina', category: 'SUV Premium', color: 'Cinza Selênio',
    images: ['https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=800&q=80',
    description: 'SUV premium com motor 2.0 turbo de 258 cv, tração 4Matic, MBUX touchscreen 10.25", assistentes avançados e acabamento de luxo.', featured: true, stock: 1,
  },
  {
    id: '20', name: 'BMW X5 xDrive30d', brand: 'BMW', model: 'X5 xDrive30d', year: 2021, price: 489900, km: 35000,
    transmission: 'Automático Steptronic', fuel: 'Diesel', category: 'SUV Premium', color: 'Preto Carbono',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    description: 'SUV de luxo com motor diesel 3.0 de 265 cv, tração xDrive, suspensão a ar, tela panorâmica BMW Curved Display e pacote M Sport completo.', featured: true, stock: 1,
  },
  {
    id: '21', name: 'Volkswagen Tiguan Allspace', brand: 'Volkswagen', model: 'Tiguan Allspace', year: 2022, price: 239900, km: 22000,
    transmission: 'Automático DSG', fuel: 'Gasolina', category: 'SUV Premium', color: 'Prata Reflex',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    description: 'SUV de 7 lugares com motor TSI 1.4 turbo de 150 cv, câmbio DSG de 6 marchas, teto solar panorâmico e sistema de entretenimento traseiro.', featured: false, stock: 1,
  },
  // PICAPES
  {
    id: '22', name: 'Toyota Hilux SRX 4x4', brand: 'Toyota', model: 'Hilux SRX', year: 2022, price: 259900, km: 39000,
    transmission: 'Automático', fuel: 'Diesel', category: 'Picape', color: 'Branco Pérola',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Picape robusta com tração 4x4, motor diesel 2.8 de 204 cv, suspensão reforçada e Toyota Play 9". Alta confiabilidade e liquidez no mercado.', featured: true, stock: 1,
  },
  {
    id: '23', name: 'Ford Ranger XLS 4x4', brand: 'Ford', model: 'Ranger XLS', year: 2021, price: 219900, km: 48000,
    transmission: 'Manual', fuel: 'Diesel', category: 'Picape', color: 'Prata Lunar',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Picape resistente com motor diesel 2.2 de 160 cv, tração 4x4 com reduzida, capacidade de carga de 1 tonelada e reboque de até 3,5 toneladas.', featured: false, stock: 1,
  },
  {
    id: '24', name: 'Volkswagen Amarok Highline', brand: 'Volkswagen', model: 'Amarok Highline', year: 2022, price: 289900, km: 31000,
    transmission: 'Automático', fuel: 'Diesel', category: 'Picape', color: 'Preto Deep',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'A picape mais potente do segmento com motor V6 TDI 3.0 de 224 cv, câmbio automático de 8 marchas, tração 4Motion e acabamento premium Highline.', featured: true, stock: 1,
  },
  {
    id: '25', name: 'Chevrolet S10 LTZ 4x4', brand: 'Chevrolet', model: 'S10 LTZ', year: 2021, price: 229900, km: 44000,
    transmission: 'Automático', fuel: 'Diesel', category: 'Picape', color: 'Branco Summit',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Picape versátil com motor diesel 2.8 Duramax de 200 cv, tração 4x4 automática, suspensão traseira a molas e MyLink 8" com CarPlay.', featured: false, stock: 2,
  },
  // HATCH PREMIUM
  {
    id: '26', name: 'Volkswagen Golf GTI', brand: 'Volkswagen', model: 'Golf GTI', year: 2023, price: 219900, km: 12000,
    transmission: 'Automático DSG', fuel: 'Gasolina', category: 'Hatch Premium', color: 'Vermelho Tornado',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
    description: 'Ícone esportivo com motor EA888 2.0 TSI de 245 cv, câmbio DSG de 7 marchas, frenagem Brembo e visual agressivo com rodas de 18".', featured: true, stock: 1,
  },
  // ELÉTRICOS
  {
    id: '27', name: 'BYD Dolphin Plus', brand: 'BYD', model: 'Dolphin Plus', year: 2024, price: 149900, km: 8000,
    transmission: 'Automático (Elétrico)', fuel: 'Elétrico', category: 'Hatch Elétrico', color: 'Azul Oceano',
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    description: 'Hatch elétrico com autonomia de 468 km, carregamento rápido DC 60kW, tela giratória de 12.8", carga de 0-80% em 30 minutos e custo de manutenção mínimo.', featured: true, stock: 1,
  },
  {
    id: '28', name: 'BYD Seal AWD', brand: 'BYD', model: 'Seal AWD', year: 2024, price: 289900, km: 5000,
    transmission: 'Automático (Elétrico AWD)', fuel: 'Elétrico', category: 'Sedan Elétrico', color: 'Branco',
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    description: 'Sedan elétrico AWD com 530 cv, 0-100 km/h em 3.8s, autonomia de 580 km, suspensão traseira multilink e bateria Blade de 82.5 kWh.', featured: true, stock: 1,
  },
  // ESPORTIVOS / VIP
  {
    id: '29', name: 'Ford Mustang GT 5.0 V8', brand: 'Ford', model: 'Mustang GT', year: 2021, price: 389900, km: 19000,
    transmission: 'Manual 6 Marchas', fuel: 'Gasolina', category: 'Esportivo', color: 'Azul Velocity',
    images: ['https://images.unsplash.com/photo-1584345604476-8ec5f452d7f3?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5f452d7f3?w=800&q=80',
    description: 'Lendário muscle car americano com motor V8 5.0 de 460 cv, escapamento ativo, modos de condução personalizáveis e visual icônico que para multidões.', featured: true, stock: 1,
  },
  {
    id: '30', name: 'Chevrolet Camaro SS 6.2 V8', brand: 'Chevrolet', model: 'Camaro SS', year: 2020, price: 359900, km: 28000,
    transmission: 'Manual 6 Marchas', fuel: 'Gasolina', category: 'Esportivo', color: 'Amarelo Rally',
    images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
    description: 'Muscle car brutal com motor V8 6.2 de 455 cv, 0-100 em 4.0 segundos, frenagem Brembo de 6 pistões e sistema de escape ativo Borla.', featured: true, stock: 1,
  },
  {
    id: '31', name: 'BMW M3 Competition', brand: 'BMW', model: 'M3 Competition', year: 2022, price: 699900, km: 14000,
    transmission: 'Automático M DCT', fuel: 'Gasolina', category: 'Esportivo Premium', color: 'Verde Isle of Man',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    description: 'O sedã mais esportivo da BMW com motor S58 3.0 bi-turbo de 510 cv, tração traseira, 0-100 em 3.9s, diferencial M ativo e pacote Competition completo.', featured: true, stock: 1,
  },
  {
    id: '32', name: 'Porsche 718 Cayman', brand: 'Porsche', model: '718 Cayman', year: 2021, price: 489900, km: 22000,
    transmission: 'Automático PDK', fuel: 'Gasolina', category: 'Esportivo Premium', color: 'Amarelo Racing',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    description: 'Esportivo de médio porte com motor boxer 2.0 turbo de 300 cv, câmbio PDK de 7 marchas, peso de apenas 1.395 kg e agilidade incomparável nas curvas.', featured: true, stock: 1,
  },
];

export const categories = ['Todos', 'Hatch Popular', 'Sedan Popular', 'Sedan', 'Sedan Premium', 'SUV', 'SUV Premium', 'Picape', 'Hatch Premium', 'Hatch Elétrico', 'Sedan Elétrico', 'Esportivo', 'Esportivo Premium'];

export const brands = ['Todas', 'Chevrolet', 'Volkswagen', 'Toyota', 'Honda', 'Hyundai', 'Fiat', 'Renault', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Jeep', 'Ford', 'BYD', 'Porsche'];

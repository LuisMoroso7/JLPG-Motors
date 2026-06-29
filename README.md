# JLPG Motors — Frontend Mobile

Aplicativo mobile desenvolvido em React Native com Expo para a plataforma de e-commerce de veículos JLPG Motors, localizada em Ciriaco, RS.

## Tecnologias

- **React Native** com Expo SDK 54
- **React Navigation** — navegação por tabs e stack
- **Expo Linear Gradient** — gradientes profissionais
- **Expo Vector Icons** — ícones Ionicons
- **Expo Image Picker** — upload de fotos
- **Axios** — integração com a API REST
- **API Anthropic Claude** — assistente de IA no chat de negociação

## Funcionalidades

### Cliente
- Onboarding animado com 4 slides de boas-vindas
- Login e cadastro com validação completa
- Catálogo com 36+ veículos (carros e motos)
- Filtros por categoria, marca, combustível, câmbio e faixa de preço
- Ordenação por preço, km e ano
- Alternância entre lista e grade
- Pull-to-refresh no catálogo
- Galeria de fotos na tela de detalhes
- Simulador de financiamento com prazo e entrada
- Comparação de dois veículos lado a lado
- Sistema de favoritos
- Proposta de compra com múltiplos veículos
- Chat com assistente de IA para negociação
- Agendamento de test drive com calendário
- Avaliações e reviews dos veículos
- Histórico de pedidos e test drives
- Alerta de preço personalizado
- Compartilhar veículo e proposta
- Perfil com foto e informações

### Administrador
- Painel admin exclusivo (visível só para ADMIN)
- Cadastro de veículos com dropdowns (ano, câmbio, combustível, categoria, cor)
- Edição e exclusão de veículos
- Gerenciamento de test drives — aprovar ou recusar
- Chat com clientes com opção de assumir conversa como gerente
- Botões de aprovar ou recusar venda no chat

### Loja
- Mapa visual com localização em Ciriaco, RS
- Botões para abrir no Google Maps e Waze
- Contato via WhatsApp, telefone e e-mail
- Horário de funcionamento

## Integração com Backend

O app integra com a API REST do JLPG Motors Backend hospedada em:

https://jlpg-motors-backend.onrender.com

Endpoints utilizados:
- POST /auth-service/auth/login — autenticação
- POST /auth-service/auth/register — cadastro
- GET /vehicle-service/vehicles — listagem de veículos
- POST /vehicle-service/vehicles — cadastro de veículo (ADMIN)
- PUT /vehicle-service/vehicles/{id} — edição (ADMIN)
- DELETE /vehicle-service/vehicles/{id} — exclusão (ADMIN)
- POST /customer-service/favorites/{vehicleId} — toggle favorito
- GET /customer-service/favorites — listar favoritos
- POST /customer-service/negotiations/{vehicleId} — iniciar negociação
- GET /customer-service/negotiations/my-chats — histórico do cliente
- PUT /customer-service/negotiations/{chatId}/close — encerrar (ADMIN)

O app possui fallback automático — se o backend estiver offline, continua funcionando com dados locais.

## Como rodar

### Pré-requisitos
- Node.js 18+
- Expo Go instalado no celular (iOS ou Android)
- Celular e computador na mesma rede Wi-Fi

### Instalação

```
git clone https://github.com/LuisMoroso7/JLPG-Motors.git
cd JLPG-Motors
npm install
npm start
```

Escaneia o QR Code com o Expo Go no celular.

## Credenciais de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | adm@jlpg.com | senha123 |
| Cliente | comum@jlpg.com | senha123 |

## Estrutura do projeto

```
src/
components/     Componentes reutilizáveis
data/           Dados mockados de fallback
navigation/     Configuração de rotas
screens/        Todas as telas do app
services/       Integração com backend (api.js)
theme/          Tema dark profissional (colors.js)
utils/          Utilitários (formatCurrency.js)
```

## Disciplina

Projeto desenvolvido para a disciplina Projeto, Design e Engenharia de Processos — ATITUS Educação, Passo Fundo/RS.

Professor: Augusto Kruger Ortolan / Luciano Rodrigo Ferretto

Integrantes:
- João Paulo Pasolini
- Luis Eduardo Moroso
- Gustavo Marcante Vazzoler
- Pedro Henrique Renosto

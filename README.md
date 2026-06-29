# JLPG Motors - Frontend Mobile

Aplicativo mobile desenvolvido em React Native com Expo para a plataforma de e-commerce de veiculos JLPG Motors.

## Tecnologias

- React Native com Expo SDK 54
- React Navigation
- Expo Linear Gradient
- Expo Vector Icons
- Axios
- AsyncStorage para sessao local

## Funcionalidades

### Cliente

- Onboarding
- Login e cadastro
- Catalogo de veiculos
- Filtros por categoria, marca, combustivel, cambio e faixa de preco
- Ordenacao por preco, km e ano
- Detalhes do veiculo
- Simulador de financiamento
- Comparacao de veiculos
- Favoritos locais
- Proposta de compra integrada ao backend de pedidos
- Agendamento de test drive local
- Historico de pedidos e test drives
- Alertas de preco locais
- Perfil

### Administrador

- Painel admin para usuarios com `role=ADMIN`
- Cadastro, edicao e exclusao de veiculos via backend
- Campo de imagem por URL publica
- Gerenciamento local de test drives

## Integracao com Backend

O app consome o `gateway-service` do backend Spring Boot.

URL padrao local:

```bash
http://localhost:8080
```

Para alterar a URL da API, use:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080
```

No celular fisico com Expo Go, `localhost` aponta para o proprio celular. Use o IP da maquina que esta rodando o backend, por exemplo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Endpoints usados:

- `POST /auth/login` - login
- `POST /auth/register` - cadastro
- `GET /products?targetCurrency=BRL` - listagem de veiculos
- `POST /ws/product` - cadastro de veiculo, exige ADMIN
- `PUT /ws/product/{id}` - edicao de veiculo, exige ADMIN
- `DELETE /ws/product/{id}` - exclusao de veiculo, exige ADMIN
- `POST /ws/orders` - criacao de pedido/proposta
- `GET /ws/orders/BRL` - historico de pedidos do usuario logado

Recursos mantidos locais nesta etapa:

- Favoritos
- Test drives
- Chat
- Reviews
- Alertas de preco

## Como Rodar

### Pre-requisitos

- Node.js 18+
- Expo Go instalado no celular, se for testar em dispositivo fisico
- Backend rodando pelo `gateway-service`

### Instalacao

```bash
npm install
```

### Ambiente local no navegador/Expo Web

```bash
npm start
```

### Ambiente local no celular fisico

No PowerShell:

```powershell
$env:EXPO_PUBLIC_API_URL="http://SEU_IP_LOCAL:8080"
npm start
```

Depois escaneie o QR Code com o Expo Go.

## Credenciais

O usuario administrador sera criado pelo time de backend. Para acesso admin, o usuario precisa retornar `role: "ADMIN"` no login.

## Estrutura

```text
src/
components/     Componentes reutilizaveis
data/           Dados mockados de fallback
navigation/     Configuracao de rotas
screens/        Telas do app
services/       Integracao com backend
theme/          Tema visual
utils/          Utilitarios
```

# JLPG Motors - React Native

Aplicativo mobile de e-commerce de veículos desenvolvido em **React Native com Expo**.

## Tema

A JLPG Motors é um aplicativo para venda de carros. O usuário pode visualizar o catálogo de veículos, abrir detalhes, salvar favoritos, montar uma proposta de compra e acompanhar solicitações realizadas. O aplicativo também possui uma área administrativa para cadastrar, editar e remover veículos.

## Funcionalidades

### Cliente

- Login mockado
- Cadastro mockado
- Página inicial
- Catálogo de veículos
- Busca por marca, modelo ou categoria
- Detalhes do veículo
- Favoritos
- Proposta de compra
- Histórico de solicitações
- Perfil do usuário

### Administrador

- Acesso como administrador usando um e-mail com `admin`
- Listagem de veículos cadastrados
- Cadastro de novo veículo
- Edição de veículo
- Exclusão de veículo

## Tecnologias utilizadas

- React Native
- Expo
- React Navigation
- JavaScript
- Axios preparado para integração futura com API

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm start
```

3. Abra com o aplicativo Expo Go no celular ou use o emulador.

## Integração futura com backend

O arquivo `src/services/api.js` já possui os endpoints esperados para integração com o backend em microservices:

- `POST /auth/signup`
- `POST /auth/signin`
- `GET /products?targetCurrency=BRL`
- `GET /products/{id}?targetCurrency=BRL`
- `POST /ws/product`
- `PUT /ws/product/{id}`
- `DELETE /ws/product/{id}`
- `POST /ws/orders`
- `GET /ws/orders/BRL`

Enquanto o backend não estiver pronto, o aplicativo utiliza dados mockados no arquivo `src/data/vehicles.js`.



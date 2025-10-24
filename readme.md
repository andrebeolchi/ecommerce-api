# Clean E-Commerce API

![GitHub Actions Test Status](https://img.shields.io/github/actions/workflow/status/andrebeolchi/ecommerce-api/test-coverage.yml?label=tests) 

Esse projeto é uma API de e-commerce construída seguindo os princípios da Clean Architecture, visando escalabilidade, manutenibilidade e código limpo.

## Links

- [Acompanhe o desenvolvimento](https://github.com/users/andrebeolchi/projects/3)
- [Repositório Web](https://github.com/andrebeolchi/ecommerce-web/)

## Índice

- [Clean E-Commerce API](#clean-e-commerce-api)
  - [Links](#links)
  - [Índice](#índice)
  - [Como executar?](#como-executar)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Configuração](#passos-para-configuração)
  - [Rotas disponíveis:](#rotas-disponíveis)
  - [Testes Automatizados](#testes-automatizados)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Qualidade de Código](#qualidade-de-código)

## Como executar?

### Pré-requisitos

- **Node.js**
- **NPM** ou **Yarn**
- **Docker** (para rodar o banco de dados via container)

### Passos para Configuração

1. **Clone o repositório**:

```bash
git clone https://github.com/andrebeolchi/ecommerce-api.git
cd ecommerce-api
```

2. **Instale as dependências**:

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` a partir do `.env.example` na raiz do projeto.

4. **Inicie o banco de dados via Docker**:

```bash
docker-compose up -d
```

5. **Execute as migrações do banco de dados**:

```bash
npm run db:migrate
# ou
yarn db:migrate
```

6. **Rode o seed para popular o banco de dados com dados iniciais**:

```bash
npm run db:seed
# ou
yarn db:seed
```

7. **Inicie a aplicação**:

```bash
npm run dev
# ou
yarn dev
```

## Rotas disponíveis:

- `POST /api/auth/register`: Registra um novo usuário.
- `POST /api/auth/login`: Autentica um usuário e retorna um token JWT.

- `GET /api/products`: Retorna uma lista de produtos.
- `GET /api/products/:id`: Retorna detalhes de um produto específico.

- `POST /api/cart/add`: Adiciona um produto ao carrinho.
  - Necessita Bearer Token no header para autenticação.

- `GET /api/cart`: Retorna os itens no carrinho do usuário autenticado.
  - Necessita Bearer Token no header para autenticação.

## Testes Automatizados

O projeto inclui testes automatizados para garantir a qualidade do código. Para executar os testes, utilize o comando:

```bash
# Executar todos os testes
yarn test

# Ver relatório de cobertura
open coverage/lcov-report/index.html
```

## Tecnologias Utilizadas

- Node.js + TypeScript
- Fastify - Framework web
- Prisma - ORM
- PostgreSQL - Banco de dados
- Jest - Framework de testes
- JWT - Autenticação
- Docker - Containerização

## Qualidade de Código
Este projeto segue as melhores práticas de qualidade de código, incluindo:

- **ESLint**: Para garantir a consistência do código.
  - Ordenação automática de imports
- **Prettier**: Para formatação automática do código.
- **Husky**: Para executar scripts de verificação antes dos commits.
- **Commitlint**: Para padronizar mensagens de commit.
# 📋 Gerenciador de Tarefas

Repositório full-stack de um **Gerenciador de Tarefas** com **backend** em Node.js/TypeScript/Express/MySQL/Prisma e **frontend** em React/TypeScript/Ant Design. Funcionalidades principais: autenticação JWT, CRUD de tarefas, Kanban interativo, tema claro/escuro, animações e timestamps.

---

## 📂 Estrutura do Projeto

```
/
├── backend/            # API RESTful em Node.js + TypeScript
│   ├── src/
│   ├── prisma/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── app.ts
│   ├── index.ts
│   └── tests/
│
├── frontend/           # SPA em React + TypeScript + Ant Design
│   ├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   └── assets/
│
└── README.md           # Documentação unificada (este arquivo)
```

---

## 🚀 Tecnologias

**Backend**  
- Node.js, TypeScript, Express  
- MySQL, Prisma ORM  
- JWT, bcryptjs, express-validator  
- Jest + Supertest (testes)

**Frontend**  
- React, TypeScript, Vite/CRA  
- Ant Design, CSS Modules  
- Axios, Context API  
- Framer Motion, @hello-pangea/dnd  
- dotenv (variáveis de ambiente)

---

## ⚙️ Pré-requisitos

- Node.js v14+  
- npm ou yarn  
- MySQL instalado e rodando  

---

## 🛠️ Setup

### 1. Clonar Repositório

```bash
git clone https://github.com/DevLucasCarvalhoCosta/Gerenciador-de-Tarefas.git
```

### 2. Configurar Backend

```bash
cd gerenciador-tarefas/backend
npm install
```

Crie `.env`:

```env
PORT=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=

# Prisma
DATABASE_URL=""
```

#### Rodar Migrations e Iniciar

```bash
npx prisma migrate dev --name init
npm run dev
```

Testes:

```bash
npm test
```

### 3. Configurar Frontend

Em outra aba/terminal:

```bash
cd gerenciador-tarefas/frontend
npm install
```

Crie `.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

Iniciar SPA:

```bash
npm start
```

Abra `http://localhost:3000`.

---

## 📋 Uso

1. Acesse a rota `/register` (backend) para criar usuário ou use SPA.
2. Faça login no frontend; após sucesso, será redirecionado ao Kanban.
3. Crie, arraste e edite tarefas com prioridade, veja createdAt/updatedAt.
4. Altere tema via botão no header.

---

## 📝 Scripts Úteis

**Backend** (dentro de `backend/`):
- `npm run dev` – Dev server com ts-node-dev  
- `npm test` – Executa testes Jest + Supertest  

**Frontend** (dentro de `frontend/`):
- `npm run dev` – Dev server Vite  
- `npm start` – Dev server CRA  
- `npm run build` – Build de produção  
- `npm run preview` – Preview do build  

---

## 🤝 Contribuição

1. Fork do projeto  
2. Crie branch: `git checkout -b feature/nova-funcionalidade`  
3. Commit das mudanças: `git commit -m "feat: adicionar..."`  
4. Push: `git push origin feature/nova-funcionalidade`  
5. Abra Pull Request

---

## 📌 Autor

**Lucas Carvalho Costa**  
- LinkedIn: https://linkedin.com/in/devlucascarvalhocosta 

---

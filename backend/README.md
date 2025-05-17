
# 📋 Gerenciador de Tarefas - Backend

Este é o backend do sistema de gerenciamento de tarefas, desenvolvido com Node.js, TypeScript, Express, MySQL e Prisma ORM. Oferece autenticação JWT, CRUD completo de tarefas, controle de status e prioridade, além de testes automatizados com Jest.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** – Ambiente JavaScript para servidor.
- **TypeScript** – Tipagem estática para maior segurança e produtividade.
- **Express** – Framework para APIs RESTful.
- **MySQL** – Banco de dados relacional.
- **Prisma ORM** – ORM moderno, eficiente e tipado para manipulação de dados.

  > 🔄 *Migrado de consultas manuais com `mysql2` para Prisma ORM, demonstrando domínio de ambas as abordagens.*

- **JWT (JSON Web Token)** – Autenticação segura via tokens.
- **bcryptjs** – Criptografia de senhas.
- **express-validator** – Validação de dados nas requisições.
- **Jest + Supertest** – Testes automatizados para validação da API.

---

## 📁 Estrutura de Pastas

```
src/
├── prisma/            # Schema e cliente Prisma
├── controllers/       # Controladores das rotas
├── middlewares/       # Autenticação e validações
├── routes/            # Definição das rotas da API
├── app.ts             # Configuração principal da API
└── index.ts           # Ponto de entrada
```

---

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/DevLucasCarvalhoCosta/Gerenciador-de-Tarefas.git
cd gerenciador-tarefas/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
DB_NAME=taskmanager
JWT_SECRET= Sua chave

# Prisma
DATABASE_URL="mysql://root:123456@localhost:3306/taskmanager"

```

4. Gere o client e aplique migrations com Prisma:

```bash
npx prisma migrate dev --name init
```

5. Inicie a API:

```bash
npm run dev
```

---

## 🔄 Migração do mysql2 para Prisma

Antes, o projeto usava `mysql2` e queries manuais:

```ts
const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
```

Agora usa Prisma ORM, mais simples e seguro:

```ts
const usuario = await prisma.usuario.findUnique({ where: { email } });
```

---

## 🔐 Regras para Status e Prioridade

- **Status permitidos (no backend):**  
  `'pendente'`, `'em_andamento'`, `'concluida'`  
  > No frontend, converta o status para este formato antes de enviar.

- **Prioridade permitida:**  
  `'baixa'`, `'media'`, `'alta'`

---

## 🔐 Rotas da API

### Autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tarefas (requer token JWT)

- `GET /api/tarefas`
- `POST /api/tarefas`
- `PUT /api/tarefas/:id`
- `DELETE /api/tarefas/:id`

> Enviar no header: `Authorization: Bearer <seu_token>`

---

## ✅ Testes Automatizados

Rodar os testes:

```bash
npm test
```

- Cobertura de testes para autenticação e CRUD de tarefas
- Utiliza Jest + Supertest
- Compatível com Prisma ORM

---

## 🧠 Exemplo Scrum e Jira

### Épico

> Gestão de Tarefas com Acesso Seguro

### História de Usuário

> Como colaborador, quero criar, listar e gerenciar tarefas para organizar meu trabalho com segurança.

### Tarefa

> Criar API REST autenticada com JWT, protegendo as rotas de tarefas e testá-la com Jest.

---

## ♻️ Exemplo de Refatoração - Código Legado para Código Moderno

**Antes (mistura de responsabilidades, falta padronização):**

```ts
app.post('/api/tarefas', async (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = req.headers['x-user-id'];

  if (!titulo || !descricao) {
    res.status(400).send("Campos obrigatórios não preenchidos.");
    return;
  }

  const tarefa = {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    usuario_id: Number(usuarioId),
    status: 'pendente'
  };

  try {
    await db.query('INSERT INTO tarefas SET ?', tarefa);
    res.send("Criado com sucesso.");
  } catch (err) {
    res.status(500).send("Erro interno.");
  }
});
```

**Depois (separação clara, uso do Prisma, respostas padrão):**

```ts
import { RequestHandler } from 'express';
import { prisma } from '../prisma/client';

export const criarTarefa: RequestHandler = async (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = (req as any).usuario.id;

  if (!titulo?.trim() || !descricao?.trim()) {
    return res.status(400).json({ message: "Título e descrição são obrigatórios." });
  }

  try {
    await prisma.tarefa.create({
      data: {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        status: 'pendente',
        usuarioId
      }
    });

    return res.status(201).json({ message: "Tarefa criada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao criar a tarefa." });
  }
};
```

---

## 📌 Autor

- **Lucas Carvalho Costa**  
- LinkedIn: [linkedin.com/in/devlucascarvalhocosta](https://linkedin.com/in/devlucascarvalhocosta)

---

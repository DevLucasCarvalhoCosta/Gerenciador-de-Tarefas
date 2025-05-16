# 📋 Gerenciador de Tarefas - Backend

Este é o backend do sistema de gerenciamento de tarefas, desenvolvido com Node.js, TypeScript, Express e MySQL. Ele oferece autenticação com JWT, CRUD completo de tarefas e testes automatizados com Jest. Agora, com integração total ao Prisma ORM.

---

## 🚀 Tecnologias Utilizadas

O backend foi desenvolvido com foco em desempenho, segurança e boas práticas modernas. As tecnologias adotadas incluem:

- **Node.js** – Ambiente de execução JavaScript no lado do servidor.
- **TypeScript** – Superset de JavaScript com tipagem estática, trazendo maior segurança e produtividade.
- **Express** – Framework minimalista e robusto para construção de APIs RESTful.
- **MySQL** – Banco de dados relacional utilizado para persistência das informações.
- **Prisma ORM** – ORM moderno e eficiente utilizado para manipulação de dados com tipagem completa.  
  > 🔄 *O projeto foi inicialmente construído com `mysql2` e `db.query(...)`, e posteriormente migrado para o Prisma, demonstrando domínio de ambas as abordagens.*
- **JWT (JSON Web Token)** – Para autenticação segura e baseada em tokens.
- **bcryptjs** – Para criptografia de senhas no processo de registro e login.
- **express-validator** – Para validação de dados nas requisições, garantindo integridade.
- **Jest + Supertest** – Ferramentas de testes automatizados para simular requisições e validar comportamentos da API.


---

## 📁 Estrutura de Pastas

```
src/
├── prisma/            # Prisma Client e schema
├── controllers/       # Lógica das rotas
├── middlewares/       # Autenticação e validações
├── routes/            # Rotas da API
├── app.ts             # Configuração principal da API
└── index.ts           # Ponto de entrada
```

---

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seuusuario/gerenciador-tarefas.git
cd gerenciador-tarefas/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o `.env`:

```env
PORT=3001
JWT_SECRET=sua_chave_secreta
DATABASE_URL="mysql://root:sua_senha@localhost:3306/nome_do_banco"
```

4. Gere o client e o banco com Prisma:

```bash
npx prisma migrate dev --name init
```

5. Inicie a API:

```bash
npm run dev
```

---

## 🔄 Migração do mysql2 para Prisma

O projeto originalmente utilizava `mysql2` com `db.query(...)` manual. Agora foi migrado para o ORM **Prisma**, trazendo benefícios como:

- Tipagem automática de entidades
- Integração com TypeScript
- Migrations versionadas
- Simplicidade nas queries

### Exemplo da migração:

**Antes (mysql2):**
```ts
const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
```

**Depois (Prisma):**
```ts
const usuario = await prisma.usuario.findUnique({ where: { email } });
```

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

> Enviar header: `Authorization: Bearer <seu_token>`

---

## ✅ Testes Automatizados

Rodar os testes:

```bash
npm test
```

- 8 testes cobrindo autenticação e CRUD de tarefas com token
- Testes usando Jest + Supertest
- Agora compatíveis com Prisma (com timeout aumentado)

---

## 🧠 Scrum e Jira (Exemplo)

### Épico:
> Gestão de Tarefas com Acesso Seguro

### História de Usuário:
> Como colaborador, quero criar, listar e gerenciar tarefas, para organizar meu trabalho com segurança.

### Tarefa:
> Criar API REST autenticada com JWT protegendo as rotas de tarefas e testá-la com Jest.

---

## ♻️ Refatoração (exemplo de código legado)

Durante o desenvolvimento, foi identificado um padrão de código com baixa legibilidade, lógica dispersa e violação do princípio da responsabilidade única. A seguir, um exemplo fictício de refatoração que evidencia boas práticas aplicadas:

### 🔴 Antes – Código legado com múltiplas responsabilidades

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

---

### ❌ Problemas encontrados:

- Validações e criação de tarefa misturadas na mesma função.
- Respostas sem padrão (uso de `.send()` com strings simples).
- Falta de consistência e clareza na estrutura de dados.
- Lógica de transformação de dados (`trim`, `Number()`) diretamente no controller.
- Baixa reutilização de código.

---

### ✅ Depois – Código refatorado com responsabilidade única e padrões REST

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

### 💡 Melhorias aplicadas:

| Problema antigo                            | Solução aplicada                                 |
|--------------------------------------------|--------------------------------------------------|
| Código com múltiplas responsabilidades     | Separação clara entre validação, lógica e resposta |
| Dados não tratados corretamente            | Uso de `.trim()` e checagem segura com optional chaining |
| Falta de padrão nas respostas              | Respostas consistentes com `res.status().json()` |
| Baixa clareza e manutenção                 | Função clara, reutilizável e fácil de testar     |

Essa refatoração demonstra o compromisso com os princípios **SRP (Responsabilidade Única)**, **Clean Code**, e **boas práticas REST**, promovendo legibilidade, padronização e testabilidade do código.

---

## 📌 Autor

- **Nome:** Lucas Carvalho Costa
- **LinkedIn:** [linkedin.com/in/lucas-carvalho-costa](https://linkedin.com/in/lucas-carvalho-costa)

---

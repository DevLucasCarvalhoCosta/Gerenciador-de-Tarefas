# 📋 Gerenciador de Tarefas - Frontend

Este é o frontend do sistema de gerenciamento de tarefas, desenvolvido com React, TypeScript e Ant Design. Implementa um **Kanban** interativo, tema claro/escuro, autenticação via JWT e boas práticas de código e UX.

---

## 🚀 Tecnologias Utilizadas

- **React** (TS) – Biblioteca para construção de interfaces.
- **TypeScript** – Tipagem estática no frontend.
- **Create React App** – Ferramenta de build e dev server.
- **Ant Design** – Componentes UI profissionais.
- **Axios** – Cliente HTTP configurado com base em `REACT_APP_API_URL`.
- **Context API** – Gerenciamento de estado de autenticação e tema.
- **Framer Motion** – Animações suaves para avatar e saudações.
- **@hello-pangea/dnd** – Drag & Drop para o Kanban.
- **CSS Modules** – Escopo local de estilos.
- **dotenv** – Carregamento de variáveis de ambiente.

---

## 📁 Estrutura de Pastas

```bash
src/
├── api/
│   └── axios.ts           # Cliente Axios configurado
├── assets/                # Imagens, fontes
├── components/
│   ├── Layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── HeaderBar.tsx
│   │   └── SideMenu.tsx
│   └── UI/                # Botões, Spinner, etc.
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   └── useTheme.ts
├── pages/
│   ├── Login.tsx
│   ├── Tarefas.tsx       # CRUD simples
│   └── KanbanTarefas.tsx # Quadro Kanban avançado
├── routes/
│   └── AppRoutes.tsx
├── styles/
│   └── *.module.css
├── App.tsx                # Configuração de rotas
└── index.tsx               # Ponto de entrada
```

---

## ⚙️ Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/DevLucasCarvalhoCosta/Gerenciador-de-Tarefas.git
cd gerenciador-tarefas/frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` na raiz do `frontend`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

ou, se usar CRA:

```bash
npm start
```

5. Acesse em `http://localhost:3000`.

---

## 🔧 Scripts Disponíveis

| Script             | Descrição                                  |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Executa em modo desenvolvimento (Vite).    |
| `npm run build`    | Gera build de produção otimizado.         |
| `npm run preview`  | Serve build para preview local.           |
| `npm start`        | Executa em modo desenvolvimento (CRA).     |

---

## 🔐 Autenticação

- Após login bem-sucedido, o **AuthContext** armazena o JWT em `localStorage` e configura o header do Axios.
- **Rotas privadas** usam `<PrivateRoute>` para redirecionar usuários não autenticados.

### Fluxo de login

1. Formulário envia `POST /auth/login` com email e senha.
2. Recebe `{ token, user }`.
3. Context salva e navega para `/kanban`.

---

## 🌗 Tema Claro / Escuro

- **ThemeContext** controla estado do tema (`light` / `dark`).
- Variáveis CSS dinamicamente atualizadas.
- Componentes (`DashboardLayout`, `KanbanTarefas`) aplicam classe `.darkMode` para alterar cores.

---

## 🗂️ Kanban e Tarefas

- **Drag & Drop** entre colunas.
- Filtros de busca por status e titulo.
- Exibição de `createdAt` e `updatedAt` formatados.
- Seleção de prioridade via tags estilizadas.
- Confirmação de exclusão com Modal do Ant Design.
- Botões e inputs adaptados a ambos os temas.

---

## 🎨 Customização

- Ajuste cores no CSS Modules (`src/styles/`), alterando as **CSS variables**:
  - `--bg-page`, `--panel-bg`, `--column-bg`, `--card-bg`, `--text-color`, etc.
- Para trocar o icon da logo, substitua em `src/assets`.

---

## 📌 Autor

- **Lucas Carvalho Costa**  
  LinkedIn: [linkedin.com/in/devlucascarvalhocosta](https://linkedin.com/in/devlucascarvalhocosta)

---

Feito com ❤️ e boas práticas de desenvolvimento!

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import KanbanTarefas from './pages/KanbanTarefas';
import Tarefas from './pages/Tarefas';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => (
  <Routes>
    {/* Rota pública */}
    <Route path="/login" element={<Login />} />

    {/* Rotas protegidas dentro do layout */}
    <Route
      path="/"
      element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<Navigate to="/kanban" replace />} />
      <Route path="kanban" element={<KanbanTarefas />} />
      <Route path="tarefas" element={<Tarefas />} />
      {/* Outras rotas protegidas podem ser adicionadas aqui */}
    </Route>

    {/* Redirecionar rotas desconhecidas */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import KanbanTarefas from './pages/KanbanTarefas/KanbanTarefas';
import Tarefas from './pages/Tarefas/Tarefas';

import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

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
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tarefas from './pages/Tarefas';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/tarefas"
        element={
          <PrivateRoute>
            <Tarefas />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;

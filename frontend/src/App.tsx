import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tarefas from './pages/Tarefas';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;

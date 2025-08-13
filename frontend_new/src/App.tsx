import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Processes from './pages/Processes';
import Exigencias from './pages/Exigencias';
import EditProcess from './pages/EditProcess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/processos" element={<Processes />} />
        <Route path="/processos/editar/:id" element={<EditProcess />} />
        <Route path="/exigencias" element={<Exigencias />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

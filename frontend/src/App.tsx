import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Processes from './pages/Processes';
import Exigencias from './pages/Exigencias';
import EditProcess from './pages/EditProcess';
import TesteLicenca from './pages/TesteLicenca';
import TesteLicenca2 from './pages/TesteLicenca2';
import TesteLicenca3 from './pages/TesteLicenca3';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/processos" element={<Processes />} />
        <Route path="/processos/editar/:id" element={<EditProcess />} />
        <Route path="/exigencias" element={<Exigencias />} />
        <Route path="/teste" element={<TesteLicenca />} />
        <Route path="/teste2" element={<TesteLicenca2 />} />
        <Route path="/teste3" element={<TesteLicenca3 />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

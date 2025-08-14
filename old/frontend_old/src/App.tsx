import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Exigencias from './pages/Exigencias';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Exigencias />} />
        <Route path="/exigencias" element={<Exigencias />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioForm from './components/PortfolioForm';
import PortfolioTemplate from './components/PortfolioTemplate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioForm />} />
        <Route path="/portfolio/:portfolioUrl" element={<PortfolioTemplate />} />
      </Routes>
    </Router>
  );
}

export default App; 
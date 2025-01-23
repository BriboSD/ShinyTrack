import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';


// import Seller from './pages/SellerPage';

function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

    </Routes>
  );
}

export default App;
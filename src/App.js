import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './Pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;

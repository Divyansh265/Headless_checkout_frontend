import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './Pages/Checkout'; // Assuming Checkout is the component for displaying the cart

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/cart-preview" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;

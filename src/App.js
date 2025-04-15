
import './App.css';

// In App.js
import { Route, Routes } from 'react-router-dom';
import Checkout from './Pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/cart-preview" element={<Checkout />} />

    </Routes>
  );
}


export default App;

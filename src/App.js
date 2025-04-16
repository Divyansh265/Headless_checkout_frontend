import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from './Pages/Checkout';

function App() {
  return (
    <Router>
      <>
        <h1>Checkout</h1>
        <Routes>
          <Route path="/cart-preview" element={<Checkout />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

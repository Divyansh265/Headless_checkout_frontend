import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from './Pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;

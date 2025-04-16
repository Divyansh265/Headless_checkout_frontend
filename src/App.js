import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Checkout from './Pages/Checkout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/checkout" element={<Checkout />} />
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


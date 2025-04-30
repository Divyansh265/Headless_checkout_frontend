import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Checkout from "./Pages/Checkout";
import Home from "./Pages/Home";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} /> 
      <Route path="/checkout" element={<Checkout />} /> 
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

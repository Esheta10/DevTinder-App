import { useState } from "react";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
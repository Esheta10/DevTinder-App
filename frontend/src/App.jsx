import { useState } from "react";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";
import {Provider} from "react-redux";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Provider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
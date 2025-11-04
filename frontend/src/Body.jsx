import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Body = () => (
  <div>
    <NavBar />
    <Outlet />
  </div>
);

export default Body;

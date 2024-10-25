import "./Body.css";
import Home from "./home/Home";
import About from "./about/About";
import Contact from "./contact/Contact";
import User from "./user/User";
import Register from "./auth/register/Register";
import Login from "./auth/login/Login";
import { Route, Routes } from "react-router-dom";

function Body() {
  return (
    <>
      <main style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/user" element={<User />}></Route>

          {/* Auth */}
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default Body;

import "./Body.css";
import Home from "./home/Home";
import About from "./about/About";
import Contact from "./contact/Contact";
import User from "./user/User";
import Register from "./auth/register/Register";
import Login from "./auth/login/Login";
import { Route, Routes } from "react-router-dom";
import ProjectOverview from "../templates/ProjectOverview/ProjectOverview";

function Body() {
  return (
    <>
      <main style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/project/:id" element={<ProjectOverview />} />
          <Route path="/user/project/:id" element={<ProjectOverview />} />
          {/* Auth */}
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default Body;

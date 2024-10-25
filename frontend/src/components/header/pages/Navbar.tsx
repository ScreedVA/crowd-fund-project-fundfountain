import { useNavigate } from "react-router-dom";

import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../../services/AuthService";

function Navbar() {
  const navigate = useNavigate();
  const { signedIn, logout } = useContext(AuthContext);
  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-div">
          <div className="logo">
            <a href="#" onClick={() => navigate("/")}>
              FundFountain
            </a>
          </div>
          <ul className="nav-list">
            <li>
              <a href="#" onClick={() => navigate("/about")}>
                About
              </a>
            </li>
            <li>
              <a href="#" onClick={() => navigate("/contact")}>
                Contact
              </a>
            </li>
            {signedIn ? (
              <>
                <button className="navButton">
                  <a href="#" onClick={handleSignOut}>
                    Sign out
                  </a>
                </button>
                <button className="navButton prof">
                  <a href="#" onClick={() => navigate("/user")}>
                    Profile
                  </a>
                </button>
              </>
            ) : (
              <>
                <button className="navButton reg">
                  <a href="#" onClick={() => navigate("/register")}>
                    Register
                  </a>
                </button>
                <button className="navButton log">
                  <a href="#" onClick={() => navigate("/login")}>
                    Login
                  </a>
                </button>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useContext, useState } from "react";
import { FormEvent } from "react";
import {
  AuthContext,
  LoginForToken,
} from "../../../../../services/AuthService";
import { tokenModel } from "../../../../../models/UserModel";

function LoginForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useContext(AuthContext);

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const tokenResponse: tokenModel = await LoginForToken(formData);
    login(tokenResponse["access_token"], tokenResponse["refresh_token"]);
    navigate("/user");
  }

  return (
    <>
      <div className="wrapper-log-form">
        <h1>Welcome Back</h1>
        <form action="" className="login-form" onSubmit={handleFormSubmit}>
          <h1>Login</h1>

          <div className="input-box log">
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-field log">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            <div className="anch-log">
              <a href="" onClick={() => navigate("/register")}>
                Not Account?
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;

import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useContext, useState } from "react";
import { FormEvent } from "react";
import {
  AuthContext,
  LoginForToken,
} from "../../../../../services/AuthService";
import { tokenModel } from "../../../../../models/UserModel";
import { LoginFormModel } from "../../../../../models/ProjectModel";
import { validateLoginFormModel } from "../../../../../services/ValidationService";

function LoginForm() {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState<LoginFormModel>();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<any>();
  const { login } = useContext(AuthContext);

  function handleFormDetailsChanged(event: any) {
    event.preventDefault();

    const { name, value } = event.target;
    setLoginDetails((prevValues: any) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLoginFormModel(loginDetails!);
    setErrors(validationErrors);
    if (loginDetails) {
      if (Object.keys(validationErrors).length === 0) {
        const formData = new URLSearchParams();
        formData.append("username", loginDetails.username);
        formData.append("password", loginDetails.password);

        const tokenResponse: tokenModel = await LoginForToken(formData);
        login(tokenResponse["access_token"], tokenResponse["refresh_token"]);
        navigate("/user");
      }
    }
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
                name="username"
                onChange={handleFormDetailsChanged}
                value={loginDetails?.username || ""}
              />
              {errors?.username && (
                <small style={{ color: "red" }}>{errors.username}</small>
              )}
            </div>
            <div className="input-field log">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleFormDetailsChanged}
                value={loginDetails?.password || ""}
              />
              {errors?.password && (
                <small style={{ color: "red" }}>{errors.password}</small>
              )}
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

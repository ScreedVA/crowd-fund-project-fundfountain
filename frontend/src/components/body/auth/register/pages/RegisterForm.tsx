import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { FormEvent, useContext, useState } from "react";
import {
  AuthContext,
  RegisterForToken,
} from "../../../../../services/AuthService";
import { CreateUserModel, tokenModel } from "../../../../../models/UserModel";
import { isLocationField } from "../../../../../services/CommonService";

function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [registerDetails, setRegisterDetails] = useState<CreateUserModel>();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleRegisterDetailsChange(event: any) {
    const { name, value } = event.target;

    setRegisterDetails((prevState: any) => {
      if (isLocationField(name)) {
        return {
          ...prevState,
          location: {
            ...prevState?.location,
            [name]: value,
          },
        };
      }

      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (registerDetails?.password !== passwordConfirm) {
      alert("Passwords do not match");
    }

    if (registerDetails) {
      const tokenResponse: tokenModel = await RegisterForToken(registerDetails);
      login(tokenResponse["access_token"], tokenResponse["refresh_token"]);
      navigate("/user");
    }
  }

  return (
    <>
      <div className="wrapper-reg-form">
        <form onSubmit={handleFormSubmit} className="register-form">
          <h1>Registration</h1>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleRegisterDetailsChange}
              />
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleRegisterDetailsChange}
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="*Username"
                name="username"
                onChange={handleRegisterDetailsChange}
                required
              />
            </div>
            <div className="input-field reg">
              <input
                type="email"
                placeholder="*Email"
                name="email"
                onChange={handleRegisterDetailsChange}
                required
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="password"
                placeholder="*Password"
                name="password"
                onChange={handleRegisterDetailsChange}
                required
              />
            </div>
            <div className="input-field reg">
              <input
                type="password"
                placeholder="*Confirm Password"
                name="confirmPassword"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-box reg single">
            <div className="input-field reg">
              <label htmlFor="dateofBirth"></label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleRegisterDetailsChange}
                required
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Street"
                name="street"
                onChange={handleRegisterDetailsChange}
              />
            </div>

            <div className="input-field reg">
              <input
                type="text"
                placeholder="House Number"
                name="houseNumber"
                onChange={handleRegisterDetailsChange}
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="City"
                name="city"
                onChange={handleRegisterDetailsChange}
              />
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Country"
                name="country"
                onChange={handleRegisterDetailsChange}
              />
            </div>
          </div>

          <div className="input-box reg single">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="PLZ"
                name="plz"
                onChange={handleRegisterDetailsChange}
              />
            </div>
          </div>

          <button className="register-button" type="submit">
            Sign Up
          </button>
          <div className="anch-reg">
            <a href="" className="reg" onClick={() => navigate("/login")}>
              Already have account?
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;

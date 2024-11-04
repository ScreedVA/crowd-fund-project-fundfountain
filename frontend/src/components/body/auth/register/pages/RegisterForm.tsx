import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { FormEvent, useContext, useState } from "react";
import {
  AuthContext,
  RegisterForToken,
} from "../../../../../services/AuthService";
import { CreateUserModel, tokenModel } from "../../../../../models/UserModel";
import { isLocationField } from "../../../../../services/CommonService";
import useToast from "../../../../../services/ToasterService";
import { validateCreateUserModel } from "../../../../../services/ValidationService";
import Toaster from "../../../../templates/Toaster/Toaster";

function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [registerDetails, setRegisterDetails] = useState<CreateUserModel>();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { toast, showToast, hideToast } = useToast();
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
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        passwordConfirm: "Confirmed password must be the same as password",
      }));
    }

    if (registerDetails) {
      const validationErrors = validateCreateUserModel(registerDetails);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const response = await RegisterForToken(registerDetails);
        const tokenResponse: tokenModel = await response.json();
        login(tokenResponse["access_token"], tokenResponse["refresh_token"]);
        navigate("/user");

        if (response.ok) {
          showToast("New project created", "success");
        } else {
          showToast(`Error Status: ${response.status} Error: ${response.text}`);
        }
      }
    }
  }

  return (
    <>
      <div className="wrapper-reg-form">
        <form className="register-form">
          <h1>Registration</h1>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={registerDetails?.firstName || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.firstName && (
                <small style={{ color: "red" }}>{errors.firstName}</small>
              )}
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={registerDetails?.lastName || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.lastName && (
                <small style={{ color: "red" }}>{errors.lastName}</small>
              )}
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="*Username"
                name="username"
                value={registerDetails?.username || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.username && (
                <small style={{ color: "red" }}>{errors.username}</small>
              )}
            </div>
            <div className="input-field reg">
              <input
                type="email"
                placeholder="*Email"
                name="email"
                value={registerDetails?.email || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.email && (
                <small style={{ color: "red" }}>{errors.email}</small>
              )}
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="password"
                placeholder="*Password"
                name="password"
                value={registerDetails?.password || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.password && (
                <small style={{ color: "red" }}>{errors.password}</small>
              )}
            </div>
            <div className="input-field reg">
              <input
                type="password"
                placeholder="*Confirm Password"
                name="confirmPassword"
                value={passwordConfirm || ""}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {errors.passwordConfirm && (
                <small style={{ color: "red" }}>{errors.passwordConfirm}</small>
              )}
            </div>
          </div>

          <div className="input-box reg single">
            <div className="input-field reg">
              <label htmlFor="dateofBirth"></label>
              <input
                type="date"
                name="dateOfBirth"
                value={registerDetails?.dateOfBirth || ""}
                onChange={handleRegisterDetailsChange}
              />
              {errors.dateOfBirth && (
                <small style={{ color: "red" }}>{errors.dateOfBirth}</small>
              )}
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Street"
                name="street"
                value={registerDetails?.location?.street || ""}
                onChange={handleRegisterDetailsChange}
              />
            </div>

            <div className="input-field reg">
              <input
                type="text"
                placeholder="House Number"
                name="houseNumber"
                value={registerDetails?.location?.houseNumber || ""}
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
                value={registerDetails?.location?.city || ""}
                onChange={handleRegisterDetailsChange}
              />
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={registerDetails?.location?.country || ""}
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
                value={registerDetails?.location?.plz || ""}
                onChange={handleRegisterDetailsChange}
              />
            </div>
          </div>

          <button
            className="register-button"
            onClick={handleFormSubmit}
            type="submit"
          >
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

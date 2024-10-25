import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { FormEvent, useContext, useState } from "react";
import {
  AuthContext,
  RegisterForToken,
} from "../../../../../services/AuthService";
import { CreateUserRequest, tokenModel } from "../../../../../models/UserModel";
import { isObjectAnyFieldNotEmpty } from "../../../../../services/CommonService";
import { CreateLocationRequest } from "../../../../../models/LocationModel";
function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [roles, setRoles] = useState({
    isAdmin: false,
    isProjectOwner: false,
    isInvestor: false,
  });
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [plz, setPlz] = useState("");

  const navigate = useNavigate();

  function handleRoleChange(event: any) {
    const { name, checked } = event.target;
    setRoles((prevRoles) => ({
      ...prevRoles,
      [name]: checked,
    }));
  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert("Passwords do not match");
    }

    const locationRequest: CreateLocationRequest = {
      street,
      houseNumber,
      city,
      country,
      plz,
    };

    const userRequest: CreateUserRequest = {
      firstName,
      lastName,
      username,
      email,
      password,
      dateOfBirth,
      isAdmin: roles.isAdmin,
      isProjectOwner: roles.isProjectOwner,
      isInvestor: roles.isInvestor,
      location: isObjectAnyFieldNotEmpty(locationRequest)
        ? locationRequest
        : undefined,
    };

    const tokenResponse: tokenModel = await RegisterForToken(userRequest);
    login(tokenResponse["access_token"], tokenResponse["refresh_token"]);
    navigate("/user");
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
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="*Username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-field reg">
              <input
                type="email"
                placeholder="*Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-box reg checkboxes">
            <div className="input-field reg" style={{ gridColumn: 1 }}>
              <label htmlFor="isAdmin">Admin</label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={roles.isAdmin}
                onChange={handleRoleChange}
              />
            </div>
            <div className="input-field reg" style={{ gridColumn: 2 }}>
              <label htmlFor="isProjectOwner">Project Owner</label>
              <input
                type="checkbox"
                name="isProjectOwner"
                checked={roles.isProjectOwner}
                onChange={handleRoleChange}
              />
            </div>
            <div className="input-field reg" style={{ gridColumn: 3 }}>
              <label htmlFor="isInvestor">Investor</label>
              <input
                type="checkbox"
                name="isInvestor"
                checked={roles.isInvestor}
                onChange={handleRoleChange}
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Street"
                name="street"
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div className="input-field reg">
              <input
                type="text"
                placeholder="House Number"
                name="houseNumber"
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="input-box reg">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="City"
                name="city"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="input-field reg">
              <input
                type="text"
                placeholder="Country"
                name="country"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="input-box reg single">
            <div className="input-field reg">
              <input
                type="text"
                placeholder="PLZ"
                name="plz"
                onChange={(e) => setPlz(e.target.value)}
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

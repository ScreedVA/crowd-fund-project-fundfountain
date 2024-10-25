import { FormEvent, useEffect, useState } from "react";
import "./UserForm.css";
import {
  ReadUserRequest,
  UpdateUserRequest,
} from "../../../../models/UserModel";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../../../../services/UserService";
import { UpdateLocationRequest } from "../../../../models/LocationModel";
import { isObjectAnyFieldNotEmpty } from "../../../../services/CommonService";
function UserForm() {
  const [id, setId] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [roles, setRoles] = useState({
    isAdmin: false,
    isProjectOwner: false,
    isInvestor: false,
  });
  const [street, setStreet] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [plz, setPlz] = useState<string>("");

  useEffect(() => {
    async function setCurrentUser() {
      const currentUser: ReadUserRequest | null | undefined =
        await getCurrentUser();
      if (currentUser) {
        setId(currentUser.id);
        setFirstName(currentUser.firstName);
        setLastName(currentUser.lastName);
        setUsername(currentUser.username);
        setEmail(currentUser.email);
        setUsername(currentUser.username);
        setDateOfBirth(currentUser.dateOfBirth);
        setRoles({
          isAdmin: currentUser.isAdmin,
          isInvestor: currentUser.isInvestor,
          isProjectOwner: currentUser.isProjectOwner,
        });
        if (currentUser.location) {
          const currentLocation = currentUser.location;
          currentLocation.street !== null &&
            setStreet(currentUser.location.street!);
          currentLocation.houseNumber !== null &&
            setHouseNumber(currentUser.location.houseNumber!);
          currentLocation.city !== null && setCity(currentUser.location.city!);
          currentLocation.country !== null &&
            setCountry(currentUser.location.country!);
          currentLocation.plz !== null && setPlz(currentUser.location.plz!);
        }
      }
    }
    setCurrentUser();
  }, []);

  function handleRoleChange(event: any) {
    const { name, checked } = event.target;
    setRoles((prevRoles) => ({
      ...prevRoles,
      [name]: checked,
    }));
  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    const locationRequest: UpdateLocationRequest = {
      street,
      houseNumber,
      city,
      country,
      plz,
    };

    const userRequest: UpdateUserRequest = {
      firstName,
      lastName,
      username,
      email,
      dateOfBirth,
      isAdmin: roles.isAdmin,
      isInvestor: roles.isInvestor,
      isProjectOwner: roles.isProjectOwner,
      location: isObjectAnyFieldNotEmpty(locationRequest)
        ? locationRequest
        : undefined,
    };

    await updateCurrentUser(userRequest, id);
  }

  return (
    <>
      <div className="user-form-wrapper">
        <form onSubmit={handleFormSubmit} className="user-form">
          <div className="input-box-user four">
            <div className="input-field-user">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-box-user 4">
            <div className="input-field-user">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="input-field-user checkbox">
              <label htmlFor="isInvestor">Investor</label>
              <input
                type="checkbox"
                name="isInvestor"
                checked={roles.isInvestor}
                onChange={handleRoleChange}
              />
            </div>
            <div className="input-field-user checkbox">
              <label htmlFor="isAdmin">Admin</label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={roles.isAdmin}
                onChange={handleRoleChange}
              />
            </div>
            <div className="input-field-user checkbox">
              <label htmlFor="isProjectOwner">Project Owner</label>
              <input
                type="checkbox"
                name="isProjectOwner"
                checked={roles.isProjectOwner}
                onChange={handleRoleChange}
              />
            </div>
          </div>

          <div className="input-box-user five">
            <div className="input-field-user">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="plz">PLZ</label>
              <input
                type="text"
                name="plz"
                placeholder="PLZ"
                value={plz}
                onChange={(e) => setPlz(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="houseNumber">House Number</label>
              <input
                type="text"
                name="houseNumber"
                placeholder="House Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
            <div className="button-box">
              <button type="submit" className="save-btn submit-btn-user">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserForm;

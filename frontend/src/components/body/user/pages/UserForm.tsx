import { FormEvent, useEffect, useState } from "react";
import "./UserForm.css";
import { ReadUserModel, UpdateUserModel } from "../../../../models/UserModel";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../../../../services/UserService";
import { isLocationField } from "../../../../services/CommonService";

function UserForm() {
  const [currentUser, setCurrentUser] = useState<ReadUserModel>();
  useEffect(() => {
    async function setUser() {
      setCurrentUser(await getCurrentUser());
    }
    setUser();
  }, []);

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (currentUser) {
      await updateCurrentUser(currentUser as UpdateUserModel, currentUser.id);
    }
  }

  function handleUserDetailsChange(event: any) {
    const { name, value } = event.target;

    setCurrentUser((prevState: any) => {
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

  return (
    <>
      <div className="user-form-wrapper">
        <form onSubmit={handleFormSubmit} className="user-form">
          <div className="input-box-user two">
            <div className="input-field-user">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={currentUser?.username || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={currentUser?.email || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
          </div>
          <div className="input-box-user three">
            <div className="input-field-user">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={currentUser?.firstName || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={currentUser?.lastName || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={currentUser?.dateOfBirth || ""}
                onChange={handleUserDetailsChange}
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
                value={currentUser?.location?.street || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="plz">PLZ</label>
              <input
                type="text"
                name="plz"
                placeholder="PLZ"
                value={currentUser?.location?.plz || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={currentUser?.location?.city || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={currentUser?.location?.country || ""}
                onChange={handleUserDetailsChange}
              />
            </div>
            <div className="input-field-user">
              <label htmlFor="houseNumber">House Number</label>
              <input
                type="text"
                name="houseNumber"
                placeholder="House Number"
                value={currentUser?.location?.houseNumber || ""}
                onChange={handleUserDetailsChange}
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

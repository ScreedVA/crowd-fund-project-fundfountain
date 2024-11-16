import { FormEvent, useEffect, useState } from "react";
import "./UserAccountForm.css";
import { ReadUserModel, UpdateUserModel } from "../../../models/UserModel";
import { fetchCurrentUserHttpRequest, updateCurrentUser } from "../../../services/UserService";
import { validateUpdateUserModel } from "../../../services/ValidationService";
import { isLocationField } from "../../../services/CommonService";
import Toaster from "../Toaster/Toaster";
import useToast from "../../../services/ToasterService";
import { ToasterMessageType } from "../../../models/ToasterModel";

function AccountForm() {
  const [currentUser, setCurrentUser] = useState<ReadUserModel>();
  const [errors, SetErrors] = useState<any>();
  const { toast, showToast, hideToast } = useToast();

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validateUpdateUserModel(currentUser!);
    SetErrors(validationErrors);

    if (currentUser) {
      if (Object.keys(validationErrors).length === 0) {
        const response: Response = await updateCurrentUser(currentUser as UpdateUserModel, currentUser.id);
        console.log(response.status);
        if (response.status == 201) {
          showToast("Account Updated", ToasterMessageType.SUCCESS);
        } else {
          showToast(`Error: ${response.status}`, ToasterMessageType.ERROR);
        }
      }
    }
  }

  async function initUser() {
    const response: Response = await fetchCurrentUserHttpRequest();
    setCurrentUser(await response.json());
  }

  useEffect(() => {
    initUser();
  }, []);

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
              {errors?.username && <small style={{ color: "red" }}>{errors.username}</small>}
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
              {errors?.email && <small style={{ color: "red" }}>{errors.email}</small>}
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
              {errors?.firstName && <small style={{ color: "red" }}>{errors.firstName}</small>}
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
              {errors?.lastName && <small style={{ color: "red" }}>{errors.lastName}</small>}
            </div>
            <div className="input-field-user">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={currentUser?.dateOfBirth || ""}
                onChange={handleUserDetailsChange}
              />
              {errors?.dateOfBirth && <small style={{ color: "red" }}>{errors.dateOfBirth}</small>}
            </div>
          </div>
          <div className="input-box-user single">
            <div className="input-field-user">
              <label htmlFor="biography">Biography</label>
              <textarea
                name="biography"
                value={currentUser?.biography || ""}
                onChange={handleUserDetailsChange}
              ></textarea>
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
        {toast.isVisible && <Toaster message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    </>
  );
}

export default AccountForm;

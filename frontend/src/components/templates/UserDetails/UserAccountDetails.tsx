import { useEffect, useState } from "react";
import "./UserAccountDetails.css";
import { ReadUserModel } from "../../../models/UserModel";
import { fetchCurrentUserHttpRequest } from "../../../services/UserService";

interface UserDetailsProps {}

const UserAccountDetails: React.FC<UserDetailsProps> = ({}) => {
  const [userDetails, setUserDetails] = useState<ReadUserModel>();

  async function initCurrentUser() {
    const response: Response = await fetchCurrentUserHttpRequest();
    const currentUserResponse: ReadUserModel = await response.json();
    setUserDetails(currentUserResponse);
  }

  useEffect(() => {
    initCurrentUser();
  }, []);

  return (
    <>
      <div className="user-details-container">
        <h1>{userDetails?.username}</h1>
        <h4>{userDetails?.biography}</h4>
        <div className="user-box">
          <div className="user-box-field">
            <p>Email: {userDetails?.email}</p>
            <p>Date Of Birth: {userDetails?.dateOfBirth}</p>
          </div>
          <div className="user-box-field">
            <p>First Name: {userDetails?.firstName}</p>
            <p>Last Name: {userDetails?.lastName}</p>
          </div>
        </div>
        {userDetails?.location && (
          <div className="user-box">
            <div className="user-box-field">
              <p>
                Street: {userDetails.location.street}{" "}
                {userDetails.location.houseNumber}
              </p>
              <p>PLZ: {userDetails?.location.plz}</p>
            </div>
            <div className="user-box-field">
              <p>Country: {userDetails?.location.country}</p>
              <p>City: {userDetails?.location.city}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default UserAccountDetails;

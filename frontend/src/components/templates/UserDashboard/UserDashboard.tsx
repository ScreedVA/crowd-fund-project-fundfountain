import { useState } from "react";
import TabMenu from "../Navigation/TabNavigation/TabMenu";
import "./UserDashboard.css";
import AccountForm from "../UserAccountForm/UserAccountForm";
import UserAccountDetails from "../UserDetails/UserAccountDetails";

interface UserDashboardProps {}

const UserDashboard: React.FC<UserDashboardProps> = () => {
  const [options, setOptions] = useState(["Account Details", "Edit Account"]);
  const [tabSelectedIndex, tabSetSelectedIndex] = useState<number>(0);
  return (
    <>
      <div className="user-dashboard-conainer">
        <div className="top-row">
          <TabMenu
            selectOptions={options}
            selectedIndex={tabSelectedIndex}
            sendSelectedIndexFromTabMenu={tabSetSelectedIndex}
            custumTabConfig={{ listXAlignment: "center" }}
          />
        </div>
        <div className="bottom-row">
          {tabSelectedIndex == options.indexOf("Account Details") && <UserAccountDetails />}
          {tabSelectedIndex == options.indexOf("Edit Account") && <AccountForm />}
        </div>
      </div>
    </>
  );
};
export default UserDashboard;

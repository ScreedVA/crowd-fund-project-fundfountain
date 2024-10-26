import { useState } from "react";
import "./User.css";
import UserMenuBar from "./pages/UserMenuBar";
import UserForm from "./pages/UserForm";
import ProjectDashboard from "./pages/ProjectDashboard";
import InvestorPortfolio from "./pages/InvestorPortfolio";

function User() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectOptions: string[] = [
    "Account Details",
    "Project Dashboard",
    "Investment Portfolio",
  ];

  function handleMenuItemChange(index: number) {
    setSelectedIndex(index);
  }

  return (
    <>
      <div className="user-container">
        <div className="user-left">
          <UserMenuBar
            sendIndexToFromUserMenuBar={handleMenuItemChange}
            selectOptions={selectOptions}
          />
        </div>
        <div className="user-right">
          <h1 style={{ textAlign: "center" }}>
            {selectOptions[selectedIndex]}
          </h1>
          {selectedIndex == 0 && <UserForm />}
          {selectedIndex == 1 && <ProjectDashboard />}
          {selectedIndex == 2 && <InvestorPortfolio />}
        </div>
      </div>
    </>
  );
}
export default User;

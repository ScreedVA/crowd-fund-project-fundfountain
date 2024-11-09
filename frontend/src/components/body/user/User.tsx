import { useState } from "react";
import "./User.css";
import UserMenuBar from "./pages/UserMenuBar";
import UserForm from "./pages/UserForm";
import ProjectUserDashboard from "./pages/ProjectUserDashboard";
import InvestorPortfolio from "./pages/InvestorPortfolio/InvestorPortfolio";
import ProjectForm from "../../templates/ProjectForm/ProjectForm";

function User() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectOptions: string[] = [
    "Account Details",
    "Investment Portfolio",
    "Project Dashboard",
    "Create New Project",
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
            selectedIndex={selectedIndex}
          />
        </div>
        <div className="user-right">
          <h1 style={{ textAlign: "center" }}>
            {selectOptions[selectedIndex]}
          </h1>
          {selectedIndex == 0 && <UserForm />}
          {selectedIndex == 1 && <InvestorPortfolio />}
          {selectedIndex == 2 && <ProjectUserDashboard />}
          {selectedIndex == 3 && <ProjectForm />}
        </div>
      </div>
    </>
  );
}
export default User;

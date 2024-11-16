import { useEffect, useState } from "react";
import "./User.css";
import UserMenuBar from "./pages/UserSideBar/UserSideBar";
import AccountForm from "../../templates/UserAccountForm/UserAccountForm";
import ProjectUserDashboard from "./pages/ProjectUserDashboard/ProjectUserDashboard";
import InvestorPortfolio from "./pages/InvestorPortfolio/InvestorPortfolio";
import ProjectForm from "../../templates/CFProjects/ProjectForm/ProjectForm";
import { fetchAdminVerficationHttpResponse } from "../../../services/AdminService";
import { UserIsAdminModel } from "../../../models/AdminModel";
import UserDashboard from "../../templates/UserDashboard/UserDashboard";
function User() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const selectOptions: string[] = [
    "User Dashboard",
    "Investment Portfolio",
    "Project Dashboard",
    "Create New Project",
    isAdmin && "Admin Dashboard",
  ].filter(Boolean) as string[];

  async function initAdminVerfication() {
    const response: Response = await fetchAdminVerficationHttpResponse();
    const resData: UserIsAdminModel = await response.json();
    setIsAdmin(resData.isAdmin);
  }

  useEffect(() => {
    initAdminVerfication();
  }, []);

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
          <h1 style={{ textAlign: "center" }}>{selectOptions[selectedIndex]}</h1>
          {selectedIndex == 0 && <UserDashboard />}
          {selectedIndex == 1 && <InvestorPortfolio />}
          {selectedIndex == 2 && <ProjectUserDashboard />}
          {selectedIndex == 3 && <ProjectForm />}
        </div>
      </div>
    </>
  );
}
export default User;

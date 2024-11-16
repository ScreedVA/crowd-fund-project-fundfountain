import PieChart from "../../Charts/PieChart/PieChart";
import TabMenu from "../../Navigation/TabNavigation/TabMenu";
import { useEffect, useState } from "react";
import { cfpResourcePermissionsModel } from "../../../../models/AdminModel";
import { TabMenuCustomConfig } from "../../../../models/TabMenuModel";
import { ProjectShareDistributionToInvestorsModel } from "../../../../models/InvestorModel";
import { ReadCFProjectModel } from "../../../../models/ProjectModel";
import { ReadUserSummaryModel } from "../../../../models/UserModel";
import { fetchProjectShareDistribution, fetchInvestorListHttpRequest } from "../../../../services/InvestorService";
import {
  fetchCFPResourcePermissionsHttpRequest,
  fetchProjectByIdHttpRequest,
} from "../../../../services/ProjectService";
import UserList from "../../UserList/UserList";
import ProjectForm from "../ProjectForm/ProjectForm";
import ProjectDetails from "../ProjectOverview/pages/ProjectDetails";

import "./ProjectDashboard.css";
import { CFPDashboardTabMenuOptions } from "../../../../models/TabMenuModel";
import RevenueDashboard from "../../Revenue/RevenueDashboard/RevenueDashboard";
interface ProjectDashboardProps {
  projectId: number;
  tabMenuCustomConfig?: TabMenuCustomConfig;
}

const revenueDashboardTabMenuConfig: TabMenuCustomConfig = {
  listXAlignment: "center",
  unorderedListStyles: {
    borderBottom: "none",
  },
  listItemBorderStyles: {
    borderBottom: "2px solid black",
  },
};

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId, tabMenuCustomConfig }) => {
  const [resourcePermissions, setResourcePermissions] = useState<cfpResourcePermissionsModel>();
  const [tabSelectedIndex, setTabSelectedIndex] = useState<number>(0);
  const [projectDetails, setProjectDetails] = useState<ReadCFProjectModel>();
  const [piechartData, setPiechartData] = useState<ProjectShareDistributionToInvestorsModel[]>();
  const [investorList, setInvestorList] = useState<ReadUserSummaryModel[]>();
  const [options, setOptions] = useState<CFPDashboardTabMenuOptions[]>([
    CFPDashboardTabMenuOptions.PROJECT_DETAILS,
    CFPDashboardTabMenuOptions.SHARE_DISTRIBUTION,
    CFPDashboardTabMenuOptions.INVESTOR_LIST,
  ]);

  async function initProjectEditPermission() {
    if (projectId) {
      const response: Response = await fetchCFPResourcePermissionsHttpRequest(projectId);
      const permissionResponse: cfpResourcePermissionsModel = await response.json();
      setResourcePermissions(permissionResponse);
    }
  }

  async function initProjectDetails() {
    const response: Response = await fetchProjectByIdHttpRequest(projectId);
    const projectDetailsResponse: ReadCFProjectModel = response.ok && (await response.json());
    setProjectDetails(projectDetailsResponse);
  }

  async function initPiechartData() {
    const response: Response = await fetchProjectShareDistribution(projectId);
    const piechartResponse: ProjectShareDistributionToInvestorsModel[] = response.ok && (await response.json());
    setPiechartData(piechartResponse);
  }

  async function initInvestorList() {
    const response: Response = await fetchInvestorListHttpRequest(projectId);
    const investorListResponse: ReadUserSummaryModel[] = await response.json();

    setInvestorList(investorListResponse);
  }

  useEffect(() => {
    // Initialize Permissions
    initProjectEditPermission();
  }, [projectId]);

  useEffect(() => {
    // Map Default Selection Tabs to Methods
    tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.PROJECT_DETAILS) && initProjectDetails();
    tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.SHARE_DISTRIBUTION) && initPiechartData();
    tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.INVESTOR_LIST) && initInvestorList();

    // Set Conditional Selection Tabs
    if (resourcePermissions?.ownerCanEdit && !options.includes(CFPDashboardTabMenuOptions.EDIT_PROJECT)) {
      options.push(CFPDashboardTabMenuOptions.EDIT_PROJECT);
    }

    if (resourcePermissions?.canReportRevenue && !options.includes(CFPDashboardTabMenuOptions.REVENUE_DASHBOARD)) {
      setOptions((prevValue) => [...prevValue, CFPDashboardTabMenuOptions.REVENUE_DASHBOARD]);
    } else if (
      !resourcePermissions?.canReportRevenue &&
      options.includes(CFPDashboardTabMenuOptions.REVENUE_DASHBOARD)
    ) {
      const updatedOptions = options.filter((option) => option !== CFPDashboardTabMenuOptions.REVENUE_DASHBOARD);
      setOptions(updatedOptions);
    }

    // Reset Tab Selected Index
    tabSelectedIndex > options.length - 1 && setTabSelectedIndex(0);

    // On Dismount
    return () => {
      setProjectDetails(undefined);
    };
  }, [tabSelectedIndex, projectId, resourcePermissions]);

  return (
    <>
      <div className="project-user-dashboard-main-container">
        <div className="top-row">
          <TabMenu
            selectOptions={options}
            selectedIndex={tabSelectedIndex}
            sendSelectedIndexFromTabMenu={setTabSelectedIndex}
            custumTabConfig={tabMenuCustomConfig && tabMenuCustomConfig}
            dependancyArray={[projectId]}
          />
        </div>
        <div className="bottom-row">
          {tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.PROJECT_DETAILS) && projectDetails && (
            <ProjectDetails isUserPath={true} projectDetailsFromParent={projectDetails} />
          )}
          {tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.SHARE_DISTRIBUTION) && piechartData && (
            <PieChart
              seriesData={piechartData.map((object) => ({
                value: object.sharesAgainstProjectValuationAmount,
                name: object.investorName.toUpperCase(),
              }))}
            />
          )}
          {tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.INVESTOR_LIST) && investorList && (
            <UserList userList={investorList} isNavigator={true} />
          )}

          {/* Owner Views */}
          {tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.EDIT_PROJECT) &&
            resourcePermissions?.ownerCanEdit && <ProjectForm projectId={projectId} />}
          {tabSelectedIndex == options.indexOf(CFPDashboardTabMenuOptions.REVENUE_DASHBOARD) &&
            resourcePermissions?.canReportRevenue &&
            projectId && <RevenueDashboard tabMenuCustomConfig={revenueDashboardTabMenuConfig} projectId={projectId} />}
        </div>
      </div>
    </>
  );
};

export default ProjectDashboard;

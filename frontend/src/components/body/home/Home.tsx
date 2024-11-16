import "./Home.css";
import HomeLeft from "./pages/HomeLeft";
import HomeCenter from "./pages/HomeCenter";
import HomeRight from "./pages/HomeRight";
import HomeHeader from "./pages/HomeHeader";
import { cfpFilterModel, CFProjectSummary } from "../../../models/ProjectModel";
import { useEffect, useState } from "react";
import { fetchAllProjects } from "../../../services/ProjectService";

function Home() {
  const [projectList, setProjectList] = useState<CFProjectSummary[]>([]);
  const [cfpFilter, setCfpFilter] = useState<cfpFilterModel>();

  async function getProjectList() {
    const response: Response = await fetchAllProjects(cfpFilter!);
    const projectListResponse: CFProjectSummary[] = await response.json();
    setProjectList(projectListResponse);
  }
  useEffect(() => {
    getProjectList();
  }, [cfpFilter]);

  async function updateSearchFilter(event: any) {
    const { name, value } = event.target;

    await setCfpFilter((prevFilter: any) => {
      return {
        ...prevFilter,
        [name]: value,
      };
    });
  }

  return (
    <>
      <div className="home-header">
        <HomeHeader updateFilter={updateSearchFilter} />
      </div>
      <div className="home-body">
        <div className="home-body-left grid-item">
          <HomeLeft />
        </div>
        <div className="home-body-center grid-item">
          {projectList && <HomeCenter projectList={projectList} />}
        </div>
        <div className="home-body-right grid-item">
          <HomeRight />
        </div>
      </div>
    </>
  );
}

export default Home;

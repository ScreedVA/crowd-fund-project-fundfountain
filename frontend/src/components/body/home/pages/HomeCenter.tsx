import "./HomeCenter.css";
import ProjectList from "../../../templates/ProjectList";
import { useEffect, useState } from "react";
import { CrowdFundProjectSummary } from "../../../../models/Project";
import { fetchAllProjects } from "../../../../services/ProjectService";

function HomeCenter() {
  const [projectList, setProjectList] = useState<CrowdFundProjectSummary[]>([]);

  useEffect(() => {
    async function getProjectList() {
      const projectListRequest: CrowdFundProjectSummary[] =
        await fetchAllProjects();
      setProjectList(projectListRequest);
    }
    getProjectList();
  }, []);

  return (
    <>
      <div className="home-center-container">
        <ProjectList projectList={projectList} />
      </div>
    </>
  );
}
export default HomeCenter;

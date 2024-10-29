import "./ProjectUserDashboard.css";
import ProjectList from "../../../templates/ProjectList/ProjectList";
import { CrowdFundProjectSummary } from "../../../../models/ProjectModel";
import { fetchProjectListByCurrentUser } from "../../../../services/ProjectService";
import { useEffect, useState } from "react";

function ProjectUserDashboard() {
  const [projectList, setProjectList] = useState<CrowdFundProjectSummary[]>([]);

  useEffect(() => {
    async function getProjectList() {
      const projectListRequest: CrowdFundProjectSummary[] =
        await fetchProjectListByCurrentUser();
      setProjectList(projectListRequest);
    }
    getProjectList();
  }, []);

  return (
    <>
      <ProjectList projectList={projectList} />
    </>
  );
}
export default ProjectUserDashboard;

import "./ProjectUserDashboard.css";
import ProjectList from "../../../templates/ProjectList/ProjectList";
import { CFProjectSummary } from "../../../../models/ProjectModel";
import { fetchProjectListByCurrentUser } from "../../../../services/ProjectService";
import { useEffect, useState } from "react";

function ProjectUserDashboard() {
  const [projectList, setProjectList] = useState<CFProjectSummary[]>([]);

  useEffect(() => {
    async function getProjectList() {
      const projectListRequest: CFProjectSummary[] =
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

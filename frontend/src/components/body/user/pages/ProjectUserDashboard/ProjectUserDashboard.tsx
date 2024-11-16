import { useLocation } from "react-router-dom";
import { CFProjectSummary } from "../../../../../models/ProjectModel";
import { fetchProjectListByCurrentUser } from "../../../../../services/ProjectService";
import ProjectList from "../../../../templates/CFProjects/ProjectList/ProjectList";
import ProjectDashboard from "../../../../templates/CFProjects/ProjectDashboard/ProjectDashboard";
import "./ProjectUserDashboard.css";

import { useEffect, useState } from "react";

function ProjectUserDashboard() {
  const [projectList, setProjectList] = useState<CFProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>();

  async function getProjectList() {
    const projectListRequest: CFProjectSummary[] = await fetchProjectListByCurrentUser();
    setProjectList(projectListRequest);
    setSelectedProjectId(projectListRequest[0].id);
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <>
      <div className="project-user-dashboard-container">
        <div className="project-dashboard-left">{<ProjectDashboard projectId={selectedProjectId} />}</div>
        <div className="project-dashboard-right">
          <h2 style={{ textAlign: "center" }}>Project List</h2>
          <div className="project-list">
            <ProjectList projectList={projectList} isSelectionList={true} sendSelectionId={setSelectedProjectId} />
          </div>
        </div>
      </div>
    </>
  );
}
export default ProjectUserDashboard;

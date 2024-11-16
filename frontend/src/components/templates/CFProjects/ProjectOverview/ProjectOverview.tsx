import { useParams } from "react-router-dom";
import "./ProjectOverview.css";
import ProjectDashboard from "../ProjectDashboard/ProjectDashboard";

function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  return (
    <>
      <div className="project-overview-container">
        <h1>Project Overview Dashboard</h1>
        {<ProjectDashboard projectId={projectId} tabMenuCustomConfig={{ listXAlignment: "center" }} />}
      </div>
    </>
  );
}
export default ProjectOverview;

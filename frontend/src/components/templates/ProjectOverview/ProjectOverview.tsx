import { useLocation, useParams } from "react-router-dom";
import "./ProjectOverview.css";
import ProjectDetails from "./pages/ProjectDetails";

function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;
  const location = useLocation();

  const currentPath = location.pathname;

  const isUserPath = currentPath.startsWith("/user");

  return (
    <>
      <div className="project-overview-container">
        <div className="project-overview-left grid-item"></div>
        <div className="project-overview-right grid-item">
          <ProjectDetails projectId={projectId} isUserPath={isUserPath} />
        </div>
      </div>
    </>
  );
}
export default ProjectOverview;

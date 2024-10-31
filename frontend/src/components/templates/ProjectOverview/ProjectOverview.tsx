import { useLocation, useParams } from "react-router-dom";
import "./ProjectOverview.css";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectForm from "../ProjectForm/ProjectForm";

function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;
  const location = useLocation();

  const currentPath = location.pathname;

  const isUserPath = currentPath.startsWith("/user");
  const isProjectEditPath = currentPath.startsWith("/edit/project");
  return (
    <>
      <div className="project-overview-container">
        <div className="project-overview-left grid-item"></div>
        <div className="project-overview-right grid-item">
          {!isProjectEditPath ? (
            <ProjectDetails projectId={projectId} isUserPath={isUserPath} />
          ) : (
            <div>
              <h1 className="project-overview-h1">Update Project Details</h1>
              <ProjectForm projectId={projectId}></ProjectForm>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default ProjectOverview;

import { useParams } from "react-router-dom";
import "./ProjectOverview.css";
import ProjectDetails from "./pages/ProjectDetails";

function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  return (
    <>
      <div className="project-overview-container">
        <div className="project-overview-left grid-item"></div>
        <div className="project-overview-right grid-item">
          <ProjectDetails projectId={projectId} />
        </div>
      </div>
    </>
  );
}
export default ProjectOverview;

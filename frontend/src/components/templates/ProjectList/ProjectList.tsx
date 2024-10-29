import { CrowdFundProjectSummary } from "../../../models/ProjectModel";
import ProjectListItem from "./pages/ProjectListItem";
import "./ProjectList.css";
import { useNavigate } from "react-router-dom";
interface ProjectListProps {
  projectList: CrowdFundProjectSummary[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projectList }) => {
  const navigate = useNavigate();

  return (
    <>
      <ul className="project-list-container">
        {projectList.map((value) => (
          <li
            onClick={() => navigate(`./project/${value.id}`)}
            key={value.id}
            className="project-list-item-container"
          >
            <ProjectListItem
              name={value.name}
              description={value.description}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectList;

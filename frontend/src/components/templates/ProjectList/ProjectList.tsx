import { CFProjectSummary } from "../../../models/ProjectModel";
import ProjectListItem from "./pages/ProjectListItem";
import "./ProjectList.css";
import { useNavigate } from "react-router-dom";
interface ProjectListProps {
  projectList: CFProjectSummary[];
  customWidthpx?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projectList,
  customWidthpx,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <ul className="project-list-container">
        {projectList.map((value) => (
          <li
            onClick={() => navigate(`./project/${value.id}`)}
            key={value.id}
            style={{ width: customWidthpx ? customWidthpx : "80%" }}
            className="project-list-item-container"
          >
            <ProjectListItem
              name={value.name}
              description={value.description}
              status={value.status}
              ownerId={value.ownerId}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectList;

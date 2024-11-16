import { useEffect, useRef, useState } from "react";
import ProjectListItem from "./pages/ProjectListItem";
import "./ProjectList.css";
import { useNavigate } from "react-router-dom";
import { CFProjectSummary } from "../../../../models/ProjectModel";
interface ProjectListProps {
  projectList: CFProjectSummary[];
  customWidthpx?: string;
  isNavigatorList?: boolean;
  isSelectionList?: boolean;
  sendSelectionId?: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projectList,
  customWidthpx,
  isNavigatorList = false,
  isSelectionList = false,
  sendSelectionId,
}) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  function handleListClick(value: any) {
    if (isSelectionList) {
      if (sendSelectionId) {
        sendSelectionId(value.id!);
      }
    } else if (isNavigatorList) {
      navigate(`/project/${value.id}`);
    }
  }

  function getTruncatedDescription(description: string): string {
    if (width < 180) return description.slice(0, 20) + "...";
    if (width < 300) return description.slice(0, 40) + "...";
    return description; // Full description if width is large enough
  }

  return (
    <>
      <ul ref={containerRef} className="project-list-container">
        {projectList.map((value) => (
          <li
            onClick={() => handleListClick(value)}
            key={value.id}
            style={{ width: customWidthpx ? customWidthpx : "80%" }}
            className="project-list-item-container"
          >
            <ProjectListItem
              name={value.name}
              description={getTruncatedDescription(value.description)}
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

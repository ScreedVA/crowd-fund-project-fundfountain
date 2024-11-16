import "./HomeCenter.css";
import ProjectList from "../../../templates/CFProjects/ProjectList/ProjectList";
import { CFProjectSummary } from "../../../../models/ProjectModel";

interface HomeCenterProps {
  projectList: CFProjectSummary[];
}

const HomeCenter: React.FC<HomeCenterProps> = ({ projectList }) => {
  return (
    <>
      <div className="home-center-container">
        <ProjectList projectList={projectList} isNavigatorList={true} />
      </div>
    </>
  );
};
export default HomeCenter;

import "./HomeCenter.css";
import ProjectList from "../../../templates/ProjectList/ProjectList";
import { useEffect, useState } from "react";
import { CFProjectSummary } from "../../../../models/ProjectModel";
import { fetchAllProjects } from "../../../../services/ProjectService";

function HomeCenter() {
  const [projectList, setProjectList] = useState<CFProjectSummary[]>([]);

  useEffect(() => {
    async function getProjectList() {
      const projectListRequest: CFProjectSummary[] = await fetchAllProjects();
      setProjectList(projectListRequest);
    }
    getProjectList();
  }, []);

  return (
    <>
      <div className="home-center-container">
        <ProjectList projectList={projectList} />
      </div>
    </>
  );
}
export default HomeCenter;

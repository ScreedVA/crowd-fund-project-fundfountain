import "./HomeCenter.css";
import ProjectList from "../../../templates/ProjectList/ProjectList";
import { useEffect, useState } from "react";
import { CFProjectSummary } from "../../../../models/ProjectModel";
import { fetchAllProjects } from "../../../../services/ProjectService";

interface HomeCenterProps {
  projectList: CFProjectSummary[];
}

const HomeCenter: React.FC<HomeCenterProps> = ({ projectList }) => {
  return (
    <>
      <div className="home-center-container">
        <ProjectList projectList={projectList} />
      </div>
    </>
  );
};
export default HomeCenter;

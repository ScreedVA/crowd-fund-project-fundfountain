import { useEffect, useState } from "react";
import "./ProjectDetails.css";
import { ReadCrowdFundProjectRequest } from "../../../models/Project";
import { fetchProjectById } from "../../../services/ProjectService";
interface ProjectDetailsProps {
  projectId: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const [projectDetails, setProjectDetails] =
    useState<ReadCrowdFundProjectRequest>();

  useEffect(() => {
    async function getProjectById() {
      const projectResponse: ReadCrowdFundProjectRequest =
        await fetchProjectById(projectId);

      setProjectDetails(projectResponse);
    }
    getProjectById();
  }, []);

  return (
    <>
      <div className="project-details-container">
        <h1>{projectDetails?.name}</h1>
        <h3 id="project-status">Status: {projectDetails?.status}</h3>
        <p id="project-description">{projectDetails?.description}</p>

        <div className="project-box">
          <div className="project-box-field">
            <h4>Fund Goal: {projectDetails?.fundGoal}</h4>
            <h4>Current Fund: {projectDetails?.currentFund}</h4>
          </div>
          <div className="project-box-field">
            <h4>Start Date: {projectDetails?.startDate}</h4>
            <h4>Last Date: {projectDetails?.lastDate}</h4>
          </div>
        </div>
        <div className="project-box">
          <div className="project-box-field">
            <h4>Total Units: {projectDetails?.totalUnits}</h4>
            <h4>Valuation: {projectDetails?.valuation}</h4>
          </div>
          <div className="project-box-field">
            <h4>Funding Model: {projectDetails?.fundingModel}</h4>
            <h4>Funding Progress: {projectDetails?.fundingProgress}</h4>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectDetails;

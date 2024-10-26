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
        <h3>{projectDetails?.description}</h3>
        <h5>Fund Goal: {projectDetails?.fundGoal}</h5>
        <h5>Current Fund: {projectDetails?.currentFund}</h5>
        <h5>Start Date: {projectDetails?.startDate}</h5>
        <h5>Last Date: {projectDetails?.lastDate}</h5>
        <h5>Total Units: {projectDetails?.totalUnits}</h5>
        <h5>Valuation: {projectDetails?.valuation}</h5>
        <h5>Status: {projectDetails?.status}</h5>
        <h5>Funding Model: {projectDetails?.fundingModel}</h5>
        <h5>Funding Progress: {projectDetails?.fundingProgress}</h5>
      </div>
    </>
  );
};
export default ProjectDetails;

import { useEffect, useState } from "react";
import "./ProjectDetails.css";
import { ReadCrowdFundProjectRequest } from "../../../../models/ProjectModel";
import { fetchProjectById } from "../../../../services/ProjectService";
import { FundingModel } from "../../../../models/ProjectModel";
interface ProjectDetailsProps {
  projectId: number;
  isUserPath: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectId,
  isUserPath,
}) => {
  const [projectDetails, setProjectDetails] =
    useState<ReadCrowdFundProjectRequest>();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function getProjectById() {
      const projectResponse: ReadCrowdFundProjectRequest =
        await fetchProjectById(projectId);

      setProjectDetails(projectResponse);
    }
    getProjectById();
  }, []);

  const handleInvestClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="project-details-container">
        <h1>{projectDetails?.name}</h1>
        <h3 id="project-status">Status:{projectDetails?.status}</h3>
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
            <h4>Funding Progress: {projectDetails?.fundingProgress}%</h4>
          </div>
          {!isUserPath &&
            (projectDetails?.fundingModel == FundingModel.FIXED_PRICE ? (
              <div className="project-box">
                <button
                  className="project-invest-btn"
                  onClick={handleInvestClick}
                >
                  <a>Invest</a>
                </button>
              </div>
            ) : (
              <div className="project-box">
                <button
                  className="project-invest-btn"
                  onClick={handleInvestClick}
                >
                  <a>Invest</a>
                </button>
              </div>
            ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-body">
            <span onClick={handleCloseModal}>
              <p className="modal-close">&times;</p>
            </span>
            <h2>Investment Form</h2>
            <form className="modal-form">
              <input
                type="number"
                name="amount"
                className="modal-input"
                placeholder="Amount"
                required
              />
              <button type="submit" className="modal-confirm-btn">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default ProjectDetails;

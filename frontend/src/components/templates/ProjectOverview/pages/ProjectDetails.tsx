import { useEffect, useState } from "react";
import "./ProjectDetails.css";
import {
  InvestRequestModel,
  ReadCrowdFundProjectRequest,
} from "../../../../models/ProjectModel";
import {
  fetchProjectById,
  investHttpRequest,
} from "../../../../services/ProjectService";
import { FundingModel } from "../../../../models/ProjectModel";
import ProgressBar from "../../ProgressBar/ProgressBar";
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
  const [unitsToInvest, setUnitsToInvest] = useState(0);
  const [investAmount, setInvestAmount] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function getProjectById() {
      const projectResponse: ReadCrowdFundProjectRequest =
        await fetchProjectById(projectId);

      setProjectDetails(projectResponse);
    }
    getProjectById();
  }, [reload]);

  const handleInvestClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInvestConfirmClick = (event: any) => {
    event.preventDefault();

    if (projectDetails?.fundingModel == FundingModel.FIXED_PRICE) {
      if (unitsToInvest > projectDetails!.totalUnits) {
        alert(
          `Units to invest ${unitsToInvest} exceed total units: ${projectDetails?.totalUnits}`
        );
        return;
      }
    } else if (projectDetails?.fundingModel == FundingModel.MICRO_INVESTMENT) {
      if (investAmount < 1000) {
        alert(`Invest Amount: ${investAmount} must be atleast 1000`);
        return;
      }
    }

    const investRequestBody: InvestRequestModel = {
      amount: investAmount,
      unitCount: unitsToInvest,
    };

    async function sendInvestRequest() {
      const response: any = await investHttpRequest(
        investRequestBody,
        projectDetails!.id
      );
      setReload((prev) => !prev);
      handleCloseModal();
      setUnitsToInvest(0);
      setInvestAmount(0);
    }
    sendInvestRequest();
  };

  const isfundingProgressValid = () => {
    if (
      projectDetails?.fundingProgress !== undefined &&
      projectDetails.fundingProgress > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="project-details-container">
        <h1>{projectDetails?.name}</h1>
        <h3 id="project-status">Status:{projectDetails?.status}</h3>
        <p id="project-description">{projectDetails?.description}</p>
        {isfundingProgressValid() && (
          <ProgressBar
            percentage={projectDetails!.fundingProgress}
          ></ProgressBar>
        )}
        <div className="project-box">
          <div className="project-box-field">
            <h4>Fund Goal: ${projectDetails?.fundGoal}</h4>
            <h4>Current Fund: ${projectDetails?.currentFund}</h4>
          </div>
          <div className="project-box-field">
            <h4>Start Date: {projectDetails?.startDate}</h4>
            <h4>Last Date: {projectDetails?.lastDate}</h4>
          </div>
        </div>
        <div className="project-box">
          <div className="project-box-field">
            {projectDetails?.totalUnits !== null && (
              <h4>Total Units: {projectDetails?.totalUnits}</h4>
            )}
            <h4>Valuation: {projectDetails?.valuation}</h4>
          </div>
          <div className="project-box-field">
            <h4>Funding Model: {projectDetails?.fundingModel}</h4>
            <h4>Funding Progress: {projectDetails?.fundingProgress}%</h4>
          </div>
          {!isUserPath ? (
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
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-body">
            <span onClick={handleCloseModal}>
              <p className="modal-close">&times;</p>
            </span>
            {projectDetails?.fundingModel == FundingModel.FIXED_PRICE ? (
              <form className="modal-form">
                <h2>Fixed Price Investment</h2>
                <h3>Price: ${unitsToInvest * projectDetails.unitPrice}</h3>
                <input
                  type="number"
                  name="unitsToInvest"
                  className="modal-input"
                  onChange={(e) => setUnitsToInvest(Number(e.target.value))}
                  placeholder={`/ ${projectDetails?.totalUnits} Total Units`}
                  required
                />
                <button
                  type="submit"
                  className="modal-confirm-btn"
                  onClick={handleInvestConfirmClick}
                >
                  Confirm Payment
                </button>
              </form>
            ) : (
              <form className="modal-form">
                <h2>Micro Investments</h2>
                <input
                  type="number"
                  name="investAmount"
                  className="modal-input"
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  placeholder="Minimum Amount: $1000"
                  required
                />
                <button
                  type="submit"
                  className="modal-confirm-btn"
                  onClick={handleInvestConfirmClick}
                >
                  Confirm Payment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default ProjectDetails;

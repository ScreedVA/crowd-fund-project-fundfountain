import { useEffect, useState } from "react";
import "./ProjectDetails.css";
import {
  FundingModel,
  InvestRequestModel,
  ProjectStatus,
  ReadCFProjectModel,
} from "../../../../../models/ProjectModel";
import { useNavigate } from "react-router-dom";
import {
  fetchCFPResourcePermissionsHttpRequest,
  fetchProjectByIdHttpRequest,
} from "../../../../../services/ProjectService";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import { investHttpRequest } from "../../../../../services/InvestorService";
import { validateFixedPriceInput, validateMicroInvestmentInput } from "../../../../../services/ValidationService";

interface ProjectDetailsProps {
  isUserPath: boolean;
  projectId?: number;
  projectDetailsFromParent?: ReadCFProjectModel;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, projectDetailsFromParent, isUserPath }) => {
  const [projectDetails, setProjectDetails] = useState<ReadCFProjectModel>();
  const [resourcePermissions, setResourcePermissions] = useState<{
    canEdit: string;
  }>();
  const [investRequest, setInvestRequest] = useState<InvestRequestModel>({
    microInvestmentAmount: 0,
    unitsToInvest: 0,
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [errors, setErrors] = useState<any>();
  const navigate = useNavigate();

  async function initCFProjectEditPermission() {
    if (projectId) {
      const response: Response = await fetchCFPResourcePermissionsHttpRequest(projectId);
      const permissionResponse: { canEdit: string } = await response.json();
      setResourcePermissions(permissionResponse);
    }
  }

  async function initProjectById() {
    if (projectId) {
      const response: Response = await fetchProjectByIdHttpRequest(projectId);
      const projectResponse: ReadCFProjectModel = response.ok && (await response.json());

      setProjectDetails(projectResponse);
      await initCFProjectEditPermission();
    }
  }
  useEffect(() => {
    if (projectDetailsFromParent) {
      setProjectDetails(projectDetailsFromParent);
    } else if (projectId) {
      initProjectById();
    }
    projectId && initCFProjectEditPermission();
  }, [reload, projectDetailsFromParent]);

  const handleEditClick = () => {
    navigate(`/edit/project/${projectId}`);
  };

  const handleInvestClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInvestRequestChanged = (event: any) => {
    event.preventDefault();

    const { name, value } = event.target;

    setInvestRequest((prevValues) => {
      return {
        ...prevValues,
        [name]: Number(value),
      };
    });
    console.log(`name: ${name} value: ${value}`);
  };

  const handleInvestConfirmClick = (event: any) => {
    event.preventDefault();

    const validationErrors =
      projectDetails?.fundingModel === FundingModel.FIXED_PRICE
        ? validateFixedPriceInput(investRequest?.unitsToInvest!, projectDetails.totalUnits)
        : validateMicroInvestmentInput(
            investRequest?.microInvestmentAmount!,
            projectDetails!.currentFund,
            projectDetails!.fundGoal
          );

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      async function sendInvestRequest() {
        const response = await investHttpRequest(investRequest!, projectDetails!.id);

        setReload((prev) => !prev);
        handleCloseModal();
        setInvestRequest({});
      }
      sendInvestRequest();
      console.log(validationErrors);
    }
  };

  const isfundingProgressValid = () => {
    if (projectDetails?.fundingProgress !== undefined && projectDetails.fundingProgress > 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="project-details-container">
        <h1>{projectDetails?.name}</h1>
        <h3 id="project-status">
          Status:{" "}
          <span
            style={{
              color: projectDetails?.status == ProjectStatus.ACTIVE ? "#17DC21" : "#DB0117",
            }}
          >
            {projectDetails?.status}
          </span>
        </h3>
        <p id="project-description">{projectDetails?.description}</p>
        {isfundingProgressValid() && <ProgressBar percentage={projectDetails!.fundingProgress}></ProgressBar>}
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
            {projectDetails?.totalUnits !== null && <h4>Total Units: {projectDetails?.totalUnits}</h4>}
            <h4>Valuation: {projectDetails?.valuation}</h4>
          </div>
          <div className="project-box-field">
            <h4>Funding Model: {projectDetails?.fundingModel}</h4>
            <h4>Funding Progress: {projectDetails?.fundingProgress}%</h4>
          </div>
        </div>

        <div className="project-box">
          {/* Edit/Invest Buttun */}
          {!isUserPath ? (
            <>
              {projectDetails?.status == ProjectStatus.ACTIVE && (
                <div className="">
                  <button className="project-details-btn" onClick={handleInvestClick}>
                    <a>Invest</a>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {resourcePermissions?.canEdit && (
                <div className="">
                  <button className="project-details-btn" onClick={handleEditClick}>
                    <a>Edit</a>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* <div className="project-box"></div> */}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-body">
            <span onClick={handleCloseModal}>
              <p className="modal-close">&times;</p>
            </span>
            {projectDetails?.fundingModel == FundingModel.FIXED_PRICE ? (
              <form className="modal-form">
                <h2>Fixed Price Investment</h2>
                <h3>Price: ${investRequest?.unitsToInvest! * projectDetails.unitPrice || 0}</h3>
                <input
                  type="number"
                  name="unitsToInvest"
                  className="modal-input"
                  onChange={handleInvestRequestChanged}
                  placeholder={`/ ${projectDetails?.totalUnits} Total Units`}
                  value={investRequest?.unitsToInvest || ""}
                />
                {errors?.unitsToInvest && <small style={{ color: "red" }}>{errors.unitsToInvest}</small>}
                <button type="submit" className="modal-confirm-btn" onClick={handleInvestConfirmClick}>
                  Confirm Payment
                </button>
              </form>
            ) : (
              <form className="modal-form" onSubmit={handleInvestConfirmClick}>
                <h2>Micro Investments</h2>
                <input
                  type="number"
                  name="microInvestmentAmount"
                  className="modal-input"
                  onChange={handleInvestRequestChanged}
                  placeholder="Minimum Amount: $1000"
                  value={investRequest?.microInvestmentAmount || ""}
                />
                {errors?.microInvestmentAmount && (
                  <small style={{ color: "red" }}>{errors.microInvestmentAmount}</small>
                )}
                <button type="submit" className="modal-confirm-btn">
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

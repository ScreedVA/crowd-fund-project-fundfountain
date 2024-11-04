import { useEffect, useState } from "react";
import {
  CreateCFProjectModel,
  FundingModel,
  ProjectStatus,
  ReadCFProjectModel,
  UpdateCFProjectModel,
} from "../../../models/ProjectModel";
import ProjectDetails from "../ProjectOverview/pages/ProjectDetails";
import "./ProjectForm.css";
import {
  createCFProjectHttpRequest,
  fetchProjectByIdHttpRequest,
  updateCFProjectHttpRequest,
} from "../../../services/ProjectService";
import { isLocationField } from "../../../services/CommonService";
import {
  validateCreateCFProjectModel,
  validateUpdateCFProjectModel,
} from "../../../services/ValidationService";
import useToast from "../../../services/ToasterService";
import Toaster from "../Toaster/Toaster";

interface ProjectFormProps {
  projectId?: number;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId }) => {
  const [currentProjectDetails, setCurrentProjectDetails] =
    useState<ReadCFProjectModel>();
  const [errors, setErrors] = useState<any>({});
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    async function setProjectById() {
      const resData: ReadCFProjectModel = await fetchProjectByIdHttpRequest(
        projectId!
      );
      setCurrentProjectDetails(resData);
    }

    if (projectId) {
      setProjectById();
    } else {
      setCurrentProjectDetails((prevValue: any) => {
        return {
          ...prevValue,
          ["fundingModel"]: FundingModel.FIXED_PRICE,
          ["status"]: ProjectStatus.ACTIVE,
        };
      });
    }
  }, []);

  function handleCurrentDetailsChanged(event: any) {
    const { name, value, type } = event.target;

    setCurrentProjectDetails((prevFields) => {
      const updatedFields = prevFields ?? ({} as ReadCFProjectModel);

      let parsedValue: any;
      if (name === "status") {
        parsedValue = value as ProjectStatus;
      } else if (name === "fundingModel") {
        parsedValue = value as FundingModel;
      } else {
        parsedValue = type === "number" ? +value : value;
      }

      if (isLocationField(name)) {
        return {
          ...updatedFields,
          location: {
            ...updatedFields.location,
            [name]: parsedValue,
          },
        };
      }

      return {
        ...updatedFields,
        [name]: parsedValue,
      };
    });
  }

  async function handleConfirmSaveBtnClick(event: any) {
    event.preventDefault();

    if (currentProjectDetails) {
      if (projectId) {
        const requestBody: UpdateCFProjectModel = {
          name: currentProjectDetails.name,
          description: currentProjectDetails.description,
          location: currentProjectDetails.location,
        };

        const validationErrors = validateUpdateCFProjectModel(requestBody);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          const response = await updateCFProjectHttpRequest(
            projectId,
            requestBody
          );
          if (response.ok) {
            showToast("Project has been updated", "success");
          } else {
            showToast(
              `Error Status: ${response.status} Error: ${response.text}`
            );
          }
        }
      } else {
        const validationErrors = validateCreateCFProjectModel(
          currentProjectDetails
        );
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          const response = await createCFProjectHttpRequest(
            currentProjectDetails as CreateCFProjectModel
          );
          if (response.ok) {
            showToast("New project created", "success");
          } else {
            showToast(
              `Error Status: ${response.status} Error: ${response.text}`
            );
          }
        }
      }
    }
  }

  return (
    <>
      <div className="project-form-wrapper">
        <form action="" className="project-form">
          <div className="project-form-input-box one">
            <div className="project-form-input-field">
              <label htmlFor="name">Name*</label>
              <input
                name="name"
                type="text"
                value={currentProjectDetails?.name || ""}
                onChange={handleCurrentDetailsChanged}
              />
              {errors.name && (
                <small style={{ color: "red" }}>{errors.name}</small>
              )}
            </div>
          </div>
          <div className="project-form-input-box one">
            <div className="project-form-input-field">
              <label htmlFor="description">Description*</label>
              <textarea
                name="description"
                value={currentProjectDetails?.description || ""}
                onChange={handleCurrentDetailsChanged}
              ></textarea>
              {errors.description && (
                <small style={{ color: "red" }}>{errors.description}</small>
              )}
            </div>
          </div>

          {/* Show if Project is not being updated */}
          {projectId == undefined && (
            <>
              <div className="project-form-input-box four">
                <div className="project-form-input-field">
                  <label htmlFor="fundGoal">Fund Goal*</label>
                  <input
                    type="number"
                    name="fundGoal"
                    value={currentProjectDetails?.fundGoal || ""}
                    onChange={handleCurrentDetailsChanged}
                  />
                  {errors.fundGoal && (
                    <small style={{ color: "red" }}>{errors.fundGoal}</small>
                  )}
                </div>
                <div className="project-form-input-field">
                  <label htmlFor="unitPrice">Unit Price*</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={currentProjectDetails?.unitPrice || ""}
                    onChange={handleCurrentDetailsChanged}
                  />
                  {errors.unitPrice && (
                    <small style={{ color: "red" }}>{errors.unitPrice}</small>
                  )}
                </div>
                <div className="project-form-input-field select">
                  <label htmlFor="fundingModel">Funding Model*</label>
                  <select
                    name="fundingModel"
                    value={currentProjectDetails?.fundingModel || ""}
                    onChange={handleCurrentDetailsChanged}
                  >
                    <option value={FundingModel.FIXED_PRICE}>
                      {FundingModel.FIXED_PRICE}
                    </option>
                    <option value={FundingModel.MICRO_INVESTMENT}>
                      {FundingModel.MICRO_INVESTMENT}
                    </option>
                    {errors.fundingModel && (
                      <small style={{ color: "red" }}>
                        {errors.fundingMOdel}
                      </small>
                    )}
                  </select>
                </div>
                <div className="project-form-input-field select">
                  <label htmlFor="status">Project Status*</label>
                  <select
                    name="status"
                    value={currentProjectDetails?.status || ""}
                    onChange={handleCurrentDetailsChanged}
                  >
                    <option value={ProjectStatus.ACTIVE}>
                      {ProjectStatus.ACTIVE}
                    </option>
                    <option value={ProjectStatus.COMPLETE}>
                      {ProjectStatus.COMPLETE}
                    </option>
                    <option value={ProjectStatus.FUNDING}>
                      {ProjectStatus.FUNDING}
                    </option>
                    <option value={ProjectStatus.PENDING_APPROVAL}>
                      {ProjectStatus.PENDING_APPROVAL}
                    </option>
                    {errors.status && (
                      <small style={{ color: "red" }}>{errors.status}</small>
                    )}
                  </select>
                </div>
              </div>
              <div className="project-form-input-box two">
                <div className="project-form-input-field">
                  <label htmlFor="startDate">Start Date*</label>
                  <input
                    type="date"
                    name="startDate"
                    value={currentProjectDetails?.startDate || ""}
                    onChange={handleCurrentDetailsChanged}
                  />
                  {errors.startDate && (
                    <small style={{ color: "red" }}>{errors.startDate}</small>
                  )}
                </div>
                <div className="project-form-input-field">
                  <label htmlFor="lastDate">End Date*</label>
                  <input
                    type="date"
                    name="lastDate"
                    value={currentProjectDetails?.lastDate || ""}
                    onChange={handleCurrentDetailsChanged}
                  />
                  {errors.lastDate && (
                    <small style={{ color: "red" }}>{errors.lastDate}</small>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Location Fields */}
          <div className="project-form-input-box five">
            <div className="project-form-input-field">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={currentProjectDetails?.location?.street || ""}
                onChange={handleCurrentDetailsChanged}
              />
            </div>
            <div className="project-form-input-field">
              <label htmlFor="plz">PLZ</label>
              <input
                type="text"
                name="plz"
                placeholder="PLZ"
                value={currentProjectDetails?.location?.plz || ""}
                onChange={handleCurrentDetailsChanged}
              />
            </div>
            <div className="project-form-input-field">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={currentProjectDetails?.location?.city || ""}
                onChange={handleCurrentDetailsChanged}
              />
            </div>
            <div className="project-form-input-field">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={currentProjectDetails?.location?.country || ""}
                onChange={handleCurrentDetailsChanged}
              />
            </div>
            <div className="project-form-input-field">
              <label htmlFor="houseNumber">House Number</label>
              <input
                type="text"
                name="houseNumber"
                placeholder="House Number"
                value={currentProjectDetails?.location?.houseNumber || ""}
                onChange={handleCurrentDetailsChanged}
              />
            </div>
          </div>
          <div className="project-form-input-box one">
            <div className="project-form-input-field button-field">
              <button
                type="submit"
                className="project-form-btn"
                onClick={handleConfirmSaveBtnClick}
              >
                Confirm Save
              </button>
            </div>
          </div>
        </form>
        {toast.isVisible && (
          <Toaster
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </>
  );
};

export default ProjectForm;

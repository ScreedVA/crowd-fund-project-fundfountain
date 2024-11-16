import React, { useState } from "react";
import "./RevenueReportForm.css";
import { CreateRevenueReportFormDataSchema } from "../../../../models/RevenueModel";
import { postRevenueEntryHttpRequest } from "../../../../services/RevenueService";

interface RevenueReportProps {
  projectId: number;
}

const RevenueReportForm: React.FC<RevenueReportProps> = ({ projectId }) => {
  const [formDataRequest, setFormDataRequest] = useState<CreateRevenueReportFormDataSchema>();
  const [revenueReportFiles, setRevenueReportFiles] = useState<FileList>();

  // Handle Input Changes
  function handleFormDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormDataRequest((prevValue: any) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
    console.log(`Name: ${name}, Value: ${value}`);
  }

  function handleFileDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setRevenueReportFiles(event.target.files);
    }
  }

  async function handleSubmitReport(event: React.FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    // Handle Form Data
    if (formDataRequest) {
      formData.append("distribution_date", formDataRequest.distributionDate);
      formData.append("amount", formDataRequest.amount.toString());
    }

    // Handle Report Files
    if (revenueReportFiles) {
      for (let i = 0; i < revenueReportFiles.length; i++) {
        formData.append("revenue_report_files", revenueReportFiles[i]);
      }
    }

    // handle Http Post Request
    const response: Response = await postRevenueEntryHttpRequest(projectId, formData);
    console.log(await response.json());
  }

  return (
    <>
      <div className="revenue-form-wrapper">
        <form className="revenue-form">
          <div className="revenue-form-input-box two">
            <div className="revenue-form-input-field">
              <label htmlFor="distributionDate">Distribution Date</label>
              <input
                type="date"
                name="distributionDate"
                onChange={handleFormDataChange}
                value={formDataRequest?.distributionDate || ""}
              />
            </div>
            <div className="revenue-form-input-field">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                placeholder="$"
                onChange={handleFormDataChange}
                name="amount"
                value={formDataRequest?.amount || ""}
              />
            </div>
          </div>
          <div className="revenue-form-input-box one">
            <div className="revenue-form-input-field">
              <label htmlFor="revenueReportFiles">Revenue Documents</label>
              <input type="file" multiple accept="application/pdf" onChange={handleFileDataChange} />
            </div>
          </div>
          <div className="revenue-form-input-box one">
            <div className="revenue-form-input-field button-field">
              <button type="submit" className="project-form-btn" onClick={handleSubmitReport}>
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default RevenueReportForm;

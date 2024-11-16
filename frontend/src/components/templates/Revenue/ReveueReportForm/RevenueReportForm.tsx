import "./RevenueReportForm.css";

interface RevenueReportProps {}

const RevenueReportForm: React.FC<RevenueReportProps> = () => {
  return (
    <>
      <div className="revenue-form-wrapper">
        <form className="revenue-form">
          <div className="revenue-form-input-box two">
            <div className="revenue-form-input-field">
              <label htmlFor="distributionDate">Distribution Date</label>
              <input type="date" name="distributionDate" />
            </div>
            <div className="revenue-form-input-field">
              <label htmlFor="amount">Amount</label>
              <input type="number" placeholder="$" />
            </div>
          </div>
          <div className="revenue-form-input-box one">
            <div className="revenue-form-input-field">
              <label htmlFor="revenueReportFiles">Revenue Documents</label>
              <input type="file" multiple accept="application/pdf" />
            </div>
          </div>
          <div className="revenue-form-input-box one">
            <div className="revenue-form-input-field button-field">
              <button type="submit" className="project-form-btn">
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

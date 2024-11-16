import { RevenueSummaryModel } from "../../../../models/RevenueModel";
import { fetchRevenueSummary } from "../../../../services/RevenueService";
import "./RevenueDetails.css";

interface RevenueDetailsProps {
  revenueSummaryFromParent: RevenueSummaryModel;
}

const RevenueDetails: React.FC<RevenueDetailsProps> = ({ revenueSummaryFromParent }) => {
  return (
    <>
      <div className="revenue-details-container">
        <h1>Revenue Summary</h1>
        <div className="flex-row">
          <h3>Total Revenue</h3>
          <h3>${revenueSummaryFromParent.revenueAggregateTotal}</h3>
        </div>
        <div className="flex-row">
          <h3>Total Entries</h3>
          <h3>{revenueSummaryFromParent.revenueEntryCount}</h3>
        </div>
      </div>
    </>
  );
};
export default RevenueDetails;

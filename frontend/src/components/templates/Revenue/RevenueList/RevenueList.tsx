import { RevenueEntryModel } from "../../../../models/RevenueModel";
import RevenueListItem from "./pages/RevenueListItem";
import "./RevenueList.css";
interface RevenueListProps {
  revenueEntryList: RevenueEntryModel[];
  liCustomWidthpx: string;
}

const RevenueList: React.FC<RevenueListProps> = ({ revenueEntryList, liCustomWidthpx }) => {
  return (
    <>
      <ul className="revenue-list-container">
        {revenueEntryList.map((value, index) => (
          <li
            key={value.id}
            style={{ width: liCustomWidthpx ? liCustomWidthpx : "80%" }}
            className="revenue-list-item-container"
          >
            <RevenueListItem amount={value.amount} date={value.date} fileIdList={value.fileIdList} />
          </li>
        ))}
      </ul>
    </>
  );
};
export default RevenueList;

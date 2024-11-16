import RevenueListItem from "./pages/RevenueListItem";
import "./RevenueList.css";
interface RevenueListProps {
  revenueDateAmountList: { date: string; amount: number }[];
  liCustomWidthpx: string;
}

const RevenueList: React.FC<RevenueListProps> = ({ revenueDateAmountList, liCustomWidthpx }) => {
  return (
    <>
      <ul className="revenue-list-container">
        {revenueDateAmountList.map((value, index) => (
          <li
            key={index}
            style={{ width: liCustomWidthpx ? liCustomWidthpx : "80%" }}
            className="revenue-list-item-container"
          >
            <RevenueListItem amount={value.amount} date={value.date} />
          </li>
        ))}
      </ul>
    </>
  );
};
export default RevenueList;

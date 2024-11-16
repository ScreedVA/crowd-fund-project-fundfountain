import "./RevenueListItem.css";

interface RevenueListItemProps {
  date: string;
  amount: number;
}

const RevenueListItem: React.FC<RevenueListItemProps> = ({ date, amount }) => {
  return (
    <>
      <div className="revenue-list-item-row">
        <table>
          <tr>
            <th>Date</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>{date}</td>
            <td>${amount}</td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default RevenueListItem;

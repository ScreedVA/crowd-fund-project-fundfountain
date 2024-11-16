import { useState } from "react";
import { ContentDispositionFilter } from "../../../../../models/FileModel";
import { fetchFileDownloadHttpRequest } from "../../../../../services/FileService";
import "./RevenueListItem.css";

interface RevenueListItemProps {
  fileIdList: number[];
  date: string;
  amount: number;
}

const RevenueListItem: React.FC<RevenueListItemProps> = ({ date, amount, fileIdList }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  async function handleFileDownloadStream(fileId: number) {
    if (fileIdList) {
      await fetchFileDownloadHttpRequest(fileId, { content_disposition: ContentDispositionFilter.ATTACHMENT });
    }
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="revenue-list-item-row">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              {fileIdList && <th>Download</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{date}</td>
              <td>${amount}</td>
              {fileIdList && (
                <td>
                  <a onClick={handleOpenModal} style={{ textAlign: "center" }}>
                    <i className="fa-solid fa-download"></i>
                  </a>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="download-list-container">
          <div className="download-modal body">
            <span>
              <p onClick={handleCloseModal} className="modal-close">
                &times;
              </p>
            </span>
            {fileIdList &&
              fileIdList.map((value) => (
                <ul>
                  <li key={value} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px" }}>
                    <p style={{ margin: 0 }}>File #{value}</p>
                    <a
                      className="modal-download-list-icon"
                      onClick={() => handleFileDownloadStream(value)}
                      style={{ textAlign: "center" }}
                    >
                      <i className="fa-solid fa-download" style={{ color: "black" }}></i>
                    </a>
                  </li>
                </ul>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RevenueListItem;

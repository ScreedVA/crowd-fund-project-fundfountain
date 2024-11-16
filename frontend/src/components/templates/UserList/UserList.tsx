import { ReadUserSummaryModel } from "../../../models/UserModel";
import UserListItem from "./pages/UserListItem";
import "./UserList.css";
interface UserListProps {
  userList: ReadUserSummaryModel[];
  isNavigator: boolean;
}

const UserList: React.FC<UserListProps> = ({ userList }) => {
  function handleListClick(value: any) {}

  return (
    <>
      <ul className="user-list-container">
        {userList.map((value) => (
          <li onClick={() => handleListClick(value)} key={value.id} className="user-list-item-container">
            {
              <UserListItem
                username={value.username} // Set Username to Uppercase}
                biography={value.biography}
              />
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserList;

interface ProjectListItemProps {
  username: string;
  biography: string;
}

const UserListItem: React.FC<ProjectListItemProps> = ({
  username,
  biography,
}) => {
  return (
    <>
      <h1>{username}</h1>
      <h3>{biography}</h3>
    </>
  );
};
export default UserListItem;

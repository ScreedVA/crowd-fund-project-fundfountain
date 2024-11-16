import React from "react";
import "./UserSideBar.css";

interface UserMenuBarProps {
  sendIndexToFromUserMenuBar: (index: number) => void;
  selectOptions: string[];
  selectedIndex: number;
}

const UserMenuBar: React.FC<UserMenuBarProps> = ({
  sendIndexToFromUserMenuBar,
  selectOptions,
}) => {
  function handleMenuItemSelect(index: number) {
    sendIndexToFromUserMenuBar(index);
  }

  return (
    <>
      <menu className="menu-body">
        <ul className="menu-list">
          {selectOptions.map((value, index) => (
            <li
              key={index}
              style={{}}
              className={`menu-item item-${index}`}
              onClick={() => handleMenuItemSelect(index)}
            >
              {value}
            </li>
          ))}
        </ul>
      </menu>
    </>
  );
};

export default UserMenuBar;

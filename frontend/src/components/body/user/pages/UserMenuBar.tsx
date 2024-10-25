import React from "react";
import "./UserMenuBar.css";

interface UserMenuBarProps {
  sendIndexToFromUserMenuBar: (index: number) => void;
  selectOptions: string[];
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
              className="menu-item"
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

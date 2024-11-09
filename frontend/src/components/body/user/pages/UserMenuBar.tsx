import React from "react";
import "./UserMenuBar.css";

interface UserMenuBarProps {
  sendIndexToFromUserMenuBar: (index: number) => void;
  selectOptions: string[];
  selectedIndex: number;
}

const UserMenuBar: React.FC<UserMenuBarProps> = ({
  sendIndexToFromUserMenuBar,
  selectOptions,
  selectedIndex,
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
              style={{
                backgroundColor: selectedIndex == index ? "#008c9e" : "#1e3a5f",
              }}
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

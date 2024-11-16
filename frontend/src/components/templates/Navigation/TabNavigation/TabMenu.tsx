import { useEffect } from "react";
import "./TabMenu.css";
import { TabMenuCustomConfig } from "../../../../models/TabMenuModel";

interface TabMenuProps {
  sendSelectedIndexFromTabMenu: (index: number) => void;
  selectOptions: string[];
  selectedIndex: number;
  custumTabConfig?: TabMenuCustomConfig;
  dependancyArray?: any[];
}

const TabMenu: React.FC<TabMenuProps> = ({
  sendSelectedIndexFromTabMenu,
  selectOptions,
  selectedIndex,
  custumTabConfig,
  dependancyArray,
}) => {
  useEffect(() => {}, [selectOptions, ...(dependancyArray || [])]);

  return (
    <>
      <menu className="tab-menu-body">
        <ul
          className="tab-menu-list"
          style={{
            justifyContent:
              custumTabConfig && custumTabConfig?.listXAlignment ? custumTabConfig.listXAlignment : "start",
            ...(custumTabConfig?.unorderedListStyles?.borderBottom
              ? { borderBottom: custumTabConfig.unorderedListStyles.borderBottom }
              : {}),
          }}
        >
          {selectOptions.map((value, index, array) => (
            <li
              key={index}
              style={{
                backgroundColor: selectedIndex == index ? "#00bcd4" : "#4a5568",
                borderRight: index == array.length - 1 ? "2px solid black" : "",
                ...(custumTabConfig?.listItemBorderStyles?.borderBottom
                  ? { borderBottom: custumTabConfig.listItemBorderStyles.borderBottom }
                  : {}),
              }}
              className={`tab-menu-item item-${index}`}
              onClick={() => sendSelectedIndexFromTabMenu(index)}
            >
              {value}
            </li>
          ))}
        </ul>
      </menu>
    </>
  );
};
export default TabMenu;

import "./InvestorMenuBar.css";

interface InvestorMenuBarProps {
  sendIndexToFromInvestorMenuBar: (index: number) => void;
  selectOptions: string[];
  selectedIndex: number;
}

const InvestorMenuBar: React.FC<InvestorMenuBarProps> = ({
  sendIndexToFromInvestorMenuBar,
  selectOptions,
  selectedIndex,
}) => {
  function handleMenuItemSelect(index: number) {
    sendIndexToFromInvestorMenuBar(index);
  }
  return (
    <>
      <menu className="investor-menu-body">
        <ul className="investor-menu-list">
          {selectOptions.map((value, index) => (
            <li
              key={index}
              style={{
                backgroundColor: selectedIndex == index ? "#00bcd4" : "#1e3a5f",
              }}
              className={`investor-menu-item item-${index}`}
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

export default InvestorMenuBar;

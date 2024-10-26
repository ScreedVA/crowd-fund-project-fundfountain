import "./HomeHeader.css";

function HomeHeader() {
  return (
    <>
      <div className="home-header-container">
        <div className="home-header-grid-item"></div>
        <div className="home-header-grid-item">
          <form className="home-header-form">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="searchBar"
            />
            <select className="searchFilter" name="searchFilter">
              <option value="option1">Name</option>
              <option value="option2">Description</option>
              <option value="option3">Location</option>
            </select>
            <button type="submit" className="searchButton">
              Search
            </button>
          </form>
        </div>
        <div className="home-header-grid-item"></div>
      </div>
    </>
  );
}
export default HomeHeader;

import { useState } from "react";
import {
  cfpFilterModel,
  FundingModel,
  ProjectStatus,
} from "../../../../models/ProjectModel";
import "./HomeHeader.css";

interface HomeHeaderProps {
  updateFilter: (event: any) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ updateFilter }) => {
  function handleFilterChanged(event: any) {
    updateFilter(event);
  }

  return (
    <>
      <div className="home-header-container">
        <div className="home-header-grid-item"></div>
        <div className="home-header-grid-item">
          <form className="home-header-form">
            <input
              type="search"
              name="name"
              placeholder="Search"
              className="search-bar"
              onChange={handleFilterChanged}
            />
            <select
              className="status-filter filter"
              name="status"
              onChange={handleFilterChanged}
            >
              <option value=""></option>
              <option value={ProjectStatus.ACTIVE}>
                {ProjectStatus.ACTIVE}
              </option>
              <option value={ProjectStatus.FUNDED}>
                {ProjectStatus.FUNDED}
              </option>
              <option value={ProjectStatus.FUNDED}>
                {ProjectStatus.PENDING_APPROVAL}
              </option>
            </select>

            <select
              className="funding-model-filter filter"
              name="fundingModel"
              onChange={handleFilterChanged}
            >
              <option value=""></option>
              <option value={FundingModel.FIXED_PRICE}>
                {FundingModel.FIXED_PRICE}
              </option>
              <option value={FundingModel.MICRO_INVESTMENT}>
                {FundingModel.MICRO_INVESTMENT}
              </option>
            </select>
            {/* <button type="submit" className="search-btn">
              Search
            </button> */}
          </form>
        </div>
        <div className="home-header-grid-item"></div>
      </div>
    </>
  );
};
export default HomeHeader;

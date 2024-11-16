import React from "react";
import { CFProjectSummary, ProjectStatus } from "../../../../../models/ProjectModel";

const ProjectListItem: React.FC<CFProjectSummary> = ({ name, description, status }) => {
  return (
    <>
      <small style={{ fontWeight: "bold" }}>
        Status:{" "}
        <span
          style={{
            color: status == ProjectStatus.ACTIVE ? "#17DC21" : "#DB0117",
            fontWeight: "normal",
          }}
        >
          {status}
        </span>
      </small>
      <h1>{name}</h1>
      <h3>{description}</h3>
    </>
  );
};
export default ProjectListItem;

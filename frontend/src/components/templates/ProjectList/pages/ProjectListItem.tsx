import React from "react";
import { CFProjectSummary } from "../../../../models/ProjectModel";

const ProjectListItem: React.FC<CFProjectSummary> = ({ name, description }) => {
  return (
    <>
      <h1>{name}</h1>
      <h3>{description}</h3>
    </>
  );
};
export default ProjectListItem;

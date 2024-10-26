import React from "react";
import { CrowdFundProjectSummary } from "../../../models/Project";

const ProjectListItem: React.FC<CrowdFundProjectSummary> = ({
  name,
  description,
}) => {
  return (
    <>
      <h1>{name}</h1>
      <h3>{description}</h3>
    </>
  );
};
export default ProjectListItem;

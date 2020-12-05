// libs
import React from "react";
// others
import "./style.scss";

/**
 * ProcessingLoader
 * TODO: Create Loading
 */
const ProcessingLoader = ({ message = "Loading..." }) => (
  <div className="processing-loader-wrapper">{message}</div>
);

export default ProcessingLoader;

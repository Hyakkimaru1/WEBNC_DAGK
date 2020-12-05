// libs import
import React from "react";
// others
import "./styles.scss";

/**
 * ErrorInformation
 * TODO: Create ErrorInformation
 */
const ErrorInformation:React.FC<{error:any}> = ({ error = {} }) => (
  <div className="error-information-wrapper">Error: {error.message}</div>
);

const withErrorBoundary = ({ isError, error }:{isError:any, error:any}) => (WrappedComponent:any) =>
  isError ? <ErrorInformation error={error} /> : WrappedComponent;

export default withErrorBoundary;

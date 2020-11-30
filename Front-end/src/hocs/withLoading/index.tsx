// libs import
import React from "react";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";

const withLoading = (isLoading:boolean) => (WrappedComponent:any) =>
  isLoading ? <ProcessingLoader /> : WrappedComponent;

export default withLoading;

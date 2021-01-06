import React from "react";
import { Backdrop, CircularProgress } from '@material-ui/core';

const Loading: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <Backdrop
      style={{ backgroundColor: "rgba(255,255,255,.75", zIndex: 100000 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

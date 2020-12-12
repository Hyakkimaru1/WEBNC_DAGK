import React from "react";
import "./style.scss";

const Square: React.FC<{value:number}> = ({value}) => {
  return <li className="square">X</li>;
};

export default Square;

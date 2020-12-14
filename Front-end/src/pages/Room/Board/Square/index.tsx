import React from "react";
import "./style.scss";

const Square: React.FC<{value:number}> = ({value}) => {
  return <li className="square">
    <div className="square__O"></div>
  </li>;
};

export default Square;

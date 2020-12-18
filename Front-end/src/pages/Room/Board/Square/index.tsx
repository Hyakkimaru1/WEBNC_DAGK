import React from "react";
import "./style.scss";

const Square: React.FC<{
  isPlay: boolean;
  value?: number;
  onClick: any;
  location: number;
  current?: boolean;
}> = ({ isPlay, value = -1, onClick, location,current }) => {
  return (
    <li
      style={isPlay && value === null ? { cursor: "pointer" } : { cursor: "context-menu" }}
      onClick={() => (isPlay && value === null? onClick(location) : null)}
      className={`square ${current?"square-current":null}`}
    >
      {value === 0 ? <div className="square__O"></div> : <></>}
      {value === 1 ? <div className="square__X"></div> : <></>}
    </li>
  );
};

export default Square;

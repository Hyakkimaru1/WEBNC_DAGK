import React from "react";
import "./style.scss";

const Square: React.FC<{
  isPlay: boolean;
  value?: number;
  onClick: any;
  location: number;
}> = ({ isPlay, value = -1, onClick, location }) => {
  return (
    <li
      style={isPlay && value === null ? { cursor: "pointer" } : { cursor: "context-menu" }}
      onClick={() => (isPlay && value === null? onClick(location) : null)}
      className="square"
    >
      {value === 0 ? <div className="square__O"></div> : <></>}
      {value === 1 ? <div className="square__X"></div> : <></>}
    </li>
  );
};

export default Square;

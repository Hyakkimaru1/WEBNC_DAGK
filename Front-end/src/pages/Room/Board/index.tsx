import React from "react";
import "./style.scss";
import Square from "./Square/index";

const Board: React.FC = () => {
  //const [squares, setSquares] = useState(Array(25*25).fill(null));
  const renderSquare = (i: number) => {
    return (
      <Square
        key={`square${i}`}
        value={i}
        //    onClick={() => onClick(i)}
      />
    );
  };
  const rowMax = 25;
  let boardSquares = [];
  for (let row = 0; row < rowMax; row++) {
    for (let col = 0; col < rowMax; col++) {
      boardSquares.push(renderSquare(row * rowMax + col));
    }
  }
  return <ul className="board">{boardSquares}</ul>;
};

export default Board;

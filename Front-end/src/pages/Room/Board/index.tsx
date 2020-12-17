import React from "react";
import "./style.scss";
import Square from "./Square/index";

const Board: React.FC<{
  isPlay: boolean;
  board?: number[];
  onClick: (i: number) => void;
}> = ({ isPlay, board = [], onClick }) => {
  //const [squares, setSquares] = useState(Array(25*25).fill(null));
  const renderSquare = (i: number) => {
    return (
      <Square
        isPlay={isPlay}
        key={`square${i}`}
        location={i}
        value={board[i]}
        onClick={onClick}
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

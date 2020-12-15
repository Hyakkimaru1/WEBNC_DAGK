type CurrentBoardPlay = {
  boardID: string | null; // roomID
  playerX: string | null;
  playerO: string | null;
  turn: number | null;
  i?:number;
  winner?:number;
  board: number[];
};

export default CurrentBoardPlay;

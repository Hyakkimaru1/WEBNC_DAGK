type CurrentBoardPlay = {
  boardID: string | null; // roomID
  playerX: string | null;
  playerO: string | null;
  turn: number | null;
  board: number[];
};

export default CurrentBoardPlay;

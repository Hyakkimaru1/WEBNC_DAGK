type CurrentBoardPlay = {
  boardID: string | null; // roomID
  playerX: string | null;
  playerO: string | null;
  turn: number | null;
  i?:number;
  hasPassword?:boolean;
  winner?:number;
  board: number[];
};

export default CurrentBoardPlay;


export type personInRoom = {
  socketId: string;
  user: string;
};


export const initialCurrentBoardPlay = {
  boardID:"",
  playerX:"",
  playerO:"",
  turn:null,
  board:[]
}
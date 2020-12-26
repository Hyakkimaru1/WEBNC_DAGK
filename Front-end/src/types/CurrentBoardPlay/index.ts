import USERPLAY from '@/types/UserPlay/index';

type CurrentBoardPlay = {
  boardID: string | null; // roomID
  playerX?: USERPLAY;
  playerO?: USERPLAY;
  turn: number | null;
  i?:number;
  hasPassword?:boolean;
  winner?:number;
  board: number[];
  xReady?:boolean;
  isReady?:boolean;
  oReady?:boolean;
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
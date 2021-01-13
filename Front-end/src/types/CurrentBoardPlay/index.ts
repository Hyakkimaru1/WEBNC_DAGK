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
  chats?:any;
};

export default CurrentBoardPlay;


export type personInRoom = {
  socketId: string;
  user: string;
};

export type User = {
  id?: string;
  avatar?: string;
  name?: string;
  room?: string;
};

export const initialCurrentBoardPlay = {
  boardID:"",
  playerX:"",
  playerO:"",
  turn:null,
  board:[]
}
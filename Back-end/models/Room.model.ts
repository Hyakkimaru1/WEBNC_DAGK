import mongoose, { Document } from "mongoose";

export interface Room extends Document {
  roomId: string; // roomID
  playerX: User; // store userID or username
  playerO: User;
  board: number[][];
  winner: string;
  startChat: number;
  endChat: number;
}
type User = {
  name: string;
  avatar: string;
  cups: number;
  wins: number;
};
const User = new mongoose.Schema({
  name: String,
  avatar: String,
  cups: Number,
  wins: Number,
});
const instance = new mongoose.Schema({
  roomId: String, // roomID
  playerX: User, // store userID or username
  playerO: User,
  board: [[Number]],
  turn: Number,
  winner: String,
  startChat: Number,
  endChat: Number,
});

export default mongoose.model<Room>("room", instance);

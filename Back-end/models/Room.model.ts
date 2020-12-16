import mongoose, { Document } from "mongoose";

export interface Room extends Document {
  roomId: string; // roomID
  playerX: string; // store userID or username
  playerO: string;
  board: number[][];
  winner: string;
}

const instance = new mongoose.Schema({
  roomId: String, // roomID
  playerX: String, // store userID or username
  playerO: String,
  board: [[Number]],
  turn: Number,
  winner: String,
});

export default mongoose.model<Room>("room", instance);

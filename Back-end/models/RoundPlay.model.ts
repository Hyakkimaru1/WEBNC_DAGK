import mongoose, { Document } from "mongoose";

export interface ITRoundPlay extends Document {
  idBoard: string;
  playerX: User;
  playerO: User;
  winner: string | null;
  history: object[];
  startChat: number;
  endChat: number;
}
type User = {
  name: string;
  cups: number;
  wins: number;
};
const User = new mongoose.Schema({
  name: String,
  cups: Number,
  wins: Number,
});
const instance = new mongoose.Schema({
  createBy: String,
  playerX: User,
  playerO: User,
  winner: String,
  history: Array,
  startChat: Number,
  endChat: Number,
});

export default mongoose.model<ITRoundPlay>("roundplay", instance);

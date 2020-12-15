import mongoose, { Document } from "mongoose";

export interface ITRoundPlay extends Document {
  idBoard: string;
  playerX: string;
  playerO: string;
  winner: string | null;
  history: object[];
}
const instance = new mongoose.Schema({
  createBy: String,
  playerX: String,
  playerO: String,
  winner: String,
  history: Array,
});

export default mongoose.model<ITRoundPlay>("roundplay", instance);

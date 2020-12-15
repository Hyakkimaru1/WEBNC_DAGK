import mongoose, { Document } from "mongoose";

export interface Room extends Document {
  host: String;
  guest: String;
  winner: String;
  history: [[String]];
  time: String;
  chat: String;
}

const instance = new mongoose.Schema({
  host: String,
  guest: String,
  winner: String,
  history: [[String]],
  time: String,
  chat: String,
});

export default mongoose.model<Room>("room", instance);

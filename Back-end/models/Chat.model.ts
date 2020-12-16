import mongoose, { Document } from "mongoose";

export interface Chat extends Document {
  roomId: string; // roomID
  messages: [{ user: string; message: string }]; // store userID or username
}

const instance = new mongoose.Schema({
  roomId: String, // roomID
  messages: [{ user: String, message: String }], // store userID or username
});

export default mongoose.model<Chat>("chat", instance);

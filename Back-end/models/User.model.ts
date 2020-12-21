import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  user: string,
  password: string,
  avatar: string,
  name: string,
  isConfirm?:boolean,
  codeConfirm?: string
}

const instance = new mongoose.Schema({
  user: String,
  password: String,
  avatar: String,
  name: String,
  isConfirm:Boolean,
  codeConfirm: String
});

export default mongoose.model<IUser>("user", instance);

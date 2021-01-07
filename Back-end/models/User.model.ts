import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  user: string;
  password: string;
  avatar: string;
  name: string;
  isConfirm?: boolean;
  codeConfirm?: string;
  joinDate?: string;
  wins?: number;
  cups?: number;
  isActive?:boolean;
}

const instance = new mongoose.Schema({
  user: String,
  password: String,
  avatar: String,
  name: String,
  isConfirm: Boolean,
  codeConfirm: String,
  joinDate: Date,
  wins: Number,
  cups: Number,
  isActive: Boolean,
});

export default mongoose.model<IUser>("user", instance);

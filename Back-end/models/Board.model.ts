import mongoose, { Document } from "mongoose";

export interface ITBoard extends Document {
  createBy: string;
  hasPassword: boolean;
  password:string;
}
const instance = new mongoose.Schema({
  createBy: String,
  hasPassword:Boolean,
  password:String
});

export default mongoose.model<ITBoard>("board", instance);

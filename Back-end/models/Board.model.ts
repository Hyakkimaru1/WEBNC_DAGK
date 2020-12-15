import mongoose, { Document } from "mongoose";

export interface ITBoard extends Document {
  createBy: string;
}
const instance = new mongoose.Schema({
    createBy: String,
});

export default mongoose.model<ITBoard>("board", instance);

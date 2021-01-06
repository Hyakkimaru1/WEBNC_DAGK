import mongoose, { Document } from "mongoose";

export interface ITokenPassword extends Document {
  _idUser: string;
  user: string;
}

const instance = new mongoose.Schema({
  _idUser: String,
  user: String,
});

export default mongoose.model<ITokenPassword>("tokenpassword", instance);

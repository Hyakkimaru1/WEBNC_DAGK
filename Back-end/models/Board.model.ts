import mongoose, { Document } from "mongoose";
// import autoIncrement from "mongoose-auto-increment";

// var connection = mongoose.createConnection(
//   "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority"
// );

// autoIncrement.initialize(connection);
export interface ITBoard extends Document {
  createBy: string;
}
const instance = new mongoose.Schema({
  createBy: String,
});
// instance.plugin(autoIncrement.plugin, {
//   model: "Book",
//   field: "bookId",
//   startAt: 100,
//   incrementBy: 100,
// });
// var Book = connection.model("name", instance);
export default mongoose.model<ITBoard>("board", instance);

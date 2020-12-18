import mongoose, { Document } from "mongoose";
import autoIncrement from "mongoose-auto-increment";
mongoose.set("useCreateIndex", true);
var connection = mongoose.createConnection(
  "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);

autoIncrement.initialize(connection);
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
<<<<<<< HEAD

=======
instance.plugin(autoIncrement.plugin, {
  model: "board",
  field: "name",
  startAt: 0,
  incrementBy: 1,
});
var Board = connection.model("board", instance);
>>>>>>> cccbb1baaabaaf2052cb0ad22d53decf786a1842
export default mongoose.model<ITBoard>("board", instance);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
mongoose_1.default.set("useCreateIndex", true);
var connection = mongoose_1.default.createConnection("mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});
mongoose_auto_increment_1.default.initialize(connection);
const instance = new mongoose_1.default.Schema({
    createBy: String,
    hasPassword: Boolean,
    password: String,
});
instance.plugin(mongoose_auto_increment_1.default.plugin, {
    model: "board",
    field: "name",
    startAt: 0,
    incrementBy: 1,
});
var Board = connection.model("board", instance);
exports.default = mongoose_1.default.model("board", instance);
//# sourceMappingURL=Board.model.js.map
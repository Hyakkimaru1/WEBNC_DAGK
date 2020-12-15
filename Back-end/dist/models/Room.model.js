"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const instance = new mongoose_1.default.Schema({
    host: String,
    guest: String,
    winner: String,
    history: [[String]],
    time: String,
    chat: String,
});
exports.default = mongoose_1.default.model("room", instance);
//# sourceMappingURL=Room.model.js.map
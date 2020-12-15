"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const instance = new mongoose_1.default.Schema({
    createBy: String,
    playerX: String,
    playerO: String,
    winner: String,
    history: Array,
});
exports.default = mongoose_1.default.model("roundplay", instance);
//# sourceMappingURL=RoundPlay.model.js.map
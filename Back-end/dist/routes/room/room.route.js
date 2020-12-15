"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config"));
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const router = express_1.default.Router();
const primaryKey = config_1.default.PRIMARYKEY;
router.get("/", (req, res) => {
    res.send("<h1>ROUTE USER</h1>");
});
router.post("/create", (req, res) => {
    // req.body has
    // username,password
    try {
        Room_model_1.default.create(req.body, (err) => {
            if (err) {
                res.sendStatus(503);
            }
            else
                res.sendStatus(201);
        });
    }
    catch (error) { }
});
router.get("/:id", (req, res) => {
    User_model_1.default.findById(req.params.id, (err, data) => {
        if (err) {
            res.sendStatus(404);
        }
        else {
            res.send(data);
        }
    });
});
exports.default = router;
//# sourceMappingURL=room.route.js.map
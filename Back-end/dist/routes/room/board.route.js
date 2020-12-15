"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config"));
const Board_model_1 = __importDefault(require("../../models/Board.model"));
const router = express_1.default.Router();
const primaryKey = config_1.default.PRIMARYKEY;
const routerBoard = (io) => {
    router.get("/", (req, res) => {
        res.send("<h1>ROUTE Board</h1>");
    });
    router.post("/create", (req, res) => {
        // req.body has
        // username,password
        try {
            Board_model_1.default.create(req.body, (err) => {
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
        Board_model_1.default.findById(req.params.id, (err, data) => {
            if (err) {
                res.sendStatus(404);
            }
            else {
                res.send(data);
            }
        });
    });
    return router;
};
exports.default = routerBoard;
//# sourceMappingURL=board.route.js.map
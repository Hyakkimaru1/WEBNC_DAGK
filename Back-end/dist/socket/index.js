"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const primaryKey = config_1.default.PRIMARYKEY;
function default_1(io) {
    io.on("connection", (socket) => {
        console.log("loggin");
        socket.on("join", ({ name, room }, callback) => {
            try {
                name &&
                    jsonwebtoken_1.default.verify(name, primaryKey, function (err, decoded) {
                        if (err) {
                            console.log("err", err);
                            // callback(err);
                            // return;
                        }
                        else {
                            name = decoded.user;
                        }
                    });
                let newUser = {
                    id: socket.id,
                    name,
                    room,
                };
                //console.log("name,room", name, room);
                const user = User_1.addUser(newUser);
                if (user.error) {
                    callback(user.error);
                    return;
                }
                socket.emit("message", {
                    user: "admin",
                    text: `${name}, welcome to  room${room}`,
                });
                socket.broadcast.to(user.room).emit("message", {
                    user: "admin",
                    text: `${name}, has joined!`,
                });
                socket.join(room);
                const users = User_1.userInRoom(room);
                //console.log("users", users);
                io.to(room).emit("roomData", {
                    room: user.room,
                    users,
                });
            }
            catch (error) {
                console.log(error);
                callback(error);
            }
        });
        socket.on("sendMess", (message, callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.getUser(socket.id);
                io.to(user.room).emit("message", { user: user.name, text: message });
                const users = User_1.userInRoom(user.room);
                //console.log("usersssss", users);
                io.to(user.room).emit("roomData", {
                    room: user.room,
                    users,
                });
                callback();
            }
            catch (error) {
                console.log("error", error);
            }
        }));
        socket.on("onboard", ({ boardID, token }) => {
            jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                if (err) {
                }
                else {
                    socket.join(boardID);
                    const room = io.sockets.adapter.rooms.get(`${boardID}`);
                    if (room.size == 1) {
                        const initialValueCurrentBoardPlay = {
                            boardID,
                            playerX: decoded.user,
                            playerO: null,
                        };
                        io.sockets.adapter.rooms.get(`${boardID}`).infBoard = initialValueCurrentBoardPlay;
                    }
                    socket.emit("getInfBoard", io.sockets.adapter.rooms.get(`${boardID}`).infBoard);
                }
            });
        });
        socket.on("disconnect", () => {
            const user = User_1.removeUser(socket.id);
            //console.log("disconnect", user);
            if (user) {
                const users = User_1.userInRoom(user.room);
                io.to(user.room).emit("roomData", {
                    room: user.room,
                    users,
                });
                io.to(user.room).emit("message", {
                    user: "admin",
                    text: `${user.name} has left!`,
                });
            }
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const config_1 = __importStar(require("../config"));
const helper_1 = __importDefault(require("./helper"));
const Room_model_1 = __importDefault(require("../models/Room.model"));
const Chat_model_1 = __importDefault(require("../models/Chat.model"));
const Board_model_1 = __importDefault(require("../models/Board.model"));
const primaryKey = config_1.default.PRIMARYKEY;
function default_1(io) {
    io.on(config_1.EventSocket.CONNECTION, (socket) => {
        socket.on(config_1.EventSocket.JOIN, ({ name, room }, callback) => {
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
                const user = User_1.addUser(newUser);
                if (user.error) {
                    callback(user.error);
                    return;
                }
                //admin chat when someone join room
                // socket.emit("message", {
                //   user: "admin",
                //   text: ${name}, welcome to  room${room},
                // });
                // socket.broadcast.to(user.room).emit("message", {
                //   user: "admin",
                //   text: ${name}, has joined!,
                // });
                socket.join(room);
                const users = User_1.getAllUsers;
                io.to(room).emit(config_1.EventSocket.ROOM_DATA, {
                    room: user.room,
                    users,
                });
            }
            catch (error) {
                console.log(error);
                callback(error);
            }
        });
        socket.on(config_1.EventSocket.SEND_MESS, ({ roomId, token, message }, callback) => {
            try {
                let user = null;
                token &&
                    jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                        if (err) {
                            console.log("err", err);
                            // callback(err);
                            // return;
                        }
                        else {
                            user = decoded.user;
                        }
                    });
                const roomH = io.sockets.adapter.rooms.get(roomId);
                if (roomH && (roomH === null || roomH === void 0 ? void 0 : roomH.messages)) {
                    roomH.messages.push({ user, message });
                }
                else {
                    roomH.messages = [{ user, message }];
                }
                roomH.messages &&
                    io.to(roomId).emit(config_1.EventSocket.MESSAGE, { messages: roomH.messages });
                callback();
            }
            catch (error) {
                console.log("error", error);
            }
        });
        //luc vao phong
        socket.on(config_1.EventSocket.ON_BOARD, ({ boardID, token }, callback) => {
            jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                    }
                    else {
                        let newUser = {
                            id: socket.id,
                            name: decoded.user,
                            room: "1",
                        };
                        const user = User_1.addUser(newUser);
                        socket.join(boardID);
                        const room = io.sockets.adapter.rooms.get(boardID);
                        //declare person with their socketId and user (allow invite or primary chat)
                        const person = {
                            socketId: socket.id,
                            user: decoded.user,
                        };
                        //check new room
                        if (room.size === 1) {
                            const doc = yield Board_model_1.default.findById(boardID);
                            if (doc) {
                                const initialValueCurrentBoardPlay = {
                                    boardID,
                                    playerX: decoded.user,
                                    playerO: null,
                                    board: new Array(25 * 25).fill(null),
                                    turn: 1,
                                    hasPassword: doc.hasPassword,
                                    i: null,
                                    winner: null,
                                };
                                io.sockets.adapter.rooms.get(boardID).infBoard = initialValueCurrentBoardPlay;
                            }
                            else {
                                return callback();
                            }
                            //add initial array person
                            room.peopleInRoom = [person];
                        }
                        else {
                            //push user to room
                            if (room.infBoard.hasPassword) {
                                const finduser = room.peopleInRoom.findIndex((ele) => ele.user === decoded.user);
                                if (finduser === -1) {
                                    return callback(null);
                                }
                            }
                            else
                                room.peopleInRoom.push(person);
                        }
                        //toast all users in room know about new user has joined
                        io.to(boardID).emit(config_1.EventSocket.USER_JOIN, room.peopleInRoom);
                        //send inf board for user join room
                        io.to(boardID).emit(config_1.EventSocket.GET_INFO_BOARD, io.sockets.adapter.rooms.get(boardID).infBoard);
                        (room === null || room === void 0 ? void 0 : room.messages) &&
                            io
                                .to(boardID)
                                .emit(config_1.EventSocket.MESSAGE, { messages: room === null || room === void 0 ? void 0 : room.messages });
                        allrooms(socket);
                    }
                });
            });
        });
        //Luc danh
        socket.on(config_1.EventSocket.ON_PLAY, ({ infBoard, i, token, }) => {
            jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                if (err) {
                }
                else {
                    const roomH = io.sockets.adapter.rooms.get(infBoard.boardID);
                    if (!roomH)
                        return;
                    if (roomH === null || roomH === void 0 ? void 0 : roomH.history) {
                        roomH.history.push(infBoard.board);
                    }
                    else {
                        roomH.history = [infBoard.board];
                    }
                    //check win
                    const newArr = [];
                    const board = [...infBoard.board];
                    const x = Math.floor(i / 25);
                    const y = i % 25;
                    while (board.length)
                        newArr.push(board.splice(0, 25));
                    if (helper_1.default(newArr, x, y, infBoard.turn)) {
                        infBoard.winner = infBoard.turn;
                        io.to(infBoard.boardID).emit(config_1.EventSocket.TOAST_WINNER, infBoard);
                        const room = {
                            roomId: infBoard.boardID,
                            playerX: infBoard.playerX,
                            playerO: infBoard.playerO,
                            board: roomH.history,
                            winner: decoded.user,
                        };
                        try {
                            Room_model_1.default.create(room, (err) => {
                                if (err) {
                                    console.log("err", err);
                                }
                            });
                        }
                        catch (error) {
                            console.log("error", error);
                        }
                    }
                    //count turn
                    infBoard.turn = 1 - infBoard.turn;
                    infBoard.i = i;
                    io.to(infBoard.boardID).emit(config_1.EventSocket.GET_INFO_BOARD, infBoard);
                    const room = io.sockets.adapter.rooms.get(infBoard.boardID);
                    if (room)
                        room.infBoard = infBoard;
                }
            });
        });
        //user connect to home page
        socket.on(config_1.EventSocket.ON_HOME, () => {
            allrooms(socket);
        });
        // Host doi vi tri
        socket.on(config_1.EventSocket.JOIN_PLAY_AS, ({ id, value, token }) => {
            jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                var _a;
                if (err) {
                }
                else {
                    let room = (_a = io.sockets.adapter.rooms.get(id)) === null || _a === void 0 ? void 0 : _a.infBoard;
                    if (!room)
                        return;
                    if (value === 1 && !room.playerX) {
                        room.playerX = decoded.user;
                        if (room.playerO === decoded.user) {
                            room.playerO = null;
                        }
                        else {
                            room.board = new Array(625).fill(null);
                            room.turn = 1;
                            room.i = null;
                            room.winner = null;
                        }
                    }
                    else if (value === 0 && !room.playerO) {
                        room.playerO = decoded.user;
                        if (room.playerX === decoded.user) {
                            room.playerX = null;
                        }
                        else {
                            room.board = new Array(625).fill(null);
                            room.turn = 1;
                            room.i = null;
                            room.winner = null;
                        }
                    }
                    else {
                        if (room.playerX === decoded.user) {
                            room.playerX = null;
                        }
                        else if (room.playerO === decoded.user) {
                            room.playerO = null;
                        }
                    }
                    io.to(id).emit(config_1.EventSocket.GET_INFO_BOARD, room);
                    allrooms(socket);
                }
            });
        });
        //user leave room
        socket.on(config_1.EventSocket.LEAVE_ROOM, ({ boardId, token }) => {
            jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
                if (err) {
                }
                else {
                    let room = io.sockets.adapter.rooms.get(boardId);
                    if (!room && !(room === null || room === void 0 ? void 0 : room.infBoard))
                        return;
                    if (room.infBoard.playerX === decoded.user ||
                        room.infBoard.playerO === decoded.user) {
                        if (room.infBoard.playerX === decoded.user) {
                            room.infBoard.playerX = null;
                        }
                        else if (room.infBoard.playerO === decoded.user) {
                            room.infBoard.playerO = null;
                        }
                        allrooms(socket);
                    }
                    const index = room.peopleInRoom.findIndex((element) => element.socketId === socket.id);
                    room.peopleInRoom.splice(index, 1);
                    socket.leave(boardId);
                    io.to(boardId).emit(config_1.EventSocket.USER_JOIN, room.peopleInRoom);
                    if (room)
                        io.to(boardId).emit(config_1.EventSocket.GET_INFO_BOARD, room.infBoard);
                    if (room.size === 0 && room.messages) {
                        const chat = {
                            roomId: boardId,
                            messages: room.messages,
                        };
                        try {
                            Chat_model_1.default.create(chat, (err) => {
                                if (err) {
                                    console.log("err", err);
                                }
                                else {
                                }
                            });
                        }
                        catch (error) {
                            console.log("error", error);
                        }
                    }
                }
            });
        });
        //Check room have password or not
        socket.on(config_1.EventSocket.JOIN_BOARD, ({ boardID }, callbackFn) => {
            let room = io.sockets.adapter.rooms.get(boardID).infBoard;
            if (!room) {
                return callbackFn(null);
            }
            ;
            callbackFn(room.hasPassword);
        });
        socket.on(config_1.EventSocket.DISCONNECTING, () => {
            const roomId = getLastValue(socket.rooms);
            const room = io.sockets.adapter.rooms.get(roomId);
            const user = User_1.getUser(socket.id);
            if ((room === null || room === void 0 ? void 0 : room.infBoard) && roomId !== "1") {
                if (room.infBoard.playerX === user.name) {
                    room.infBoard.playerX = null;
                }
                else if (room.infBoard.playerO === user.name) {
                    room.infBoard.playerO = null;
                }
                //get user in room and call
                //io.to(roomId).emit(EventSocket.USER_JOIN,)
                const index = room.peopleInRoom.findIndex((element) => element.socketId === socket.id);
                room.peopleInRoom.splice(index, 1);
                socket.leave(roomId);
                io.to(roomId).emit(config_1.EventSocket.USER_JOIN, room.peopleInRoom);
                io.to(roomId).emit(config_1.EventSocket.GET_INFO_BOARD, room.infBoard);
                allrooms(socket);
            }
        });
        socket.on(config_1.EventSocket.DISCONNECT, () => {
            const user = User_1.removeUser(socket.id);
            if (user) {
                const users = User_1.userInRoom(user.room);
                io.to(user.room).emit(config_1.EventSocket.ROOM_DATA, {
                    room: user.room,
                    users,
                });
            }
        });
    });
    //emit all room data
    const allrooms = (socket) => {
        const rooms = io.sockets.adapter.rooms;
        const resRooms = [];
        rooms.forEach((element) => {
            if (element.infBoard) {
                resRooms.push(element.infBoard);
            }
        });
        io.sockets.emit(config_1.EventSocket.ALLROOMS, { resRooms });
    };
}
exports.default = default_1;
const getLastValue = (set) => {
    let value;
    for (value of set)
        ;
    return value;
};
//# sourceMappingURL=index.js.map
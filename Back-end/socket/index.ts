import { getAllUsers, addUser, getUser, removeUser, userInRoom } from "./User";
import jwt from "jsonwebtoken";
import config from "../config";
import checkWin from "./helper";
import RoomModel, { Room } from "../models/Room.model";
import ChatModel from "../models/Chat.model";

const primaryKey = config.PRIMARYKEY;

type Location = {
  x: number;
  y: number;
};

type CurrentBoardPlay = {
  boardID: string; // roomID
  playerX: string; // store userID or username
  playerO: string;
  board: number[];
  turn: number;
  i: number;
  winner: number;
};

export default function (io) {
  io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      try {
        name &&
          jwt.verify(name, primaryKey, function (err, decoded) {
            if (err) {
              //console.log("err", err);
              // callback(err);
              // return;
            } else {
              name = decoded.user;
            }
          });
        let newUser = {
          id: socket.id,
          name,
          room,
        };

        const user: any = addUser(newUser);
        if (user.error) {
          callback(user.error);
          return;
        }
        //admin chat when someone join room
        // socket.emit("message", {
        //   user: "admin",
        //   text: `${name}, welcome to  room${room}`,
        // });

        // socket.broadcast.to(user.room).emit("message", {
        //   user: "admin",
        //   text: `${name}, has joined!`,
        // });
        socket.join(room);
        const users = getAllUsers;
        io.to(room).emit("roomData", {
          room: user.room,
          users,
        });
      } catch (error) {
        console.log(error);
        callback(error);
      }
    });

    socket.on("sendMess", async ({ roomId, token, message }, callback) => {
      try {
        let user: string = null;
        token &&
          jwt.verify(token, primaryKey, function (err, decoded) {
            if (err) {
              console.log("err", err);
              // callback(err);
              // return;
            } else {
              user = decoded.user;
            }
          });
        const roomH = io.sockets.adapter.rooms.get(`${roomId}`);
        if (roomH && roomH?.messages) {
          roomH.messages.push({ user, message });
        } else {
          roomH.messages = [{ user, message }];
        }
        //console.log("usersssss", users);
        roomH.messages &&
          io.to(roomId).emit("message", { messages: roomH.messages });
        callback();
      } catch (error) {
        console.log("error", error);
      }
    });

    //luc vao phong
    socket.on(
      "onboard",
      ({ boardID, token }: { boardID: string; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            let newUser = {
              id: socket.id,
              name: decoded.user,
              room: "1",
            };

            const user: any = addUser(newUser);

            socket.join(boardID);
            const room = io.sockets.adapter.rooms.get(`${boardID}`);
            if (room.size === 1) {
              const initialValueCurrentBoardPlay: CurrentBoardPlay = {
                boardID,
                playerX: decoded.user,
                playerO: null,
                board: new Array(25 * 25).fill(null),
                turn: 1,
                i: null,
                winner: null,
              };
              io.sockets.adapter.rooms.get(
                `${boardID}`
              ).infBoard = initialValueCurrentBoardPlay;
            }

            io.to(boardID).emit(
              "getInfBoard",
              io.sockets.adapter.rooms.get(`${boardID}`).infBoard
            );
            room?.messages &&
              io.to(boardID).emit("message", { messages: room?.messages });
            const rooms = io.sockets.adapter.rooms;
            allrooms(socket);
          }
        });
      }
    );

    //Luc danh
    socket.on(
      "onplay",
      ({
        infBoard,
        i,
        token,
      }: {
        infBoard: CurrentBoardPlay;
        i: number;
        token: string;
      }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            const roomH = io.sockets.adapter.rooms.get(`${infBoard.boardID}`);
            if (roomH?.history) {
              roomH.history.push(infBoard.board);
            } else {
              roomH.history = [infBoard.board];
            }
            //check win
            const newArr = [];
            const board = [...infBoard.board];
            const x = Math.floor(i / 25);
            const y = i % 25;
            while (board.length) newArr.push(board.splice(0, 25));
            if (checkWin(newArr, x, y, infBoard.turn)) {
              infBoard.winner = infBoard.turn;
              io.to(infBoard.boardID).emit("toastwinner", infBoard);

              const room: any = {
                roomId: infBoard.boardID, // roomID
                playerX: infBoard.playerX, // store userID or username
                playerO: infBoard.playerO,
                board: roomH.history,
                winner: decoded.user,
              };
              try {
                RoomModel.create(room, (err) => {
                  if (err) {
                    console.log("err", err);
                  }
                });
              } catch (error) {
                console.log("error", error);
              }
            }

            //count turn
            infBoard.turn = 1 - infBoard.turn;
            io.to(infBoard.boardID).emit("getInfBoard", infBoard);
            const room = io.sockets.adapter.rooms.get(`${infBoard.boardID}`);
            if (room) room.infBoard = infBoard;
          }
        });
      }
    );

    socket.on("onhome", () => {
      allrooms(socket);
    });

    // Host doi vi tri
    socket.on(
      "joinplayas",
      ({ id, value, token }: { id: string; value: number; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(`${id}`)?.infBoard;
            if (!room) return;
            if (value === 1 && !room.playerX) {
              room.playerX = decoded.user;
              if (room.playerO === decoded.user) {
                room.playerO = null;
              } else {
                room.board = new Array(625).fill(null);
                room.turn = 1;
                room.i = null;
                room.winner = null;
              }
            } else if (value === 0 && !room.playerO) {
              room.playerO = decoded.user;
              if (room.playerX === decoded.user) {
                room.playerX = null;
              } else {
                room.board = new Array(625).fill(null);
                room.turn = 1;
                room.i = null;
                room.winner = null;
              }
            } else {
              if (room.playerX === decoded.user) {
                room.playerX = null;
              } else if (room.playerO === decoded.user) {
                room.playerO = null;
              }
            }

            io.to(id).emit("getInfBoard", room);
            allrooms(socket);
          }
        });
      }
    );
    socket.on(
      "leaveroom",
      ({ boardId, token }: { boardId: string; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(`${boardId}`);
            if (!room && !room?.infBoard) return;

            if (
              room.infBoard.playerX === decoded.user ||
              room.infBoard.playerO === decoded.user
            ) {
              if (room.infBoard.playerX === decoded.user) {
                room.infBoard.playerX = null;
              } else if (room.infBoard.playerO === decoded.user) {
                room.infBoard.playerO = null;
              }
              allrooms(socket);
            }
            socket.leave(boardId);
            if (room) io.to(boardId).emit("getInfBoard", room.infBoard);
            console.log("room.messages", room.messages);
            if (room.size === 0 && room.messages) {
              const chat: any = {
                roomId: boardId, // roomID
                messages: room.messages,
              };
              try {
                ChatModel.create(chat, (err) => {
                  if (err) {
                    console.log("err", err);
                  } else {
                    console.log("chat", chat);
                  }
                });
              } catch (error) {
                console.log("error", error);
              }
            }
          }
        });
      }
    );

    socket.on("disconnecting", () => {
      console.log("socket.rooms", socket.rooms);
      const roomId = getLastValue(socket.rooms);
      const room = io.sockets.adapter.rooms.get(`${roomId}`);
      const user = getUser(socket.id);
      if (room?.infBoard && roomId !== "1") {
        if (room.infBoard.playerX === user.name) {
          room.infBoard.playerX = null;
        } else if (room.infBoard.playerO === user.name) {
          room.infBoard.playerO = null;
        }
        io.to(roomId).emit("getInfBoard", room.infBoard);
        allrooms(socket);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket.rooms", socket.rooms);
      const user = removeUser(socket.id);
      //console.log("disconnect", socket.id);
      if (user) {
        const users = userInRoom(user.room);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users,
        });
        io.to(user.room).emit("message", {
          user: "admin",
          text: `${user.name} has left!!`,
        });
      }
    });
  });

  //emit all room data
  const allrooms = (socket) => {
    const rooms = io.sockets.adapter.rooms;
    const resRooms: CurrentBoardPlay[] = [];
    rooms.forEach((element) => {
      if (element.infBoard) {
        resRooms.push(element.infBoard);
      }
    });
    io.sockets.emit("allrooms", { resRooms });
  };
}

const getLastValue = (set) => {
  let value;
  for (value of set);
  return value;
};

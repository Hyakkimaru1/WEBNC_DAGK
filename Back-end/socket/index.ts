import { getAllUsers, addUser, getUser, removeUser, userInRoom } from "./User";
import jwt from "jsonwebtoken";
import config, { EventSocket } from "../config";
import checkWin from "./helper";
import RoomModel, { Room } from "../models/Room.model";
import ChatModel from "../models/Chat.model";
import BoardModel from "../models/Board.model";

const primaryKey = config.PRIMARYKEY;

type personInRoom = {
  socketId: string;
  user: string;
};

type CurrentBoardPlay = {
  boardID: string; // roomID
  playerX: string; // store userID or username
  playerO: string;
  board: number[];
  turn: number;
  i: number;
  hasPassword?: boolean;
  winner: number;
};

export default function (io) {
  io.on(EventSocket.CONNECTION, (socket) => {
    socket.on(EventSocket.JOIN, ({ name, room }, callback) => {
      try {
        name &&
          jwt.verify(name, primaryKey, function (err, decoded) {
            if (err) {
              console.log("err", err);
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
        //   text: ${name}, welcome to  room${room},
        // });

        // socket.broadcast.to(user.room).emit("message", {
        //   user: "admin",
        //   text: ${name}, has joined!,
        // });
        socket.join(room);
        const users = getAllUsers;
        io.to(room).emit(EventSocket.ROOM_DATA, {
          room: user.room,
          users,
        });
      } catch (error) {
        console.log(error);
        callback(error);
      }
    });

    socket.on(EventSocket.SEND_MESS, ({ roomId, token, message }, callback) => {
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
        const roomH = io.sockets.adapter.rooms.get(roomId);
        if (roomH && roomH?.messages) {
          roomH.messages.push({ user, message });
        } else {
          roomH.messages = [{ user, message }];
        }
        roomH.messages &&
          io.to(roomId).emit(EventSocket.MESSAGE, { messages: roomH.messages });
        callback();
      } catch (error) {
        console.log("error", error);
      }
    });

    //luc vao phong
    socket.on(
      EventSocket.ON_BOARD,
      ({ boardID, token }: { boardID: string; token: string }, callback) => {
        jwt.verify(token, primaryKey, async function (err, decoded) {
          if (err) {
          } else {
            let newUser = {
              id: socket.id,
              name: decoded.user,
              room: "1",
            };

            const user: any = addUser(newUser);

            socket.join(boardID);
            const room = io.sockets.adapter.rooms.get(boardID);

            //declare person with their socketId and user (allow invite or primary chat)
            const person: personInRoom = {
              socketId: socket.id,
              user: decoded.user,
            };

            //check new room
            if (room.size === 1) {
              const doc: any = await BoardModel.findById(boardID);
              if (doc) {
                const initialValueCurrentBoardPlay: CurrentBoardPlay = {
                  boardID,
                  playerX: decoded.user,
                  playerO: null,
                  board: new Array(25 * 25).fill(null),
                  turn: 1,
                  hasPassword: doc.hasPassword,
                  i: null,
                  winner: null,
                };
                io.sockets.adapter.rooms.get(
                  boardID
                ).infBoard = initialValueCurrentBoardPlay;
              } else {
                return callback();
              }
              //add initial array person
              room.peopleInRoom = [person];
            } else {
              //push user to room
              if (room.infBoard.hasPassword) {
                const finduser = room.peopleInRoom.findIndex(
                  (ele: personInRoom) => ele.user === decoded.user
                );
                if (finduser === -1) {
                  return callback(null);
                }
              } else room.peopleInRoom.push(person);
            }

            //toast all users in room know about new user has joined
            io.to(boardID).emit(EventSocket.USER_JOIN, room.peopleInRoom);

            //send inf board for user join room
            io.to(boardID).emit(
              EventSocket.GET_INFO_BOARD,
              io.sockets.adapter.rooms.get(boardID).infBoard
            );

            room?.messages &&
              io
                .to(boardID)
                .emit(EventSocket.MESSAGE, { messages: room?.messages });
            allrooms(socket);
          }
        });
      }
    );

    //vao phong nhanh
    socket.on(EventSocket.QUICK_JOIN, (token: string, callback) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          const rooms = io.sockets.adapter.rooms;
          console.log("rooms", rooms);
          rooms.forEach((value, key) => {
            const board = value.infBoard;
            if (
              board &&
              ((!board?.playerX && board?.playerO) ||
                (board?.playerX && !board?.playerO))
            ) {
              callback(board.boardID);
              return;
            }
          });
          rooms.forEach((value, key) => {
            const board = value.infBoard;

            if (board && (!board?.playerX || !board?.playerO)) {
              callback(board.boardID);
              return;
            }
          });
          callback(null);
        }
      });
    });

    //Luc danh
    socket.on(
      EventSocket.ON_PLAY,
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
            const roomH = io.sockets.adapter.rooms.get(infBoard.boardID);
            if (!roomH) return;
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
              io.to(infBoard.boardID).emit(EventSocket.TOAST_WINNER, infBoard);

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
            infBoard.i = i;
            io.to(infBoard.boardID).emit(EventSocket.GET_INFO_BOARD, infBoard);
            const room = io.sockets.adapter.rooms.get(infBoard.boardID);
            if (room) room.infBoard = infBoard;
          }
        });
      }
    );

    //user connect to home page
    socket.on(EventSocket.ON_HOME, () => {
      allrooms(socket);
    });

    // Host doi vi tri
    socket.on(
      EventSocket.JOIN_PLAY_AS,
      ({ id, value, token }: { id: string; value: number; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(id)?.infBoard;

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

            io.to(id).emit(EventSocket.GET_INFO_BOARD, room);
            allrooms(socket);
          }
        });
      }
    );

    //user leave room
    socket.on(
      EventSocket.LEAVE_ROOM,
      ({ boardId, token }: { boardId: string; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(boardId);
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

            const index = room.peopleInRoom.findIndex(
              (element: personInRoom) => element.socketId === socket.id
            );
            room.peopleInRoom.splice(index, 1);

            socket.leave(boardId);

            io.to(boardId).emit(EventSocket.USER_JOIN, room.peopleInRoom);

            if (room)
              io.to(boardId).emit(EventSocket.GET_INFO_BOARD, room.infBoard);
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

    //Check room have password or not
    socket.on(
      EventSocket.JOIN_BOARD,
      ({ boardID }: { boardID: string }, callbackFn) => {
        let room = io.sockets.adapter.rooms.get(boardID).infBoard;
        if (!room) {
          return callbackFn(null);
        }
        callbackFn(room.hasPassword);
      }
    );

    socket.on(EventSocket.DISCONNECTING, () => {
      const roomId = getLastValue(socket.rooms);
      const room = io.sockets.adapter.rooms.get(roomId);
      const user = getUser(socket.id);
      if (room?.infBoard && roomId !== "1") {
        if (room.infBoard.playerX === user.name) {
          room.infBoard.playerX = null;
        } else if (room.infBoard.playerO === user.name) {
          room.infBoard.playerO = null;
        }
        //get user in room and call
        //io.to(roomId).emit(EventSocket.USER_JOIN,)
        const index = room.peopleInRoom.findIndex(
          (element: personInRoom) => element.socketId === socket.id
        );
        room.peopleInRoom.splice(index, 1);

        socket.leave(roomId);

        io.to(roomId).emit(EventSocket.USER_JOIN, room.peopleInRoom);

        io.to(roomId).emit(EventSocket.GET_INFO_BOARD, room.infBoard);
        allrooms(socket);
      }
    });

    socket.on(EventSocket.DISCONNECT, () => {
      const user = removeUser(socket.id);
      if (user) {
        const users = userInRoom(user.room);

        io.to(user.room).emit(EventSocket.ROOM_DATA, {
          room: user.room,
          users,
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
    io.sockets.emit(EventSocket.ALLROOMS, { resRooms });
  };
}

const getLastValue = (set) => {
  let value;
  for (value of set);
  return value;
};

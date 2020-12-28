import jwt from "jsonwebtoken";
import config, { EventSocket } from "../config";
import BoardModel from "../models/Board.model";
import ChatModel from "../models/Chat.model";
import RoomModel from "../models/Room.model";
import UserModel from "../models/User.model";
import checkWin from "./helper";
import {
  addUser,
  getAllUsers,
  getUser,
  removeUser,
  updateUser,
  userInRoom,
} from "./User";

const primaryKey = config.PRIMARYKEY;

type personInRoom = {
  socketId: string;
  user: string;
};
type User = {
  name: string;
  avatar: string;
  cups: number;
  wins: number;
};
type CurrentBoardPlay = {
  boardID: string; // roomID
  playerX: User; // store userID or username
  playerO: User;
  xReady: boolean;
  oReady: boolean;
  isReady: boolean;
  board: number[];
  turn: number;
  i: number;
  hasPassword?: boolean;
  winner: number;
};

type time = {
  timeX?: number;
  timeO?: number;
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
          room: "1",
        };

        const user: any = addUser(newUser);
        if (user?.error) {
          callback(user.error);
          updateUser(newUser);
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
        socket.join("1");
        const users = getAllUsers;
        io.to("1").emit(EventSocket.ROOM_DATA, {
          room: "1",
          users,
        });
        // console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
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
            try {
              let newUser = await {
                id: socket.id,
                name: decoded.user,
                room: boardID,
              };
              updateUser(newUser);

              socket.join(boardID);
              const room = io.sockets.adapter.rooms.get(boardID);

              //declare person with their socketId and user (allow invite or primary chat)
              const person: personInRoom = {
                socketId: socket.id,
                user: decoded.user,
              };

              //get user info and create user, add to board info
              const player: User = await getUserInfo(decoded._id);
              //check new room
              if (room.size === 1) {
                const doc: any = await BoardModel.findById(boardID);
                if (doc) {
                  const initialValueCurrentBoardPlay: CurrentBoardPlay = {
                    boardID,
                    playerX: player,
                    playerO: null,
                    xReady: false,
                    oReady: false,
                    isReady: false,
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
              console.log("room", room);

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
            } catch (error) {
              console.log("error", error);
            }
          }
        });
      }
    );

    //luc ready
    socket.on(EventSocket.READY, ({ roomId, token }, callback) => {
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
        const room = io.sockets.adapter.rooms.get(roomId).infBoard;
        if (room.playerX.name === user) {
          room.xReady = !room.xReady;
        } else {
          room.oReady = !room.oReady;
        }
        if (room.oReady && room.xReady) {
          room.isReady = true;
          io.to(roomId).emit(EventSocket.START, { messages: "start" });
          /*
          const r = io.sockets.adapter.rooms.get(roomId);
          let t = 10;
          const time = {
            timeX: t,
            timeO: t,
          };
          r.time.timeX = t;
          r.time.timeO = t;
          r.timer = setInterval(() => {
            r.time.timeX -= 1;
            console.log("r.time.timeX", r.time.timeX);
            if (r.time.timeX === 0) {
              room.winner = 0;
              io.to(roomId).emit(EventSocket.TOAST_WINNER, room);

              clearInterval(r.timer);
            }
          }, 1000); */
        }
        io.to(roomId).emit(EventSocket.GET_INFO_BOARD, room);
      } catch (error) {
        console.log("error", error);
      }
    });

    //vao phong nhanh
    socket.on(EventSocket.QUICK_JOIN, (token: string, callback) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          const rooms = io.sockets.adapter.rooms;
          const player: User = await getUserInfo(decoded._id);

          rooms.forEach((value, key) => {
            const board = value.infBoard;
            if (
              board &&
              !board.hasPassword &&
              ((!board?.playerX && board?.playerO) ||
                (board?.playerX && !board?.playerO))
            ) {
              if (!board?.playerX && board?.playerO) {
                board.playerX = player;
              } else {
                board.playerO = player;
              }
              callback(board.boardID);
              return;
            }
          });
          rooms.forEach((value, key) => {
            const board = value.infBoard;

            if (
              board &&
              !board.hasPassword &&
              (!board?.playerX || !board?.playerO)
            ) {
              board.playerX = player;
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
        jwt.verify(token, primaryKey, async function (err, decoded) {
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
              try {
                const room: any = {
                  roomId: infBoard.boardID, // roomID
                  playerX: infBoard.playerX, // store userID or username
                  playerO: infBoard.playerO,
                  board: roomH.history,
                  winner: decoded.user,
                  startChat: 1,
                  endChat: 10,
                };

                //xu ly cong diem luc thang
                let winner, loser;
                if (infBoard.playerX.name === decoded.user) {
                  winner = infBoard.playerX;
                  loser = infBoard.playerO;
                } else {
                  winner = infBoard.playerO;
                  loser = infBoard.playerX;
                }
                const wRank = Math.floor(winner.cups / 100);
                const lRank = Math.floor(loser.cups / 100);
                let point = 1;
                if (wRank < lRank) {
                  point += wRank - lRank;
                }
                winner.cups += point;
                winner.wins += 1;
                loser.cups -= point;
                loser.wins -= 1;
                const updateUserWin = await UserModel.findByIdAndUpdate(
                  decoded._id,
                  { $inc: { wins: 1, cups: point } }
                );
                const updateUserLose = await UserModel.findOneAndUpdate(
                  {
                    user: loser.name,
                    cups: { $gt: 0 },
                  },
                  { $inc: { cups: -point } }
                );

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
        jwt.verify(token, primaryKey, async function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(id)?.infBoard;
            const player: User = await getUserInfo(decoded._id);

            if (!room) return;
            if (value === 1 && !room.playerX) {
              room.playerX = player;
              if (room.playerO?.name === decoded.user) {
                room.playerO = null;
              } else {
                room.board = new Array(625).fill(null);
                room.turn = 1;
                room.i = null;
                room.winner = null;
              }
            } else if (value === 0 && !room.playerO) {
              room.playerO = player;
              if (room.playerX?.name === decoded.user) {
                room.playerX = null;
              } else {
                room.board = new Array(625).fill(null);
                room.turn = 1;
                room.i = null;
                room.winner = null;
              }
            } else {
              if (room.playerX?.name === decoded.user) {
                room.playerX = null;
              } else if (room.playerO?.name === decoded.user) {
                room.playerO = null;
              }
              room.xReady = false;
              room.oReady = false;
              room.isReady = false;
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

            let newUser = {
              id: socket.id,
              name: decoded.user,
              room: "1",
            };
            updateUser(newUser);
            if (
              room.infBoard.playerX?.name === decoded.user ||
              room.infBoard.playerO?.name === decoded.user
            ) {
              if (room.infBoard.playerX?.name === decoded.user) {
                room.infBoard.playerX = null;
              } else if (room.infBoard.playerO?.name === decoded.user) {
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
        try {
          let room = io.sockets.adapter.rooms.get(boardID).infBoard;
          if (!room) {
            return callbackFn(null);
          }
          callbackFn(room.hasPassword);
        } catch (error) {
          console.log("error", error);
        }
      }
    );

    socket.on(EventSocket.DISCONNECTING, () => {
      try {
        const roomId = getLastValue(socket.rooms);
        const room = io.sockets.adapter.rooms.get(roomId);
        const user = getUser(socket.id);
        if (room?.infBoard && roomId !== "1") {
          if (room.infBoard.playerX?.name === user.name) {
            room.infBoard.playerX = null;
          } else if (room.infBoard.playerO?.name === user.name) {
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
      } catch (error) {
        console.log("error", error);
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

    //get cups and wins
    socket.on(EventSocket.QUICK_JOIN, (token: string, callback) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          const rooms = io.sockets.adapter.rooms;
          const player: User = await getUserInfo(decoded._id);

          rooms.forEach((value, key) => {
            const board = value.infBoard;
            if (
              board &&
              !board.hasPassword &&
              ((!board?.playerX && board?.playerO) ||
                (board?.playerX && !board?.playerO))
            ) {
              if (!board?.playerX && board?.playerO) {
                board.playerX = player;
              } else {
                board.playerO = player;
              }
              callback(board.boardID);
              return;
            }
          });
          rooms.forEach((value, key) => {
            const board = value.infBoard;

            if (
              board &&
              !board.hasPassword &&
              (!board?.playerX || !board?.playerO)
            ) {
              board.playerX = player;
              callback(board.boardID);
              return;
            }
          });
          callback(null);
        }
      });
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

const getUserInfo = async (id) => {
  const userInfo = await UserModel.findById(id);
  const host: User = {
    name: userInfo.user,
    avatar: userInfo.avatar,
    cups: userInfo.cups || 0,
    wins: userInfo.wins || 0,
  };
  return host;
};

const getLastValue = (set) => {
  let value;
  for (value of set);
  return value;
};

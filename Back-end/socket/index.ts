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
  getUserByName,
} from "./User";

const primaryKey = config.PRIMARYKEY;

type personInRoom = {
  socketId: number;
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
  time?: number;
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
          jwt.verify(name, primaryKey, async function (err, decoded) {
            if (err) {
              console.log("err", err);
              // callback(err);
              // return;
            } else {
              const name = await decoded.user;
              const allRoom = io.sockets.adapter.rooms;
              allRoom.forEach((room, index) => {
                const info = room.infBoard;
                if (
                  info &&
                  (info.playerX?.name === name || info.playerO?.name === name)
                ) {
                  callback(info.boardID);
                }
              });

              let newUser = await {
                id: socket.id,
                avatar: decoded.avatar,
                name: decoded.user,
                room: "1",
              };
              const user: any = addUser(newUser);
              if (user?.err) {
                updateUser(newUser);
              }
              socket.join("1");
              const users = getAllUsers;
              io.to("1").emit(EventSocket.ROOM_DATA, {
                room: "1",
                users,
              });
            }
          });
      } catch (error) {
        console.log(error);
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

    //danh sach user o phong cho
    socket.on(EventSocket.WAITINGROOM, (callback) => {
      try {
        // io.to(roomId).emit(EventSocket.MESSAGE, { messages: roomH.messages });
        callback(userInRoom("1"));
      } catch (error) {
        console.log("error", error);
      }
    });

    //Chap nhan loi moi
    socket.on(
      EventSocket.ACCEPT_INVITE,
      (
        {
          token,
          roomId,
        }: {
          token: string;
          roomId: string;
        },
        callback
      ) => {
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
          const room = io.sockets.adapter.rooms.get(roomId);
          const person: personInRoom = {
            socketId: 1,
            user,
          };

          //push user to room
          room.peopleInRoom.push(person);
          callback(1);
        } catch (error) {
          console.log("error", error);
        }
      }
    );

    //Thong bao loi moi toi nguoi choi
    socket.on(
      EventSocket.INVITE,
      ({
        id,
        invitor,
        roomId,
      }: {
        id: string;
        invitor: string;
        roomId: string;
      }) => {
        try {
          io.to(id).emit(EventSocket.SHOW_INVITE, {
            invitor,
            roomId,
          });
          //console.log("id,invitor", id, invitor);
        } catch (error) {
          console.log("error", error);
        }
      }
    );

    //luc vao phong
    socket.on(
      EventSocket.ON_BOARD,
      ({ boardID, token }: { boardID: string; token: string }, callback) => {
        jwt.verify(token, primaryKey, async function (err, decoded) {
          if (err) {
          } else {
            try {
              const name = decoded.user;

              let newUser = {
                id: socket.id,
                avatar: decoded.avatar,
                name,
                room: boardID,
              };
              updateUser(newUser);
              socket.join(boardID);
              const room = io.sockets.adapter.rooms.get(boardID);
              //declare person with their socketId and user (allow invite or primary chat)
              const person: personInRoom = {
                socketId: 1,
                user: name,
              };

              //get user info and create user, add to board info
              const player: User = await getUserInfo(decoded._id);
              //check new room
              if (!room.userLeft) {
                room.userLeft = [];
              }
              const index = room.userLeft.indexOf(name);
              if (index > -1) {
                room.userLeft.splice(index, 1);
                const idx = room.peopleInRoom.findIndex(
                  (elm: personInRoom) => elm.user === name
                );
                if (idx !== -1) {
                  if (room.peopleInRoom[idx].socketId === 1) {
                  }
                  // room.peopleInRoom.splice(idx, 1);
                  else {
                    room.peopleInRoom[idx].socketId--;
                  }
                } else if (room.infBoard.hasPassword) {
                  room.peopleInRoom.push(person);
                }
              }

              if (room.size === 1) {
                const doc: any = await BoardModel.findById(boardID);
                if (doc) {
                  initBoard(doc, player, null, room);
                } else {
                  return callback(null);
                }

                //add initial array person
                room.peopleInRoom = [person];
              } else {
                if (
                  room.size >= 2 &&
                  room.infBoard.playerO?.name !== name &&
                  room.infBoard.playerX?.name !== name
                ) {
                  if (!room.infBoard.playerO) room.infBoard.playerO = player;
                  else if (!room.infBoard.playerX)
                    room.infBoard.playerX = player;
                }
                //push user to room
                const finduser = room.peopleInRoom.findIndex(
                  (ele: personInRoom) => ele.user === name
                );
                if (room.infBoard.hasPassword) {
                  if (finduser === -1) {
                    return callback(null);
                  }
                } else {
                  if (finduser === -1) room.peopleInRoom.push(person);
                  else {
                    room.peopleInRoom[finduser].finduser++;
                  }
                }
              }
              callback(room.time);
              //toast all users in room know about new user has joined
              io.to(boardID).emit(EventSocket.USER_JOIN, room.peopleInRoom);
              //send inf board for user join room
              io.to(boardID).emit(EventSocket.GET_INFO_BOARD, room.infBoard);
              socket.broadcast.emit("userjoinroom", {
                user: name,
                room: boardID,
              });
              room?.messages &&
                io
                  .to(boardID)
                  .emit(EventSocket.MESSAGE, { messages: room?.messages });
              allrooms(socket);
              // console.log("getAllUsers", getAllUsers);
            } catch (error) {
              console.log("error", error);
            }
          }
        });
      }
    );

    const initBoard = (doc, player, player2, room) => {
      const initialValueCurrentBoardPlay: CurrentBoardPlay = {
        boardID: doc._id,
        time: doc.time,
        playerX: player,
        playerO: player2,
        xReady: false,
        oReady: false,
        isReady: false,
        board: new Array(25 * 25).fill(null),
        turn: 1,
        hasPassword: doc.hasPassword,
        i: null,
        winner: null,
      };
      const time = {
        timeX: doc.time,
        timeO: doc.time,
      };
      room.messages = [];
      room.peopleInRoom = [];
      room.time = time;
      room.infBoard = initialValueCurrentBoardPlay;
    };

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
        if (room.playerX?.name === user) {
          room.xReady = true;
          room.winner = null;
        } else {
          room.oReady = true;
          room.winner = null;
        }
        if (room.oReady && room.xReady) {
          room.isReady = true;
          room.board = new Array(25 * 25).fill(null);
          room.turn = 1;
          room.i = null;
          io.to(roomId).emit(EventSocket.GET_INFO_BOARD, room);
          const r = io.sockets.adapter.rooms.get(roomId);
          const time = {
            timeX: room.time,
            timeO: room.time,
          };
          const chatHistory = {
            startChat: r.messages.length,
            endChat: null,
          };
          r.chatHistory = chatHistory;
          r.time = time;
          io.to(roomId).emit(EventSocket.START, { message: "start" });
          io.to(roomId).emit(EventSocket.UPDATE_TIME, time);
          setTimer(roomId);
        }
        io.to(roomId).emit(EventSocket.GET_INFO_BOARD, room);
      } catch (error) {
        console.log("error", error);
      }
    });

    // count time, setInterval
    const setTimer = (roomId) => {
      const r = io.sockets.adapter.rooms.get(roomId);
      r.timer = setInterval(() => {
        if (r.infBoard.turn) {
          r.time.timeX -= 1;
        } else {
          r.time.timeO -= 1;
        }
        let time = r.infBoard.turn ? r.time.timeX : r.time.timeO;
        //console.log("r.time", r.time);
        //console.log(r.infBoard.turn ? "X" : "O", time);
        if (r.infBoard.winner || !r.infBoard.isReady) {
          clearInterval(r.timer);
          return;
        }

        io.to(roomId).emit(EventSocket.UPDATE_TIME, r.time);
        if (time === 0) {
          r.infBoard.winner = 1 - r.infBoard.turn;
          r.infBoard.xReady = false;
          r.infBoard.oReady = false;
          r.infBoard.isReady = false;
          saveOnWin(r.infBoard);
          io.to(r.infBoard.boardID).emit(EventSocket.TOAST_WINNER, r.infBoard);
          io.to(roomId).emit(EventSocket.GET_INFO_BOARD, r.infBoard);

          clearInterval(r.timer);
        }
      }, 1000);
    };

    //vao phong nhanh
    socket.on(EventSocket.QUICK_JOIN, (token: string, callback) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          try {
            const rooms = io.sockets.adapter.rooms;
            const player: User = await getUserInfo(decoded._id);
            const home = io.sockets.adapter.rooms.get("1");
            let chosenBoard = null;
            let chosenPlayer = null;
            let minDis = 100000;
            if (!home?.quickJoin) {
              home.quickJoin = [player];
              return;
            }

            await Promise.all(home.quickJoin.map((pl, key) => {
              const dis = Math.abs(pl.cups - player.cups);
              if (dis < minDis) {
                minDis = dis;
                chosenPlayer = pl;
              }
            }));
            if (chosenPlayer) {
              const player2 = getUserByName(chosenPlayer.name);
              // const board: any = await createBoard(player);
              const board: any = await BoardModel.create({
                createBy: player.name,
                hasPassword: false,
                password: "",
                time: 300000,
              });
              const roomId = String(board._id);
              callback(roomId);
              socket.join(roomId);
              const room = io.sockets.adapter.rooms.get(roomId);

              initBoard(board, player, player2, room);
              const pl2 = await getUserByName(player2.name);

              const idx = home.quickJoin.findIndex(
                (user: User) => user.name === player2.name
              );
              if (idx !== -1) {
                home.quickJoin.splice(idx, 1);
              }
              setTimeout(() => {
                io.to(pl2.id).emit(EventSocket.QUICK_JOIN_FOUND, roomId);
              }, 500);
              return;
            }
            home.quickJoin.push(player);

            home.qTimeOut = setTimeout(() => {
              rooms.forEach((value, key) => {
                const board = value.infBoard;
                if (
                  board &&
                  !board.hasPassword &&
                  ((!board?.playerX && board?.playerO) ||
                    (board?.playerX && !board?.playerO))
                ) {
                  if (board?.playerX) {
                    const dis = Math.abs(board.playerX.cups - player.cups);
                    if (dis < minDis) {
                      minDis = dis;
                      chosenBoard = board;
                    }
                  } else {
                    const dis = Math.abs(board.playerO.cups - player.cups);
                    if (dis < minDis) {
                      minDis = dis;
                      chosenBoard = board;
                    }
                  }
                }
              });
              if (chosenBoard) {
                if (!chosenBoard?.playerX) {
                  chosenBoard.playerX = player;
                } else {
                  chosenBoard.playerO = player;
                }
                const idx = home.quickJoin.findIndex(
                  (user: User) => user.name === player.name
                );
                if (idx !== -1) {
                  home.quickJoin.splice(idx, 1);
                }
                callback(chosenBoard.boardID);

                return;
              }

              // rooms.forEach((value, key) => {
              //   const board = value.infBoard;

              //   if (
              //     board &&
              //     !board.hasPassword &&
              //     (!board?.playerX || !board?.playerO)
              //   ) {
              //     board.playerX = player;
              //     callback(board.boardID);
              //     return;
              //   }
              // });
              callback(null);
            }, 10000);
          } catch (error) {
            console.log("error", error);
          }
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
              infBoard.isReady = false;
              infBoard.oReady = false;
              infBoard.xReady = false;
              io.to(infBoard.boardID).emit(EventSocket.TOAST_WINNER, infBoard);
              try {
                clearInterval(roomH.timer);
                saveOnWin(infBoard);
              } catch (error) {
                console.log("error", error);
              }
            }
            const room = io.sockets.adapter.rooms.get(infBoard.boardID);
            // console.log("roomH", roomH);
            //count turn

            infBoard.turn = 1 - infBoard.turn;
            infBoard.i = i;
            io.to(infBoard.boardID).emit(EventSocket.GET_INFO_BOARD, infBoard);
            if (room) room.infBoard = infBoard;
          }
        });
      }
    );

    //user connect to home page
    socket.on(EventSocket.ON_HOME, (callback) => {
      allrooms(socket);
      callback(getAllUsers);
    });

    // Hoan doi vi tri
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
            }
            room.xReady = false;
            room.oReady = false;
            room.isReady = false;
            const time = {
              timeX: room.time,
              timeO: room.time,
            };
            io.sockets.adapter.rooms.get(id).time = time;
            io.to(id).emit(EventSocket.UPDATE_TIME, time);
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
        jwt.verify(token, primaryKey, async function (err, decoded) {
          if (err) {
          } else {
            let room = io.sockets.adapter.rooms.get(boardId);
            if (!room && !room?.infBoard) return;
            const name = await decoded.user;
            let newUser = {
              id: socket.id,
              avatar: decoded.avatar,
              name,
              room: "1",
            };
            updateUser(newUser);
            if (
              room.infBoard?.playerX?.name === name ||
              room.infBoard?.playerO?.name === name
            ) {
              if (room.infBoard.isReady && room.infBoard.winner === null) {
                if (room.infBoard.playerX?.name === name) {
                  room.infBoard.winner = room.infBoard.playerO?.name;
                } else if (room.infBoard.playerO?.name === name) {
                  room.infBoard.winner = room.infBoard.playerX?.name;
                }
                saveOnWin(room.infBoard);
              }
              if (room.infBoard.playerX?.name === name) {
                room.infBoard.playerX = null;
              } else if (room.infBoard.playerO?.name === name) {
                room.infBoard.playerO = null;
              }

              room.infBoard.xReady = false;
              room.infBoard.oReady = false;
              room.infBoard.isReady = false;
              allrooms(socket);
            }
            const users = getAllUsers;
            io.to("1").emit(EventSocket.ROOM_DATA, {
              room: "1",
              users,
            });
            const index = room.peopleInRoom.findIndex(
              (element: personInRoom) => element.user === name
            );
            if (index !== -1) {
              room.peopleInRoom.splice(index, 1);
            }
            socket.leave(boardId);

            io.to(boardId).emit(EventSocket.USER_JOIN, room.peopleInRoom);

            if (room)
              io.to(boardId).emit(EventSocket.GET_INFO_BOARD, room.infBoard);
            if (room.size === 0 && room.messages) {
              const chat: any = {
                roomId: boardId, // roomID
                messages: room.messages,
              };
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

    socket.on(EventSocket.DISCONNECTING, async (reason) => {
      try {
        const roomId = getLastValue(socket);
        const room = io.sockets.adapter.rooms.get(roomId);
        const user = await getUser(socket.id);
        if (room?.infBoard && roomId !== "1") {
          room.userLeft.push(user.name);
          //get user in room and call
          //io.to(roomId).emit(EventSocket.USER_JOIN,)
          if (room.infBoard) {
            const userName = user.name;
            const timeout = setTimeout(() => {
              const idx = room.userLeft.findIndex(
                (name: string) => name === userName
              );
              if (idx !== -1) {
                room.userLeft.splice(idx, 1);

                const index = room.peopleInRoom.findIndex(
                  (element: personInRoom) => {
                    return element.user === userName;
                  }
                );
                if (index !== -1) {
                  if (room.peopleInRoom[index].socketId === 1) {
                    room.peopleInRoom.splice(index, 1);
                    if (room.infBoard.playerX?.name === userName) {
                      room.infBoard.playerX = null;
                    } else if (room.infBoard.playerO?.name === userName) {
                      room.infBoard.playerO = null;
                    }
                    const user = removeUser(socket.id);

                    socket.leave(roomId);

                    io.to(roomId).emit(
                      EventSocket.USER_JOIN,
                      room.peopleInRoom
                    );

                    io.to(roomId).emit(
                      EventSocket.GET_INFO_BOARD,
                      room.infBoard
                    );
                    if (room?.infBoard?.history) saveOnWin(room.infBoard);
                    allrooms(socket);
                  } else {
                    room.peopleInRoom[index].socketId--;
                  }
                }
              }
            }, 15000);
          }
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

    // Cancel quick join
    socket.on(EventSocket.QUICK_JOIN_CANCEL, (token: string) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          const home = io.sockets.adapter.rooms.get("1");
          const player: User = await getUserInfo(decoded._id);

          const idx = home.quickJoin.findIndex(
            (user: User) => user.name === player.name
          );
          if (idx !== -1) {
            home.quickJoin.splice(idx, 1);
          }
        }
      });
    });

    socket.on(EventSocket.BAN_USER, (user, token) => {
      jwt.verify(token, primaryKey, async function (err, decoded) {
        if (err) {
        } else {
          socket.broadcast.emit(EventSocket.BAN_USER, user);
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

  //luu khi co nguoi thang
  const saveOnWin = async (infBoard) => {
    try {
      const roomH = io.sockets.adapter.rooms.get(infBoard.boardID);
      var query = { roomId: infBoard.boardID },
        update = {
          roomId: infBoard.boardID, // roomID
          messages: roomH?.messages,
        },
        options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        };

      // Find the document
      ChatModel.findOneAndUpdate(
        query,
        update,
        options,
        function (error, result) {
          if (error) console.log("error", error);

          // do something with the document
        }
      );
      // ChatModel.create(chat, (err) => {
      //   if (err) {
      //     console.log("err", err);
      //   } else {
      //   }
      // });

      const winUser = infBoard.winner
        ? infBoard.playerX?.name
        : infBoard.playerO?.name;
      const room: any = {
        roomId: infBoard.boardID, // roomID
        playerX: infBoard.playerX, // store userID or username
        playerO: infBoard.playerO,
        board: roomH.history,
        winner: winUser,
        startChat: roomH.chatHistory.startChat,
        endChat: roomH.messages.length,
      };

      //xu ly cong diem luc thang
      let winner, loser;
      if (infBoard.playerX.name === winUser) {
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
      loser.cups = loser.cups - point >= 0 ? loser.cups - point : 0;
      const updateUserWin = await UserModel.findOneAndUpdate(
        { user: winner.name },
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
  };
}

const getUserInfo = async (id) => {
  const userInfo = await UserModel.findById(id);
  if (userInfo) {
    const host: User = {
      name: userInfo.user,
      avatar: userInfo.avatar,
      cups: userInfo.cups || 0,
      wins: userInfo.wins || 0,
    };
    return host;
  }
  // make user logout
};

const getLastValue = (socket) => {
  let value;
  for (value of socket.rooms) {
    if (value != socket.id && value != "1") {
      return value;
    }
  }
  return null;
};

const createBoard = async (player) => {
  await BoardModel.create(
    {
      createBy: player.name,
      hasPassword: false,
      password: "",
      time: 300000,
    },
    (err, doc) => {
      if (err) {
        console.log("err", err);

        return null;
      } else {
        console.log("doc", doc);
        return doc;
      }
    }
  );
};

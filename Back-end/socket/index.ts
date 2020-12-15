import { getAllUsers, addUser, getUser, removeUser, userInRoom } from "./User";
import jwt from "jsonwebtoken";
import config from "../config";
import checkWin from "./helper";
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
  winner: number | null;
};

export default function (io) {
  io.on("connection", (socket) => {
    console.log("loggin");
    // console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
    socket.on("join", ({ name, room }, callback) => {
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
        socket.emit("message", {
          user: "admin",
          text: `${name}, welcome to  room${room}`,
        });

        socket.broadcast.to(user.room).emit("message", {
          user: "admin",
          text: `${name}, has joined!`,
        });
        socket.join(room);
        const users = getAllUsers;
        console.log("usersall", users);
        io.to(room).emit("roomData", {
          room: user.room,
          users,
        });
      } catch (error) {
        console.log(error);
        callback(error);
      }
    });

    socket.on("sendMess", async (message, callback) => {
      try {
        const user: any = await getUser(socket.id);
        io.to(user.room).emit("message", { user: user.name, text: message });
        const users = userInRoom(user.room);
        //console.log("usersssss", users);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users,
        });
        callback();
      } catch (error) {
        console.log("error", error);
      }
    });

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
            if (room.size == 1) {
              const initialValueCurrentBoardPlay: CurrentBoardPlay = {
                boardID,
                playerX: decoded.user,
                playerO: "duy1@gmail.com",
                board: new Array(25 * 25).fill(null),
                turn: 1,
                i: null,
                winner: null,
              };
              io.sockets.adapter.rooms.get(
                `${boardID}`
              ).infBoard = initialValueCurrentBoardPlay;
            }
            socket.emit(
              "getInfBoard",
              io.sockets.adapter.rooms.get(`${boardID}`).infBoard
            );
          }
        });
      }
    );

    socket.on(
      "onplay",
      ({ infBoard, token }: { infBoard: CurrentBoardPlay; token: string }) => {
        jwt.verify(token, primaryKey, function (err, decoded) {
          if (err) {
          } else {
            const newArr = [];
            const board = infBoard.board.splice(0);
            const x = Math.floor(infBoard.i / 25);
            const y = infBoard.i % 25;
            while (board.length) newArr.push(board.splice(0, 3));
            if (checkWin(newArr, x, y, infBoard.turn)) {
              infBoard.winner = infBoard.turn;
            }
            infBoard.turn = 1 - infBoard.turn;
            io.to(infBoard.boardID).emit("getInfBoard", infBoard);
            io.sockets.adapter.rooms.get(
              `${infBoard.boardID}`
            ).infBoard = infBoard;
          }
        });
      }
    );

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      console.log("disconnect", user);
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
}

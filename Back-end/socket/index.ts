import { getAllUsers, addUser, getUser, removeUser, userInRoom } from "./User";
import jwt from "jsonwebtoken";
import config from "../config";
const primaryKey = config.PRIMARYKEY;

type Location = {
  x: number;
  y: number;
};

interface CurrentBoardPlay {
  boardID: string; // roomID
  playerX: string; // store userID or username
  playerY: string;
  board?: Location[];
}

export default function (io) {
  io.on("connection", (socket) => {
    console.log("loggin");
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
        //console.log("name,room", name, room);

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
        const users = userInRoom(room);
        //console.log("users", users);
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
            socket.join(boardID);
            const room = io.sockets.adapter.rooms.get(`${boardID}`);
            if (room.size==1){
              const initialValueCurrentBoardPlay:CurrentBoardPlay = {
                boardID,
                playerX:decoded.user,
                playerY:''
              };
              io.sockets.adapter.rooms.get(`${boardID}`).infBoard = initialValueCurrentBoardPlay;
            }
            socket.emit('getInfBoard',io.sockets.adapter.rooms.get(`${boardID}`).infBoard);
          }
        });
      }
    );

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      //console.log("disconnect", user);
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

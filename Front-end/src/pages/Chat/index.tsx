// @flow
// libs
import THEME from "@/constants/Theme";
import { ThemeContext } from "@/contexts/ThemeContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
// others
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../configs/enviroments";
import "./style.scss";

const useStyles = makeStyles((theme) => ({
  chat: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  root: {
    width: "100%",
    maxWidth: 360,
  },
}));
let socket: any;
const Chat = () => {
  const classes = useStyles();
  const { userTheme, theme } = useContext(ThemeContext);
  const themeMUI = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userTheme === THEME.LIGHT ? "light" : "dark",
        },
      }),
    [userTheme]
  );
  const [room, setRoom] = React.useState<string>();
  const [name, setName] = React.useState<string>();
  const [messages, setmessages] = useState<string[]>([]);
  const [message, setmessage] = useState<string>("");
  const [users, setusers] = useState<any>([]);
  useEffect(() => {
    const nameN = localStorage.getItem("token") || "";
    const roomN = "1";
    console.log("object", BASE_URL);
    setName(nameN);
    setRoom(roomN);
    console.log("name,room", nameN, room);
    socket = io(BASE_URL);
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.emit("join", { name, room }, (error: any) =>
      console.log("error", error)
    );

    // return () => {
    //   // socket.emit("disconnect");
    //   socket.off();
    // };
  }, [name]);

  useEffect(() => {
    socket.on("message", (message: any, callback: any) => {
      setmessages([...messages, message]);
    });
    console.table(messages);
  }, [messages]);

  useEffect(() => {
    socket.on("roomData", (message: any, callback: any) => {
      console.table("users", message);
      if (message) setusers(message.users);
    });
    console.table("usersssssssss", users);
  }, [users]);

  const handleChangeVl = (event: any) => {
    setName(event.target.value);
  };

  const sendMessage = (event: any) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMess", message, () => setmessage(""));
    }
  };

  return (
    <div className="chat" style={{ backgroundColor: theme?.formBackGround }}>
      <div className="chat_title" style={{ color: theme?.text }}>
        Các tài khoản đang hoạt động:
      </div>
      <div className="container">
        <div className="container_wrap"></div>
        {/* <input
          value={message}
          onChange={(event) => setmessage(event?.target.value)}
          onKeyPress={(event) =>
            event.key == "Enter" ? sendMessage(event) : null
          }
        ></input> */}
        <ThemeProvider theme={themeMUI}>
          <List
            dense
            style={{ backgroundColor: themeMUI.palette.background.paper }}
            className={classes.root}
          >
            {users.map((user: any, value: any) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem key={value} button>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${value + 1}`}
                      src={`/static/images/avatar/${value + 1}.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    style={{ color: theme?.text }}
                    id={labelId}
                    primary={user.name}
                  />
                </ListItem>
              );
            })}
          </List>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Chat;

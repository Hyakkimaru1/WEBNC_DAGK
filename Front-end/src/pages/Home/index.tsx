// @flow
// libs
import THEME from "@/constants/Theme";
import { ThemeContext } from "@/contexts/ThemeContext";
import { createMuiTheme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
// others
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import socket from "@/configs/socket";
import "./style.scss";
import CurrentUser from "./CurrentUser/index";
import CurrentBoard from "./CurrentBoard/index";
import { UserContext } from "@/contexts/UserContext";
import UserTop from "./UserTop";
import Snow from "@/pages/Top/Snow";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";

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
const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const { userTheme, theme } = useContext(ThemeContext);
  const user: any = useContext(UserContext);
  const [boards, setBoards] = useState([]);
  const themeMUI = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userTheme === THEME.LIGHT ? "light" : "dark",
        },
      }),
    [userTheme]
  );

  const [users, setusers] = useState<any>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.emit("onhome");
    socket.on("allrooms", (data: any) => {
      //setBoard here;
      setBoards(data.resRooms);
    });
    socket.on("roomData", (message: any, callback: any) => {
      if (message) setusers(message.users);
    });

    //Luc duoc moi vao phong
    socket.on(
      "showInvite",
      ({ invitor, roomId }: { roomId: string; invitor: string }) => {
        try {
          toast.info(` ${invitor} 🦄 invites you his room! Click to join.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClick: () => {
              socket.emit("acceptInvite",{roomId,token},(req:any)=>{
                if(req){
                  history.push(ROUTERS.ROOM_PUSH + roomId);
                }
                else {
                  toast.error("SORRY! 😫😩 THE ROOM IS CANCEL")
                }
              });
            },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    );

    return () => {
      socket.off("roomData");
      socket.off("allrooms");
      socket.off("showInvite");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <Snow />
      <div className="home__user">
        <CurrentUser theme={theme} username={user.user} avatar={user.avatar} />
      </div>
      <div className="home__board">
        <div className="home__board--current">
          <CurrentBoard boards={boards} />
        </div>
        <div className="home__board--user">
          <UserTop />
          <div className="chat_title" style={{ color: theme?.text }}>
            Các tài khoản đang hoạt động:
          </div>
          <div className="container">
            <div className="container_wrap"></div>
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
                        // src={`/static/images/avatar/${value + 1}.jpg`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

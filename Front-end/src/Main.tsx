// libs import
import React, { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
// routers
// interceptors
// others
import "./styles/main.scss";
import { doAxiosRequestIntercept } from "./configs/Interceptors";
import ROUTERS from "@/constants/routers";
import Room from "./pages/Room";
import Home from "./pages/Home";
import HistoryFC from "./pages/HistoryFC";
import { THEME } from "@/types/Theme";
import InforUser from "./pages/InforUser/InforUser";
import Top from "./pages/Top";
import { useHistory } from "react-router-dom";
import NotFound from "./pages/NotFound";
import socket from "@/configs/socket";
import { UserContext } from './contexts/UserContext';
import { toast } from 'react-toastify';

const Main: React.FC<{ theme?: THEME }> = ({ theme }) => {
  const history = useHistory();
  const curentUser: any = useContext(UserContext);
  useEffect(() => {
    //user online
    const room = "1";
    const name = localStorage.getItem("token") || "";
    socket.open();
    socket.emit("join", { name, room }, (roomId: string) => {
      if (roomId) {
        history.push(ROUTERS.ROOM_PUSH + roomId);
      }
    });
    socket.on("ban-user",(user:any) => {
      if (user===curentUser.user){
        localStorage.removeItem("token");
        toast.error("YOU HAVE BEEN BAN BY ADMIN 😭");
        history.push(ROUTERS.LOGIN);
      }
    })
    return () => {
      socket.off("ban-user");
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  doAxiosRequestIntercept();
  return (
    <div
      style={{ backgroundColor: theme?.formBackGround }}
      className="main-wrapper"
    >
      <Switch>
        <Route exact path={ROUTERS.HOME}>
          <Home />
          {/* <Chat /> */}
        </Route>
        <Route path={ROUTERS.ROOM}>
          <Room />
        </Route>
        <Route path={ROUTERS.PROFILE}>
          <InforUser />
        </Route>
        <Route path={ROUTERS.HISTORY}>
          <HistoryFC />
        </Route>
        <Route path={ROUTERS.TOP}>
          <Top />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
};

export default Main;

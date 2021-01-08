// libs import
import React, { useEffect } from "react";
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

const Main: React.FC<{ theme?: THEME }> = ({ theme }) => {
  const history = useHistory();
  doAxiosRequestIntercept();
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
    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

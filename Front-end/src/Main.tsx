// libs import
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
// routers
// interceptors
// others
import { store } from "@/configs/Redux/store";
import "./styles/main.scss";
import { doAxiosRequestIntercept } from "./configs/Interceptors";
import ROUTERS from '@/constants/routers';
import Room from "./pages/Room";
import Home from './pages/Home';
import Profile from "./pages/Profile";
import HistoryFC from "./pages/HistoryFC";
import { THEME } from '@/types/Theme';

const Main:React.FC<{theme?:THEME}> = ({theme}) => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div style={{backgroundColor:theme?.formBackGround}} className="main-wrapper">
        <Switch>
          <Route exact path={ROUTERS.HOME}>
             <Home /> 
            {/* <Chat /> */}
          </Route>
          <Route path={ROUTERS.ROOM}>
            <Room />
          </Route>
          <Route path={ROUTERS.PROFILE}>
            <Profile />
          </Route>
          <Route path={ROUTERS.HISTORY}>
            <HistoryFC />
          </Route>
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

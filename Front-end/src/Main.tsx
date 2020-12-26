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
import HistoryFC from "./pages/HistoryFC";
import { THEME } from '@/types/Theme';
import InforUser from "./pages/InforUser/InforUser";
import Top from './pages/Top';
import NotFound from './pages/NotFound';

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
            <InforUser />
          </Route>
          <Route path={ROUTERS.HISTORY}>
            <HistoryFC />
          </Route>
          <Route path={ROUTERS.TOP}>
            <Top />
          </Route>
          <Route>
            <NotFound/>
          </Route>
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

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

const Main = () => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div className="main-wrapper">
        <Switch>
          <Route exact path={ROUTERS.HOME}>
             <Home /> 
            {/* <Chat /> */}
          </Route>
          <Route path={ROUTERS.ROOM}>
            <Room />
          </Route>
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

// libs import
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
// routers
// interceptors
// others
import {store} from "@/configs/Redux/store";
import "./styles/main.scss";
import { doAxiosRequestIntercept } from "./configs/Interceptors";
import Home from "./pages/Home";
import History from "./pages/History/History";
import HistoryDetail from "./pages/History/HistoryDetail";
import User from "./pages/User/User";
import UserDetail from "./pages/User/UserDetail";
import Account from "./pages/Account/Account"


const Main = () => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div className="main-wrapper">
        <Switch>
        <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/history">
            <History/>
          </Route>
          <Route exact path="/user">
            <User/>
          </Route>
          <Route path="/user/detail/:id">
            <UserDetail/>
          </Route>
          <Route path="/user/detail/history/:id">
            <HistoryDetail/>
          </Route>
          <Route exact path="/account">
            <Account/>
          </Route>
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

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
import History from "./pages/History";
import HistoryDetail from "./pages/History/HistoryDetail";
import User from "./pages/User/User";
import UserDetail from "./pages/User/UserDetail";
import Account from "./pages/Account/Account";
import Header from "./pages/Home/Header";

const Main = () => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div className="main-wrapper">
      <Header/>
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
          <Route path="/user/:id">
            <UserDetail/>
          </Route>
          <Route path="/history/:id">
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

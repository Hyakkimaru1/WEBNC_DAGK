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
import UserDetail from "./pages/User/UserDetail";
import Header from "./pages/Home/Header";
import HistoryDetail from "@/pages/History/HistoryDetail";

const Main = () => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div className="main-wrapper">
        <Switch>
          <Route exact path="/">
            <Header />
          </Route>
          <Route path="/history/:id">
            <HistoryDetail/>
          </Route>
          <Route path="/user/:id">
            <UserDetail />
          </Route>
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

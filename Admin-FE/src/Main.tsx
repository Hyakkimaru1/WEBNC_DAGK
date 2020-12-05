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


const Main = () => {
  doAxiosRequestIntercept();
  return (
    <Provider store={store}>
      <div className="main-wrapper">
        <Switch>
          {
            // route here
          }
        </Switch>
      </div>
    </Provider>
  );
};

export default Main;

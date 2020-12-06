// libs
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";
// routers
// others
import Home from "./pages/Home";
import ROUTERS from "./constants/routers";
import Login from './pages/Login/index';
import '@/styles/App.scss'
import Signup from './pages/Signup/index';

// generate app routes

const App = () => (
  <Router>
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <Switch>
          <Route exact path={ROUTERS.HOME}>
            <Home/>
          </Route>
          <Route path={ROUTERS.LOGIN}>
            <Login/>
          </Route>
          <Route path={ROUTERS.SIGNUP}>
            <Signup/>
          </Route>
      </Switch>
    </Suspense>
  </Router>
);

export default App;

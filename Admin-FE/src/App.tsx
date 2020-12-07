// libs
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";
// routers

// others
import Home from "./pages/Home";
import ROUTERS from './constants/routers';
import Login from './pages/Login';
//import '@/styles/App.scss';

// generate app routes

const App = () => (
  <Router>
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path={ROUTERS.LOGIN}>
            <Login/>
          </Route>
      </Switch>
    </Suspense>
  </Router>
);

export default App;

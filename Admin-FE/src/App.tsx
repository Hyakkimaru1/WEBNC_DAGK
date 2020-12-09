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
import Signup from './pages/Signup';
import '@/styles/App.scss';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// generate app routes

const App = () => (
  <Router>
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <ToastContainer/>
      <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path={ROUTERS.LOGIN}>
            <Login/>
          </Route>
          <Route exact path={ROUTERS.SIGNUP}>
            <Signup/>
          </Route>
      </Switch>
    </Suspense>
  </Router>
);

export default App;

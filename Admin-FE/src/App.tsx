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
import '@/styles/App.scss';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./contexts/UserContext";
import Main from "./Main";

// generate app routes

const App = () => (
  <Router>
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <ToastContainer/>
      <Switch>
          <Route exact path={ROUTERS.LOGIN}>
            <Login/>
          </Route>
          <UserProvider>
                <Main/>
          </UserProvider>
      </Switch>
    </Suspense>
  </Router>
);

export default App;

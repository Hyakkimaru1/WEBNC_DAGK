// libs
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";
// routers
// others
import ROUTERS from "./constants/routers";
import Login from "./pages/Login/index";
import "@/styles/App.scss";
import Signup from "./pages/Signup/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import ToggleLayOut from "./components/ToggleLayOut/index";
import Main from './Main';
import { UserProvider } from './contexts/UserContext';

// generate app routes

const App = () => (
  <Router>
    <ToastContainer />
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <ThemeProvider>
        <ToggleLayOut>
          <Switch>
            <Route path={ROUTERS.LOGIN}>
              <Login />
            </Route>
            <Route path={ROUTERS.SIGNUP}>
              <Signup />
            </Route>
            <UserProvider>
                <Main/>
            </UserProvider>
          </Switch>
        </ToggleLayOut>
      </ThemeProvider>
    </Suspense>
  </Router>
);

export default App;

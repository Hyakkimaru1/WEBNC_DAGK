// libs
import React, { Suspense, useContext } from "react";
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
import ToggleLayOut from "./components/ToggleLayOut/index";
import Main from "./Main";
import { UserProvider } from "./contexts/UserContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import THEME from "@/constants/Theme";

// generate app routes

const App = () => {
  const { userTheme } = useContext(ThemeContext);


  const themeMUI = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userTheme === THEME.LIGHT ? "light" : "dark",
        },
      }),
    [userTheme]
  );
  return (
    <Router>
      <ToastContainer />
      <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
        <ToggleLayOut>
          <ThemeProvider theme={themeMUI}>
            <Switch>
              <Route path={ROUTERS.LOGIN}>
                <Login />
              </Route>
              <Route path={ROUTERS.SIGNUP}>
                <Signup />
              </Route>
              <UserProvider>
                <Main />
              </UserProvider>
            </Switch>
          </ThemeProvider>
        </ToggleLayOut>
      </Suspense>
    </Router>
  );
};

export default App;

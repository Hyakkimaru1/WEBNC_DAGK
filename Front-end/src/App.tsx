// libs
import React, { Suspense, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";
// routers
// others
import ROUTERS from "./constants/routers";
import Login from "./pages/Login";
import "@/styles/App.scss";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleLayOut from "./components/ToggleLayOut";
import Main from "./Main";
import { UserProvider } from "./contexts/UserContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import THEME from "@/constants/Theme";
import ForgotPassword from "./pages/ForgotPassword";
import { Provider } from "react-redux";
import { store } from "@/configs/Redux/store";
import ResetPassword from "./pages/ResetPassword";

// generate app routes

const App = () => {
  const { userTheme, theme } = useContext(ThemeContext);

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

      <Provider store={store}>
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
                <Route path={ROUTERS.FORGET_PASSWORD}>
                  <ForgotPassword />
                </Route>
                <Route
                  path={`${ROUTERS.RESET_PASSWORD}/:token`}
                  children={<ResetPassword />}
                />
                <UserProvider>
                  <Main theme={theme} />
                </UserProvider>
              </Switch>
            </ThemeProvider>
          </ToggleLayOut>
        </Suspense>
      </Provider>
    </Router>
  );
};

export default App;

// libs
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// components import
import ProcessingLoader from "@/components/ProcessingLoader";
// routers
// others
import Home from "./pages/Home";

// generate app routes

const App = () => (
  <Router>
    <Suspense fallback={<ProcessingLoader message="Suspense fallback" />}>
      <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
      </Switch>
    </Suspense>
  </Router>
);

export default App;

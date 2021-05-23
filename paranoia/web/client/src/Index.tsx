import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Create from "./pages/Create";
import Intro from "./pages/Intro";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/join">Not implemented</Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/">
          <Intro />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
ReactDOM.render(<App />, document.getElementById("react-app"));

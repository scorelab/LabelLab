import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./dashboard/index";
import Logout from "./logout/index";
import Login from "./login/index";
import PrivateRoute from "../utils/pR";
import Navbar from "./navbar/index";

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <BrowserRouter>
        <React.Fragment>
          <PrivateRoute path={`${match.path}/`} component={Navbar} />
          <Switch>
            <PrivateRoute exact path={`${match.path}/`} component={Dashboard} />
            <Route path={`${match.path}/logout`} component={Logout} />
            <Route path={`${match.path}/login`} component={Login} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;

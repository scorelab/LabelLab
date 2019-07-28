import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./dashboard/index";
import Logout from "./logout/index";
import Login from "./login/index";
import PrivateRoute from "../utils/pR";
import Register from "./register/index";
import Profile from "./profile/index";
import Labeller from "./labeller/index";
import Project from "./project/index";
import Redirect from "./redirect.js";

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path={`${match.path}redirect`} component={Redirect} />
            <Route path={`${match.path}logout`} component={Logout} />
            <Route path={`${match.path}login`} component={Login} />
            <Route path={`${match.path}register`} component={Register} />
            <PrivateRoute exact path={`${match.path}`} component={Dashboard} />
            <PrivateRoute
              exact
              path={`${match.path}profile`}
              component={Profile}
            />
            <PrivateRoute
              path={`${match.path}labeller/:projectId/:imageId`}
              component={Labeller}
            />
            <PrivateRoute
              path={`${match.path}project/:projectId`}
              component={Project}
            />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;

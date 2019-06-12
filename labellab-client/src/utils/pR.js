import React from "react";
import { Route, Redirect } from "react-router-dom";
import { hasToken } from "../utils/token";
import { TOKEN_TYPE } from "../constants/index";
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasToken(TOKEN_TYPE) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;

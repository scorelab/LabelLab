import React, { Component } from "react";
import { Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducers from "./reducers/index";
import AppIndex from "./components/index"
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      rootReducers,
      compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    );
  }
  render() {
    const { match } = this.props
    return (
      <Provider store={this.store}>
        <Route path={`${match.path}`} component={AppIndex} />
      </Provider>
    );
  }
}

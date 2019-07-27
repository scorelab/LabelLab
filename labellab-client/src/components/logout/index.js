import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/index";
class Logout extends Component {
  componentDidMount() {
    this.props.logout(this.callback);
  }
  callback = () => {
    this.props.history.push("/login");
  };
  render() {
    return <></>;
  }
}

const mapActionToProps = dispatch => {
  return {
    logout: callback => {
      return dispatch(logout(callback));
    }
  };
};

export default connect(
  null,
  mapActionToProps
)(Logout);

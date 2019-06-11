import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Input, Button } from "semantic-ui-react";
import validateInput from "../../utils/validation";
import { login } from "../../actions/index";
// import "../css/login.css";
import { hasToken } from "../../utils/token";
import { TOKEN_TYPE } from "../../constants/index";

class LoginIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: ""
    };
  }
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.history.push("/");
    }
  }
  onChange = e => {
    const name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
      errors: ""
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let { username, password } = this.state;
    if (username) {
      username = username.trim();
    }
    if (password) {
      password = password.trim();
    }
    const checkPass = validateInput(password, "password");
    if (checkPass.isValid) {
      this.props.login(username, password, this.callback);
    } else {
      this.setState({
        errors: checkPass.errors.password
      });
    }
  };
  callback = () => {
    this.props.history.push("/");
  };
  render() {
    const { username, password, errors } = this.state;
    return (
      <div className="login">
        <div className="loginInput">
          <span className="login-error-text">
            {errors}
          </span>
          <form onSubmit={this.handleSubmit}>
            <Input
              type="text"
              placeholder="Email ID"
              className="loginField"
              name="username"
              value={username}
              onChange={this.onChange}
            />
            <br />
            <Input
              type="password"
              placeholder="Password"
              className="loginField"
              name="password"
              value={password}
              onChange={this.onChange}
            />
            <div className="forgotPassword">
              <Link to="#">Forgot Password?</Link>
            </div>
            <Button content="Login" className="loginSubmit" />
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.login
  };
};

const mapActionToProps = dispatch => {
  return {
    login: (username, password, callback) => {
      return dispatch(login(username, password, callback));
    }
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginIndex);

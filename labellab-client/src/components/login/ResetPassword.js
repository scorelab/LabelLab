import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { verifyResetPasswordToken, updatePassword } from '../../actions/auth'
import { Input, Button } from 'semantic-ui-react'
import { Redirect , Link } from 'react-router-dom'

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email:'',
      password: '',
      updated: false,
      error: true,
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    await this.props.verifyResetPasswordToken(params.user_id,params.token)
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = async (e) => {
    e.preventDefault();
    const { match: { params } } = this.props;
    const { username,  email } = this.props.details;
    const { password } = this.state
    try {
      await this.props.updatePassword(email, username, password, params.token)
      if (this.props.passwordUpdatedMessage === 'password updated') {
        this.setState({
          updated: true,
          error: false,
        });
      } else {
        this.setState({
          updated: false,
          error: true,
        });
      }
    } catch (error) {
        this.setState({
            updated: false,
            error: true,
        });
    }
  };

  render() {
    const {
    password, updated 
    } = this.state;
    const error = this.props.verificationError
    if (error) {
      return (
        <div>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <Button
              as={Link}
              to="/login">
              Login
            </Button>
            <Button
              as={Link}
              to="/forgotpassword">
              Forgot-Password
            </Button>
        </div>
      );
    }else{
    return (
      <div>
        <form className="password-form" onSubmit={this.updatePassword}>
        <Input
            primary
            id="password"
            label="password"
            value={password}
            onChange={this.handleChange('password')}
            placeholder="Password"
            type="password"
          />
          <Button type="submit" > Update Password </Button>
        </form>
        {updated && (
          <div>
            <p>
              Your password has been successfully reset, please try logging in
              again.
            </p>
            <Button
              as={Link}
              to="/login">
              Login
            </Button>
          </div>
        )}
        <Button
            as={Link}
            to="/register">
            Register
        </Button>
      </div>
    );
  }
  }
}

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }),
  verifyResetPasswordToken:PropTypes.func,
  updatePassword:PropTypes.func,
  verifyTokenMessage:PropTypes.string.isRequired,
  passwordUpdatedMessage:PropTypes.string,
  details:PropTypes.object.isRequired,
  verificationError:PropTypes.bool.isRequired
};
 
const mapStateToProps = state => {
   return {
    verifyTokenMessage:state.auth.verifyTokenMessage,
    passwordUpdatedMessage:state.auth.passwordUpdatedMessage,
    details:state.auth.details,
    verificationError:state.auth.verificationError
   }
 }
 
const mapActionToProps = dispatch => {
   return {
       verifyResetPasswordToken: (user_id, token) => {
       return dispatch(verifyResetPasswordToken(user_id, token))
     },
       updatePassword: (email, username, password, resetPasswordToken) => {
        return dispatch(updatePassword(email, username, password, resetPasswordToken))
      },
   }
 }
 
export default connect(
   mapStateToProps,
   mapActionToProps
 )(ResetPassword)
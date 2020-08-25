import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { verifyResetPasswordToken, updatePassword } from '../../actions/auth'
import { Input, Button } from 'semantic-ui-react'
import { Redirect , Link } from 'react-router-dom'
import './css/ResetPassword.css'

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email:'',
      password: '',
      error: true,
      notNullError:false,
      updated:false
    };
  }
F
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
    if(password === ''){
        this.setState({
            notNullError:true
        })
    }else{
    try {
      await this.props.updatePassword(email, username, password, params.token)
        this.setState({
          notNullError:false,
          updated:true
        });
    } catch (error) {
        this.setState({
            notNullError:false,
            updated:true
        });
    }}
  };

  render() {
    const {
    password, updated, notNullError
    } = this.state;
    const error = this.props.verificationError
    const { passwordUpdateError } = this.props
    if (error) {
      return (
        <div className='failureBody'>
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
        <>
        {updated?
        <>
        {
            passwordUpdateError===false?
            <div className='successBody'>
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
            :
            <div className='errorResettingPassword'>
                There was a problem setting your password please send another Password reset link.
            </div>
         }
        </>
        :
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
        {notNullError && (
          <div>
            <p>The password cannot be null.</p>
          </div>
        )}
          <Button type="submit" > Update Password </Button>
        </form>
        }
        </>
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
  verifyTokenMessage:PropTypes.string,
  passwordUpdatedMessage:PropTypes.string,
  details:PropTypes.object.isRequired,
  verificationError:PropTypes.bool,
  passwordUpdateError:PropTypes.bool
};
 
const mapStateToProps = state => {
   return {
    verifyTokenMessage:state.auth.verifyTokenMessage,
    passwordUpdatedMessage:state.auth.passwordUpdatedMessage,
    details:state.auth.details,
    verificationError:state.auth.verificationError,
    passwordUpdateError:state.auth.passwordUpdateError
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
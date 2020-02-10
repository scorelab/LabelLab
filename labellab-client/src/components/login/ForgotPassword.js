import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Input, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { Redirect , Link } from 'react-router-dom'
import { forgotPassword } from '../../actions/auth'


class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  redirect = () =>{
    return <Redirect to='/login'/>
  }

  sendEmail = async (e) => {
    e.preventDefault();
    const { email } = this.state;
    if (email === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
    } else {
     console.log(this.props.emailRecievedMessage)
      try {
        await this.props.forgotPassword(email,this.redirect())
        if (this.props.emailRecievedMessage === 'recovery email sent') {
          this.setState({
            showError: false,
            messageFromServer: 'recovery email sent',
            showNullError: false,
          });
        }else{
          {
            this.setState({
              showError: true,
              messageFromServer: this.props.emailRecievedMessage,
              showNullError: false,
            });
          }
        }
      } catch (error) {
         {
          this.setState({
            showError: true,
            messageFromServer: this.props.emailRecievedMessage,
            showNullError: false,
          });
        }
      }
    }
  };

  render() {
    const {
 email, messageFromServer, showNullError, showError 
} = this.state;

    return (
      <div>
        <form className="profile-form" onSubmit={this.sendEmail}>
          <Input
            primary
            id="email"
            label="email"
            value={email}
            onChange={this.handleChange('email')}
            placeholder="Email Address"
          />
          <Button primary>Send Password Reset Email</Button>
        </form>
        {showNullError && (
          <div>
            <p>The email address cannot be null.</p>
          </div>
        )}
        {showError && (
          <div>
            <p>
              That email address isn&apos;t recognized. Please try again or
              register for a new account.
            </p>
            <Button
              as={Link}
              to="/register"
            >Register
            </Button>
          </div>
        )}
        {messageFromServer === 'recovery email sent' && (
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
        <Button as= {Link} to="/login">Go Home</Button>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
     emailRecievedMessage:PropTypes.string.isRequired,
  }
  
  const mapStateToProps = state => {
    return {
      emailRecievedMessage: state.auth.emailRecievedMessage
    }
  }
  
  const mapActionToProps = dispatch => {
    return {
        forgotPassword: (email, callback) => {
        return dispatch(forgotPassword(email, callback))
      }
    }
  }
  
  export default connect(
    mapStateToProps,
    mapActionToProps
  )(ForgotPassword)
  
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Input, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { Redirect , Link } from 'react-router-dom'
import { forgotPassword } from '../../actions/auth'
import './css/ForgotPassword.css'


class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
      emailRequestSent:false,
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
        emailRequestSent: false
      });
    } else {
      try {
        await this.props.forgotPassword(email,this.redirect())
          this.setState({
            showNullError: false,
            emailRequestSent:true
          });
      } catch (error) {
         {
          this.setState({
            showError: true,
            messageFromServer: this.props.emailRecievedMessage,
            showNullError: false,
            emailRequestSent:true
          });
        }
      }
    }
  };

  render() {
    const {
      email, showNullError, emailRequestSent
      } = this.state;
     const { isEmailSending, emailRecievedMessage } =this.props
    return (
      <div className='mainBody'>
      { isEmailSending?
       <div>
         Sending...
       </div>
       :
      <>
      {emailRequestSent?
      <>
        {emailRecievedMessage==='recovery email sent'?
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
          :
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
        }
      </>
      :
      <>
       <form className="profile-form" onSubmit={this.sendEmail} className='emailForm'>
          <Input
            primary
            id="email"
            value={email}
            onChange={this.handleChange('email')}
            placeholder="Email Address"
          />
          <span className='sendMail'>
          <Button primary>Send Email</Button>
          </span>
        </form>
        {showNullError && (
          <div>
            <p>The email address cannot be null.</p>
          </div>
        )}
        </>
      }
        <Button as= {Link} to="/login">Go Home</Button>
      </>
      }
      </div>
    );
  }
}

ForgotPassword.propTypes = {
     emailRecievedMessage:PropTypes.string,
     isEmailSending:PropTypes.bool.isRequired
  }
  
  const mapStateToProps = state => {
    return {
      emailRecievedMessage: state.auth.emailRecievedMessage,
      isEmailSending: state.auth.isEmailSending
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

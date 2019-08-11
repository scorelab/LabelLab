import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Message, Button, Form, Icon } from 'semantic-ui-react'
import { userRegister } from '../../actions/index'
import register from './css/register.css'

class RegisterIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      submitted: false
    }
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { name, username, email, password, password2 } = this.state
    const { history, setProfile } = this.props
    this.setState({
      submitted: true
    })
    if (name && username && email && password && password2) {
      if (password === password2) {
        let data = {
          name: name,
          username: username,
          email: email,
          password: password,
          password2: password2
        }
        setProfile(data, () => {
          history.push('/login')
        })
      } else {
        this.setState({
          password2Err: 'Both password are not equal'
        })
      }
    }
  }

  render() {
    const { errField, statusText, isRegistering } = this.props
    const { name, username, email, password, password2, submitted } = this.state
    return (
      <div>
        <Message
          attached
          header="Welcome to our site!"
          content="Fill out the form below to sign-up for a new account"
        />
        <Form onSubmit={this.handleSubmit} className="attached fluid segment">
          <Form.Input
            error={errField === 'name' || (submitted && name === '')}
            onChange={this.onChange}
            fluid
            name="name"
            label="Name"
            placeholder="Name"
            type="text"
          />
          {submitted && !name && (
            <div className="register-error-text">
              Name field cannot be empty
            </div>
          )}
          {statusText && errField === 'name' && (
            <div className={register.errorText}>{statusText}</div>
          )}
          <Form.Input
            error={errField === 'email' || (submitted && email === '')}
            onChange={this.onChange}
            name="email"
            label="Email"
            placeholder="Email"
            type="email"
          />
          {submitted && !email && (
            <div className="register-error-text">
              Email field cannot be empty
            </div>
          )}
          {statusText && errField === 'email' && (
            <div className="register-error-text">{statusText}</div>
          )}
          <Form.Input
            error={errField === 'username' || (submitted && username === '')}
            onChange={this.onChange}
            name="username"
            label="Username"
            placeholder="Username"
            type="text"
          />
          {submitted && !username && (
            <div className="register-error-text">
              Username field cannot be empty
            </div>
          )}
          {statusText && errField === 'username' && (
            <div className="register-error-text">{statusText}</div>
          )}
          <Form.Input
            error={errField === 'password' || (submitted && password === '')}
            onChange={this.onChange}
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />
          {submitted && !password && (
            <div className="register-error-text">
              Password field cannot be empty
            </div>
          )}
          {statusText && errField === 'password' && (
            <div className="register-error-text">{statusText}</div>
          )}
          <Form.Input
            error={errField === 'password2' || (submitted && password2 === '')}
            onChange={this.onChange}
            name="password2"
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
          />
          {submitted && !password2 && (
            <div className="register-error-text">
              Confirm password field cannot be empty
            </div>
          )}
          {submitted && password && password2 && password !== password2 && (
            <div className="register-error-text">
              Both password are not equal!
            </div>
          )}
          {statusText && errField === 'password2' && (
            <div className="register-error-text">{statusText}</div>
          )}
          <Button loading={isRegistering} color="blue">
            Submit
          </Button>
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          Already signed up?&nbsp;<a href="/login">Login here</a>&nbsp;instead.
        </Message>
      </div>
    )
  }
}

RegisterIndex.propTypes = {
  isRegistering: PropTypes.bool,
  statusText: PropTypes.string,
  errField: PropTypes.string,
  history: PropTypes.object,
  setProfile: PropTypes.func
}

const mapStateToProps = state => {
  return {
    isRegistering: state.register.isRegistering,
    statusText: state.register.statusText,
    errField: state.register.errField
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProfile: (data, callback) => {
      dispatch(userRegister(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterIndex)

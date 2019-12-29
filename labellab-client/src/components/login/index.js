import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Input,
  Button,
  Image,
  Divider,
  Header,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import validateInput from '../../utils/validation'
import { login } from '../../actions/index'
import googleIcon from '../../static/icons/search.svg'
import githubIcon from '../../static/icons/github-logo.svg'
import { hasToken } from '../../utils/token'
import { TOKEN_TYPE } from '../../constants/index'
import './css/login.css'

class LoginIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errors: ''
    }
  }
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.history.push('/')
    }
  }
  onChange = e => {
    const name = e.target.name
    let value = e.target.value
    this.setState({
      [name]: value,
      errors: ''
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    let { username, password } = this.state
    if (username) {
      username = username.trim()
    }
    if (password) {
      password = password.trim()
    }
    const checkPass = validateInput(password, 'password')
    if (checkPass.isValid) {
      this.props.login(username, password, this.callback)
    } else {
      this.setState({
        errors: checkPass.errors.password
      })
    }
  }
  callback = () => {
    const { location, history } = this.props
    location &&
    location.state &&
    location.state.from &&
    location.state.from.pathname
      ? history.push(location.state.from.pathname)
      : history.push('/')
  }
  render() {
    const { isAuthenticating } = this.props
    const { username, password, errors } = this.state
    return (
      <div className="login-grand-parent">
        {isAuthenticating ? (
          <Dimmer active>
            <Loader content="Authenticating" />
          </Dimmer>
        ) : null}
        <div className="login-parent">
          <Header as="h2" textAlign="center">
            Login in LabelLab!
          </Header>
          <div className="login-oauth-icon">
            <div>
              <a
                href={
                  process.env.REACT_APP_HOST + ':' +
                  process.env.REACT_APP_SERVER_PORT +
                  `/api/v1/auth/google`
                }
              >
                <Image size="mini" src={googleIcon} />
              </a>
            </div>
            <div>
              <a
                href={
                  process.env.REACT_APP_HOST + ':'+
                  process.env.REACT_APP_SERVER_PORT +
                  `/api/v1/auth/github`
                }
              >
                <Image size="mini" src={githubIcon} />
              </a>
            </div>
          </div>
          <Divider horizontal>Or</Divider>
          <div className="loginInput">
            <span className="login-error-text">{errors}</span>
            <form onSubmit={this.handleSubmit}>
              <Header className="login-form-label" as="h5">
                Email
              </Header>
              <Input
                type="text"
                placeholder="Email ID"
                className="loginField"
                name="username"
                value={username}
                onChange={this.onChange}
              />
              <Header className="login-form-label" as="h5">
                Password
              </Header>
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
              <Button size="medium" content="Login" className="loginSubmit" />
            </form>
          </div>
          <div className="login-create-account">
            Don&apos;t have an account?
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }
}

LoginIndex.propTypes = {
  isAuthenticating: PropTypes.bool,
  login: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = state => {
  return {
    isAuthenticating: state.auth.isAuthenticating
  }
}

const mapActionToProps = dispatch => {
  return {
    login: (username, password, callback) => {
      return dispatch(login(username, password, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginIndex)

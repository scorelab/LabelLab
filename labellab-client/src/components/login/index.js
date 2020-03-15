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
  Loader,
  Message,
  Icon,
  Label,
  Form
} from 'semantic-ui-react'
import { validateForm, isEmail } from '../../utils/helpers'
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
      email: '',
      password: '',
      errors: {
        email: '',
        password: ''
      }
    }
  }

  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.history.push('/')
    }
  }

  handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    let errors = { ...this.state.errors }

    switch (name) {
      case 'email':
        errors.email = value.length
          ? isEmail(value)
            ? ''
            : 'E-mail address is invalid!'
          : 'E-mail address is required!'
        break
      case 'password':
        errors.password = value.length ? '' : 'Password is required!'
        break
      default:
        break
    }

    this.setState({
      [name]: value,
      errors: errors
    })
  }

  handleSubmit = e => {
    const { email, password } = this.state
    e.preventDefault()

    if (validateForm(this.state)) {
      this.props.login(email, password, this.callback)
    } else {
      let errors = { ...this.state.errors }

      errors.password = password.length ? '' : 'Password is required!'
      errors.email = email.length
        ? isEmail(email)
          ? ''
          : 'E-mail address is invalid!'
        : 'E-mail address is required!'

      this.setState({
        errors
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
    const { isAuthenticating, statusText, registerStatusText, authError } = this.props
    const { email, password, errors } = this.state
    return (
      <div className="login-grand-parent">
        {isAuthenticating ? (
          <Dimmer active>
            <Loader content="Authenticating..." />
          </Dimmer>
        ) : null}
        <div className="login-parent">
          <Header as="h2" textAlign="center">
            <Header.Content>
              LabelLab
              <Header.Subheader>Login to your account</Header.Subheader>
            </Header.Content>
          </Header>

          <div className="login-form">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field error={!!errors.email}>
                <label>E-mail address</label>
                <Input
                  type="text"
                  placeholder="E-mail address"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                />
                {errors.email && (
                  <Label pointing color="red">
                    {errors.email}
                  </Label>
                )}
              </Form.Field>

              <Form.Field error={!!errors.password}>
                <label>Password</label>

                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />
                {errors.password && (
                  <Label pointing color="red">
                    {errors.password}
                  </Label>
                )}
              </Form.Field>

              {authError && (
                <Message negative>
                  <Icon name="warning circle" />
                  {statusText}
                </Message>
              )}

              {(!authError && registerStatusText || statusText) && (
                <Message>
                  <Icon name="info circle" />
                  {registerStatusText || statusText}
                </Message>
              )}


              <div className="action">
                <Link to="#">Forgot password?</Link>
              </div>

              <Button primary>Log in</Button>
            </Form>
          </div>

          <div className="action">
            Don&apos;t have an account?&nbsp;
            <Link to="/register">Create an account</Link>
          </div>

          <Divider horizontal>Or</Divider>

          <div className="login-oauth-icon">
            <div className="login-icons">
              <a
                href={
                  process.env.REACT_APP_HOST +
                  process.env.REACT_APP_SERVER_PORT +
                  `/api/v1/auth/google`
                }
              >
                <Image src={googleIcon} />
              </a>
            </div>
            <div className="login-icons">
              <a
                href={
                  process.env.REACT_APP_HOST +
                  process.env.REACT_APP_SERVER_PORT +
                  `/api/v1/auth/github`
                }
              >
                <Image src={githubIcon} />
              </a>
            </div>
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
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText,
    registerStatusText: state.register.statusText,
    authError: state.auth.error
  }
}

const mapActionToProps = dispatch => {
  return {
    login: (email, password, callback) => {
      return dispatch(login(email, password, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginIndex)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
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
  Form,
} from 'semantic-ui-react'
import { validateForm, isEmail } from '../../utils/helpers'
import { login } from '../../actions/index'
import googleIcon from '../../static/icons/search.svg'
import githubIcon from '../../static/icons/github-logo.svg'
import { hasToken } from '../../utils/token'
import { TOKEN_TYPE } from '../../constants/index'
import GoogleContainer from './GoogleOAuth'
import GitHubContainer from './GithubOAuth'
import './css/login.css'

class LoginIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
      },
      showPassword: false,
    }
  }

  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.history.push('/')
    }
  }

  handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    let errors = { ...this.state.errors }

    switch (name) {
      case 'email':
        errors.email = value.length
          ? isEmail(value)
            ? ''
            : t('login.emailInvalid')
          : t('login.emailRequired')
        break
      case 'password':
        errors.password = value.length ? '' : t('login.passwordRequired')
        break
      default:
        break
    }

    this.setState({
      [name]: value,
      errors: errors,
    })
  }

  handleSubmit = (e) => {
    const { email, password } = this.state
    e.preventDefault()

    if (validateForm(this.state)) {
      this.props.login(email, password, this.callback)
    } else {
      let errors = { ...this.state.errors }

      errors.password = password.length ? '' : t('login.passwordRequired')
      errors.email = email.length
        ? isEmail(email)
          ? ''
          : 'E-mail address is invalid!'
        : 'E-mail address is required!'

      this.setState({
        errors,
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

  showPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }

  render() {
    const {
      isAuthenticating,
      statusText,
      registerStatusText,
      authError,
      t,
    } = this.props
    const { email, password, errors } = this.state
    return (
      <div className="login-grand-parent">
        {isAuthenticating ? (
          <Dimmer active>
            <Loader content={t('login.authenticating')} />
          </Dimmer>
        ) : null}
        <div className="login-parent">
          <Header as="h2" textAlign="center">
            <Header.Content>
              LabelLab
              <Header.Subheader>{t('login.title')}</Header.Subheader>
            </Header.Content>
          </Header>

          <div className="login-form">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field error={!!errors.email}>
                <label>{t('login.email')}</label>
                <Input
                  type="text"
                  className="email"
                  placeholder={t('login.email')}
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
                <label>{t('login.password')}</label>

                <Input
                  type={this.state.showPassword ? 'text' : 'password'}
                  placeholder={t('login.password')}
                  className="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  label={
                    <Button
                      type="button"
                      onClick={this.showPassword}
                      className="show-password"
                    >
                      {this.state.showPassword ? (
                        <Icon fitted name="eye slash" />
                      ) : (
                        <Icon fitted name="eye" />
                      )}
                    </Button>
                  }
                  labelPosition="right"
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
              <div className="action">
                <Link to="/forgotpassword">{t('login.forgotPassword')}</Link>
              </div>

              <Button primary>{t('login.loginButton')}</Button>
            </Form>
          </div>

          <div className="action">
            {t('login.noAccount')}&nbsp;
            <Link to="/register">{t('login.createAccount')}</Link>
          </div>

          <Divider horizontal>{t('login.or')}</Divider>

          <div className="login-oauth-icon">
            <GoogleContainer />
            <GitHubContainer />
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
  location: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText,
    registerStatusText: state.register.statusText,
    authError: state.auth.error,
  }
}

const mapActionToProps = (dispatch) => {
  return {
    login: (email, password, callback) => {
      return dispatch(login(email, password, callback))
    },
  }
}

export { LoginIndex }

export default withTranslation()(
  connect(mapStateToProps, mapActionToProps)(LoginIndex)
)

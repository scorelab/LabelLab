import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Message,
  Button,
  Form,
  Icon,
  Header,
  Label,
  Input
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { userRegister } from '../../actions/index'
import register from './css/register.css'
import validateInput from '../../utils/validation'
import { isEmail } from '../../utils/helpers'

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
      const checkPass = validateInput(password, 'password')

      if (checkPass.isValid) {
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
            password2Err: 'Both password are not equal',
            errors: null
          })
        }
      } else {
        this.setState({
          errors: checkPass.errors.password
        })
      }
    }
  }

  render() {
    const { errField, statusText, isRegistering } = this.props
    const {
      name,
      username,
      email,
      password,
      password2,
      submitted,
      errors
    } = this.state

    return (
      <div className="register-parent">
        <Header as="h2" textAlign="center">
          <Header.Content>
            LabelLab
            <Header.Subheader>Create an account</Header.Subheader>
          </Header.Content>
        </Header>

        <Form onSubmit={this.handleSubmit} className="register-form">
          <Form.Field error={errField === 'name' || (submitted && name === '')}>
            <label>Name</label>

            <Input
              onChange={this.onChange}
              fluid
              name="name"
              placeholder="Name"
              type="text"
            />
            {submitted && !name && (
              <Label pointing color="red">
                Name cannot be empty!
              </Label>
            )}
            {statusText && errField === 'name' && (
              <Label pointing color="red">
                {statusText}
              </Label>
            )}
          </Form.Field>

          <Form.Field
            error={
              errField === 'email' ||
              (submitted && (email === '' || !isEmail(email)))
            }
          >
            <label>E-mail address</label>

            <Input
              onChange={this.onChange}
              name="email"
              placeholder="E-mail address"
              type="email"
            />
            {submitted && !email && (
              <Label pointing color="red">
                E-mail address cannot be empty!
              </Label>
            )}
            {submitted && email && !isEmail(email) && (
              <Label pointing color="red">
                E-mail address is invalid!
              </Label>
            )}
            {statusText && errField === 'email' && (
              <Label pointing color="red">
                {statusText}
              </Label>
            )}
          </Form.Field>

          <Form.Field
            error={errField === 'username' || (submitted && username === '')}
          >
            <label>Username</label>

            <Input
              onChange={this.onChange}
              name="username"
              placeholder="Username"
              type="text"
            />
            {submitted && !username && (
              <Label pointing color="red">
                Username cannot be empty!
              </Label>
            )}
            {statusText && errField === 'username' && (
              <Label pointing color="red">
                {statusText}
              </Label>
            )}
          </Form.Field>

          <Form.Field
            error={errField === 'password' || (submitted && password === '')}
          >
            <label>Password</label>

            <Input
              onChange={this.onChange}
              name="password"
              placeholder="Password"
              type="password"
            />
            {submitted && !password && (
              <Label pointing color="red">
                Password cannot be empty!
              </Label>
            )}
            {statusText && errField === 'password' && (
              <Label pointing color="red">
                {statusText}
              </Label>
            )}
            {submitted && errors && (
              <Label pointing color="red">
                {errors}
              </Label>
            )}
          </Form.Field>

          <Form.Field
            error={
              errField === 'password2' ||
              (submitted &&
                (password2 === '' || (password && password !== password2)))
            }
          >
            <label>Confirm Password</label>

            <Input
              onChange={this.onChange}
              name="password2"
              placeholder="Confirm password"
              type="password"
            />
            {submitted && !password2 && (
              <Label pointing color="red">
                Confirm password cannot be empty!
              </Label>
            )}
            {submitted && password && password2 && password !== password2 && (
              <Label pointing color="red">
                Passwords do not match!
              </Label>
            )}
            {statusText && errField === 'password2' && (
              <Label pointing color="red">
                {statusText}
              </Label>
            )}
          </Form.Field>

          {statusText ? (
            <Message negative>
              <Icon name="warning circle" />
              {statusText}
            </Message>
          ) : null}
          <Button loading={isRegistering} color="blue">
            Register
          </Button>
        </Form>
        <div className="register-login">
          Already have an account? &nbsp;
          <Link to="/login">Login here</Link>
        </div>
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

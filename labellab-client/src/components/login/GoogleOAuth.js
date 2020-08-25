import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login'
import { uuid } from 'uuidv4';

import { OauthUser } from '../../actions/auth'

class GoogleContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      status: 'unknown',
      errors: null
    }
  }

  responseGoogle = res => {
    const credentials = {
      type: 'google',
      name: res.profileObj.name,
      username: res.profileObj.name + uuid(),
      email: res.profileObj.email
    }
    this.props.OauthUser(credentials, this.callback)
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

  errors = err => {
    console.log(err)
    this.setState({ errors: err })
  }

  render() {
    return (
      <div>
        <GoogleLogin
          className="googleSignin"
          buttonText={
            'Login with Google'
          }
          clientId={process.env.GOOGLE_CLIENT_ID}
          onSuccess={this.responseGoogle}
          onFailure={this.errors}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    )
  }
}

GoogleContainer.propTypes = {
  OauthUser: PropTypes.func.isRequired
}

const mapStateToProps = null

const mapDispatchToProps = {
  OauthUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleContainer)

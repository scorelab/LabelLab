import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GitHubLogin from 'react-github-login'

import { OauthUser, GithubOauth, GithubOauthCallback } from '../../actions/auth'

import './css/login.css'

class GitHubContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      status: 'unknown',
      errors: null
    }
  }

  responseGithub = res => {
    const credentials = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: res.code
    }
    this.props.GithubOauth(credentials, this.convert)
  }

  convert = () => {
    const { access_token } = this.props.githubResponse.data
    access_token && this.props.GithubOauthCallback(access_token, this.sendDetails)
  }

  sendDetails = () => {
    const { details } = this.props
    const data = {
      name: details.name,
      username: details.username,
      email: details.email
    }
    this.props.OauthUser(data, this.callback)
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
        <GitHubLogin
          className="github-login"
          buttonText="Login with GitHub"
          clientId={process.env.GITHUB_CLIENT_ID}
          redirectUri=""
          onSuccess={this.responseGithub}
          onFailure={this.errors}
        />
      </div>
    )
  }
}

GitHubContainer.propTypes = {
  OauthUser: PropTypes.func.isRequired,
  GithubOauth: PropTypes.func.isRequired,
  GithubOauthCallback: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  return {
    githubResponse: state.auth.githubResponse,
    details: state.auth.details
  }
}

const mapDispatchToProps = {
  OauthUser,
  GithubOauth,
  GithubOauthCallback
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GitHubContainer)

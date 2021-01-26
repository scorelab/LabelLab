import {
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  SEND_EMAIL_REQUEST,
  SENT_EMAIL_SUCCESS,
  EMAIL_SENT_FAILURE,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  OAUTH_LOGIN_REQUEST,
  OAUTH_LOGIN_SUCCESS,
  OAUTH_LOGIN_FAILURE,
  GITHUB_OAUTH_REQUEST,
  GITHUB_OAUTH_SUCCESS,
  GITHUB_OAUTH_FAILURE,
  GITHUB_OAUTH_CALLBACK_REQUEST,
  GITHUB_OAUTH_CALLBACK_SUCCESS,
  GITHUB_OAUTH_CALLBACK_FAILURE
} from '../constants/index'

import axios from 'axios'
import FetchApi from '../utils/FetchAPI'
import { setAuthToken, saveAllTokens, removeAllTokens } from '../utils/token'

export const login = (username, password, callback) => {
  return dispatch => {
    const data = {
      email: username,
      password: password
    }
    dispatch(request())
    FetchApi.post('/api/v1/auth/login', data)
      .then(res => {
        console.log(res)
        if (res.data && res.data.access_token && res.data.refresh_token) {
          const { access_token, refresh_token, body } = res.data
          // Set token to Auth header
          setAuthToken(access_token)
          //Save to localstorage
          saveAllTokens({ access_token, refresh_token, body })
          dispatch(success(body))
          callback()
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: LOGIN_REQUEST }
  }
  function success(data) {
    return { type: LOGIN_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: LOGIN_FAILURE, payload: error }
  }
}

export const logout = callback => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/auth/logout_access', {})
      .then(() => {
        FetchApi.post('/api/v1/auth/logout_refresh', {})
          .then(() => {
            // Remove tokens from local storage
            setAuthToken(false)
            removeAllTokens()
            dispatch(success())
            callback()
          })
          .catch(err => {
            console.error(err)
          })
      })
      .catch(err => {
        console.error(err)
      })
  }

  function request() {
    return { type: LOGOUT_REQUEST }
  }
  function success() {
    return { type: LOGOUT_SUCCESS }
  }
}

export const forgotPassword = (email, callback) => {
  return dispatch => {
    const data = {
      email: email
    }
    dispatch(request())
    FetchApi('POST', '/api/v1/auth/reset-password', data)
      .then(res => {
        if (res.data) {
          dispatch(success(res.data))
          callback()
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: SEND_EMAIL_REQUEST }
  }
  function success(data) {
    return { type: SENT_EMAIL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: EMAIL_SENT_FAILURE, error }
  }
}

export const verifyResetPasswordToken = (user_id, token) => {
  return dispatch => {
    dispatch(request())
    FetchApi('GET', `/api/v1/auth/reset-password/${user_id}/${token}`)
      .then(res => {
        if (res.data) {
          dispatch(success(res.data))
        }
      })
      .catch(err => {
        console.log(err.response)
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: VERIFY_TOKEN_REQUEST }
  }
  function success(data) {
    return { type: VERIFY_TOKEN_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: VERIFY_TOKEN_FAILURE, error }
  }
}

export const updatePassword = (
  email,
  username,
  password,
  resetPasswordToken
) => {
  return dispatch => {
    const data = {
      email: email,
      username: username,
      password: password,
      resetPasswordToken: resetPasswordToken
    }
    dispatch(request())
    FetchApi('PUT', `/api/v1/auth/update-password`, data)
      .then(res => {
        if (res.data) {
          console.log(res.data)
          dispatch(success(res.data))
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: UPDATE_PASSWORD_REQUEST }
  }
  function success(data) {
    return { type: UPDATE_PASSWORD_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: UPDATE_PASSWORD_FAILURE, error }
  }
}

export const OauthUser = (credentials, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/auth/oauth', credentials)
      .then(res => {
        if (res.data && res.data.access_token && res.data.refresh_token) {
          const { access_token, refresh_token, body } = res.data
          // Set token to Auth header
          setAuthToken(access_token)
          //Save to localstorage
          saveAllTokens({ access_token, refresh_token, body })
          dispatch(success(res.data))
          callback()
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: OAUTH_LOGIN_REQUEST }
  }
  function success(data) {
    return { type: OAUTH_LOGIN_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: OAUTH_LOGIN_FAILURE, error }
  }
}

export const GithubOauth = (credentials, callback) => {
  return dispatch => {
    const config = {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        Accept: 'application/json'
      }
    }
    dispatch(request())
    axios
      .post('https://github.com/login/oauth/access_token', credentials, config)
      .then(res => {
        dispatch(success(res))
        callback()
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: GITHUB_OAUTH_REQUEST }
  }
  function success(data) {
    return { type: GITHUB_OAUTH_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: GITHUB_OAUTH_FAILURE, error }
  }
}

export const GithubOauthCallback = (access_token, callback) => {
  return dispatch => {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        Accept: 'application/json',
        Authorization: 'token ' + access_token
      }
    }
    dispatch(request())
    axios
      .get('https://api.github.com/user', config)
      .then(res => {
        dispatch(success(res.data))
        callback()
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: GITHUB_OAUTH_CALLBACK_REQUEST }
  }
  function success(data) {
    return { type: GITHUB_OAUTH_CALLBACK_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: GITHUB_OAUTH_CALLBACK_FAILURE, error }
  }
}

import {
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  TOKEN_TYPE,
  SEND_EMAIL_REQUEST,
  SENT_EMAIL_SUCCESS,
  EMAIL_SENT_FAILURE,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'
import { setToken, removeToken} from '../utils/token'

export const login = (username, password, callback) => {
  return dispatch => {
    const data = {
      email: username,
      password: password
    }
    dispatch(request())
    FetchApi('POST', '/api/v1/auth/login', data)
      .then(res => {
        if (res.data && res.data.token) {
          setToken(TOKEN_TYPE, res.data.token)
          dispatch(success(res.data.token))
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
    return { type: LOGIN_FAILURE, error }
  }
}

export const logout = callback => {
  return dispatch => {
    dispatch(request())
    removeToken(TOKEN_TYPE)
    dispatch(success())
    callback()
  }

  function request() {
    return { type: LOGOUT_REQUEST }
  }
  function success(data) {
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

export const updatePassword = (email, username, password, resetPasswordToken) =>{
  return dispatch => {
    const data = {
      email: email,
      username:username,
      password: password,
      resetPasswordToken:resetPasswordToken
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
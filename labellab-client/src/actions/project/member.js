import {
  ADD_MEMBER_FAILURE,
  ADD_MEMBER_REQUEST,
  ADD_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  DELETE_MEMBER_REQUEST,
  DELETE_MEMBER_SUCCESS,
  TOKEN_TYPE
} from '../../constants/index'

import FetchApi from '../../utils/FetchAPI'
import { getToken } from '../../utils/token'

const token = getToken(TOKEN_TYPE)

export const addMember = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi('POST', '/api/v1/project/add/' + data.projectId, data, token)
      .then(res => {
        dispatch(success())
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
    return { type: ADD_MEMBER_REQUEST }
  }
  function success(data) {
    return { type: ADD_MEMBER_SUCCESS }
  }
  function failure(error) {
    return { type: ADD_MEMBER_FAILURE, payload: error }
  }
}

export const memberDelete = (email, projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi(
      'POST',
      '/api/v1/project/remove/' + projectId,
      { member_email: email },
      token
    )
      .then(res => {
        dispatch(success())
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
    return { type: DELETE_MEMBER_REQUEST }
  }
  function success() {
    return { type: DELETE_MEMBER_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_MEMBER_FAILURE, payload: error }
  }
}

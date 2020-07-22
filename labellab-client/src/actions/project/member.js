import {
  ADD_MEMBER_FAILURE,
  ADD_MEMBER_REQUEST,
  ADD_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  DELETE_MEMBER_REQUEST,
  DELETE_MEMBER_SUCCESS
} from '../../constants/index'

import FetchApi from '../../utils/FetchAPI'

export const addMember = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/project/add_project_member/' + data.projectId, data)
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
    FetchApi.post(
      '/api/v1/project/remove_project_member/' + projectId,
      { member_email: email },
      true
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

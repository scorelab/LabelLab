import {
  INITIALIZE_PROJECT_FAILURE,
  INITIALIZE_PROJECT_REQUEST,
  INITIALIZE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAILURE,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS
} from '../../constants/index'

import FetchApi from '../../utils/FetchAPI'

export const initProject = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/project/create', data)
      .then(res => {
        dispatch(success(res.data.body))
        callback(res.data.body.project.id)
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
    return { type: INITIALIZE_PROJECT_REQUEST }
  }
  function success(data) {
    return { type: INITIALIZE_PROJECT_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: INITIALIZE_PROJECT_FAILURE, payload: error }
  }
}

export const updateProject = (data, projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.put(`/api/v1/project/project_info/${projectId}`, data)
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
    return { type: UPDATE_PROJECT_REQUEST }
  }
  function success(data) {
    return { type: UPDATE_PROJECT_SUCCESS }
  }
  function failure(error) {
    return { type: UPDATE_PROJECT_FAILURE, payload: error }
  }
}

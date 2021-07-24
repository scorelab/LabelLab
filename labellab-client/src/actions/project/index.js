import {
  DELETE_PROJECT_FAILURE,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  LEAVE_PROJECT_FAILURE,
  LEAVE_PROJECT_REQUEST,
  LEAVE_PROJECT_SUCCESS
} from '../../constants/project/index'

import FetchApi from '../../utils/FetchAPI'

export const deleteProject = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.delete(`/api/v1/project/project_info/${projectId}`)
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
    return { type: DELETE_PROJECT_REQUEST }
  }
  function success() {
    return { type: DELETE_PROJECT_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_PROJECT_FAILURE, payload: error }
  }
}

export const leaveProject = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/project/leave/${projectId}`)
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
    return { type: LEAVE_PROJECT_REQUEST }
  }
  function success() {
    return { type: LEAVE_PROJECT_SUCCESS }
  }
  function failure(error) {
    return { type: LEAVE_PROJECT_FAILURE, payload: error }
  }
}

export * from './fetchDetails'
export * from './member'
export * from './search'
export * from './projectDetails'
export * from './pathTracking'
export * from './teams'
export * from './logs'

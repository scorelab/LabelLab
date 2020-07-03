import {
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ALL_FAILURE,
  FETCH_PROJECT_ALL_REQUEST,
  FETCH_PROJECT_ALL_SUCCESS
} from '../../constants/index'

import FetchApi from '../../utils/FetchAPI'

export const fetchAllProject = () => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/project/get')
      .then(res => {
        dispatch(success(res.data.body))
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
    return { type: FETCH_PROJECT_ALL_REQUEST }
  }
  function success(data) {
    return { type: FETCH_PROJECT_ALL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_PROJECT_ALL_FAILURE, payload: error }
  }
}

export const fetchProject = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/project/project_info/${data}`)
      .then(res => {
        dispatch(success(res.data.body))
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
    return { type: FETCH_PROJECT_REQUEST }
  }
  function success(data) {
    return { type: FETCH_PROJECT_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_PROJECT_FAILURE, payload: error }
  }
}

import {
  ANALYTICS_TIME_LABEL_FAILURE,
  ANALYTICS_TIME_LABEL_REQUEST,
  ANALYTICS_TIME_LABEL_SUCCESS,
  ANALYTICS_COUNT_LABEL_FAILURE,
  ANALYTICS_COUNT_LABEL_REQUEST,
  ANALYTICS_COUNT_LABEL_SUCCESS
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'

export const getTimeLabel = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(
      '/api/v1/time_label/get/' + projectId
    )
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
    return { type: ANALYTICS_TIME_LABEL_REQUEST }
  }
  function success(data) {
    return { type: ANALYTICS_TIME_LABEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ANALYTICS_TIME_LABEL_FAILURE, payload: error }
  }
}

export const getLabelCount = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(
      '/api/v1/label_counts/get/' + projectId
    )
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
    return { type: ANALYTICS_COUNT_LABEL_REQUEST }
  }
  function success(data) {
    return { type: ANALYTICS_COUNT_LABEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ANALYTICS_COUNT_LABEL_FAILURE, payload: error }
  }
}

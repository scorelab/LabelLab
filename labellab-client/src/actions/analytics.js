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
    FetchApi(
      'GET',
      '/api/v1/analytics/' + projectId + '/timeLabel/get',
      null,
      true
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
    FetchApi(
      'GET',
      '/api/v1/analytics/' + projectId + '/labelCount/get',
      null,
      true
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

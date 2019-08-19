import {
  ANALYTICS_TIME_LABEL_FAILURE,
  ANALYTICS_TIME_LABEL_REQUEST,
  ANALYTICS_TIME_LABEL_SUCCESS,
  TOKEN_TYPE
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'
import { getToken } from '../utils/token'

export const getTimeLabel = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi(
      'GET',
      '/api/v1/analytics/' + projectId + '/timeLabel/get',
      null,
      getToken(TOKEN_TYPE)
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

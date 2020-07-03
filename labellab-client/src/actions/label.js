import {
  FETCH_LABEL_FAILURE,
  FETCH_LABEL_REQUEST,
  FETCH_LABEL_SUCCESS,
  CREATE_LABEL_FAILURE,
  CREATE_LABEL_REQUEST,
  CREATE_LABEL_SUCCESS,
  UPDATE_LABEL_FAILURE,
  UPDATE_LABEL_REQUEST,
  UPDATE_LABEL_SUCCESS,
  DELETE_LABEL_FAILURE,
  DELETE_LABEL_REQUEST,
  DELETE_LABEL_SUCCESS,
  UPDATE_A_LABEL_REQUEST,
  UPDATE_A_LABEL_SUCCESS,
  UPDATE_A_LABEL_FAILURE

} from '../constants/index'

import FetchApi from '../utils/FetchAPI'

export const fetchLabels = (projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/label/get/' + projectId)
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
    return { type: FETCH_LABEL_REQUEST }
  }
  function success(data) {
    return { type: FETCH_LABEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_LABEL_FAILURE, payload: error }
  }
}

export const createLabel = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post(
      '/api/v1/label/create/' + data.projectId,
      data
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
    return { type: CREATE_LABEL_REQUEST }
  }
  function success() {
    return { type: CREATE_LABEL_SUCCESS }
  }
  function failure(error) {
    return { type: CREATE_LABEL_FAILURE, payload: error }
  }
}

export const updateLabels = (image_id, labelData) => {
  return dispatch => {
    dispatch(request())
    FetchApi('PUT', '/api/v1/image/' + image_id + '/update', labelData, true)
      .then(res => {
        dispatch(success())
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
    return { type: UPDATE_LABEL_REQUEST }
  }
  function success() {
    return { type: UPDATE_LABEL_SUCCESS }
  }
  function failure(error) {
    return { type: UPDATE_LABEL_FAILURE, payload: error }
  }
}

export const updateALabel = (label_id, labelData ,callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.put('/api/v1/label/label_info/' + label_id, labelData)
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
    return { type: UPDATE_A_LABEL_REQUEST }
  }
  function success() {
    return { type: UPDATE_A_LABEL_SUCCESS }
  }
  function failure(error) {
    return { type: UPDATE_A_LABEL_FAILURE, payload: error }
  }
}

export const deleteLabel = (label_id, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi('DELETE', '/api/v1/label/' + label_id + '/delete', null, true)
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
    return { type: DELETE_LABEL_REQUEST }
  }
  function success() {
    return { type: DELETE_LABEL_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_LABEL_FAILURE, payload: error }
  }
}

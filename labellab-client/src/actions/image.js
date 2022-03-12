import {
  DELETE_IMAGE_FAILURE,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  POST_IMAGE_FAILURE,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_REQUEST,
  FETCH_IMAGE_FAILURE,
  FETCH_IMAGE_REQUEST,
  FETCH_IMAGE_SUCCESS,
  SET_IMAGE_STATE
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'

export const submitImage = (data, projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/image/create/' + projectId, data)
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
    return { type: POST_IMAGE_REQUEST }
  }
  function success(data) {
    return { type: POST_IMAGE_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: POST_IMAGE_FAILURE, payload: error }
  }
}

export const fetchProjectImage = (projectId, imageId, callback) => {
  return dispatch => {
    if (imageId === undefined) {
      dispatch(failure('ImageId is not present'))
      return
    }
    dispatch(request())
    FetchApi.get('/api/v1/image/get_image/' + projectId + '/' + imageId)
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
    return { type: FETCH_IMAGE_REQUEST }
  }
  function success(data) {
    return { type: FETCH_IMAGE_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_IMAGE_FAILURE, payload: error }
  }
}

export const deleteImage = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post(`/api/v1/image/delete/${data.projectId}`, data)
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
    return { type: DELETE_IMAGE_REQUEST }
  }
  function success() {
    return { type: DELETE_IMAGE_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_IMAGE_FAILURE, payload: error }
  }
}

export const setNextPrev = (next, prev) => {
  return dispatch => {
    let data = {
      next: next,
      prev: prev
    }
    dispatch(request(data))
  }
  function request(data) {
    return { type: SET_IMAGE_STATE, payload: data }
  }
}

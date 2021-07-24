import {
  FETCH_PROJECT_LOGS_REQUEST,
  FETCH_PROJECT_LOGS_SUCCESS,
  FETCH_PROJECT_LOGS_FAILURE,
  FETCH_CATEGORY_SPECIFIC_LOGS_REQUEST,
  FETCH_CATEGORY_SPECIFIC_LOGS_SUCCESS,
  FETCH_CATEGORY_SPECIFIC_LOGS_FAILURE,
  FETCH_MEMBER_SPECIFIC_LOGS_REQUEST,
  FETCH_MEMBER_SPECIFIC_LOGS_SUCCESS,
  FETCH_MEMBER_SPECIFIC_LOGS_FAILURE,
  FETCH_ENTITY_SPECIFIC_LOGS_REQUEST,
  FETCH_ENTITY_SPECIFIC_LOGS_SUCCESS,
  FETCH_ENTITY_SPECIFIC_LOGS_FAILURE
} from '../../constants/index'
import FetchApi from '../../utils/FetchAPI'

export const fetchProjectLogs = projectId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/logs/${projectId}`)
      .then(res => dispatch(success(res.data.data)))
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: FETCH_PROJECT_LOGS_REQUEST }
  }
  function success(data) {
    return { type: FETCH_PROJECT_LOGS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_PROJECT_LOGS_FAILURE, payload: error }
  }
}

export const fetchCategorySpecificLogs = (projectId, category) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/logs/${projectId}/category/${category}`)
      .then(res => dispatch(success(res.data.data)))
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: FETCH_CATEGORY_SPECIFIC_LOGS_REQUEST }
  }
  function success(data) {
    return { type: FETCH_CATEGORY_SPECIFIC_LOGS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_CATEGORY_SPECIFIC_LOGS_FAILURE, payload: error }
  }
}

export const fetchMemberSpecificLogs = (projectId, memberEmail) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/logs/${projectId}/user/${memberEmail}`)
      .then(res => dispatch(success(res.data.data)))
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: FETCH_MEMBER_SPECIFIC_LOGS_REQUEST }
  }
  function success(data) {
    return { type: FETCH_MEMBER_SPECIFIC_LOGS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_MEMBER_SPECIFIC_LOGS_FAILURE, payload: error }
  }
}

export const fetchEntitySpecificLogs = (projectId, entityType, entityId) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/logs/${projectId}/entity/${entityType}/${entityId}`)
      .then(res => dispatch(success(res.data.data)))
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: FETCH_ENTITY_SPECIFIC_LOGS_REQUEST }
  }
  function success(data) {
    return { type: FETCH_ENTITY_SPECIFIC_LOGS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_ENTITY_SPECIFIC_LOGS_FAILURE, payload: error }
  }
}

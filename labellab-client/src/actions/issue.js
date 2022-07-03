import {
    FETCH_ISSUE_FAILURE,
    FETCH_ISSUE_REQUEST,
    FETCH_ISSUE_SUCCESS,
    CREATE_ISSUE_FAILURE,
    CREATE_ISSUE_REQUEST,
    CREATE_ISSUE_SUCCESS,
    UPDATE_ISSUE_FAILURE,
    UPDATE_ISSUE_REQUEST,
    UPDATE_ISSUE_SUCCESS,
    DELETE_ISSUE_FAILURE,
    DELETE_ISSUE_REQUEST,
    DELETE_ISSUE_SUCCESS,
    ASSIGN_ISSUE_FAILURE,
    ASSIGN_ISSUE_REQUEST,
    ASSIGN_ISSUE_SUCCESS,
    FETCH_PROJECT_ISSUES_REQUEST,
    FETCH_PROJECT_ISSUES_SUCCESS,
    FETCH_PROJECT_ISSUES_FAILURE,
    FETCH_CATEGORY_SPECIFIC_ISSUES_REQUEST,
    FETCH_CATEGORY_SPECIFIC_ISSUES_SUCCESS,
    FETCH_CATEGORY_SPECIFIC_ISSUES_FAILURE,
    FETCH_TEAM_SPECIFIC_ISSUES_REQUEST,
    FETCH_TEAM_SPECIFIC_ISSUES_SUCCESS,
    FETCH_TEAM_SPECIFIC_ISSUES_FAILURE,
    FETCH_ENTITY_SPECIFIC_ISSUES_REQUEST,
    FETCH_ENTITY_SPECIFIC_ISSUES_SUCCESS,
    FETCH_ENTITY_SPECIFIC_ISSUES_FAILURE,
    SEND_COMMENT,
    RECEIVE_COMMENT
  
  } from '../constants/index'
  
  import socket from '../utils/webSocket'
  import FetchApi from '../utils/FetchAPI'

  
  export const fetchProjectIssues = (projectId, page=1, perPage=6) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get(`/api/v1/issue/get/${projectId}?page=${page}`)
        .then(res => dispatch(success(res.data.body)))
        .catch(err => {
          if (err.response) {
            err.response.data
              ? dispatch(failure(err.response.data.msg))
              : dispatch(failure(err.response.statusText, null))
          }
        })
    }
    function request() {
      return { type: FETCH_PROJECT_ISSUES_REQUEST }
    }
    function success(data) {
      return { type: FETCH_PROJECT_ISSUES_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_PROJECT_ISSUES_FAILURE, payload: error }
    }
  }
  
  export const fetchCategorySpecificIssues = (projectId, category) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get(`/api/v1/issue/${projectId}/category/${category}`)
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
      return { type: FETCH_CATEGORY_SPECIFIC_ISSUES_REQUEST }
    }
    function success(data) {
      return { type: FETCH_CATEGORY_SPECIFIC_ISSUES_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_CATEGORY_SPECIFIC_ISSUES_FAILURE, payload: error }
    }
  }
  
  export const fetchTeamSpecificIssues = (projectId, team_id) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get(`/api/v1/issue/${projectId}/team/${team_id}`)
        .then(res => dispatch(success(res.data.body)))
        .catch(err => {
          if (err.response) {
            err.response.data
              ? dispatch(failure(err.response.data.msg))
              : dispatch(failure(err.response.statusText, null))
          }
        })
    }
    function request() {
      return { type: FETCH_TEAM_SPECIFIC_ISSUES_REQUEST }
    }
    function success(data) {
      return { type: FETCH_TEAM_SPECIFIC_ISSUES_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_TEAM_SPECIFIC_ISSUES_FAILURE, payload: error }
    }
  }
  
  export const fetchEntitySpecificIssues = (projectId, entityType, entityId) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get(`/api/v1/issue/${projectId}/entity/${entityType}/${entityId}`)
        .then(res => dispatch(success(res.data.body)))
        .catch(err => {
          if (err.response) {
            err.response.data
              ? dispatch(failure(err.response.data.msg))
              : dispatch(failure(err.response.statusText, null))
          }
        })
    }
    function request() {
      return { type: FETCH_ENTITY_SPECIFIC_ISSUES_REQUEST }
    }
    function success(data) {
      return { type: FETCH_ENTITY_SPECIFIC_ISSUES_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_ENTITY_SPECIFIC_ISSUES_FAILURE, payload: error }
    }
  }
  
  export const createIssue = (projectId, data, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.post(
        '/api/v1/issue/create/' + projectId,
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
      return { type: CREATE_ISSUE_REQUEST }
    }
    function success() {
      return { type: CREATE_ISSUE_SUCCESS }
    }
    function failure(error) {
      return { type: CREATE_ISSUE_FAILURE, payload: error }
    }
  }
  
  export const fetchIssue = (project_id, issue_id) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get("/api/v1/issue/issue_info/" + project_id + "/" + issue_id)
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
      return { type: FETCH_ISSUE_REQUEST }
    }
    function success(data) {
      return { type: FETCH_ISSUE_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_ISSUE_FAILURE, payload: error }
    }
  }

  export const updateIssue = (project_id, issue_id, issuedata, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.put("/api/v1/issue/issue_info/" + project_id + "/" + issue_id, issuedata)
        .then(() => {
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
      return { type: UPDATE_ISSUE_REQUEST }
    }
    function success() {
      return { type: UPDATE_ISSUE_SUCCESS }
    }
    function failure(error) {
      return { type: UPDATE_ISSUE_FAILURE, payload: error }
    }
  }
  
  export const deleteIssue = (project_id, issue_id, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.delete("/api/v1/issue/issue_info/" + project_id + "/" + issue_id)
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
      return { type: DELETE_ISSUE_REQUEST }
    }
    function success() {
      return { type: DELETE_ISSUE_SUCCESS }
    }
    function failure(error) {
      return { type: DELETE_ISSUE_FAILURE, payload: error }
    }
  }

  export const assignIssue = (project_id, issue_id, issuedata, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.put("/api/v1/issue/assign/" + project_id + "/" + issue_id, issuedata)
        .then(() => {
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
      return { type: ASSIGN_ISSUE_REQUEST }
    }
    function success() {
      return { type: ASSIGN_ISSUE_SUCCESS }
    }
    function failure(error) {
      return { type: ASSIGN_ISSUE_FAILURE, payload: error }
    }
  }

  export const handleCommentReceive = issueId => {
    return dispatch => {
      socket.on('receive_comment', data => {
        const commentIssueId = data.issue_id
        if (commentIssueId == issueId) {
          dispatch(success(data))
        }
      })
    }
    function success(data) {
      return { type: RECEIVE_COMMENT, payload: data }
    }
  }

  export const sendComment = (comment, issueId, userId) => {
    return dispatch => {
      const data = {
        body: comment,
        issue_id: issueId,
        user_id: userId
      }
      socket.emit('send_comment', data)
      dispatch(success())
    }
    function success() {
      return { type: SEND_COMMENT}
    }
  }
  
  
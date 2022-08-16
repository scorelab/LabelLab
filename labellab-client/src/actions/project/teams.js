import {
  FETCH_TEAMS_FAILURE,
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  DELETE_TEAM_FAILURE,
  DELETE_TEAM_REQUEST,
  DELETE_TEAM_SUCCESS,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
  UPDATE_TEAM_REQUEST,
  UPDATE_TEAM_SUCCESS,
  UPDATE_TEAM_FAILURE,
  ADD_TEAM_MEMBER_REQUEST,
  ADD_TEAM_MEMBER_SUCCESS,
  ADD_TEAM_MEMBER_FAILURE,
  REMOVE_TEAM_MEMBER_REQUEST,
  REMOVE_TEAM_MEMBER_SUCCESS,
  REMOVE_TEAM_MEMBER_FAILURE,
  FETCH_TEAM_MESSAGES_REQUEST,
  FETCH_TEAM_MESSAGES_SUCCESS,
  FETCH_TEAM_MESSAGES_FAILURE,
  RECEIVE_MESSAGE,
  SEND_MESSAGE
} from '../../constants/index'

import socket from '../../utils/webSocket'
import FetchApi from '../../utils/FetchAPI'

export const fetchAllTeams = projectId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/team/get/' + projectId)
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
    return { type: FETCH_TEAMS_REQUEST }
  }
  function success(data) {
    return { type: FETCH_TEAMS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_TEAMS_FAILURE, payload: error }
  }
}

export const teamDelete = (team_id, projectId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.delete('/api/v1/team/team_info/' + projectId + '/' + team_id)
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
    return { type: DELETE_TEAM_REQUEST }
  }
  function success() {
    return { type: DELETE_TEAM_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_TEAM_FAILURE, payload: error }
  }
}

export const fetchTeam = (projectId, teamId) => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`/api/v1/team/team_info/${projectId}/${teamId}`)
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
    return { type: FETCH_TEAM_REQUEST }
  }
  function success(data) {
    return { type: FETCH_TEAM_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_TEAM_FAILURE, payload: error }
  }
}

export const updateTeam = (projectId, teamId, teamname, role, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.put(`/api/v1/team/team_info/${projectId}/${teamId}`, {
      teamname,
      role
    })
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
    return { type: UPDATE_TEAM_REQUEST }
  }
  function success() {
    return { type: UPDATE_TEAM_SUCCESS }
  }
  function failure(error) {
    return { type: UPDATE_TEAM_FAILURE, payload: error }
  }
}

export const addTeamMember = (projectId, teamId, memberEmail, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post(`api/v1/team/add_team_member/${projectId}/${teamId}`, {
      member_email: memberEmail
    })
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
    return { type: ADD_TEAM_MEMBER_REQUEST }
  }
  function success() {
    return { type: ADD_TEAM_MEMBER_SUCCESS }
  }
  function failure(error) {
    return { type: ADD_TEAM_MEMBER_FAILURE, payload: error }
  }
}

export const removeTeamMember = (projectId, teamId, memberEmail, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post(`api/v1/team/remove_team_member/${projectId}/${teamId}`, {
      member_email: memberEmail
    })
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
    return { type: REMOVE_TEAM_MEMBER_REQUEST }
  }
  function success() {
    return { type: REMOVE_TEAM_MEMBER_SUCCESS }
  }
  function failure(error) {
    return { type: REMOVE_TEAM_MEMBER_FAILURE, payload: error }
  }
}

export const fetchTeamMessages = teamId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get(`api/v1/chatroom/${teamId}`)
      .then(res => dispatch(success(res.data.body)))
      .catch(err => dispatch(failure(err.response.data.msg)))
  }
  function request() {
    return { type: FETCH_TEAM_MESSAGES_REQUEST }
  }
  function success(data) {
    return { type: FETCH_TEAM_MESSAGES_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: FETCH_TEAM_MESSAGES_FAILURE, payload: error }
  }
}

export const handleMessageReceive = teamId => {
  return dispatch => {
    socket.on('receive_message', data => {
      const messageTeamId = data.team_id
      if (messageTeamId == teamId) {
        dispatch(success(data))
      }
    })
  }
  function success(data) {
    return { type: RECEIVE_MESSAGE, payload: data }
  }
}

export const sendMessage = (message, teamId, userId, entityType, entityId, tagged_users_id) => {
  return dispatch => {
    const data = {
      body: message,
      team_id: teamId,
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      tagged_users: tagged_users_id
    }
    socket.emit('send_message', data)
    dispatch(success())
  }
  function success() {
    return { type: SEND_MESSAGE }
  }
}

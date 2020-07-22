import {
    FETCH_TEAMS_FAILURE,
    FETCH_TEAM_REQUEST,
    FETCH_TEAM_SUCCESS,
    DELETE_MEMBER_FAILURE,
    DELETE_MEMBER_REQUEST,
    DELETE_MEMBER_SUCCESS
  } from '../../constants/index'
  
  import FetchApi from '../../utils/FetchAPI'
  
  export const allTeams = (data, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get('/team/get/' + data.projectId)
        .then(res => {
          dispatch(success(res.data))
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
      return { type: FETCH_TEAM_REQUEST }
    }
    function success(data) {
      return { type: FETCH_TEAM_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_TEAMS_FAILURE, payload: error }
    }
  }
  
  export const teamDelete = (team_id, projectId, callback) => {
    return dispatch => {
      dispatch(request())
      FetchApi.post(
        '/api/v1/team/team_info/' + projectId + team_id,
        { member_email: email },
        true
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
      return { type: DELETE_MEMBER_REQUEST }
    }
    function success() {
      return { type: DELETE_MEMBER_SUCCESS }
    }
    function failure(error) {
      return { type: DELETE_MEMBER_FAILURE, payload: error }
    }
  }
  
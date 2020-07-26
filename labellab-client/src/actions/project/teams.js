import {
    FETCH_TEAMS_FAILURE,
    FETCH_TEAMS_REQUEST,
    FETCH_TEAMS_SUCCESS,
    DELETE_TEAM_FAILURE,
    DELETE_TEAM_REQUEST,
    DELETE_TEAM_SUCCESS
  } from '../../constants/index'
  
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
      FetchApi.delete(
        '/api/v1/team/team_info/' + projectId + '/' + team_id
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
      return { type: DELETE_TEAM_REQUEST }
    }
    function success() {
      return { type: DELETE_TEAM_SUCCESS }
    }
    function failure(error) {
      return { type: DELETE_TEAM_FAILURE, payload: error }
    }
  }
  
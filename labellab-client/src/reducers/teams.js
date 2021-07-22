import {
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
  DELETE_TEAM_REQUEST,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_FAILURE
} from '../constants/index'

const initialState = {
  teamActions: {
    isfetching: false,
    isDeleting: false,
    errors: '',
    msg: ''
  },
  currentTeam: {}
}

const team = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case FETCH_TEAM_REQUEST:
      return {
        ...state,
        teamActions: {
          isfetching: true
        }
      }
    case FETCH_TEAM_SUCCESS:
      return {
        ...state,
        teamActions: {
          isfetching: false
        },
        currentTeam: payload
      }
    case FETCH_TEAM_FAILURE:
      return {
        ...state,
        teamActions: {
          isfetching: false,
          errors: payload
        }
      }
    case DELETE_TEAM_REQUEST:
      return {
        ...state,
        teamActions: {
          isDeleting: true
        }
      }
    case DELETE_TEAM_SUCCESS:
      return {
        ...state,
        teamActions: {
          isDeleting: false
        },
        currentTeam: {}
      }
    case DELETE_TEAM_FAILURE:
      return {
        ...state,
        teamActions: {
          isDeleting: false,
          errors: payload
        }
      }
    default:
      return state
  }
}

export default team

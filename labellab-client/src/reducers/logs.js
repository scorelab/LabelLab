import {
  FETCH_PROJECT_LOGS_REQUEST,
  FETCH_PROJECT_LOGS_SUCCESS,
  FETCH_PROJECT_LOGS_FAILURE
} from '../constants/index'

const initialState = {
  logs: [],
  logsActions: {
    isFetching: false,
    errors: ''
  }
}

const logs = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case FETCH_PROJECT_LOGS_REQUEST:
      return {
        ...state,
        logsActions: {
          isFetching: true
        }
      }
    case FETCH_PROJECT_LOGS_SUCCESS:
      return {
        ...state,
        logs: payload,
        logsActions: {
          isFetching: false
        }
      }
    case FETCH_PROJECT_LOGS_FAILURE:
      return {
        ...state,
        logsActions: {
          isFetching: false,
          errors: payload
        }
      }
    default:
      return state
  }
}

export default logs

import {
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATION_FAILURE,
  RECEIVE_NOTIFICATION
} from '../constants/index'

const initialState = {
  notifications: [],
  actions: {
    isFetching: false,
    errors: ''
  },
}

const notifications = (state = initialState, action) => {

  const { type, payload } = action
  switch (type) {
    
    case FETCH_NOTIFICATION_REQUEST:
      return {
        ...state,
        actions: {
          isFetching: true
        }
      }
    case FETCH_NOTIFICATION_SUCCESS:
      return {
        ...state,
        actions: {
          isFetching: false
        },
        notifications: payload.reverse()
      }
    case FETCH_NOTIFICATION_FAILURE:
      return {
        ...state,
        actions: {
          isFetching: false,
          errors: payload
        }
      }
    case RECEIVE_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: payload.id,
            message: payload.message,
            user_id: payload.userId,
            type: payload.type
          },
          ...state.notifications
        ]
      }
    default:
      return state
  }
}

export default notifications

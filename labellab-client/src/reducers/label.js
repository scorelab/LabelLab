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
  DELETE_LABEL_SUCCESS
} from '../constants/index'

const initialState = {
  labelActions: {
    isposting: false,
    error: '',
    isfetching: false,
    isupdating: false,
    isdeleting: false
  },
  labels: []
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isfetching: true
        }
      }
    case FETCH_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isfetching: false,
          error: 'Something went wrong!'
        }
      }
    case FETCH_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isfetching: false
        },
        labels: action.payload.labels
      }
    case CREATE_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isposting: true
        }
      }
    case CREATE_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isposting: false,
          error: 'Something went wrong!'
        }
      }
    case CREATE_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isposting: false
        }
      }
    case UPDATE_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isupdating: true
        }
      }
    case UPDATE_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isupdating: false,
          error: 'Something went wrong!'
        }
      }
    case UPDATE_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isupdating: false
        }
      }

    case DELETE_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isdeleting: true
        }
      }
    case DELETE_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isdeleting: false,
          error: 'Something went wrong!'
        }
      }
    case DELETE_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isdeleting: false
        }
      }
    default:
      return state
  }
}

export default user

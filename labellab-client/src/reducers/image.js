import {
  POST_IMAGE_FAILURE,
  POST_IMAGE_REQUEST,
  POST_IMAGE_SUCCESS,
  FETCH_IMAGE_FAILURE,
  FETCH_IMAGE_REQUEST,
  FETCH_IMAGE_SUCCESS,
  DELETE_IMAGE_FAILURE,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  SET_IMAGE_STATE
} from '../constants/index'

const initialState = {
  imageActions: {
    isposting: false,
    error: '',
    isfetching: false,
    isdeleting: false
  },
  currentImage: {},
  nextImage: {},
  prevImage: {}
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case POST_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isposting: true
        }
      }
    case POST_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: 'Something went wrong!'
        }
      }
    case POST_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: 'Successfully submitted'
        },
        currentImage: action.payload
      }
    case FETCH_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isfetching: true
        }
      }
    case FETCH_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isfetching: false,
          error: 'Something went wrong!'
        }
      }
    case FETCH_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isfetching: false,
          error: 'Successfully fetched!'
        },
        currentImage: action.payload
      }
    case DELETE_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isdeleting: true
        }
      }
    case DELETE_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isdeleting: false,
          error: 'Something went wrong!'
        }
      }
    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isdeleting: false,
          error: 'Successfully deleted'
        }
      }
    case SET_IMAGE_STATE:
      return {
        ...state,
        nextImage: action.payload.next,
        prevImage: action.payload.prev
      }
    default:
      return state
  }
}

export default user

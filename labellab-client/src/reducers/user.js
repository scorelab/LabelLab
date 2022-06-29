import {
  SET_USER_DATA_FAILURE,
  SET_USER_DATA_REQUEST,
  SET_USER_DATA_SUCCESS,
  UPLOAD_USER_IMAGE_FAILURE,
  UPLOAD_USER_IMAGE_REQUEST,
  UPLOAD_USER_IMAGE_SUCCESS,
  FETCH_COUNT_FAILURE,
  FETCH_COUNT_REQUEST,
  FETCH_COUNT_SUCCESS,
  FETCH_ALL_USERS_FAILURE,
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS
} from '../constants/index'
const initialState = {
  userActions: {
    isuploading: false,
    isfetching: false,
    isinitializing: false,
    errors: ''
  },
  userDetails: {
    id: '',
    name: '',
    username: '',
    thumbnail: '',
    email: '',
    profileImage: ''
  },
  userProfile: {
    totalLabels: '',
    totalProjects: '',
    totalImages: ''
  },
  users : []
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_USER_IMAGE_REQUEST:
      return {
        ...state,
        userActions: {
          isuploading: true
        }
      }
    case UPLOAD_USER_IMAGE_FAILURE:
      return {
        ...state,
        userActions: {
          isuploading: false,
          errors: 'Something went wrong!'
        }
      }
    case UPLOAD_USER_IMAGE_SUCCESS:
      return {
        ...state,
        userActions: {
          isuploading: false
        }
      }
    case SET_USER_DATA_REQUEST:
      return {
        ...state,
        userActions: {
          isfetching: true
        }
      }
    case SET_USER_DATA_SUCCESS:
      return {
        ...state,
        userActions: {
          isfetching: false
        },
        userDetails: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          username: action.payload.username,
          thumbnail: action.payload.thumbnail,
          profileImage: action.payload.thumbnail
        }
      }
    case SET_USER_DATA_FAILURE:
      return {
        ...state,
        userActions: {
          errors: action.payload
        }
      }
    case FETCH_COUNT_REQUEST:
      return {
        ...state,
        userActions: {
          isfetching: true
        }
      }
    case FETCH_COUNT_SUCCESS:
      return {
        ...state,
        userActions: {
          isfetching: false
        },
        userProfile: {
          totalProjects: action.payload.total_projects,
          totalLabels: action.payload.total_labels,
          totalImages: action.payload.total_images
        }
      }
    case FETCH_COUNT_FAILURE:
      return {
        ...state,
        userActions: {
          errors: action.payload
        }
      }
    case FETCH_ALL_USERS_REQUEST:
      return {
        ...state,
        userActions: {
            isFetching: true
        }
      }
    case FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        users : action.payload,
        userActions: {
            isFetching: false
        }
      }
    case FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        users : action.payload,
        userActions: {
            isFetching: true
        }
      }
    default:
      return state
  }
}

export default user

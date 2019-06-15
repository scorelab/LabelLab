import {
  INITIALIZE_PROJECT_FAILURE,
  INITIALIZE_PROJECT_REQUEST,
  INITIALIZE_PROJECT_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS
} from "../constants/index";
const initialState = {
  userActions: {
    isuploading: false,
    isfetching: false,
    isinitializing: false,
    errors: ""
  },
  userProjects: {}
};

const project = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PROJECT_REQUEST:
      return {
        ...state,
        userActions: {
          isinitializing: true
        }
      };
    case INITIALIZE_PROJECT_FAILURE:
      return {
        ...state,
        userActions: {
          isinitializing: false,
          errors: action.payload
        }
      };
    case INITIALIZE_PROJECT_SUCCESS:
      return {
        ...state,
        userActions: {
          isinitializing: false
        },
        userProjects: {
          project_name: action.payload.project_name,
          images: action.payload.image
        }
      };
    case FETCH_PROJECT_REQUEST:
      return {
        ...state,
        userActions: {
          isfetching: true
        }
      };
    case FETCH_PROJECT_FAILURE:
      return {
        ...state,
        userActions: {
          isfetching: false,
          errors: action.payload
        }
      };
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        userActions: {
          isfetching: false
        },
        userProjects: {
          project_name: action.payload.project_name,
          images: action.payload.image
        }
      };
    default:
      return state;
  }
};

export default project;

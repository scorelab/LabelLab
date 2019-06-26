import {
  INITIALIZE_PROJECT_FAILURE,
  INITIALIZE_PROJECT_REQUEST,
  INITIALIZE_PROJECT_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ALL_FAILURE,
  FETCH_PROJECT_ALL_REQUEST,
  FETCH_PROJECT_ALL_SUCCESS
} from "../constants/index";
const initialState = {
  projectActions: {
    isuploading: false,
    isfetching: false,
    isinitializing: false,
    errors: ""
  },
  currentProject: {},
  allProjects: []
};

const project = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PROJECT_REQUEST:
      return {
        ...state,
        projectActions: {
          isinitializing: true
        }
      };
    case INITIALIZE_PROJECT_FAILURE:
      return {
        ...state,
        projectActions: {
          isinitializing: false,
          errors: action.payload
        }
      };
    case INITIALIZE_PROJECT_SUCCESS:
      return {
        ...state,
        projectActions: {
          isinitializing: false
        },
        currentProject: {
          project_name: action.payload.project_name,
          images: action.payload.image
        }
      };
    case FETCH_PROJECT_REQUEST:
      return {
        ...state,
        projectActions: {
          isfetching: true
        }
      };
    case FETCH_PROJECT_FAILURE:
      return {
        ...state,
        projectActions: {
          isfetching: false,
          errors: action.payload
        }
      };
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        projectActions: {
          isfetching: false
        },
        currentProject: {
          project_id: action.payload._id,
          project_name: action.payload.project_name,
          images: action.payload.image,
          members:action.payload.members
        }
      };
    case FETCH_PROJECT_ALL_REQUEST:
      return {
        ...state,
        projectActions: {
          isfetching: true
        }
      };
    case FETCH_PROJECT_ALL_FAILURE:
      return {
        ...state,
        projectActions: {
          isfetching: false,
          errors: action.payload
        }
      };
    case FETCH_PROJECT_ALL_SUCCESS:
      return {
        ...state,
        projectActions: {
          isfetching: false
        },
        allProjects: action.payload
      };
    default:
      return state;
  }
};

export default project;

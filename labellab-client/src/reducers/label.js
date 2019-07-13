import {
  POST_LABEL_FAILURE,
  POST_LABEL_REQUEST,
  POST_LABEL_SUCCESS,
  FETCH_LABEL_FAILURE,
  FETCH_LABEL_REQUEST,
  FETCH_LABEL_SUCCESS,
  CREATE_LABEL_FAILURE,
  CREATE_LABEL_REQUEST,
  CREATE_LABEL_SUCCESS
} from "../constants/index";

const initialState = {
  labelActions: {
    isposting: false,
    error: "",
    isfetching: false
  },
  images: {},
  labels: []
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case POST_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isposting: true
        }
      };
    case POST_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isposting: false,
          error: "Something went wrong!"
        }
      };
    case POST_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isposting: false,
          error: "Successfully submitted"
        }
      };
    case FETCH_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isfetching: true
        }
      };
    case FETCH_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isfetching: false,
          error: "Something went wrong!"
        }
      };
    case FETCH_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isfetching: false
        },
        labels: action.payload.labels
      };
    case CREATE_LABEL_REQUEST:
      return {
        ...state,
        labelActions: {
          isposting: true
        }
      };
    case CREATE_LABEL_FAILURE:
      return {
        ...state,
        labelActions: {
          isposting: false,
          error: "Something went wrong!"
        }
      };
    case CREATE_LABEL_SUCCESS:
      return {
        ...state,
        labelActions: {
          isposting: false
        }
      };
    default:
      return state;
  }
};

export default user;

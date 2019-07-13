import {
  POST_IMAGE_FAILURE,
  POST_IMAGE_REQUEST,
  POST_IMAGE_SUCCESS,
  FETCH_IMAGE_FAILURE,
  FETCH_IMAGE_REQUEST,
  FETCH_IMAGE_SUCCESS
} from "../constants/index";

const initialState = {
  imageActions: {
    isposting: false,
    error: "",
    isfetching: false,
  },
  currentImage: {}
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case POST_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isposting: true
        }
      };
    case POST_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: "Something went wrong!"
        }
      };
    case POST_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: "Successfully submitted"
        },
        currentImage: action.payload
      };
    case FETCH_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isfetching: true
        }
      };
    case FETCH_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isfetching: false,
          error: "Something went wrong!"
        }
      };
    case FETCH_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isfetching: false,
          error: "Successfully submitted"
        },
        currentImage: action.payload[0]
      };
    default:
      return state;
  }
};

export default user;

import {
  SET_USER_DATA_FAILURE,
  SET_USER_DATA_REQUEST,
  SET_USER_DATA_SUCCESS,
  UPLOAD_USER_IMAGE_FAILURE,
  UPLOAD_USER_IMAGE_REQUEST,
  UPLOAD_USER_IMAGE_SUCCESS
} from "../constants/index";
const initialState = {
  userActions: {
    isuploading: false,
    isfetching: false,
    isinitializing: false,
    errors: ""
  },
  userDetails: {
    name: "",
    username: "",
    image: "",
    email: ""
  }
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_USER_IMAGE_REQUEST:
      return {
        ...state,
        userActions: {
          isuploading: true
        }
      };
    case UPLOAD_USER_IMAGE_FAILURE:
      return {
        ...state,
        userActions: {
          isuploading: false,
          errors: "Something went wrong!"
        }
      };
    case UPLOAD_USER_IMAGE_SUCCESS:
      return {
        ...state,
        userActions: {
          isuploading: false
        }
      };
    case SET_USER_DATA_REQUEST:
      return {
        ...state,
        userActions: {
          isfetching: true
        }
      };
    case SET_USER_DATA_SUCCESS:
      return {
        ...state,
        userActions: {
          isfetching: false
        },
        userDetails: {
          name: action.payload.name,
          email: action.payload.email,
          username: action.payload.username,
          image: action.payload.thumbnail
        }
      };
    case SET_USER_DATA_FAILURE:
      return {
        ...state,
        userActions: {
          errors: action.payload
        }
      };
    default:
      return state;
  }
};

export default user;

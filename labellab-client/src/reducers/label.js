import {
  POST_LABEL_FAILURE,
  POST_LABEL_REQUEST,
  POST_LABEL_SUCCESS
} from "../constants/index";

const initialState = {
  labelActions: {
    isposting: false,
    error: "",
    isfetching: false
  },
  images: {}
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
    default:
      return state;
  }
};

export default user;

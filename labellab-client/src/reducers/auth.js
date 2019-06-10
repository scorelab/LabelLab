import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS
} from "../constants/index";

const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: "",
  details: {
    email: ""
  },
  error: false,
  err_field: ""
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticating: false,
        statusText: "You are logged in successfully!",
        details: {
          email: action.payload.email
        }
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText:
          action.payload === "Unauthorized" ? "Email is not registered" : null,
        error: true,
        err_field: action.other
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: "You have been successfully logged out",
        details: {
          email: ""
        }
      };
    default:
      return state;
  }
};
export default auth;

import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  SEND_EMAIL_REQUEST,
  SENT_EMAIL_SUCCESS,
  EMAIL_SENT_FAILURE,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  OAUTH_LOGIN_REQUEST,
  OAUTH_LOGIN_SUCCESS,
  OAUTH_LOGIN_FAILURE
} from '../constants/index'

const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: '',
  details: {
    email: '',
    username: ''
  },
  error: false,
  errField: '',
  isLoading: false,
  emailRecievedMessage: '',
  verifyTokenMessage: '',
  passwordUpdatedMessage: '',
  verificationError: null,
  isEmailSending: false,
  passwordUpdateError: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticating: false,
        statusText: 'You are logged in successfully!',
        error: false,
        details: {
          email: action.payload.email
        }
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText:
          action.error === 'Unauthorized' ? 'Incorrect e-mail address or password!' : null,
        error: true,
        errField: action.other
      }
    case LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: '',
        error: false,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: 'You have been successfully logged out!',
        error: false,
        details: {
          email: ''
        }
      }
    case SEND_EMAIL_REQUEST:
      return {
        ...state,
        isEmailSending: true
      }
    case SENT_EMAIL_SUCCESS:
      return {
        ...state,
        isEmailSending: false,
        emailRecievedMessage: action.payload
      }
    case EMAIL_SENT_FAILURE:
      return {
        ...state,
        isEmailSending: false,
        emailRecievedMessage: action.payload
      }
    case VERIFY_TOKEN_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        details: {
          email: action.payload.email,
          username: action.payload.username
        },
        verifyTokenMessage: action.payload.msg,
        verificationError: action.payload.msg === 'password reset link a-ok' ? false : true
      }
    case VERIFY_TOKEN_FAILURE:
      return {
        ...state,
        isLoading: false,
        verifyTokenMessage: action.payload,
        verificationError: true
      }
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        passwordUpdatedMessage: action.payload.msg,
        passwordUpdateError: action.payload.msg === 'password updated' ? false : true
      }
    case UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        passwordUpdatedMessage: action.payload,
        passwordUpdateError: true
      }
      case OAUTH_LOGIN_REQUEST:
        return {
          ...state,
          isAuthenticating: true
        }
      case OAUTH_LOGIN_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          isAuthenticating: false,
          statusText: 'You are logged in successfully!',
          error: false,
          details: {
            email: action.payload.email
          }
        }
      case OAUTH_LOGIN_FAILURE:
        return {
          ...state,
          isAuthenticated: false,
          isAuthenticating: false,
          statusText:
            action.error === 'Unauthorize' ? 'LOGIN FAILED!' : null,
          error: true,
          errField: action.other
        }
    default:
      return state
  }
}
export default auth

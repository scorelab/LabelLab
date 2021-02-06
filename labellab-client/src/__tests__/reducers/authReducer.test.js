import { 
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS, 
} from "../../constants/index";
import auth  from "../../reducers/auth";

const initState = {
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
    githubResponse: '',
    passwordUpdatedMessage: '',
    verificationError: null,
    isEmailSending: false,
    passwordUpdateError: null
}

describe("Auth Reducer", () => {
  it("Should return the default state", () => {
    const newState = auth(undefined, {});
    expect(newState).toEqual(initState);
  });
  it("Should send a login request", () => {
    const newState = auth(initState, {
      type: LOGIN_REQUEST
    });
    expect(newState).toEqual({
      ...initState,
      isAuthenticating: true
    });
  });
  it("Should login a user", () => {
    const mockPayload = { name: "user", email: "email1@email.com", username: "user1" }
    const newState = auth(initState, {
      type: LOGIN_SUCCESS,
      payload: mockPayload
    });
    expect(newState).toEqual({ 
        ...initState,
        isAuthenticated: true,
        isAuthenticating: false,
        statusText: 'You are logged in successfully!',
        error: false,
        details: {
          email: mockPayload.email
        } 
    });
  });
  it("Should send logout request", () => {
    const newState = auth(initState, {
      type: LOGOUT_REQUEST,
    });
    expect(newState).toEqual({ 
        ...initState,
        isAuthenticating: true,
        statusText: '',
        error: false
     });
  });
  it("Should logout user", () => {
    const newState = auth(initState, {
      type: LOGOUT_SUCCESS,
    });
    expect(newState).toEqual({ 
        ...initState,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: 'You have been successfully logged out!',
        error: false,
        details: {
          email: ''
        }
     });
  });
});
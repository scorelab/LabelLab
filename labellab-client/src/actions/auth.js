import {
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  TOKEN_TYPE
} from "../constants/index";

import FetchApi from "../utils/FetchAPI";
import { setToken, removeToken } from "../utils/token";

export const login = (username, password, callback) => {
  return dispatch => {
    const data = {
      email: username,
      password: password
    };
    dispatch(request());
    FetchApi("POST", "/api/v1/auth/login", data)
      .then(res => {
        if (res.data && res.data.token) {
          setToken(TOKEN_TYPE, res.data.token);
          dispatch(success(res.data.token));
          callback();
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };

  function request() {
    return { type: LOGIN_REQUEST };
  }
  function success(data) {
    return { type: LOGIN_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: LOGIN_FAILURE, error };
  }
};

export const logout = callback => {
  return dispatch => {
    dispatch(request());
    removeToken(TOKEN_TYPE);
    dispatch(success());
    callback();
  };

  function request() {
    return { type: LOGOUT_REQUEST };
  }
  function success(data) {
    return { type: LOGOUT_SUCCESS };
  }
};

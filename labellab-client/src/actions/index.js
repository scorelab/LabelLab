import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  SET_USER_DATA_FAILURE,
  SET_USER_DATA_REQUEST,
  SET_USER_DATA_SUCCESS,
  UPLOAD_USER_IMAGE_FAILURE,
  UPLOAD_USER_IMAGE_REQUEST,
  UPLOAD_USER_IMAGE_SUCCESS,
  INITIALIZE_PROJECT_FAILURE,
  INITIALIZE_PROJECT_REQUEST,
  INITIALIZE_PROJECT_SUCCESS,
  TOKEN_TYPE
} from "../constants/index";

import FetchApi from "../utils/FetchAPI";
import { setToken, logout, getToken } from "../utils/token";

const token = getToken(TOKEN_TYPE);

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
      .catch(error => {
        dispatch(failure(error));
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

export const log_out = callback => {
  return dispatch => {
    dispatch(request());
    logout(TOKEN_TYPE);
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

export const userRegister = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("POST", "/api/v1/auth/register", data)
      .then(() => {
        dispatch(success());
        callback();
      })
      .catch(err => {
        if (err.response) {
          err.response.data ? 
          dispatch(failure(err.response.data.msg, err.response.data.err_field))
          : dispatch(failure(err.response.statusText,null))
        }
      });
  };
  function request() {
    return { type: REGISTER_REQUEST };
  }
  function success() {
    return { type: REGISTER_SUCCESS, payload: "Login to continue!" };
  }
  function failure(error, other) {
    return { type: REGISTER_FAILURE, payload: error, other: other };
  }
};

export const fetchUser = () => {
  return dispatch => {
    dispatch(request());
    FetchApi("GET", "/api/v1/users/info", null, getToken(TOKEN_TYPE))
      .then(res => {
        dispatch(success(res.data.body));
      })
      .catch(err => {
        if (err.response) {
          dispatch(failure(err.response.statusText));
        }
      });
  };
  function request() {
    return { type: SET_USER_DATA_REQUEST };
  }
  function success(data) {
    return { type: SET_USER_DATA_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: SET_USER_DATA_FAILURE, payload: error };
  }
};

export const uploadImage = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("POST", "/api/v1/users/upload_image", data, token)
      .then(() => {
        dispatch(success());
        callback("true");
      })
      .catch(err => {
        if (err.response) {
          dispatch(failure());
        }
      });
  };
  function request() {
    return { type: UPLOAD_USER_IMAGE_REQUEST };
  }
  function success() {
    return { type: UPLOAD_USER_IMAGE_SUCCESS };
  }
  function failure() {
    return { type: UPLOAD_USER_IMAGE_FAILURE };
  }
};

export const initProject = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("POST", "/api/v1/project/create", data, token)
      .then(res => {
        dispatch(success(res.data.body));
        callback(res.data.body._id);
      })
      .catch(err => {
        if (err.response) {
          dispatch(failure(err.response.data.msg));
        }
      });
  };
  function request() {
    return { type: INITIALIZE_PROJECT_REQUEST };
  }
  function success(data) {
    return { type: INITIALIZE_PROJECT_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: INITIALIZE_PROJECT_FAILURE, payload: error };
  }
};

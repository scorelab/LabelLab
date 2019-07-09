import {
  INITIALIZE_PROJECT_FAILURE,
  INITIALIZE_PROJECT_REQUEST,
  INITIALIZE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAILURE,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
  POST_PROJECT_IMAGE_FAILURE,
  POST_PROJECT_IMAGE_REQUEST,
  POST_PROJECT_IMAGE_SUCCESS,
  TOKEN_TYPE
} from "../../constants/index";

import FetchApi from "../../utils/FetchAPI";
import { getToken } from "../../utils/token";

const token = getToken(TOKEN_TYPE);

export const initProject = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("POST", "/api/v1/project/create", data, getToken(TOKEN_TYPE))
      .then(res => {
        dispatch(success(res.data.body));
        callback(res.data.body._id);
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
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

export const updateProject = (data, project_id, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("PUT", "/api/v1/project/update/" + project_id, data, token)
      .then(res => {
        dispatch(success());
        callback();
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: UPDATE_PROJECT_REQUEST };
  }
  function success(data) {
    return { type: UPDATE_PROJECT_SUCCESS };
  }
  function failure(error) {
    return { type: UPDATE_PROJECT_FAILURE, payload: error };
  }
};

export const uploadProjectImage = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi(
      "POST",
      "/api/v1/project/" + data.project_id + "/image",
      data,
      token
    )
      .then(res => {
        dispatch(success(res.data.body));
        callback();
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: POST_PROJECT_IMAGE_REQUEST };
  }
  function success(data) {
    return { type: POST_PROJECT_IMAGE_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: POST_PROJECT_IMAGE_FAILURE, payload: error };
  }
};

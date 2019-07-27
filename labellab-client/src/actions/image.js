import {
  DELETE_IMAGE_FAILURE,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  POST_IMAGE_FAILURE,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_REQUEST,
  FETCH_IMAGE_FAILURE,
  FETCH_IMAGE_REQUEST,
  FETCH_IMAGE_SUCCESS,
  SET_IMAGE_STATE,
  TOKEN_TYPE
} from "../constants/index";

import FetchApi from "../utils/FetchAPI";
import { getToken } from "../utils/token";

const token = getToken(TOKEN_TYPE);

export const submitImage = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi(
      "POST",
      "/api/v1/image/" + data.projectId + "/create",
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
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: POST_IMAGE_REQUEST };
  }
  function success(data) {
    return { type: POST_IMAGE_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: POST_IMAGE_FAILURE, payload: error };
  }
};

export const fetchProjectImage = (imageId, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("GET", "/api/v1/image/" + imageId + "/get", null, token)
      .then(res => {
        console.log(res.data.body)
        dispatch(success(res.data.body));
        callback();
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
    return { type: FETCH_IMAGE_REQUEST };
  }
  function success(data) {
    return { type: FETCH_IMAGE_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: FETCH_IMAGE_FAILURE, payload: error };
  }
};

export const deleteImage = (imageId, projectId, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi(
      "DELETE",
      "/api/v1/image/" + projectId + "/delete/" + imageId,
      null,
      token
    )
      .then(res => {
        dispatch(success());
        callback();
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
    return { type: DELETE_IMAGE_REQUEST };
  }
  function success() {
    return { type: DELETE_IMAGE_SUCCESS };
  }
  function failure(error) {
    return { type: DELETE_IMAGE_FAILURE, payload: error };
  }
};

export const setNextPrev = (next, prev) => {
  return dispatch => {
    let data = {
      next: next,
      prev: prev
    };
    console.log(data);
    dispatch(request(data));
  };
  function request(data) {
    return { type: SET_IMAGE_STATE, payload: data };
  }
};

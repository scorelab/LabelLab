import {
  IMAGE_PREVIEW_REQUEST,
  IMAGE_PREVIEW_SUCCESS,
  POST_IMAGE_FAILURE,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_REQUEST,
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
      "/api/v1/image/" + data.project_id + "/create",
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
    return { type: POST_IMAGE_REQUEST };
  }
  function success(data) {
    return { type: POST_IMAGE_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: POST_IMAGE_FAILURE, payload: error };
  }
};

export const imagePreview = data => {
  return dispatch => {
    dispatch(request());
    dispatch(success(data));
  };
  function request() {
    return { type: IMAGE_PREVIEW_REQUEST };
  }
  function success(data) {
    return { type: IMAGE_PREVIEW_SUCCESS, payload: data };
  }
};

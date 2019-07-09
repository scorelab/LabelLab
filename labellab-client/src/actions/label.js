import {
  POST_LABEL_FAILURE,
  POST_LABEL_REQUEST,
  POST_LABEL_SUCCESS,
  TOKEN_TYPE
} from "../constants/index";

import FetchApi from "../utils/FetchAPI";
import { getToken } from "../utils/token";

const token = getToken(TOKEN_TYPE);

export const postLabel = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("POST", "/api/v1/label/" + data.image_id + "/create", data, token)
      .then(res => {
        dispatch(success(res.data));
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
    return { type: POST_LABEL_REQUEST };
  }
  function success(data) {
    return { type: POST_LABEL_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: POST_LABEL_FAILURE, payload: error };
  }
};

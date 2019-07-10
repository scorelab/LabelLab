import {
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ALL_FAILURE,
  FETCH_PROJECT_ALL_REQUEST,
  FETCH_PROJECT_ALL_SUCCESS,
  TOKEN_TYPE
} from "../../constants/index";

import FetchApi from "../../utils/FetchAPI";
import { getToken } from "../../utils/token";

const token = getToken(TOKEN_TYPE);

export const fetchAllProject = () => {
  return dispatch => {
    dispatch(request());
    FetchApi("GET", "/api/v1/project/get/", null, getToken(TOKEN_TYPE))
      .then(res => {
        dispatch(success(res.data.body));
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
    return { type: FETCH_PROJECT_ALL_REQUEST };
  }
  function success(data) {
    return { type: FETCH_PROJECT_ALL_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: FETCH_PROJECT_ALL_FAILURE, payload: error };
  }
};

export const fetchProject = data => {
  return dispatch => {
    dispatch(request());
    FetchApi("GET", "/api/v1/project/get/" + data, null, token)
      .then(res => {
        dispatch(success(res.data.body));
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
    return { type: FETCH_PROJECT_REQUEST };
  }
  function success(data) {
    return { type: FETCH_PROJECT_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: FETCH_PROJECT_FAILURE, payload: error };
  }
};

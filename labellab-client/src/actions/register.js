import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'

export const userRegister = (data, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/auth/register', data)
      .then(() => {
        dispatch(success())
        callback()
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
              failure(err.response.data.msg, err.response.data.err_field)
            )
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: REGISTER_REQUEST }
  }
  function success() {
    return { type: REGISTER_SUCCESS, payload: 'Please log in to continue.' }
  }
  function failure(error, other) {
    return { type: REGISTER_FAILURE, payload: error, other: other }
  }
}

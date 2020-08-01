import {
    FETCH_COORDINATES_FAILURE,
    FETCH_COORDINATES_REQUEST,
    FETCH_COORDINATES_SUCCESS 
  } from '../../constants/index'
  
  import FetchApi from '../../utils/FetchAPI'
  
  export const fetchCoordinates = (projectId) => {
    return dispatch => {
      dispatch(request())
      FetchApi.get('/api/v1/project/polylines/' + projectId)
        .then(res => {
          dispatch(success(res.data.body))
        })
        .catch(err => {
          if (err.response) {
            err.response.data
              ? dispatch(failure(err.response.data.msg))
              : dispatch(failure(err.response.statusText, null))
          }
        })
    }
    function request() {
      return { type: FETCH_COORDINATES_REQUEST }
    }
    function success(data) {
      return { type: FETCH_COORDINATES_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_COORDINATES_FAILURE, payload: error }
    }
  }
  
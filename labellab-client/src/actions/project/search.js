import { SEARCH_PROJECTS, SEARCH_PROJECTS_FAILURE } from '../../constants/index'

import FetchApi from '../../utils/FetchAPI'

export const getSearchProjects = query => {
  return dispatch => {
    if (!query) {
      query = 'null'
    }
    FetchApi('GET', '/api/v1/project/search/' + query, null, true)
      .then(response => {
        dispatch(success(response.data.body))
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
  function success(data) {
    return { type: SEARCH_PROJECTS, payload: data }
  }
  function failure(error) {
    return { type: SEARCH_PROJECTS_FAILURE, payload: error }
  }
}

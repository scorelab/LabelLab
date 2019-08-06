import { SEARCH_PROJECTS, SEARCH_PROJECTS_FAILURE } from '../constants/index'
const searchProjects = (state = [], action) => {
  switch (action.type) {
    case SEARCH_PROJECTS:
      return action.payload
    case SEARCH_PROJECTS_FAILURE:
      return action.payload
    default:
      return state
  }
}
export default searchProjects

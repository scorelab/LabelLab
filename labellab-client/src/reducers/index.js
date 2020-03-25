import { combineReducers } from 'redux'
import auth from './auth'
import register from './register'
import user from './user'
import project from './project'
import image from './image'
import label from './label'
import searchProjects from './search'
import searchUser from './searchUser'
import analytics from './analytics'

const rootReducers = combineReducers({
  auth: auth,
  register: register,
  user: user,
  projects: project,
  images: image,
  labels: label,
  searchProjects: searchProjects,
  searchUser: searchUser,
  analytics: analytics
})

export default rootReducers

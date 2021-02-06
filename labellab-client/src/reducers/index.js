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
import model from "./model"

const rootReducers = combineReducers({
  auth,
  register,
  user,
  searchProjects,
  searchUser,
  analytics,
  model,
  projects: project,
  images: image,
  labels: label,
})

export default rootReducers

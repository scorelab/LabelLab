import { combineReducers } from "redux"
import auth from "./auth"
import register from "./register"
import user from "./user"
import project from "./project"

const rootReducers = combineReducers({
	auth: auth,
	register: register,
	user: user,
	projects: project
})

export default rootReducers
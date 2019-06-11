import { createStore, compose, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import rootReducer from "../reducers/index"

const initialState = {}
const middleware = [thunk]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
	rootReducer,
	initialState,
	composeEnhancers(applyMiddleware(...middleware))
)

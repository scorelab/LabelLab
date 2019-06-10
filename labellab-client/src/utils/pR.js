import React from "react"
import { Route, Redirect } from "react-router-dom"
import { TOKEN_TYPE } from "../constants/index"
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			localStorage.getItem(TOKEN_TYPE) ? (
				<Component {...props} />
			) : (
				<Redirect
					to="/login"
				/>
			)
		}
	/>
)

export default PrivateRoute

import React, { Component } from "react"
import {withRouter} from "react-router-dom"
import { Card, Header } from "semantic-ui-react"
import { connect } from "react-redux"
// import "./css/home.css"
import { fetchAllProject } from "../../actions/index"

class PreviousProject extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	componentDidMount() {
		console.log(this.props)

		this.props.fetchAllProject()
	}
	handleClick = id => {
		this.props.history.push({
			pathname:'/labeller',
		    search:'?project_id='+id
		})
	}
	render() {
		return (
			<div>
				{!this.props.actions.isfetching ? (
					this.props.projects[0] &&
					this.props.projects.map((project, index) => (
							<Card onClick={() => this.handleClick(project._id)}>
								<Card.Content className="card-headers" header={project.project_name} />
								<Card.Content description="Image Labelling App" />
								<Card.Content extra />
							</Card>
					))
				) : (
					<Header as="h2" content="Loading" />
				)}
			</div>
		)
	}
}
const mapStateToProps = state => {
	return {
		projects: state.projects.allProjects,
		actions: state.projects.projectActions
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchAllProject: () => {
			return dispatch(fetchAllProject())
		}
	}
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(PreviousProject))
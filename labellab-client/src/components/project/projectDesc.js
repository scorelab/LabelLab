import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Header,
  Icon,
  TextArea,
  Form,
  Button,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import { updateProject, fetchProject } from '../../actions/index'
import './css/projectDesc.css'

class ProjectDescriptionIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false,
      desc: ''
    }
  }
  componentDidUpdate(prevProps) {
    const { project } = this.props
    if (prevProps.project !== project) {
      this.setState({
        desc: project.projectDescription
      })
    }
  }
  handleUpdate = () => {
    this.setState({
      edit: !this.state.edit
    })
  }
  handleSubmit = () => {
    const { updateProject, project } = this.props
    let data = {
      projectDescription: this.state.desc
    }

    updateProject(data, project.projectId, this.callback)
  }
  callback = () => {
    const { project, fetchProject } = this.props
    this.setState({
      edit: false
    })
    fetchProject(project.projectId)
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const { actions } = this.props
    const { edit, desc } = this.state
    return (
      <div className="projectDesc-parent">
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}
        <div className="projectDesc-header">
          <Header content="Project Description" as="h4" />
          <Icon name="pencil alternate" onClick={this.handleUpdate} />
        </div>
        {edit ? (
          <Form>
            <TextArea
              placeholder="Write some project description"
              value={desc}
              onChange={this.handleChange}
              name="desc"
            />
            <Button
              className="projectDesc-submit"
              floated="right"
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </Form>
        ) : null}
        {!edit && desc ? desc : null}
      </div>
    )
  }
}

ProjectDescriptionIndex.propTypes = {
  project: PropTypes.object,
  actions: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func,
  updateProject: PropTypes.func
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.projects.projectActions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateProject: (data, projectId, callback) => {
      return dispatch(updateProject(data, projectId, callback))
    },
    fetchProject: data => {
      return dispatch(fetchProject(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDescriptionIndex)

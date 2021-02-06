import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Header,
  Icon,
  Input,
  Button,
  Card,
  Dimmer,
  Loader,
  Modal
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
        name: project.projectName,
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
      project_description: this.state.desc,
      project_name: project.projectName
    }

    updateProject(data, project.projectId, this.callback)
  }
  callback = () => {
    const { project, fetchProject } = this.props
    this.close()
    fetchProject(project.projectId)
  }
  close = () => {
    this.setState({
      edit: false
    })
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const { actions } = this.props
    const { edit, name, desc } = this.state
    return (
      <div className="projectDesc-parent">
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : (
            <Card>
              <Card.Header className="projectDesc-header">
                <Header content={name} as="h4"></Header>
                <Icon name="pencil alternate" onClick={this.handleUpdate} />
              </Card.Header>
              <Card.Content>
                {edit ? (
                  <Modal size="small" open={this.state.edit} onClose={this.close}>
                    <Modal.Header>
                      <p>Enter Project Description</p>
                    </Modal.Header>
                    <Modal.Actions>
                      <div className="modal-actions">
                        <Input
                          name="desc"
                          type="text"
                          label="Description"
                          placeholder="Description..."
                          defaultValue={this.state.desc}
                          onChange={this.handleChange}
                        />
                        <div>
                          <Button
                            positive
                            onClick={this.handleSubmit}
                            content="Submit"
                          />
                        </div>
                      </div>
                    </Modal.Actions>
                  </Modal>
                ) : null}
                {!edit && desc ? desc : null}
              </Card.Content>
            </Card>
          )}
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

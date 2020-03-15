import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Button, Confirm, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchProject,
  deleteProject,
  fetchAllProject
} from '../../actions/index'
import './css/sidebar.css'

class ProjectSidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: ''
    }
  }
  componentDidMount() {
    this.setState({
      activeItem: window.location.pathname.substring(34),
      open: false
    })
  }
  imageCallback = () => {
    const { fetchProject, project } = this.props
    fetchProject(project.projectId)
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleDeleteProject = () => {
    this.handleClose()
    this.props.deleteProject(
      this.props.project.projectId,
      this.fetchAllProjectCallback
    )
  }
  fetchAllProjectCallback = () => {
    fetchAllProject()
    this.props.history.push({
      pathname: '/'
    })
  }
  handleOpen = () => {
    this.setState({
      open: true
    })
  }
  handleClose = () => {
    this.setState({
      open: false
    })
  }
  render() {
    const { project } = this.props
    const { activeItem } = this.state
    return (
      <div className="sidebar-parent">
        {project.images ? (
          <div>
            <div className="sidebar-menu-parent">
              <Menu vertical size="large">
                <Menu.Item
                  as={Link}
                  to={`/project/${project.projectId}/team`}
                  name="team"
                  active={activeItem === 'team'}
                  onClick={this.handleItemClick}
                >
                  Project Team
                </Menu.Item>

                <Menu.Item
                  as={Link}
                  to={`/project/${project.projectId}/images`}
                  name="images"
                  active={activeItem === 'images'}
                  onClick={this.handleItemClick}
                >
                  Project Images
                  <Label>{project.images.length}</Label>
                </Menu.Item>

                <Menu.Item
                  as={Link}
                  to={`/project/${project.projectId}/analytics`}
                  name="analytics"
                  active={activeItem === 'analytics'}
                  onClick={this.handleItemClick}
                >
                  Project Analytics
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to={`/project/${project.projectId}/labels`}
                  name="labels"
                  active={activeItem === 'labels'}
                  onClick={this.handleItemClick}
                >
                  Project Labels
                </Menu.Item>
              </Menu>
            </div>

            <Button
              negative
              className="delete-project-button"
              onClick={this.handleOpen}
              content="Delete Project"
            />
            <Confirm
              open={this.state.open}
              onCancel={this.handleClose}
              onConfirm={this.handleDeleteProject}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}

ProjectSidebar.propTypes = {
  project: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func,
  fetchAllProject: PropTypes.func,
  deleteProject: PropTypes.func
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: data => {
      return dispatch(fetchProject(data))
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject())
    },
    deleteProject: (projectId, callback) => {
      return dispatch(deleteProject(projectId, callback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSidebar)

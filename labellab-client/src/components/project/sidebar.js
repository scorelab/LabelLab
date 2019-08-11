import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchProject } from '../../actions/index'
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
      activeItem: window.location.pathname.substring(34)
    })
  }
  imageCallback = () => {
    const { fetchProject, project } = this.props
    fetchProject(project.projectId)
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { project } = this.props
    const { activeItem } = this.state
    return (
      <div className="sidebar-parent">
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
      </div>
    )
  }
}

ProjectSidebar.propTypes = {
  project: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSidebar)

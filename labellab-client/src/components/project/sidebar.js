import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { fetchProject } from "../../actions/index";
import "./css/sidebar.css";

class ProjectSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: ""
    };
  }
  componentDidMount() {
    this.setState({
      activeItem: window.location.pathname.substring(34)
    });
  }
  imageCallback = () => {
    this.props.fetchProject(this.props.project.project_id);
  };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <div className="sidebar-parent">
        <div className="sidebar-menu-parent">
          <Menu vertical size="large">
            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/team`}
              name="team"
              active={this.state.activeItem === "team"}
              onClick={this.handleItemClick}
            >
              Project Team
            </Menu.Item>

            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/images`}
              name="images"
              active={this.state.activeItem === "images"}
              onClick={this.handleItemClick}
            >
              Project Images
            </Menu.Item>

            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/analytics`}
              name="analytics"
              active={this.state.activeItem === "analytics"}
              onClick={this.handleItemClick}
            >
              Project Analytics
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/labels`}
              name="labels"
              active={this.state.activeItem === "labels"}
              onClick={this.handleItemClick}
            >
              Project Labels
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isfetching: state.projects.projectActions.isfetching,
    project: state.projects.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: data => {
      return dispatch(fetchProject(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSidebar);

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import "./css/sidebar.css";

class ProjectSidebar extends Component {
  render() {
    return (
      <div className="sidebar-parent">
        <div>
          <Image />
        </div>
        <div>
          <Menu vertical>
            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/team`}
              name="team"
            >
              Project Team
            </Menu.Item>

            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/images`}
              name="images"
            >
              Project Images
            </Menu.Item>

            <Menu.Item
              as={Link}
              to={`/project/${this.props.project.project_id}/analytics`}
              name="analytics"
            >
              Project Analytics
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSidebar);

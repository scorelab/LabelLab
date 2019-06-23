import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { connect } from "react-redux";
import "./css/sidebar.css";

class ProjectSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project_id: ""
    };
  }
  render() {
    console.log(this.state);
    const pathname = this.props.history.location.pathname
    return (
      <div className="sidebar-parent">
        <div>
          <Image />
        </div>
        <div>
          <ul>
            <Link to={`${pathname}/team`}>
              <li>Project Team</li>
            </Link>
            {/* <Link to={`/project/${this.state.project_id}/team`}>
              <li>Project Configuration</li>
            </Link> */}
            <Link to={`${pathname}/images`}>
              <li>Images</li>
            </Link>
            <Link to={`${pathname}/analytics`}>
              <li>Analytics</li>
            </Link>
            {/* <Link to={`${pathname}/team`}>
              <li>Path tracking feature</li>
            </Link> */}
          </ul>
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

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { uploadProjectImage, fetchProject } from "../../actions/index";
import "./css/sidebar.css";

class ProjectSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      image: ""
    };
  }
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file
      });
      this.onSubmit(e);
    };
    reader.readAsDataURL(file);
  };
  onSubmit = e => {
    let { file, image } = this.state;
    if (file && file.size > 101200) {
      this.setState({
        max_size_error: "max sized reached"
      });
    } else {
      let data = {
        image: image,
        format: file.type,
        project_id: this.props.project.project_id
      };
      this.props.uploadProjectImage(data, this.imageCallback);
    }
  };
  imageCallback = () => {
    this.props.fetchProject(this.props.project.project_id);
  };
  render() {
    return (
      <div className="sidebar-parent">
        <div className="profile-first-leftbar">
          {this.props.isfetching ? (
            <h4>LOADING</h4>
          ) : this.props.project && this.props.project.project_image ? (
            <Image
              centered
              src={
                process.env.REACT_APP_HOST +
                process.env.REACT_APP_SERVER_PORT +
                `/static/project/${
                  this.props.project.project_image
                }?${Date.now()}`
              }
              size="medium"
            />
          ) : null}
          <div>
            <input
              type="file"
              onChange={this.handleImageChange}
              className="file-input"
              id="embedpollfileinput"
            />
            <label
              htmlFor="embedpollfileinput"
              className="ui medium primary left floated button custom-margin"
            >
              Change Project Image
            </label>
          </div>
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
    isfetching: state.projects.projectActions.isfetching,
    project: state.projects.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadProjectImage: (data, callback) => {
      return dispatch(uploadProjectImage(data, callback));
    },
    fetchProject: data => {
      return dispatch(fetchProject(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSidebar);

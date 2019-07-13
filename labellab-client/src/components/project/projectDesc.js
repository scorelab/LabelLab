import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Header,
  Icon,
  TextArea,
  Form,
  Button,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { updateProject, fetchProject } from "../../actions/index";
import "./css/projectDesc.css";

class ProjectDescriptionIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      desc: ""
    };
  }
  componentDidMount() {
    if (this.props.project.currentProject) {
      this.setState({
        desc: this.props.project.project_description
      });
    }
  }
  handleUpdate = () => {
    this.setState({
      edit: !this.state.edit
    });
  };
  handleSubmit = () => {
    let data = {
      project_description: this.state.desc
    };

    this.props.updateProject(
      data,
      this.props.project.project_id,
      this.callback
    );
  };
  callback = () => {
    this.setState({
      edit: false
    });
    this.props.fetchProject(this.props.project.project_id);
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    return (
      <div className="projectDesc-parent">
        {this.props.actions.isfetching ? (
          <Dimmer active={this.props.actions.isfetching}>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}
        <div className="projectDesc-header">
          <Header content="Project Description" as="h4" />
          <Icon name="pencil alternate" onClick={this.handleUpdate} />
        </div>
        {this.state.edit ? (
          <Form>
            <TextArea
              placeholder="Write some project description"
              value={this.state.desc}
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
        {!this.state.edit &&
        this.props.project &&
        this.props.project.project_description
          ? this.props.project.project_description
          : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.projects.projectActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProject: (data, project_id, callback) => {
      return dispatch(updateProject(data, project_id, callback));
    },
    fetchProject: data => {
      return dispatch(fetchProject(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDescriptionIndex);

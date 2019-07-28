import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { fetchProject } from "../../actions/index";
import PrivateRoute from "../../utils/pR";
import Sidebar from "./sidebar";
import ProjectNavbar from "../navbar/project";
import Images from "./images";
import Analytics from "./analytics";
import ProjectDescription from "./projectDesc";
import Team from "./team";
import Labels from "./label/index"
import "./css/index.css";

class ProjectIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.fetchProject(this.props.location.pathname.substring(9, 33));
  }
  render() {
    const { match } = this.props;
    // console.log(this.props)
    return (
      <React.Fragment>
        {this.props.actions.isfetching ? (
          <Dimmer active={this.props.actions.isfetching}>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}
        {this.props.actions.isuploading ? (
          <Dimmer active={this.props.actions.isuploading}>
            <Loader indeterminate>Uploading Image</Loader>
          </Dimmer>
        ) : null}
        <ProjectNavbar history={this.props.history} />
        <div className="project-main">
          <Sidebar history={this.props.history} />
          <div className="project-non-side-section">
            <ProjectDescription history={this.props.history} />
            <Switch>
              <PrivateRoute
                exact
                path={`${match.path}/:id/team`}
                component={Team}
              />
              <PrivateRoute
                exact
                path={`${match.path}/:id/images`}
                component={Images}
              />
              <PrivateRoute
                exact
                path={`${match.path}/:id/analytics`}
                component={Analytics}
              />
              <PrivateRoute
                exact
                path={`${match.path}/:id/labels`}
                component={Labels}
              />
            </Switch>
          </div>
        </div>
        </React.Fragment>
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
    fetchProject: data => {
      return dispatch(fetchProject(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectIndex);

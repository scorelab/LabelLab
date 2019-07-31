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
import Labels from "./label/index";
import "./css/index.css";

class ProjectIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match, fetchProject } = this.props;
    fetchProject(match.params.projectId);
  }
  render() {
    const { match, actions, history } = this.props;
    return (
      <React.Fragment>
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}
        {actions.isuploading ? (
          <Dimmer active>
            <Loader indeterminate>Uploading Image</Loader>
          </Dimmer>
        ) : null}
        <ProjectNavbar history={history} />
        <div className="project-main">
          <Sidebar history={history} />
          <div className="project-non-side-section">
            <ProjectDescription history={history} />
            <Switch>
              <PrivateRoute
                exact
                path={`${match.path}/team`}
                component={Team}
              />
              <PrivateRoute
                exact
                path={`${match.path}/images`}
                component={Images}
              />
              <PrivateRoute
                exact
                path={`${match.path}/analytics`}
                component={Analytics}
              />
              <PrivateRoute
                exact
                path={`${match.path}/labels`}
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

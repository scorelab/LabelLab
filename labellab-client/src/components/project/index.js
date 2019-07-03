import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { fetchProject } from "../../actions/index";
import PrivateRoute from "../../utils/pR";
import Sidebar from "./sidebar";
import ProjectNavbar from "../navbar/project";
import Images from "./images";
import Analytics from "./analytics";
import ProjectDescription from "./projectDesc";
import Team from "./team";
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
    return (
      <BrowserRouter>
        <ProjectNavbar history={this.props.history} />
        <div className="project-main">
          <Sidebar history={this.props.history} />
          <div>
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
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => {
  return {};
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

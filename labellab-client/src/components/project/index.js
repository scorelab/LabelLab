import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import PrivateRoute from "../../utils/pR";
import Sidebar from "./sidebar";
import ProjectNavbar from "../navbar/project";
import Images from "./images";
import Analytics from "./analytics";
import Team from "./team";
import "./css/index.css"

class ProjectIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { match } = this.props;
    return (
      <BrowserRouter>
        <ProjectNavbar history={this.props.history} />
        <div className="project-main">
          <Sidebar history={this.props.history} />
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
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectIndex);

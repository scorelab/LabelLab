import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import { connect } from "react-redux";
// import "./css/home.css"
import { fetchAllProject } from "../../actions/index";
import CardLoader from "../../utils/cardLoader";

class PreviousProject extends Component {
  componentDidMount() {
    this.props.fetchAllProject();
  }
  handleClick = id => {
    this.props.history.push({
      pathname: "/labeller",
      search: "?project_id=" + id
    });
  };
  render() {
    return (
      <div>
        <Card.Group itemsPerRow={3}>
          {!this.props.actions.isfetching ? (
            this.props.projects[0] &&
            this.props.projects.map((project, index) => (
              <Card onClick={() => this.handleClick(project._id)}>
                <Card.Content
                  className="card-headers"
                  header={project.project_name}
                />
                <Card.Content description="Image Labelling App" />
                <Card.Content extra />
              </Card>
            ))
          ) : (
            <CardLoader />
          )}
        </Card.Group>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    projects: state.projects.allProjects,
    actions: state.projects.projectActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllProject: () => {
      return dispatch(fetchAllProject());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreviousProject)
);

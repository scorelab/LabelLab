import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import { fetchAllProject } from "../../actions/index";
import CardLoader from "../../utils/cardLoader";
import "./css/previous.css";

class PreviousProject extends Component {
  componentDidMount() {
    this.props.fetchAllProject();
  }
  handleClick = id => {
    this.props.history.push({
      pathname: "/project/" + id + "/team"
    });
  };
  render() {
    const { actions, projects } = this.props;
    return (
      <div className="previous-card-parent">
        <Card.Group itemsPerRow={3}>
          {!actions.isfetching ? (
            projects[0] &&
            projects.map((project, index) => (
              <Card
                key={index}
                onClick={() => this.handleClick(project._id)}
                color="green"
              >
                <Card.Content
                  className="card-headers"
                  header={project.projectName}
                />
                <Card.Content description="Image Labelling App" />
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

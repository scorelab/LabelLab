import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Header } from "semantic-ui-react";
import "./css/images.css";

class ImagesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleRedirection = id => {
    this.props.history.push({
      pathname: "/labeller/" + this.props.projects.project_id + "/" + id
    });
  };
  render() {
    const { projects } = this.props;
    return (
      <div className="image-grand-parent">
        <Header as="h2" content="Images" />
        <div className="image-parent">
          {projects &&
            projects.images &&
            projects.images.map((image, index) => (
              <div onClick={() => this.handleRedirection(image._id)}>
                <Image
                  key={index}
                  src={
                    process.env.REACT_APP_HOST +
                    process.env.REACT_APP_SERVER_PORT +
                    `/static/uploads/${image.image_url}?${Date.now()}`
                  }
                  size="medium"
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    projects: state.projects.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesIndex);

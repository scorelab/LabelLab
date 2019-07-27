import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Loader, Dimmer, Modal, Button } from "semantic-ui-react";
import DocumentMeta from "react-document-meta";
import {
  fetchLabels,
  updateLabels,
  fetchProjectImage,
  fetchProject,
  setNextPrev
} from "../../actions/index";
import LabelingApp from "./LabelingApp.js";

class LabelingLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      image: null,
      isLoaded: false,
      error: null
    };
  }
  componentDidMount() {
    const { match, fetchLabels, fetchProject, fetchProjectImage } = this.props;
    fetchLabels(match.params.projectId);
    fetchProject(match.params.projectId, this.setImageState);
    fetchProjectImage(match.params.imageId);
  }
  componentDidUpdate(prevProps) {
    const { match, fetchLabels, fetchProject, fetchProjectImage } = this.props;
    if (prevProps.match.params.image_id !== match.params.image_id) {
      fetchLabels(match.params.projectId);
      fetchProject(match.params.imageId, this.setImageState);
      fetchProjectImage(match.params.imageId);
    }
  }
  setImageState = () => {
    const { match, setNextPrev, allImages } = this.props;
    const len = allImages && allImages.length;
    allImages &&
      allImages.map((image, index) =>
        image._id === match.params.imageId
          ? index === 0
            ? len <= 1
              ? setNextPrev({}, {})
              : setNextPrev(allImages[index + 1], {})
            : setNextPrev(allImages[index + 1], allImages[index - 1])
          : null
      );
  };
  pushUpdate(labelData) {
    const { match, updateLabels } = this.props;
    updateLabels(match.params.imageId, labelData);
  }
  render() {
    const {
      match,
      prev,
      next,
      history,
      image,
      labelActions,
      imageActions,
      lab
    } = this.props;
    const props = {
      onBack: () => {
        history.push(`/labeller/${match.params.projectId}/${prev._id}`);
      },
      onSkip: () => {
        history.push(`/labeller/${match.params.projectId}/${next._id}`);
      },
      onLabelChange: this.pushUpdate.bind(this)
    };
    console.log(image)
    const title = image && image.imageName;
    return (
      <DocumentMeta title={title}>
        {labelActions.isfetching &&
        labelActions.isupdating &&
        imageActions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : lab.length > 0 ? (
          <LabelingApp
            labels={lab}
            // reference={{ referenceLink, referenceText }}
            labelData={(image && image.labelData) || {}}
            imageUrl={
              process.env.REACT_APP_HOST +
              process.env.REACT_APP_SERVER_PORT +
              `/static/uploads/${image.imageUrl}?${Date.now()}`
            }
            // fetch={this.fetch.bind(this)}
            demo={false}
            {...props}
          />
        ) : (
          <Modal size="small" open>
            <Modal.Content>
              <p>
                It seems that you have not created any labels in the project.
                Click on the below button to create labels!
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Link to={`/project/${match.params.projectId}}/labels`}>
                <Button positive content="Create Labels" />
              </Link>
            </Modal.Actions>
          </Modal>
        )}
      </DocumentMeta>
    );
  }
}

const mapStateToProps = state => {
  return {
    lab: state.labels.labels,
    labelActions: state.labels.labelActions,
    imageActions: state.images.imageActions,
    image: state.images.currentImage,
    allImages: state.projects.currentProject.images,
    next: state.images.nextImage,
    prev: state.images.prevImage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: (imageId, callback) => {
      return dispatch(fetchProject(imageId, callback));
    },
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId));
    },
    fetchProjectImage: imageId => {
      return dispatch(fetchProjectImage(imageId));
    },
    updateLabels: (imageId, labelData) => {
      return dispatch(updateLabels(imageId, labelData));
    },
    setNextPrev: (next, prev) => {
      return dispatch(setNextPrev(next, prev));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelingLoader);

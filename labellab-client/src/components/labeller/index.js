import React, { Component } from "react";
import LabelingApp from "./LabelingApp.js";
import { connect } from "react-redux";
import { Loader, Dimmer, Modal, Button } from "semantic-ui-react";
import DocumentMeta from "react-document-meta";
import {
  fetchLabels,
  updateLabels,
  fetchProjectImage,
  fetchProject,
  setNextPrev
} from "../../actions/index";

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
    this.props.fetchLabels(this.props.location.pathname.substring(10, 34));
    this.props.fetchProjectImage(this.props.location.pathname.substring(35));
    this.props.fetchProject(
      this.props.location.pathname.substring(10, 34),
      this.setImageState
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.image_id !== this.props.match.params.image_id) {
      this.props.fetchLabels(this.props.match.params.project_id);
      this.props.fetchProjectImage(this.props.match.params.image_id);
    }
  }
  setImageState = () => {
    const len = this.props.allImages && this.props.allImages.length;
    this.props.allImages &&
      this.props.allImages.map((image, index) =>
        image._id === this.props.location.pathname.substring(35)
          ? index === 0
            ? len <= 1
              ? this.props.setNextPrev({}, {})
              : this.props.setNextPrev(this.props.allImages[index + 1], {})
            : this.props.setNextPrev(
                this.props.allImages[index + 1],
                this.props.allImages[index - 1]
              )
          : null
      );
  };
  pushUpdate(labelData) {
    let image_id = this.props.location.pathname.substring(35);
    this.props.updateLabels(image_id, labelData);
  }
  render() {
    const props = {
      onBack: () => {
        this.props.history.push(
          `/labeller/${this.props.location.pathname.substring(10, 34)}/${
            this.props.prev._id
          }`
        );
      },
      onSkip: () => {
        this.props.history.push(
          `/labeller/${this.props.location.pathname.substring(10, 34)}/${
            this.props.next._id
          }`
        );
      },
      onLabelChange: this.pushUpdate.bind(this)
    };
    const title = this.props.image && this.props.image.image_name;
    return (
      <DocumentMeta title={title}>
        {this.props.labelActions.isfetching &&
        this.props.labelActions.isupdating &&
        this.props.imageActions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : this.props.lab.length > 0 ? (
          <LabelingApp
            labels={this.props.lab}
            // reference={{ referenceLink, referenceText }}
            labelData={(this.props.image && this.props.image.labelData) || {}}
            imageUrl={
              process.env.REACT_APP_HOST +
              process.env.REACT_APP_SERVER_PORT +
              `/static/uploads/${this.props.image.image_url}?${Date.now()}`
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
              <a
                href={`/project/${this.props.location.pathname.substring(
                  10,
                  34
                )}/labels`}
              >
                <Button positive content="Create Labels" />
              </a>
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
    fetchLabels: project_id => {
      return dispatch(fetchLabels(project_id));
    },
    updateLabels: (image_id, labelData) => {
      return dispatch(updateLabels(image_id, labelData));
    },
    fetchProjectImage: (image_id, callback) => {
      return dispatch(fetchProjectImage(image_id, callback));
    },
    fetchProject: (data, callback) => {
      return dispatch(fetchProject(data, callback));
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

import React, { Component } from "react";
import LabelingApp from "./LabelingApp.js";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import DocumentMeta from "react-document-meta";
import { fetchLabels, updateLabels } from "../../actions/label";
import { fetchProjectImage } from "../../actions/image";

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
  }
  pushUpdate(labelData) {
    let image_id = this.props.location.pathname.substring(35);
    this.props.updateLabels(image_id, labelData);
  }
  markcomplete() {}
  render() {
    const props = {
      onLabelChange: this.pushUpdate.bind(this)
    };
    const title = this.props.image.image_name;
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
            labelData={this.props.image.labelData || {}}
            imageUrl={
              process.env.REACT_APP_HOST +
              process.env.REACT_APP_SERVER_PORT +
              `/static/uploads/${this.props.image.image_url}?${Date.now()}`
            }
            // fetch={this.fetch.bind(this)}
            demo={false}
            {...props}
          />
        ) : null}
      </DocumentMeta>
    );
  }
}

const mapStateToProps = state => {
  return {
    lab: state.labels.labels,
    labelActions: state.labels.labelActions,
    imageActions: state.images.imageActions,
    image: state.images.currentImage
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelingLoader);

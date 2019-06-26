import React, { Component } from "react";
import { connect } from "react-redux";
// import { Image } from "semantic-ui-react";
import LabelDraw from "./labelDraw";
import "./css/imagePreview.css";

class ImagePreview extends Component {
  render() {
    return (
      <div className="image-preview-parent">
        {this.props.image.image_url ? (
          <div
            className="preview-image"
            style={{
              backgroundImage: `url( ${process.env.REACT_APP_HOST}${
                process.env.REACT_APP_SERVER_PORT
              }/static/uploads/${this.props.image.image_url}?${Date.now()})`
            }}
          />
        ) : null}
        {this.props.image &&
          this.props.image.label &&
          this.props.image.label.map((label, index) => (
            <LabelDraw num={index} label={label} />
          ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    image: state.images.imagePreview
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePreview);

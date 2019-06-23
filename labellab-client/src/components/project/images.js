import React, { Component } from "react";
import { connect } from "react-redux";

class ImagesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Project Images</div>;
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
)(ImagesIndex);

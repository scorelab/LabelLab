import React, { Component } from "react";
import { connect } from "react-redux";

class AnalyticsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Project Analytics</div>;
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
)(AnalyticsIndex);

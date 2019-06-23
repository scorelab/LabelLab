import React, { Component } from "react";
import { connect } from "react-redux";

class TeamIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Project Team</div>;
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
)(TeamIndex);

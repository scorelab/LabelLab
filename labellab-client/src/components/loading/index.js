import React, { Component } from 'react'
import { connect } from 'react-redux'

class Loading extends Component {
  render() {
    return <div>Loading........</div>
  }
}

export default connect(
  null,
  null
)(Loading)

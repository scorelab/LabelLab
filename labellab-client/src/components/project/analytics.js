import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import { Dimmer, Loader } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import './css/analytics.css'
class AnalyticsIndex extends Component {
  render() {
    const { analytics, isfetching } = this.props
    return (
      <div className="project-analytics-parent">
        {isfetching ? null : <Bar data={analytics} />}
      </div>
    )
  }
}

AnalyticsIndex.propTypes = {
  analytics: PropTypes.object,
  isfetching: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    analytics: state.analytics.data,
    isfetching: state.analytics.isfetching
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsIndex)

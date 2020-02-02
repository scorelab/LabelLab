import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'
import { Bar, Pie } from 'react-chartjs-2'
import './css/analytics.css'
class AnalyticsIndex extends Component {
  render() {
    const { timeData, countData, isfetching } = this.props
    return (
      <div className="project-analytics-parent">
        <div className="analytics-row">
          <div className="project-analytics-section">
            <Header content="Time-Label Relationship" />
            {isfetching ? null : (
              <Bar
                data={timeData}
                options={{ responsive: true, maintainAspectRatio: true }}
              />
            )}
          </div>
          <div className="project-analytics-section">
            <Header content="Label Proportions" />
            {isfetching ? null : (
              <Pie
                data={countData}
                options={{ responsive: true, maintainAspectRatio: true }}
              />
            )}
          </div>
        </div>
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
    timeData: state.analytics.timeData,
    countData: state.analytics.countData,
    isfetching: state.analytics.isfetching
  }
}

export default connect(
  mapStateToProps,
  null
)(AnalyticsIndex)

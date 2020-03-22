import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Header, Grid } from 'semantic-ui-react'
import { Bar, Pie } from 'react-chartjs-2'
import './css/analytics.css'
class AnalyticsIndex extends Component {
  render() {
    const { timeData, countData, isfetching } = this.props
    return (
      <div className="project-analytics-parent">
        <div className="analytics-row">
          <Grid columns={2} style={{width: '100%'}} stackable>
          <Grid.Column  mobile={16} tablet={16} computer={8} className="analytics-column">
          <div className="project-analytics-section">
            <Header content="Time-Label Relationship" />
            {isfetching ? null : (
              <Bar
                data={timeData}
                options={{ responsive: true, maintainAspectRatio: true }}
              />
            )}
          </div>
          </Grid.Column>
          <Grid.Column  mobile={16} tablet={16} computer={8} className="analytics-column">
          <div className="project-analytics-section">
            <Header content="Label Proportions" />
            {isfetching ? null : (
              <Pie
                data={countData}
                options={{ responsive: true, maintainAspectRatio: true }}
              />
            )}
          </div>
          </Grid.Column>
          </Grid>
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

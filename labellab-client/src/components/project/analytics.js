import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Header, Grid } from 'semantic-ui-react'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import { getTimeLabel, getLabelCount, getIssueAnalytics } from '../../actions/index'
import './css/analytics.css'
class AnalyticsIndex extends Component {
  componentDidMount() {
    const { match, fetchTimeLabel, fetchLabelCount, fetchIssueAnalytics } = this.props
    fetchTimeLabel(match.params.projectId)
    fetchLabelCount(match.params.projectId)
    fetchIssueAnalytics(match.params.projectId)
  }
  render() {
    const { timeData, countData, issueData, isfetching } = this.props
    return (
      <div className="project-analytics-parent">
        <div className="analytics-row">
          <Grid columns={2} style={{ width: '100%' }} stackable>
            <Grid.Column mobile={16} tablet={16} computer={8} className="analytics-column">
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
            <Grid.Column mobile={16} tablet={16} computer={8} className="analytics-column">
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
            <Grid.Column mobile={16} tablet={16} computer={8} className="analytics-column">
              <div className="project-analytics-section">
                <Header content="Issue Priority Proportions" />
                {isfetching ? null : (
                  <Doughnut
                    data={issueData['priority']}
                    options={{ responsive: true, maintainAspectRatio: true }}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8} className="analytics-column">
              <div className="project-analytics-section">
                <Header content="Issue Category Proportions" />
                {isfetching ? null : (
                  <Doughnut
                    data={issueData['category']}
                    options={{ responsive: true, maintainAspectRatio: true }}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8} className="analytics-column">
              <div className="project-analytics-section">
                <Header content="Issue Status Proportions" />
                {isfetching ? null : (
                  <Doughnut
                    data={issueData['status']}
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
  isfetching: PropTypes.bool,
  match: PropTypes.object,
  fetchTimeLabel: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    timeData: state.analytics.timeData || {},
    countData: state.analytics.countData || {},
    issueData: state.analytics.issueData || {},
    isfetching: state.analytics.isfetching
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchTimeLabel: projectId => {
      return dispatch(getTimeLabel(projectId))
    },
    fetchLabelCount: projectId => {
      return dispatch(getLabelCount(projectId))
    },
    fetchIssueAnalytics: projectId => {
      return dispatch(getIssueAnalytics(projectId))
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsIndex)

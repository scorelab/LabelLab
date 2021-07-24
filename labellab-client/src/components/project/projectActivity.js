import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Table,
  Header,
  Dimmer,
  Loader,
  Message,
  Icon,
  Dropdown,
  Grid,
  Divider
} from 'semantic-ui-react'

import {
  fetchProjectLogs,
  fetchCategorySpecificLogs
} from '../../actions/index'

const categoryOptions = [
  { key: 1, value: 'all', text: 'all' },
  { key: 2, value: 'general', text: 'general' },
  { key: 3, value: 'images', text: 'images' },
  { key: 4, value: 'labels', text: 'labels' },
  {
    key: 5,
    value: 'image labelling',
    text: 'image labelling'
  },
  { key: 6, value: 'models', text: 'models' }
]

class ProjectActivity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: 'all'
    }
  }

  filterOnCategory = (e, { value }) => {
    const {
      projectId,
      fetchProjectLogs,
      fetchCategorySpecificLogs
    } = this.props
    this.setState({ category: value })
    if (value === 'all') {
      fetchProjectLogs(projectId)
    } else {
      fetchCategorySpecificLogs(projectId, value)
    }
  }

  render() {
    const {
      logs,
      logsActions: { isFetching, errors }
    } = this.props

    return (
      <Fragment>
        {isFetching ? (
          <Dimmer active>
            <Loader indeterminate>Fetching project activity...</Loader>
          </Dimmer>
        ) : null}
        {errors ? (
          <Message icon>
            <Icon name="warning" />
            <Message.Content>
              <Message.Header>Error</Message.Header>
              {errors}
            </Message.Content>
          </Message>
        ) : null}
        <Header as="h4" subheader>
          Category
          <Header.Subheader as="h4" className="margin-v">
            <Dropdown
              name="category"
              placeholder="Category"
              selection
              value={this.state.category}
              options={categoryOptions}
              onChange={this.filterOnCategory}
            />
          </Header.Subheader>
        </Header>
        <Divider />

        <Table color="black">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Activity</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Member</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {logs
              ? logs.map(log => (
                  <Table.Row
                    negative={log.category === 'models'}
                    positive={log.category === 'images'}
                    warning={log.category === 'labels'}
                    active={log.category === 'general'}
                    key={log.id}
                  >
                    <Table.Cell width={12}>
                      <Header as="h4" subheader>
                        {log.message}
                        <Header.Subheader as="h6">
                          {log.timestamp}
                        </Header.Subheader>
                      </Header>
                    </Table.Cell>
                    <Table.Cell width={4}>{log.category}</Table.Cell>
                    <Table.Cell width={4}>{log.username}</Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table>
      </Fragment>
    )
  }
}

ProjectActivity.propTypes = {
  logs: PropTypes.array
}

const mapStateToProps = state => {
  return {
    logs: state.logs.logs,
    logsActions: state.logs.logsActions,
    projectId: state.projects.currentProject.projectId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectLogs: projectId => {
      return dispatch(fetchProjectLogs(projectId))
    },
    fetchCategorySpecificLogs: (projectId, category) => {
      return dispatch(fetchCategorySpecificLogs(projectId, category))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectActivity)

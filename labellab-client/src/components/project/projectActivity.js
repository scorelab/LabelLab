import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table, Header, Dimmer, Loader, Message, Icon } from 'semantic-ui-react'

class ProjectActivity extends Component {
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
        <Table color="black">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Recent Activity </Table.HeaderCell>
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
    logsActions: state.logs.logsActions
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectActivity)

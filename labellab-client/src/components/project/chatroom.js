import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Dimmer,
  Loader,
  Grid,
  Header,
  Icon,
  Divider,
  Input,
  Button,
  Dropdown,
  Message
} from 'semantic-ui-react'
import moment from 'moment'

import './css/chatroom.css'
import { isEmptyObject } from '../../utils/helpers'
import {
  fetchTeam,
  fetchTeamMessages,
  sendMessage,
  handleMessageReceive
} from '../../actions/index'

class Chatroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      entityType: '',
      entityId: null
    }
  }

  componentDidMount() {
    const {
      match: {
        params: { projectId, teamId }
      },
      team,
      fetchTeam,
      fetchTeamMessages,
      handleMessageReceive
    } = this.props
    if (!team || isEmptyObject(team)) {
      fetchTeam(projectId, teamId)
    }
    fetchTeamMessages(teamId)
    handleMessageReceive(teamId)
  }

  capitalize = string => {
    if (!string) return
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  handleChange = (name, data) => {
    this.setState({
      [name]: data
    })
  }

  handleDismiss = () => {
    this.setState({ entityType: '', entityId: null })
  }

  handleSendMessage = () => {
    const { team, user, sendMessage } = this.props
    const { text, entityType, entityId } = this.state

    if (!text) {
      return
    }
    this.setState({ text: '', entityType: '', entityId: null })
    sendMessage(text, team.id, user.id, entityType, entityId)
  }

  render() {
    const { user, history, team, teamActions, messages, logs, issues } = this.props
    const { entityType, entityId } = this.state

    return (
      <React.Fragment>
        {teamActions.isFetchingMessages || teamActions.isFetching ? (
          <Dimmer active>
            <Loader indeterminate>Loading messages...</Loader>
          </Dimmer>
        ) : null}
        {team && team.members ? (
          <React.Fragment>
            <Grid>
              <Grid.Row>
                <Grid.Column width={1}>
                  <Icon
                    className="icon-button"
                    name="angle left"
                    onClick={() => history.goBack()}
                  />
                </Grid.Column>
                <Grid.Column width={15}>
                  <Header as="h4" subheader>
                    {this.capitalize(team.teamName)}
                    <Header.Subheader>{`${team.members.length} members`}</Header.Subheader>
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Divider className="chatroom-divider" />
            </Grid>
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages-banner">
                  <Icon name="warning circle" size="large" />
                  <p>No messages</p>
                </div>
              ) : null}
              {messages.map(message => (
                <MessageItem
                  key={message.id}
                  message={message}
                  userId={user.id}
                  issues={issues}
                  logs={logs}
                  projectId={team.projectId}
                />
              ))}
            </div>
            <Divider />
            <Message
              attached
              size='tiny'
              hidden={entityType == '' || entityId == null}
              onDismiss={this.handleDismiss}>
              <Message.Header>
                {entityType.toUpperCase()}
              </Message.Header>
              {entityType == 'issue' ? (
                issues.map(issue => {
                  if (issue.key == entityId) {
                    return (
                      <p>{issue.text}</p>
                    )
                  }
                })
              ) : (
                logs.map(log => {
                  if (log.key == entityId)
                    return (
                      <p>{log.text}</p>
                    )
                })
              )}
            </Message>
            <Input
              fluid
              name='text'
              action={
                <Fragment>
                  <Dropdown button upward icon='attach'>
                    <Dropdown.Menu>
                      <Dropdown.Item >
                        <Dropdown
                          upward
                          text='Issue'
                          options={issues}
                          direction='left'
                          pointing='left'
                          onClick={() => this.handleChange('entityType', 'issue')}
                          onChange={(e, { value }) => this.handleChange('entityId', value)}
                        >
                        </Dropdown>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Dropdown
                          upward
                          scrolling
                          text='Activity Log'
                          options={logs}
                          direction='left'
                          pointing='left'
                          onClick={() => this.handleChange('entityType', 'log')}
                          onChange={(e, { value }) => this.handleChange('entityId', value)}
                        >
                        </Dropdown>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    icon="angle right"
                    positive
                    content="Send"
                    labelPosition="right"
                    onClick={this.handleSendMessage}
                  />
                </Fragment>
              }
              value={this.state.text}
              placeholder="Write your message..."
              onChange={(e) => this.handleChange(e.target.name, e.target.value)}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }
}

const MessageItem = ({ message, userId, issues, logs, projectId }) => {
  const isOwnMessage = userId === message.user_id
  let messageItemClass = 'message-item '
  if (isOwnMessage) {
    messageItemClass += 'own-message'
  } else {
    messageItemClass += 'other-message'
  }

  return (
    <div className={messageItemClass}>
      <section>
        <small><strong>{!isOwnMessage && message.username}</strong></small>
        {message.entity_type && message.entity_id && (
          <div className='tag'>
            <small><strong>{message.entity_type.toUpperCase()}</strong></small>
            <div>
              {message.entity_type == 'issue' ? (
                issues.map(issue => {
                  if (issue.key == message.entity_id) {
                    return (
                      <p><Link to={`/project/${projectId}/issue/${issue.key}`} className='issue-link'>{issue.text}</Link></p>
                    )
                  }
                })
              ) : (
                logs.map(log => {
                  if (log.key == message.entity_id)
                    return (
                      <p>{log.text}</p>
                    )
                })
              )}
            </div>
          </div>
        )}
        <p>{message.body}</p>
      </section>
      <em><small>{moment.utc(message.timestamp).local().format('LLL')}</small></em>
    </div>
  )
}

Chatroom.propTypes = {
  user: PropTypes.object,
  team: PropTypes.object,
  roles: PropTypes.object,
  teamActions: PropTypes.object,
  messages: PropTypes.array,
  fetchTeamMessages: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    team: state.teams.currentTeam,
    messages: state.teams.messages,
    teamActions: state.teams.teamActions,
    roles: state.projects.currentProject.roles,
    logs: state.logs.logs
      ? [
        ...state.logs.logs.map(log => {
          return {
            key: log.id,
            value: log.id,
            text: log.message
          }
        })
      ]
      : [],
    issues: state.issues.issues.items
      ? [
        ...state.issues.issues.items.map(issue => {
          return {
            key: issue.id,
            value: issue.id,
            text: `#${issue.id} ${issue.title}`
          }
        })
      ]
      : [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTeam: (projectId, teamId) => {
      return dispatch(fetchTeam(projectId, teamId))
    },
    fetchTeamMessages: teamId => {
      return dispatch(fetchTeamMessages(teamId))
    },
    sendMessage: (message, teamId, userId, entityType, entityId) => {
      return dispatch(sendMessage(message, teamId, userId, entityType, entityId))
    },
    handleMessageReceive: teamId => {
      return dispatch(handleMessageReceive(teamId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chatroom)

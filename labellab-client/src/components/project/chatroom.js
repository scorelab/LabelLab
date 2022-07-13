import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { MentionsInput, Mention } from 'react-mentions'
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types'
import {
  Dimmer,
  Loader,
  Grid,
  Header,
  Icon,
  Divider,
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
    let newComment = text;
    newComment = newComment.split('@@@__').join("<strong><i>@")
    newComment = newComment.split('@@@^^^').join("</i></strong>")
    this.setState({ text: '', entityType: '', entityId: null })
    sendMessage(newComment, team.id, user.id, entityType, entityId)
  }

  render() {
    const { user, history, team, teamActions, messages, logs, issues, users } = this.props
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
            <div className='message-input'>
              <div className='message'>
                <MentionsInput
                  value={this.state.text}
                  onChange={(e) => this.handleChange('text', e.target.value)}
                  className='comments-textarea'
                  placeholder='Write your message...'
                >
                  <Mention
                    trigger="@"
                    data={users}
                    markup='@@@____display__@@@^^^'
                    style={{
                      backgroundColor: '#daf4fa'
                    }}
                  />
                </MentionsInput>
              </div>
              <Button.Group>
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
                  primary
                  size='small'
                  content="Send"

                  labelPosition="right"
                  onClick={this.handleSendMessage}
                />
              </Button.Group>
            </div>
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

  const defaultOptions = {
    ALLOWED_TAGS: ['i', 'strong', 'br'],
  };

  const sanitize = (message, options) => ({
    __html: DOMPurify.sanitize(
      message,
      { ...defaultOptions, ...options }
    )
  });

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
        <p dangerouslySetInnerHTML={sanitize(message.body.replace(/\n\r?/g, '<br />'))} />
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
    users: state.user.users
      ? [
        ...state.user.users.map(user => {
          return {
            id: user.id,
            display: user.name
          }
        })
      ]
      : [],
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

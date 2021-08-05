import React, { Component } from 'react'
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
  Button
} from 'semantic-ui-react'

import './css/chatroom.css'
import { isEmptyObject } from '../../utils/helpers'
import { fetchTeam, fetchTeamMessages } from '../../actions/index'

class Chatroom extends Component {
  componentDidMount() {
    const {
      match: {
        params: { projectId, teamId }
      },
      team,
      fetchTeam,
      fetchTeamMessages
    } = this.props
    if (!team || isEmptyObject(team)) {
      fetchTeam(projectId, teamId)
    }
    fetchTeamMessages(teamId)
  }

  capitalize = string => {
    if (!string) return
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render() {
    const { user, history, team, teamActions, messages } = this.props

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
              {messages.map(message => (
                <MessageItem
                  key={message.id}
                  message={message}
                  userId={user.id}
                />
              ))}
            </div>
            <Divider />
            <Input
              fluid
              label={
                <Button
                  icon="angle right"
                  positive
                  content="Send"
                  labelPosition="right"
                />
              }
              labelPosition="right"
              placeholder="Write your message..."
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }
}

const MessageItem = ({ message, userId }) => {
  const isOwnMessage = userId === message.user_id
  let messageItemClass = 'message-item '
  if (isOwnMessage) {
    messageItemClass += 'own-message'
  } else {
    messageItemClass += 'other-message'
  }

  return (
    <div className={messageItemClass}>
      <small>{message.username}</small>
      <p>{message.body}</p>
      <small>{message.timestamp}</small>
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
    roles: state.projects.currentProject.roles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTeam: (projectId, teamId) => {
      return dispatch(fetchTeam(projectId, teamId))
    },
    fetchTeamMessages: teamId => {
      return dispatch(fetchTeamMessages(teamId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chatroom)

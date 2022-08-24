import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Dimmer,
  Loader,
  Header,
  Divider,
  Grid,
  Button,
  Icon,
  Table,
  Confirm,
  Modal,
  Input,
  Dropdown,
  Message
} from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'

import {
  fetchTeam,
  teamDelete,
  fetchProject,
  updateTeam,
  addTeamMember,
  removeTeamMember
} from '../../actions/index'
import { teamsOptions } from '../../constants/options'
import SearchUser from './searchUser'


class TeamDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleteTeamModalOpen: false,
      isUpdateTeamModalOpen: false,
      isAddMemberModalOpen: false,
      invalidDetails: false,
      teamname: '',
      role: '',
      memberEmail: ''
    }
  }

  componentDidMount() {
    const {
      match: {
        params: { projectId, teamId }
      },
      fetchTeam
    } = this.props
    fetchTeam(projectId, teamId)
  }

  componentDidUpdate(prevProps) {
    const { team } = this.props
    if (team && prevProps.team !== team) {
      this.setState({
        teamname: team.teamName,
        role: team.role
      })
    }
  }

  deleteTeamConfirmation = () => this.setState({ isDeleteTeamModalOpen: true })
  closeDeleteTeam = () => this.setState({ isDeleteTeamModalOpen: false })

  updateTeamConfirmation = () => this.setState({ isUpdateTeamModalOpen: true })
  closeUpdateTeam = () => this.setState({ isUpdateTeamModalOpen: false })

  addMemberConfirmation = () => this.setState({ isAddMemberModalOpen: true })
  closeAddMember = () => this.setState({ isAddMemberModalOpen: false })

  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        if (this.state.teamname === '') {
          this.setState({
            invalidDetails: true
          })
        } else {
          this.setState({
            invalidDetails: false
          })
        }
      }
    )
  }

  handleDropDownChange = (e, { name, value }) =>
    this.setState({ [name]: value })

  updateMemberEmail = data => {
    this.setState({
      memberEmail: data
    })
  }

  deleteTeam = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      teamDelete
    } = this.props
    teamDelete(projectId, teamId, this.deleteTeamCallback)
  }

  updateTeam = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      updateTeam
    } = this.props
    updateTeam(
      projectId,
      teamId,
      this.state.teamname,
      this.state.role,
      this.updateTeamCallback
    )
  }

  addTeamMember = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      addTeamMember
    } = this.props
    addTeamMember(
      projectId,
      teamId,
      this.state.memberEmail,
      this.addTeamMemberCallback
    )
  }

  removeTeamMember = email => {
    const {
      match: {
        params: { projectId, teamId }
      },
      removeTeamMember
    } = this.props
    removeTeamMember(projectId, teamId, email, this.removeTeamMemberCallback)
  }

  deleteTeamCallback = () => {
    const {
      match: {
        params: { projectId }
      },
      history,
      fetchProject
    } = this.props
    history.push({ pathname: `/project/${projectId}/team` })
    fetchProject(projectId)
  }

  updateTeamCallback = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      fetchTeam
    } = this.props
    this.closeUpdateTeam()
    fetchTeam(projectId, teamId)
  }

  addTeamMemberCallback = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      fetchTeam
    } = this.props
    this.closeAddMember()
    fetchTeam(projectId, teamId)
  }

  removeTeamMemberCallback = () => {
    const {
      match: {
        params: { projectId, teamId }
      },
      fetchTeam
    } = this.props
    fetchTeam(projectId, teamId)
  }

  capitalize = string => {
    if (!string) return
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render() {
    const { team, roles, teamActions, history } = this.props

    return (
      <Fragment>
        {teamActions.errors ? (
          teamActions.errors == '404' ? (
            <Redirect to="/404" />
          ) : (
            teamActions.errors == '401' ? (
              <Redirect to="/401" />
            ) : null
          )
        ) : null}
        {teamActions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience </Loader>
          </Dimmer>
        ) : teamActions.isDeleting ? (
          <Dimmer active>
            <Loader indeterminate>Deleting...</Loader>
          </Dimmer>
        ) : teamActions.isUpdating ? (
          <Dimmer active>
            <Loader indeterminate>Updating...</Loader>
          </Dimmer>
        ) : roles &&
          team &&
          (roles.includes('admin') || roles.includes(team.role)) ? (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header as="h2" subheader>
                    {this.capitalize(team.teamName)}
                    <Header.Subheader>{team.role}</Header.Subheader>
                  </Header>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Grid.Row>
                    <Button
                      positive
                      icon
                      labelPosition="left"
                      onClick={() =>
                        history.push(
                          `/project/${team.projectId}/chatroom/${team.id}`
                        )
                      }
                    >
                      <Icon name="chat" />
                      Chat
                    </Button>
                    {roles && roles.includes('admin') ? (
                      <Button icon onClick={this.updateTeamConfirmation}>
                        <Icon name="edit" />
                      </Button>
                    ) : null}
                    {roles && roles.includes('admin') ? (
                      <Button
                        negative
                        icon
                        onClick={this.deleteTeamConfirmation}
                      >
                        <Icon name="delete" />
                      </Button>
                    ) : null}
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Grid.Column width={6}>
                  <Table color="green">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Recent Activity </Table.HeaderCell>
                        <Table.HeaderCell>
                          <Button
                            icon
                            as={Link}
                            to={`/project/${team.projectId}/logs/category/${team.role}`}
                          >
                            <Icon name="arrow alternate circle right outline" />
                          </Button>
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {team.logs
                        ? team.logs.map(log => (
                          <Table.Row key={log.id}>
                            <Table.Cell width={16}>{log.message}</Table.Cell>
                            <Table.Cell width={0}></Table.Cell>
                          </Table.Row>
                        ))
                        : null}
                    </Table.Body>
                  </Table>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Table color="blue">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Team Members </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                          {roles && roles.includes('admin') ? (
                            <Button icon onClick={this.addMemberConfirmation}>
                              <Icon name="add circle" />
                            </Button>
                          ) : null}
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {team.members
                        ? team.members.map(member => (
                          <Table.Row key={member.id}>
                            <Table.Cell>
                              <Header as="h4" subheader>
                                {member.name}
                                <Header.Subheader>
                                  {member.email}
                                </Header.Subheader>
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              {roles && roles.includes('admin') ? (
                                <Button
                                  icon
                                  onClick={() =>
                                    this.removeTeamMember(member.email)
                                  }
                                >
                                  <Icon name="user delete" />
                                </Button>
                              ) : null}
                            </Table.Cell>
                          </Table.Row>
                        ))
                        : null}
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : (
          <Message>
            <Message.Header>Unauthorized</Message.Header>
            <p>You are not allowed to access this team</p>
            <Button onClick={() => history.goBack()}>Go Back</Button>
          </Message>
        )}
        <Confirm
          open={this.state.isDeleteTeamModalOpen}
          onCancel={this.closeDeleteTeam}
          onConfirm={this.deleteTeam}
        />
        {/* Update Team Modal */}
        <Modal
          open={this.state.isUpdateTeamModalOpen}
          onClose={this.closeUpdateTeam}
          onOpen={this.updateTeamConfirmation}
        >
          <Header icon="group" content="Update Team" />
          <Modal.Content>
            <Input
              name="teamname"
              onChange={this.handleChange}
              type="text"
              placeholder="* Team Name"
              label="Name"
              value={this.state.teamname}
            />
            <Dropdown
              name="role"
              placeholder="Role"
              search
              selection
              value={this.state.role}
              options={teamsOptions}
              onChange={this.handleDropDownChange}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.closeUpdateTeam}>
              <Icon name="remove" />
              Cancel
            </Button>
            <Button
              color="green"
              onClick={this.updateTeam}
              disabled={this.state.invalidDetails ? true : false}
            >
              <Icon name="checkmark" /> Update
            </Button>
          </Modal.Actions>
        </Modal>
        {/* Add Team Member Modal */}
        <Modal
          open={this.state.isAddMemberModalOpen}
          onClose={this.closeAddMember}
          onOpen={this.addMemberConfirmation}
        >
          <Header icon="user add" content="Add Team Member" />
          <Modal.Content>
            <SearchUser
              history={history}
              updateState={this.updateMemberEmail}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.closeAddMember}>
              <Icon name="remove" />
              Cancel
            </Button>
            <Button
              color="green"
              onClick={this.addTeamMember}
              disabled={!this.state.memberEmail}
            >
              <Icon name="checkmark" /> Add
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    )
  }
}

TeamDetails.propTypes = {
  team: PropTypes.object,
  teamActions: PropTypes.object
}

const mapStateToProps = state => {
  return {
    team: state.teams.currentTeam,
    teamActions: state.teams.teamActions,
    roles: state.projects.currentProject.roles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTeam: (projectId, teamId) => {
      dispatch(fetchTeam(projectId, teamId))
    },
    teamDelete: (projectId, teamId, callback) => {
      dispatch(teamDelete(teamId, projectId, callback))
    },
    fetchProject: projectId => {
      dispatch(fetchProject(projectId))
    },
    updateTeam: (projectId, teamId, teamname, role, callback) => {
      dispatch(updateTeam(projectId, teamId, teamname, role, callback))
    },
    addTeamMember: (projectId, teamId, memberEmail, callback) => {
      dispatch(addTeamMember(projectId, teamId, memberEmail, callback))
    },
    removeTeamMember: (projectId, teamId, memberEmail, callback) => {
      dispatch(removeTeamMember(projectId, teamId, memberEmail, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamDetails)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Container,
  Table,
  Header,
  Button,
  Icon,
  Modal,
  Dimmer,
  Loader,
  Message,
  Dropdown,
  Grid,
  Divider
} from 'semantic-ui-react'
import {
  addMember,
  fetchProject,
  memberDelete,
  teamDelete,
  fetchAllTeams
} from '../../actions'
import SearchUser from './searchUser.js'
import './css/team.css'

const teamsOptions = [
  { key: 1, value: 'images', role: 'images', text: 'images' },
  { key: 2, value: 'labels', role: 'labels', text: 'labels' },
  {
    key: 3,
    value: 'image labelling',
    role: 'image labelling',
    text: 'image labelling'
  },
  { key: 4, value: 'models', role: 'models', text: 'models' }
]

class TeamIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      member_email: ''
    }
  }
  handleAddMember = () => {
    this.setState({
      open: !this.state.open
    })
  }
  handleChange = e => {
    console.log(e.target)
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleDropDownChange = (e, { name, value }) =>
    this.setState({ [name]: value })
  handleMemberSubmit = () => {
    const { project, addMember } = this.props
    const { member_email, team, role } = this.state
    this.setState({
      check: true
    })
    let data = {
      member_email: member_email,
      projectId: project.projectId,
      team_name: team,
      role: team
    }
    addMember(data, this.fetchProjectCallback)
    this.close()
  }
  close = () => this.setState({ open: false })
  handleDelete = (email, team_id) => {
    const { memberDelete, project } = this.props
    memberDelete(email, project.projectId, team_id, this.fetchProjectCallback)
  }
  handleTeamDelete = team_id => {
    const { teamDelete, project } = this.props
    teamDelete(team_id, project.projectId, this.fetchProjectCallback)
  }
  fetchProjectCallback = () => {
    const { fetchProject, project, fetchAllTeams } = this.props
    fetchProject(project.projectId)
    fetchAllTeams(project.projectId)
  }
  updateState = data => {
    this.setState({
      member_email: data
    })
  }
  render() {
    const { project, actions, history, user, roles, logs } = this.props
    const { open } = this.state
    console.log(project)
    return (
      <Container>
        {actions.errors ? (
          <Message negative>
            <Message.Header>{actions.errors}</Message.Header>
          </Message>
        ) : null}
        {actions.msg ? <Message success header={actions.msg} /> : null}
        {actions.isadding ? (
          <Dimmer active={actions.isadding}>
            <Loader indeterminate>Adding member :)</Loader>
          </Dimmer>
        ) : null}
        {actions.isdeleting ? (
          <Dimmer active={actions.isdeleting}>
            <Loader indeterminate>Removing member :(</Loader>
          </Dimmer>
        ) : null}
        {actions.isdeletingproject ? (
          <Dimmer active={actions.isdeletingproject}>
            <Loader indeterminate>Deleting project :(</Loader>
          </Dimmer>
        ) : null}
        <Modal size="small" open={open} onClose={this.close}>
          <Modal.Content>
            <p>Enter Member email:</p>
          </Modal.Content>
          <Modal.Actions>
            <SearchUser history={history} updateState={this.updateState} />
            <Dropdown
              name="team"
              placeholder="Team"
              search
              selection
              options={teamsOptions}
              onChange={this.handleDropDownChange}
            />
            <Button
              positive
              onClick={this.handleMemberSubmit}
              content="Add member"
            />
          </Modal.Actions>
        </Modal>

        <Grid>
          <Grid.Row>
            <Grid.Column width={13}>
              <Header as="h3">Recent Activity</Header>
            </Grid.Column>
            <Grid.Column width={3}>
              <Button
                icon
                primary
                as={Link}
                labelPosition="left"
                to={`/project/${project.projectId}/logs`}
              >
                <Icon name="arrow alternate circle right" />
                More
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table color="green">
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
                  <Table.Row key={log.id}>
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

        <Divider />

        <Grid>
          <Grid.Row>
            <Grid.Column width={13}>
              <Header as="h3">Project Members</Header>
            </Grid.Column>
            <Grid.Column width={3}>
              {roles && roles.includes('admin') ? (
                <Button
                  icon
                  positive
                  className="add-member"
                  onClick={this.handleAddMember}
                  labelPosition="left"
                >
                  <Icon name="add" />
                  Add
                </Button>
              ) : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table color="green" celled padded striped stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Name</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {project &&
              project.members &&
              project.members.map((member, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Header as="h4">{member.name}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">{member.team_role}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">{member.team_name}</Header>
                  </Table.Cell>

                  {roles && roles.includes('admin') ? (
                    <Table.Cell collapsing>
                      {member.team_role !== 'admin' &&
                      member.email !== user.email ? (
                        <Icon
                          className="team-remove-user-icon"
                          name="user delete"
                          onClick={() =>
                            this.handleDelete(member.email, member.team_id)
                          }
                        />
                      ) : null}
                    </Table.Cell>
                  ) : (
                    <Table.Cell></Table.Cell>
                  )}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>

        <Container className="team-management-conatiner">
          <Table color="green" celled striped stackable className="all-teams">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell singleLine>Team name</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>No of members</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {project &&
                project.teams &&
                project.teams.map((team, index) => (
                  <Table.Row
                    key={index}
                    className="team-item"
                    onClick={() =>
                      history.push(
                        `/project/${team.project_id}/team-details/${team.id}`
                      )
                    }
                  >
                    <Table.Cell>
                      <Header as="h4">{team.team_name}</Header>
                    </Table.Cell>
                    <Table.Cell>
                      <Header as="h4">{team.role}</Header>
                    </Table.Cell>
                    <Table.Cell>
                      <Header as="h4">{team.team_members.length}</Header>
                    </Table.Cell>
                    <Table.Cell collapsing>
                      {roles && roles.includes('admin') ? (
                        team.role !== 'admin' ? (
                          <Icon
                            className="team-remove-user-icon"
                            name="user delete"
                            onClick={() => this.handleTeamDelete(team.id)}
                          />
                        ) : null
                      ) : null}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          <Table color="green" celled striped stackable className="my-team">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell singleLine>My Teams</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {project &&
                project.members &&
                project.members
                  .filter(member => member.email === user.email)
                  .map((team, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Header as="h4">{team.team_name}</Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h4">{team.team_role}</Header>
                      </Table.Cell>
                    </Table.Row>
                  ))}
            </Table.Body>
          </Table>
        </Container>
      </Container>
    )
  }
}

TeamIndex.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  actions: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func,
  fetchAllTeams: PropTypes.func,
  match: PropTypes.object,
  memberDelete: PropTypes.func,
  addMember: PropTypes.func,
  teamDelete: PropTypes.func,
  roles: PropTypes.array
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    project: state.projects.currentProject,
    actions: state.projects.projectActions,
    roles: state.projects.currentProject.roles,
    logs: state.projects.currentProject.logs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addMember: (data, callback) => {
      return dispatch(addMember(data, callback))
    },
    fetchProject: data => {
      return dispatch(fetchProject(data))
    },
    fetchAllTeams: data => {
      return dispatch(fetchAllTeams(data))
    },
    memberDelete: (email, projectId, callback) => {
      return dispatch(memberDelete(email, projectId, callback))
    },
    teamDelete: (team_id, project_id, callback) => {
      return dispatch(teamDelete(team_id, project_id, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIndex)

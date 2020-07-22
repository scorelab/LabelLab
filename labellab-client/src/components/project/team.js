import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  Dropdown
} from 'semantic-ui-react'
import { addMember, fetchProject, memberDelete } from '../../actions'
import SearchUser from './searchUser.js'
import './css/team.css'

const teamsOptions = [
  { key: 1, value: 'images', role:'images', text: 'images' },
  { key: 2, value: 'labels',  role:'labels', text: 'labels' },
  { key: 3, value: 'image labelling', role:'image labelling', text: 'image labelling' },
  { key: 4, value: 'models', role:'models', text: 'models' }
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
  handleDropDownChange = (e, { name, value }) => this.setState({ [name]: value })
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
  handleDelete = email => {
    const { memberDelete, project } = this.props
    memberDelete(email, project.projectId, this.fetchProjectCallback)
  }
  fetchProjectCallback = () => {
    const { fetchProject, project } = this.props
    fetchProject(project.projectId)
  }
  updateState = data => {
    this.setState({
      member_email: data
    })
  }
  render() {
    const { project, actions, history, user } = this.props
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
            name='team' 
            placeholder='Team' 
            search 
            selection 
            options={teamsOptions} 
            onChange={this.handleDropDownChange}/>
            <Button
              positive
              onClick={this.handleMemberSubmit}
              content="Add member"
            />
          </Modal.Actions>
        </Modal>
        <Table color="green" celled padded striped stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Project Members</Table.HeaderCell>
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

                  <Table.Cell collapsing>
                    {member.team_role !== 'admin' &&
                    member.email !== user.email ? (
                      <Icon
                        className="team-remove-user-icon"
                        name="user delete"
                        onClick={() => this.handleDelete(member.email)}
                      />
                    ) : null}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div className="add-member-button">
          <Button
            icon
            positive
            className="add-member"
            onClick={this.handleAddMember}
            labelPosition="left"
          >
            <Icon name="add" />
            Add member
          </Button>
        </div>
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
  match: PropTypes.object,
  memberDelete: PropTypes.func,
  addMember: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.user,
    project: state.projects.currentProject,
    actions: state.projects.projectActions
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
    memberDelete: (email, projectId, callback) => {
      return dispatch(memberDelete(email, projectId, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIndex)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Table,
  Header,
  Button,
  Icon,
  Modal,
  Dimmer,
  Loader,
  Message
} from 'semantic-ui-react'
import { addMember, fetchProject, memberDelete } from '../../actions'
import SearchUser from './searchUser.js'
import './css/team.css'

class TeamIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      memberEmail: ''
    }
  }
  handleAddMember = () => {
    this.setState({
      open: !this.state.open
    })
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleMemberSubmit = () => {
    const { project, addMember } = this.props
    const { memberEmail } = this.state
    this.setState({
      check: true
    })
    let data = {
      memberEmail: memberEmail,
      projectId: project.projectId
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
  render() {
    const { project, actions, history } = this.props
    const { open } = this.state
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
        <Modal size="small" open={open} onClose={this.close}>
          <Modal.Content>
            <p>Enter Member email:</p>
          </Modal.Content>
          <Modal.Actions>
            <SearchUser history={history} />
            <Button
              positive
              onClick={this.handleMemberSubmit}
              content="Add member"
            />
          </Modal.Actions>
        </Modal>
        <Table color="green" celled padded striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Project Members</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {project &&
              project.members &&
              project.members.map((member, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Header as="h4">{member.member.name}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">{member.role}</Header>
                  </Table.Cell>

                  <Table.Cell collapsing>
                    {member.role !== 'Admin' ? (
                      <Icon
                        className="team-remove-user-icon"
                        name="user delete"
                        onClick={() => this.handleDelete(member.member.email)}
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
const mapStateToProps = state => {
  return {
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

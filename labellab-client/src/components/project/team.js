import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Table,
  Header,
  Button,
  Icon,
  Modal,
  Input,
  Dimmer,
  Loader,
  Message
} from "semantic-ui-react";
import { addMember, fetchProject, memberDelete } from "../../actions";
import "./css/team.css";

class TeamIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      member_email: ""
    };
  }
  handleAddMember = () => {
    this.setState({
      open: !this.state.open
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleMemberSubmit = () => {
    this.setState({
      check: true
    });
    let data = {
      member_email: this.state.member_email,
      project_id: this.props.project.project_id
    };
    this.props.addMember(data, this.fetchProjectCallback);
    this.close();
  };
  close = () => this.setState({ open: false });
  handleDelete = email => {
    this.props.memberDelete(
      email,
      this.props.project.project_id,
      this.fetchProjectCallback
    );
  };
  fetchProjectCallback = () => {
    this.props.fetchProject(this.props.project.project_id);
  };
  render() {
    const { project } = this.props;
    const { open } = this.state;
    return (
      <Container>
        {this.props.actions.errors ? (
          <Message negative>
            <Message.Header>{this.props.actions.errors}</Message.Header>
          </Message>
        ) : null}
        {this.props.actions.msg ? (
          <Message success header={this.props.actions.msg} />
        ) : null}
        {this.props.actions.isadding ? (
          <Dimmer active={this.props.actions.isadding}>
            <Loader indeterminate>Adding member :)</Loader>
          </Dimmer>
        ) : null}
        {this.props.actions.isdeleting ? (
          <Dimmer active={this.props.actions.isdeleting}>
            <Loader indeterminate>Removing member :(</Loader>
          </Dimmer>
        ) : null}
        <Modal size="small" open={open} onClose={this.close}>
          <Modal.Content>
            <p>Enter Member email:</p>
          </Modal.Content>
          <Modal.Actions>
            <Input
              name="member_email"
              onChange={this.handleChange}
              type="email"
              placeholder="Member email"
            />
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
                    {member.role !== "Admin" ? (
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
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.projects.projectActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addMember: (data, callback) => {
      return dispatch(addMember(data, callback));
    },
    fetchProject: data => {
      return dispatch(fetchProject(data));
    },
    memberDelete: (email, project_id, callback) => {
      return dispatch(memberDelete(email, project_id, callback));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIndex);

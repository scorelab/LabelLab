import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Table, Header } from "semantic-ui-react";

class TeamIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { project } = this.props;
    return (
      <Container>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Project Members</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {project &&
              project.members &&
              project.members.map((member, index) => 
                <Table.Row key={index}>
                  <Table.Cell>
                    <Header as="h4">
                      {member.member.name}
                    </Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">
                      {member.role}
                    </Header>
                  </Table.Cell>
                </Table.Row>
              )}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIndex);

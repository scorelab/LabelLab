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
  Confirm
} from 'semantic-ui-react'

import { fetchTeam, teamDelete, fetchProject } from '../../actions/index'

class TeamDetails extends Component {
  state = { open: false }

  deleteTeamConfirmation = () => this.setState({ open: true })
  closeDeleteTeam = () => this.setState({ open: false })

  componentDidMount() {
    const {
      match: {
        params: { projectId, teamId }
      },
      fetchTeam
    } = this.props
    fetchTeam(projectId, teamId)
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

  capitalize = string => {
    if (!string) return
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render() {
    const { team, teamActions } = this.props

    return (
      <Fragment>
        {teamActions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience </Loader>
          </Dimmer>
        ) : (
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
                    <Button positive icon labelPosition="left">
                      <Icon name="chat" />
                      Chat
                    </Button>
                    <Button icon>
                      <Icon name="edit" />
                    </Button>
                    <Button icon onClick={this.deleteTeamConfirmation}>
                      <Icon name="delete" />
                    </Button>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Grid.Column width={6}>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Recent Activity </Table.HeaderCell>
                        <Table.HeaderCell>
                          <Button icon>
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
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Team Members </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                          <Button icon>
                            <Icon name="add circle" />
                          </Button>
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
                                <Button icon>
                                  <Icon name="user delete" />
                                </Button>
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
        )}
        <Confirm
          open={this.state.open}
          onCancel={this.closeDeleteTeam}
          onConfirm={this.deleteTeam}
        />
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
    teamActions: state.teams.teamActions
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamDetails)

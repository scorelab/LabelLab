import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Button,
  Table,
  Header,
  Dimmer,
  Loader,
  Message,
  Icon,
  Image,
  Dropdown,
  Grid,
  Container,
  Label,
  Pagination,
  Popup,
  Modal
} from 'semantic-ui-react'
import moment from 'moment'

import {
  fetchProjectIssues,
  fetchTeamSpecificIssues,
  fetchEntitySpecificIssues,
  fetchCategorySpecificIssues,
  deleteIssue
} from '../../../actions/index'
import IssueActions from './issueActions'
import '../css/issues.css'
import { entityTypeOptions, categoryOptions, statusOptions, priorityOptions } from '../../../constants/options'


function ProjectIssues(props) {

  const [category, setCategory] = useState('all')
  const [team, setTeam] = useState('all')
  const [entityType, setEntityType] = useState('all')
  const [entityId, setEntityId] = useState('')
  const [entityOptions, setEntityOptions] = useState([{ text: 'No results found', value: null }])
  const [activePage, setActivePage] = useState(1)
  const [activeIssue, setActiveIssue] = useState('')
  const [update, setUpdate] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const {
      match: {
        params: { projectId, category, team, entityType, entityId }
      },
      fetchEntitySpecificIssues,
      fetchCategorySpecificIssues,
      fetchTeamSpecificIssues
    } = props
    if (category) {
      setCategory(category)
      fetchCategorySpecificIssues(projectId, category)
    } else if (entityType && entityId) {
      setEntityType(entityType)
      setEntityId(entityId)
      fetchEntitySpecificIssues(projectId, entityType, entityId)
    }
    else if (team) {
      setTeam(team)
      fetchTeamSpecificIssues(projectId, team)
    }
  }, [])

  const filterOnCategory = (e, { value }) => {
    const {
      projectId, fetchProjectIssues, fetchCategorySpecificIssues } = props
    setCategory(value)
    setTeam('all')
    setEntityId('')
    setEntityType('all')
    if (value === 'all') {
      fetchProjectIssues(projectId)
    } else {
      fetchCategorySpecificIssues(projectId, value)
    }
  }

  const filterOnTeam = (e, { value }) => {
    const { projectId, fetchProjectIssues, fetchTeamSpecificIssues } = props
    setTeam(value)
    setCategory('all')
    setEntityId('')
    setEntityType('all')
    if (value === 'all') {
      fetchProjectIssues(projectId)
    } else {
      fetchTeamSpecificIssues(projectId, value)
    }
  }

  const filterOnEntityType = (e, { value }) => {
    const { projectId, fetchProjectIssues } = props
    setEntityType(value)
    setCategory('all')
    setTeam('all')
    setEntityId('')
    if (value === 'all')
      fetchProjectIssues(projectId)
    setEntityOptions(entities[value])

  }

  const filterOnEntityId = (e, { value }) => {
    const { projectId, fetchEntitySpecificIssues } = props
    setEntityId(value)
    setCategory('all')
    setTeam('all')
    if (entityType && value) {
      fetchEntitySpecificIssues(projectId, entityType, value)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const toggleOpen = (data) => {
    setOpen(!open)
    setActiveIssue(data)
  }

  const handleClick = (id) => {
    const { projectId } = props
    props.history.push({
      pathname: '/project/' + projectId + '/issue/' + id
    })
  }

  const handlePaginationChange = (e, { activePage }) => {
    const {
      projectId,
      fetchProjectIssues,
    } = props
    setActivePage(activePage)
    fetchProjectIssues(projectId, activePage)
  }

  const handleUpdate = (e, { data }) => {
    setActiveIssue(data)
    setUpdate(true)
    toggleForm()
  }

  const handleDelete = () => {
    const { projectId, deleteIssue } = props
    if(activeIssue)
    deleteIssue(projectId, activeIssue.id, callback)
  }

  const callback = () => {
    const { projectId, fetchProjectIssues } = props
    toggleOpen('')
    fetchProjectIssues(projectId, activePage)
  }

  const {
    issues,
    teams,
    members,
    users,
    entities,
    projectId,
    issuesActions: { isFetching, isDeleting, isPosting, isUpdating, errors },
    fetchProjectIssues
  } = props

  return (
    <Fragment>
      {isPosting ? (
        <Dimmer active>
          <Loader indeterminate>Creating issue...</Loader>
        </Dimmer>
      ) : null}
      {isUpdating ? (
        <Dimmer active>
          <Loader indeterminate>Updating issue...</Loader>
        </Dimmer>
      ) : null}
      {isDeleting ? (
        <Dimmer active>
          <Loader indeterminate>Deleting issue...</Loader>
        </Dimmer>
      ) : null}
      {isFetching ? (
        <Dimmer active>
          <Loader indeterminate>Fetching project issues...</Loader>
        </Dimmer>
      ) : null}
      {errors ? (
        <Message icon>
          <Icon name="warning" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {errors}
          </Message.Content>
        </Message>
      ) : null}
      <Grid>
        <Grid.Row textAlign='bottom'>
          <Grid.Column width={4}>
            <Button onClick={toggleForm} positive>
              Add Issue
            </Button>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4" subheader>Category</Header>
            <Dropdown
              floating
              fluid
              name="category"
              label="Category"
              selection
              value={category}
              options={categoryOptions}
              onChange={filterOnCategory}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4" subheader>Team</Header>
            <Dropdown
              floating
              fluid
              name="team"
              placeholder="Team"
              selection
              value={team}
              options={teams}
              onChange={filterOnTeam}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4" subheader>Entity Type</Header>
            <Dropdown
              floating
              fluid
              name="entityType"
              placeholder="Entity Types"
              selection
              value={entityType}
              options={entityTypeOptions}
              onChange={filterOnEntityType}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4" subheader>Entities</Header>
            <Dropdown
              floating
              fluid
              search
              name="entityId"
              placeholder={`Choose ${entityType}`}
              selection
              value={entityId}
              options={entityOptions}
              onChange={filterOnEntityId}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table color="green" selectable>
        <Table.Header>
          <Table.Row className="center">
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell className="left">Issue</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Priority</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Assignee</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues && issues.items && issues.items.length > 0 ? (
            issues.items.map(issue => (
              <Table.Row
                key={issue.id}
                onClick={() => handleClick(issue.id)}
                className="center"
              >
                <Table.Cell><Header as="h4" color="grey">#{issue.id}</Header></Table.Cell>
                <Table.Cell width={8}>
                  <Header as="h4" subheader className="issue-header">
                    {issue.title}
                    {members && members.length > 0 && members.map(member => {
                      if (issue.created_by == member.user_id)
                        return (
                          <Header.Subheader>
                            reported {moment(issue.created_at).startOf('hour').fromNow()} by {member.name} <br />
                          </Header.Subheader>
                        )
                    })
                    }
                  </Header>
                </Table.Cell>
                <Table.Cell width={2}>{issue.category}</Table.Cell>
                {issue.team_id ? (
                  teams && teams.length > 0 && teams.map(team => {
                    if (team.key == issue.team_id)
                      return (
                        <Table.Cell width={2}>
                          {team.text}
                        </Table.Cell>
                      )
                  })
                ) : (
                  <Table.Cell width={2}>
                    None
                  </Table.Cell>
                )}
                <Table.Cell width={2}>
                  <Header as="h5" color={priorityOptions[issue.priority]}>
                    {issue.priority}
                  </Header>
                </Table.Cell>
                <Table.Cell width={2}>
                  <Label color={statusOptions[issue.status]} size='medium' horizontal className="issue-status-label">
                    {issue.status}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  {issue.assignee_id ? (
                    users && users.length > 0 && users.map(user => {
                      if (issue.assignee_id == user.id)
                        return (
                          <Popup content={user.name} size='mini' trigger={
                            <Image
                              src={user.thumbnail}
                              size="mini"
                              avatar
                            />
                          } />
                        )
                    })
                  ) : (
                    <Popup content='Not assigned' size='mini' trigger={
                      <Icon name="user circle" className='user-icon' />
                    } />
                  )}
                </Table.Cell>
                <Table.Cell width={1}>
                  <Dropdown item icon='ellipsis horizontal' simple>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleUpdate} data={issue} icon='edit' text='Edit' />
                      <Dropdown.Item onClick={() => toggleOpen(issue)} id={issue.id} icon='trash' text='Delete' />
                      <Dropdown.Item>
                        <Link to={`/project/${issue.project_id}/logs/entity/issue/${issue.id}`} className='issue-link'>
                          <Dropdown.Item icon='history' text='Activity'/>
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell width={16}>
                <Icon name="warning" />
                <strong>Oops!</strong> No issues found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Container className="center">
        <Pagination
          firstItem={null}
          lastItem={null}
          activePage={activePage}
          siblingRange={3}
          boundaryRange={1}
          totalPages={issues && issues.total ? Math.ceil(issues.total / issues.perPage) : 1}
          onPageChange={handlePaginationChange}
        />
      </Container>
      <IssueActions
        update={update}
        data={activeIssue}
        showForm={showForm}
        projectId={projectId}
        entities={entities}
        toggleForm={toggleForm}
        fetchProjectIssues={fetchProjectIssues}
      />
      <Modal size="mini" open={open} onClose={() => toggleOpen('')}>
        <Modal.Header>
          Delete Issue
        </Modal.Header>
        <Modal.Content>
          Are you sure you want delete {activeIssue.title} ?
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={handleDelete}>
            Yes
          </Button>
          <Button negative onClick={() => toggleOpen('')}>
            No
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}

ProjectIssues.propTypes = {
  issues: PropTypes.array
}

const mapStateToProps = state => {
  return {
    issues: state.issues.issues,
    issuesActions: state.issues.issuesActions,
    projectId: state.projects.currentProject.projectId,
    members: state.projects.currentProject.members,
    users: state.user.users,
    teams: state.projects.currentProject.teams
      ? [
        { key: 'all', value: 'all', text: 'all' },
        ...state.projects.currentProject.teams.map(team => {
          return {
            key: team.id,
            value: team.id,
            text: team.team_name
          }
        })
      ]
      : [],
    entities: {
      team: state.projects.currentProject.teams
        ? [
          ...state.projects.currentProject.teams.map(team => {
            return {
              key: team.id,
              value: team.id,
              text: team.team_name
            }
          })
        ]
        : [],
      label: state.labels.labels.length > 0
        ? [
          ...state.labels.labels.map(label => {
            return {
              key: label.id,
              value: label.id,
              text: label.label_name
            }
          })
        ]
        : [],
      image: state.projects.currentProject.images
        ? [
          ...state.projects.currentProject.images.map(image => {
            return {
              key: image.id,
              value: image.id,
              text: image.image_name
            }
          })
        ]
        : [],
      issue: state.issues.issues && state.issues.issues.items
        ? [
          ...state.issues.issues.items.map(issue => {
            return {
              key: issue.id,
              value: issue.id,
              text: issue.title
            }
          })
        ]
        : [],
      model: state.model.models
        ? [
          ...state.model.models.map(model => {
            return {
              key: model.id,
              value: model.id,
              text: model.name
            }
          })
        ]
        : []
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectIssues: (projectId, activePage) => {
      return dispatch(fetchProjectIssues(projectId, activePage))
    },
    fetchTeamSpecificIssues: (projectId, team) => {
      return dispatch(fetchTeamSpecificIssues(projectId, team))
    },
    fetchEntitySpecificIssues: (projectId, entityType, entityId) => {
      return dispatch(fetchEntitySpecificIssues(projectId, entityType, entityId))
    },
    fetchCategorySpecificIssues: (projectId, category) => {
      return dispatch(fetchCategorySpecificIssues(projectId, category))
    },
    deleteIssue: (projectId, issueId, callback) => {
      return dispatch(deleteIssue(projectId, issueId, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectIssues)

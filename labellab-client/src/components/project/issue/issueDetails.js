import React, { useState, useEffect, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
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
    Grid,
    Container,
    Label,
    TextArea,
    Divider,
    Comment,
    Input,
    Form,
    Select,
    Confirm
} from 'semantic-ui-react'
import moment from 'moment'

import {
    updateIssue,
    deleteIssue,
    fetchIssue,
    assignIssue,
    fetchEntitySpecificLogs,
    sendComment,
    handleCommentReceive
} from '../../../actions/index'
import '../css/issues.css'
import { entityTypeOptions, categoryOptions, statusOptions, priorityOptions, statusColorOptions, priorityColorOptions } from '../../../constants/options'


function IssueDetails(props) {

    const [issueDetails, setIssueDetails] = useState({
        title: { 'value': '', 'show': false },
        description: { value: '', show: false },
        team_id: { value: null, show: false },
        category: { value: '', show: false },
        priority: { value: '', show: false },
        status: { value: 'Open', show: false },
        entity_type: { value: '', show: false },
        entity_id: { value: null, show: false },
        due_date: { value: '', show: false },
        assignee_id: { value: null, show: false }
    })
    const [entityOptions, setEntityOptions] = useState([{ text: 'No results found', value: null }])
    const [update, setUpdate] = useState(false)
    const [assign, setAssign] = useState(false)
    const [comment, setComment] = useState('')
    const [open, setOpen] = useState(false)

    const {
        issue, members, logs, teams, user, users, entities, projectId, roles, comments,
        issuesActions,
        logsActions
    } = props

    useEffect(() => {
        const {
            match: {
                params: { projectId, issueId }
            },
            fetchIssue,
            fetchEntitySpecificLogs,
            handleCommentReceive,
        } = props
        fetchIssue(projectId, issueId)
        fetchEntitySpecificLogs(projectId, 'issue', issueId)
        handleCommentReceive(issueId)
    }, [])

    useEffect(() => {
        const { issue } = props
        if (issue.entityType) {
            setEntityOptions(entities[issue.entityType])
        }
        setIssueDetails({
            title: { value: issue.title, show: false },
            description: { value: issue.description, show: false },
            team_id: { value: issue.teamId ? issue.teamId : null, show: false },
            category: { value: issue.category, show: false },
            priority: { value: issue.priority, show: false },
            status: { value: issue.status, show: false },
            entity_type: { value: issue.entityType ? issue.entityType : '', show: false },
            entity_id: { value: issue.entityId ? issue.entityId : null, show: false },
            due_date: { value: issue.dueDate ? `${moment(issue.dueDate).format('YYYY-MM-DD')}T${moment(issue.dueDate).format('hh:mm')}` : '', show: false },
            assignee_id: { value: issue.assigneeId ? issue.assigneeId : null, show: false }
        })
    }, [issue])

    const toggleShow = (name) => {
        setIssueDetails({
            ...issueDetails,
            [name]: { 'value': issueDetails[name].value, 'show': true }
        })
    }

    const handleChange = (e, { name, value }) => {
        setUpdate(true)
        if (name == 'assignee_id')
            setAssign(true)
        if (name == 'comment') {
            setComment(value)
            return;
        }
        setIssueDetails({
            ...issueDetails,
            [name]: { 'value': value, 'show': issueDetails[name].show }
        })
        if (name === 'entity_type') {
            if (entities[`${value}`].length > 0)
                setEntityOptions(entities[`${value}`])
            else
                setEntityOptions([{ text: 'No results found', value: null }])
        }
    }

    const handleAssign = () => {
        var data = {
            assignee_id: issueDetails.assignee_id.value
        }
        props.assignIssue(projectId, issue.id, data, successCallback)
    }

    const handleSubmit = () => {
        const issueData = {}
        for (const [key, data] of Object.entries(issueDetails)) {
            if (data.value != null && (typeof data.value === 'string' && data.value.trim() != ''))
                issueData[key] = data.value
        }
        props.updateIssue(projectId, issue.id, issueData, successCallback)
    }

    const successCallback = () => {
        const {
            match: {
                params: { projectId, issueId }
            },
            fetchIssue,
            fetchEntitySpecificLogs
        } = props
        fetchIssue(projectId, issueId)
        fetchEntitySpecificLogs(projectId, 'issue', issueId)
    }

    const handleSendComment = () => {
        const { sendComment } = props
        const body = comment
        if (!body) {
            return
        }
        setComment('')
        sendComment(body, issue.id, user.id)
    }

    const handleDelete = () => {
        const { projectId, deleteIssue } = props
        deleteIssue(projectId, issue.id, callback)
    }

    const callback = () => {
        setOpen(false)
        props.history.goBack()
    }

    return (
        <Fragment>
            {issuesActions.errors ? (
                issuesActions.errors == '404' ? (
                    <Redirect to="/404" />
                ) : (
                    issuesActions.errors == '401' ? (
                        <Redirect to="/401" />
                    ) : null
                )
            ) : null}
            {issuesActions.isUpdating ? (
                <Dimmer active>
                    <Loader indeterminate>Updating issue...</Loader>
                </Dimmer>
            ) : null}
            {issuesActions.isDeleting ? (
                <Dimmer active>
                    <Loader indeterminate>Deleting issue...</Loader>
                </Dimmer>
            ) : null}
            {issuesActions.isFetching && logsActions.isFetching ? (
                <Dimmer active>
                    <Loader indeterminate>Fetching project issue...</Loader>
                </Dimmer>
            ) : null}
            {issuesActions.errors ? (
                <Message icon>
                    <Icon name="warning" />
                    <Message.Content>
                        <Message.Header>Error</Message.Header>
                        {issuesActions.errors}
                    </Message.Content>
                </Message>
            ) : null}
            {issue && logs ? (
                <Fragment>
                    <Grid className='issue-details-grand-parent'>
                        <Grid.Row >
                            <Grid.Column width={8}>
                                <Header as='h2'>
                                    <Grid>
                                        <Grid.Row width={16}>
                                            <Grid.Column width={3} verticalAlign='middle'>
                                                <Header color='green' size='tiny' className='issue-id'>
                                                    #{issue.id}
                                                </Header>
                                            </Grid.Column>
                                            <Grid.Column width={13}>
                                                <Header as='h2' onClick={() => toggleShow('title')} className='issue-title'>
                                                    {issueDetails.title && issueDetails.title.show ? (
                                                        <Input
                                                            name="title"
                                                            value={issueDetails.title.value}
                                                            onChange={handleChange}
                                                            className='issue-title-edit'
                                                        />
                                                    ) :
                                                        `${issue.title}`
                                                    }
                                                </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    {users && users.length > 0 && users.map((person, index) => {
                                        if (issue.createdBy == person.id)
                                            return (
                                                <Fragment key={index}>
                                                    <Header.Subheader className='issue-created'>
                                                        reported {moment.utc(issue.createdAt).local().startOf('hour').fromNow()} by {person.name}
                                                    </Header.Subheader>
                                                    <Header.Subheader className='issue-updated'>
                                                        last updated {moment.utc(issue.updatedAt).local().startOf('hour').fromNow()}
                                                    </Header.Subheader>
                                                </Fragment>
                                            )
                                    })}
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h2' verticalAlign='middle'>
                                    <Header.Subheader onClick={() => toggleShow('due_date')} className='issue-due'>
                                        {issueDetails.due_date && issueDetails.due_date.show ? (
                                            <Input
                                                name="due_date"
                                                type='datetime-local'
                                                value={issueDetails.due_date.value}
                                                onChange={handleChange}
                                                className='issue-due-edit'
                                            />
                                        ) : (
                                            <em>{issue.dueDate ? `Due ${moment(issue.dueDate).format('LLL')}` : `No due date`}</em>
                                        )}
                                    </Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width={3} textAlign='right'>
                                {statusOptions && issueDetails.status && issueDetails.status.show ? (
                                    <Select
                                        fluid
                                        options={statusOptions}
                                        placeholder="Status"
                                        name='status'
                                        value={issueDetails.status.value}
                                        onChange={handleChange}
                                        className='issue-status-edit'
                                    />
                                ) : (
                                    <Label color={issue && statusColorOptions[issue.status]} size='big' horizontal floated='right' onClick={() => toggleShow('status')} className='issue-status'>
                                        {issue.status}
                                    </Label>
                                )}

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid padded='vertically'>
                        <Grid.Row width={16}>
                            <Grid.Column width={4}>
                                <Header as='h4' className='detail-header'>Category</Header>
                                {issueDetails.category && issueDetails.category.show ? (
                                    <Select
                                        fluid
                                        options={categoryOptions}
                                        name='category'
                                        value={issueDetails.category.value}
                                        onChange={handleChange}
                                        className='issue-category-edit'
                                    />
                                ) : (
                                    <Header as='h2'>
                                        <Header.Subheader onClick={() => toggleShow('category')} className='issue-category'>
                                            {issue.category}
                                        </Header.Subheader>
                                    </Header>
                                )}
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h4' className='detail-header'>Team</Header>
                                {issueDetails.team_id && issueDetails.team_id.show ? (
                                    <Select
                                        placeholder="Assign Team"
                                        options={entities.team}
                                        name='team_id'
                                        value={issueDetails.team_id.value}
                                        onChange={handleChange}
                                        className='issue-team-edit'
                                    />
                                ) : (
                                    issue.teamId ? (
                                        teams && teams.length > 0 && teams.map((team, index) => {
                                            if (team.value == issue.teamId)
                                                return (
                                                    <Header as='h2' key={index}>
                                                        <Header.Subheader onClick={() => toggleShow('team_id')} className='issue-team'>
                                                            {team.text}
                                                        </Header.Subheader>
                                                    </Header>
                                                )
                                        })
                                    ) : (
                                        <Header as='h2'>
                                            <Header.Subheader onClick={() => toggleShow('team_id')} className='issue-team'>
                                                None
                                            </Header.Subheader>
                                        </Header>
                                    )
                                )}
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h4' className='detail-header'>Priority</Header>
                                {issueDetails.priority && issueDetails.priority.show ? (
                                    <Select
                                        placeholder="Priority"
                                        options={priorityOptions}
                                        name='priority'
                                        value={issueDetails.priority.value}
                                        onChange={handleChange}
                                        className='issue-priority-edit'
                                    />
                                ) : (
                                    <Header as='h5' color={priorityColorOptions[issue.priority]} onClick={() => toggleShow('priority')} className='issue-priority'>
                                        {issue.priority}
                                    </Header>
                                )}
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h4' className='detail-header'>Assignee</Header>
                                {issueDetails.assignee_id && issueDetails.assignee_id.show && roles && roles.includes('admin') ? (
                                    <Select
                                        placeholder="Assign a member"
                                        options={members}
                                        name='assignee_id'
                                        value={issueDetails.assignee_id.value}
                                        onChange={handleChange}
                                        className='issue-assignee-edit'
                                    />
                                ) : (
                                    <div>
                                        {issue.assigneeId ? (
                                            users && users.length > 0 && users.map((person, index) => {
                                                if (issue.assigneeId == person.id)
                                                    return (
                                                        <Header as='h3' floated='left' onClick={() => toggleShow('assignee_id')} key={index} className='issue-assignee'>
                                                            <Header.Subheader>
                                                                <Image circular src={person.thumbnail} avatar /> {person.name}
                                                            </Header.Subheader>

                                                        </Header>
                                                    )
                                            })
                                        ) : (
                                            <Header as='h3' floated='left' onClick={() => toggleShow('assignee_id')} className='issue-assignee'>
                                                <Header.Subheader>
                                                    <Icon name="user circle" className='user-icon' /> Not assigned
                                                </Header.Subheader>

                                            </Header>
                                        )}
                                    </div>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header as="h4" floated='left'>Associated Entity : </Header>

                                {issueDetails.entity_type && issueDetails.entity_type.show ? (
                                    <div className='issue-entity-edit'>
                                        <Select
                                            placeholder="Entity Type"
                                            options={entityTypeOptions}
                                            name='entity_type'
                                            value={issueDetails.entity_type.value}
                                            onChange={handleChange}
                                        />
                                        <Select
                                            placeholder={`Choose ${issue.entity_type}`}
                                            options={entityOptions}
                                            name='entity_id'
                                            value={issueDetails.entity_id.value}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    issue.entityType ? (
                                        <Fragment>
                                            {entities && entities[issue.entityType].map((entity, index) => {
                                                if (issue.entityId == entity.value)
                                                    return (
                                                        <Header as='h2' key={index}>
                                                            <Header.Subheader onClick={() => toggleShow('entity_type')} className='issue-entity'>
                                                                {`(${issue.entityType})  ${entity.text}`}
                                                            </Header.Subheader>
                                                        </Header>
                                                    )
                                            })}
                                        </Fragment>
                                    ) : (
                                        <Grid.Column width={12} onClick={() => toggleShow('entity_type')}>
                                            No associated entity
                                        </Grid.Column>
                                    )
                                )}

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Container fluid>
                        {issueDetails.description && issueDetails.description.show ? (
                            <Form>
                                <TextArea
                                    placeholder='Describe the issue in detail...'
                                    name='description'
                                    value={issueDetails.description.value}
                                    onChange={handleChange}
                                    className='issue-description-edit'
                                />
                            </Form>
                        ) : (
                            <Header as='h2'>
                                <Header.Subheader onClick={() => toggleShow('description')} className='issue-description'>
                                    {issue.description}
                                </Header.Subheader>
                            </Header>
                        )}


                    </Container>
                    <Container textAlign='right'>
                        <Button
                            active
                            disabled={
                                issueDetails.assignee_id.value == null || !assign}
                            onClick={handleAssign}
                            className="assign-button"
                        >
                            Assign
                        </Button>
                        <Button
                            positive
                            disabled={
                                issueDetails.title.value == '' || issueDetails['description'].value == '' || issueDetails['category'].value == '' || !update}
                            onClick={handleSubmit}
                            className="update-button"
                        >
                            Update
                        </Button>
                        <Button negative onClick={() => setOpen(true)} className="delete-button">Delete</Button>
                        <Confirm
                            open={open}
                            onCancel={() => setOpen(false)}
                            onConfirm={handleDelete}
                            className="delete-confirmation"
                        />
                    </Container>

                    <Divider />
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8} >
                                <Comment.Group >
                                    <Header as='h3' dividing>
                                        Comments
                                    </Header>
                                    <div className='comment-section'>
                                        {comments && comments.length > 0 ? comments.map((comment, index) => {
                                            return (
                                                <Comment key={index} className='comments'>
                                                    <Comment.Avatar src={comment.thumbnail} />
                                                    <Comment.Content>
                                                        <Comment.Author as='a'>{comment.username}</Comment.Author>
                                                        <Comment.Metadata>
                                                            <div>{moment.utc(comment.timestamp).local().startOf('minute').fromNow()}</div>
                                                        </Comment.Metadata>
                                                        <Comment.Text>{comment.body}</Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                            )
                                        }) : (
                                            <div>
                                                No comments yet!
                                            </div>
                                        )}
                                    </div>
                                    <Form reply fluid>
                                        <Image
                                            src={user.profileImage}
                                            size="mini"
                                            avatar
                                        />
                                        <Input placeholder='Type something...' onChange={handleChange} name='comment' value={comment} className='comment-box' />
                                        <Button icon='send' onClick={handleSendComment} color='green' className='send-comment' />
                                    </Form>
                                </Comment.Group>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header>Activity</Header>
                                <Table>
                                    <Table.Body >
                                        <div className='activity-section'>
                                            {logs && logs.length > 0 ? (
                                                logs.map(log => (
                                                    <Table.Row
                                                        negative={log.category === 'models'}
                                                        positive={log.category === 'images'}
                                                        warning={log.category === 'labels'}
                                                        active={log.category === 'general'}
                                                        key={log.id}
                                                        className="log"
                                                    >
                                                        <Table.Cell width={12}>
                                                            <Header as="h4" className='log-details'>
                                                                {log.message}
                                                                <Header.Subheader as="h6">
                                                                    {moment.utc(log.timestamp).local().startOf('minute').fromNow()} by {log.username}
                                                                </Header.Subheader>
                                                            </Header>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))
                                            ) : (
                                                <Table.Row>
                                                    <Table.Cell width={16}>
                                                        <Icon name="warning" />
                                                        <strong> No activity on issue yet</strong>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </div>

                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Fragment>
            ) : (
                <Fragment>
                    Issue not found
                </Fragment>
            )}
        </Fragment>
    )

}

IssueDetails.propTypes = {
    logs: PropTypes.array,
    roles: PropTypes.array,
    comments: PropTypes.array
}

const mapStateToProps = state => {
    return {
        issue: state.issues.currentIssue,
        logs: state.logs.logs,
        issuesActions: state.issues.issuesActions,
        logsActions: state.logs.logsActions,
        projectId: state.projects.currentProject.projectId,
        members: state.projects.currentProject.members,
        users: state.user.users,
        user: state.user.userDetails,
        roles: state.projects.currentProject.roles,
        comments: state.issues.comments,
        members: state.user.users
            ? [
                ...state.user.users.map(member => {
                    return {
                        key: member.id,
                        value: member.id,
                        text: member.name
                    }
                })
            ]
            : [],
        teams: state.projects.currentProject.teams
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
        updateIssue: (projectId, issueId, data, callback) => {
            return dispatch(updateIssue(projectId, issueId, data, callback))
        },
        deleteIssue: (projectId, issueId, callback) => {
            return dispatch(deleteIssue(projectId, issueId, callback))
        },
        fetchIssue: (projectId, issueId) => {
            return dispatch(fetchIssue(projectId, issueId))
        },
        assignIssue: (projectId, issueId, data, callback) => {
            return dispatch(assignIssue(projectId, issueId, data, callback))
        },
        fetchEntitySpecificLogs: (projectId, entityType, entityId) => {
            return dispatch(fetchEntitySpecificLogs(projectId, entityType, entityId))
        },
        sendComment: (comment, issueId, userId) => {
            return dispatch(sendComment(comment, issueId, userId))
        },
        handleCommentReceive: issueId => {
            return dispatch(handleCommentReceive(issueId))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IssueDetails)

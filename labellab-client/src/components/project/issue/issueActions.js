import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Form,
  Icon,
  Modal,
} from 'semantic-ui-react'

import moment from 'moment'

import {
  createIssue,
  updateIssue
} from '../../../actions/index'
import { statusOptions, categoryOptions, priorityOptions, entityTypeOptions } from '../../../constants/options'


function IssueActions(props) {
  
  const { entities, showForm, projectId, toggleForm, fetchProjectIssues } = props

  const [issue, setIssue] = useState({
    title: '',
    description: '',
    teamId: null,
    category: '',
    priority: '',
    status: '',
    entityType: '',
    entityId: null,
    due_date: ''
  })
  const [entityOptions, setEntityOptions] = useState([{ text: 'No results found', value: null }])

  useEffect(() => {
    const { update, data, entities } = props
    if (update && data) {
      if (data.entity_type) {
        setEntityOptions(entities[data.entity_type])
      }
      setIssue({
        title: data.title,
        description: data.description,
        team_id: data.team_id,
        category: data.category,
        priority: data.priority,
        status: data.status,
        entity_type: data.entity_type == null ? '' : data.entity_type,
        entity_id: data.entity_id == null ? '' : data.entity_id,
        due_date: data.due_date ? `${moment(data.due_date).format('YYYY-MM-DD')}T${moment(data.due_date).format('hh:mm')}` : ''
      })
    }
  }, [props])

  const handleChange = (e, { name, value }) => {
    setIssue({
      ...issue,
      [name]: value
    })
    if (name === 'entity_type') {
      if (entities[`${value}`].length > 0)
        setEntityOptions(entities[`${value}`])
      else
        setEntityOptions([{ text: 'No results found', value: null }])
    }
  }

  const handleSubmit = (e, { name }) => {
    for (const [key, value] of Object.entries(issue)) {
      if (value == null || (typeof value === 'string' && value.trim() == ''))
        delete issue[key]
    }
    if (name == "update") {
      props.updateIssue(projectId, props.data.id, issue, successCallback)
    }
    else {
      props.createIssue(projectId, issue, successCallback)
    }
    toggleForm()
  }

  const initialiseState = () => {
    setIssue({
      title: '',
      description: '',
      team_id: null,
      category: '',
      priority: '',
      status: '',
      entity_type: '',
      entity_id: null,
      due_date: ''
    })
  }

  const successCallback = () => {
    initialiseState()
    fetchProjectIssues(projectId)
  }

  const handleCancel = () => {
    toggleForm()
    initialiseState()
  }

  return (
    <Modal
      size="small"
      open={showForm}
      onClose={() => toggleForm()}
    >
      <Modal.Header>
        <p>Enter Issue Details</p>
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            required
            fluid
            label='Title'
            placeholder='Issue Title'
            name='title'
            value={issue.title}
            onChange={handleChange}
          />
          <Form.TextArea
            required
            label='Description'
            placeholder='Describe the issue in detail...'
            name='description'
            value={issue.description}
            onChange={handleChange}
          />
          <Form.Group widths='equal'>
            <Form.Input
              type='datetime-local'
              label='Due on'
              name='due_date'
              value={issue.due_date}
              onChange={handleChange}
            />
            <Form.Select
              label='Team'
              options={entities.team}
              placeholder='Assign Team'
              name='team_id'
              value={issue.team_id}
              onChange={handleChange}
            />
            <Form.Select
              required
              label='Category'
              options={categoryOptions}
              placeholder='Issue category'
              name='category'
              value={issue.category}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Select
              label='Priority'
              options={priorityOptions}
              placeholder='Issue priority'
              name='priority'
              value={issue.priority}
              onChange={handleChange}
            />
            <Form.Select
              label='Status'
              options={statusOptions}
              placeholder="Issue's current status"
              name='status'
              value={issue.status}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Select
              label='Entity Type'
              options={entityTypeOptions}
              placeholder='Associate an entity e.g. image'
              name='entity_type'
              value={issue.entity_type}
              onChange={handleChange}
            />
            <Form.Select
              search
              label='Entities'
              options={entityOptions}
              placeholder={`Choose ${issue.entity_type}`}
              name='entity_id'
              value={issue.entity_id}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {props.update ? (
          <Button
            name="update"
            positive
            disabled={
              issue.title.trim() == '' || issue.description.trim() == '' || issue.category.trim() == ''
            }
            onClick={handleSubmit}
          >
            <Icon name='checkmark' /> Update
          </Button>
        ) : (
          <Button
            name="create"
            positive
            disabled={
              issue.title.trim() == '' || issue.description.trim() == '' || issue.category.trim() == ''
            }
            onClick={handleSubmit}
          >
            <Icon name='checkmark' /> Create
          </Button>
        )}
        <Button negative onClick={handleCancel}>
          <Icon name='remove' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    createIssue: (projectId, data, callback) => {
      return dispatch(createIssue(projectId, data, callback))
    },
    updateIssue: (projectId, issueId, data, callback) => {
      return dispatch(updateIssue(projectId, issueId, data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueActions)

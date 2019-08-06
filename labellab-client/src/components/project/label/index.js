import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Button, Form, Icon } from 'semantic-ui-react'
import { fetchLabels, createLabel, deleteLabel } from '../../../actions/index'
import LabelItem from './labelItem.js'
import '../css/labelItem.css'

const options = [
  { key: 'bbox', text: 'Draw a bounding box', value: 'bbox' },
  { key: 'polygon', text: 'Draw a polygon figure', value: 'polygon' }
]

class LabelIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showform: false,
      name: 'New Label',
      type: 'bbox'
    }
  }
  componentDidMount() {
    const { fetchLabels, match } = this.props
    fetchLabels(match.params.projectId)
  }
  toggleForm = () => {
    this.setState({
      showform: true
    })
  }
  onChange = (name, data) => {
    this.setState({
      [name]: data
    })
  }
  handleSubmit = e => {
    const { project, createLabel } = this.props
    e.preventDefault()
    let data = {
      name: this.state.name,
      type: this.state.type,
      projectId: project.projectId
    }
    createLabel(data, this.callback)
  }
  callback = () => {
    const { project, fetchLabels } = this.props
    this.setState({
      showform: false,
      name: 'New Label',
      type: 'bbox'
    })
    fetchLabels(project.projectId)
  }
  handleDelete = value => {
    const { project, deleteLabel, fetchLabels } = this.props
    deleteLabel(value._id, fetchLabels(project.projectId))
  }
  render() {
    const value = {
      name: 'New Label',
      type: 'bbox'
    }
    const { actions, labels } = this.props
    const { showform } = this.state
    return (
      <div>
        {actions.isfetching ? (
          <Dimmer active={actions.isfetching}>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}

        {actions.isdeleting ? (
          <Dimmer active>
            <Loader indeterminate>Removing Label :)</Loader>
          </Dimmer>
        ) : null}
        {labels !== undefined &&
          labels.map((label, index) => (
            <LabelItem
              value={label}
              key={index}
              onChange={this.onChange}
              onDelete={this.handleDelete}
            />
          ))}
        <Button onClick={this.toggleForm}>Create new Label</Button>
        {showform ? (
          <Form className="form-card flex" onSubmit={this.handleSubmit}>
            <div className="form-card-child">
              <Form.Field
                placeholder="Label name"
                control="input"
                defaultValue={value.name}
                className="form-card-child-field"
                onChange={e => this.onChange(e.target.name, e.target.value)}
                name="name"
              />
              <Form.Select
                label="Label type"
                options={options}
                defaultValue={value.type}
                onChange={(e, change) =>
                  this.onChange(change.name, change.value)
                }
                style={{ maxWidth: 400 }}
                name="type"
              />
            </div>
            <div className="form-button-parent">
              <Button
                type="button"
                className="form-button-itself"
                onClick={this.onChange}
              >
                <Icon name="trash" />
              </Button>
            </div>
            <Button type="submit">Create</Button>
          </Form>
        ) : null}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.labels.labelActions,
    labels: state.labels.labels
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId))
    },
    createLabel: (data, callback) => {
      return dispatch(createLabel(data, callback))
    },
    deleteLabel: (labelId, callback) => {
      return dispatch(deleteLabel(labelId, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelIndex)

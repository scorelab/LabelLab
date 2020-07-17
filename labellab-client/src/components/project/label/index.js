import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Dimmer,
  Loader,
  Button,
  Container,
  Icon,
  Table,
  Header,
  Modal,
  Input,
  Select
} from 'semantic-ui-react'
import {
  fetchLabels,
  createLabel,
  deleteLabel,
  updateALabel
} from '../../../actions/index'
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
  toggleForm = () => {
    this.setState(prevState => ({
      showform: !prevState.showform
    }))
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
      label_name: this.state.name,
      label_type: this.state.type,
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
  onUpdate = value => {
    const { updateALabel } = this.props
    let data = {
      label_name: this.state.name,
      label_type: this.state.type
    }
    updateALabel(value.id, data, this.callback)
  }

  handleDelete = value => {
    const { project, deleteLabel, fetchLabels } = this.props
    deleteLabel(value.id, fetchLabels(project.projectId))
  }
  render() {
    const value = {
      name: 'New Label',
      type: 'bbox'
    }
    const { actions, labels } = this.props
    const { showform } = this.state
    return (
      <Container className="label-container">
        {actions.isdeleting ? (
          <Dimmer active>
            <Loader indeterminate>Removing Label :)</Loader>
          </Dimmer>
        ) : null}
        <Button onClick={this.toggleForm} positive>
          Add Label
        </Button>
        {labels !== undefined && (
          <Table color="green" celled padded striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell singleLine>S. No.</Table.HeaderCell>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {labels.length && 
                labels.length !== 0 ? labels.map((label, index) => (
                <LabelItem
                  key={label.id}
                  index={index}
                  label={label}
                  options={options}
                  onChange={this.onChange}
                  onDelete={this.handleDelete}
                  onUpdate={this.onUpdate}
                />
              )):<div>
                There are no labels present
                </div>}
            </Table.Body>
          </Table>
        )}

        <Modal
          size="small"
          open={this.state.showform}
          onClose={this.toggleForm}
        >
          <Modal.Header>
            <p>Enter Label Details</p>
          </Modal.Header>
          <Modal.Actions>
            <div className="modal-actions">
              <Input
                name="name"
                type="text"
                label="Name"
                placeholder="Label name..."
                defaultValue={value.name}
                onChange={e => this.onChange(e.target.name, e.target.value)}
              />
              <Select
                label="Type"
                options={options}
                defaultValue={value.type}
                onChange={(e, change) =>
                  this.onChange(change.name, change.value)
                }
                name="type"
              />
              <div>
                <Button
                  positive
                  onClick={this.handleSubmit}
                  content="Add Label"
                />
              </div>
            </div>
          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}

LabelIndex.propTypes = {
  match: PropTypes.object,
  project: PropTypes.object,
  actions: PropTypes.object,
  labels: PropTypes.array,
  fetchLabels: PropTypes.func,
  createLabel: PropTypes.func,
  deleteLabel: PropTypes.func,
  updateALabel: PropTypes.func
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
    },
    updateALabel: (labelId, labeldata, callback) => {
      return dispatch(updateALabel(labelId, labeldata, callback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelIndex)

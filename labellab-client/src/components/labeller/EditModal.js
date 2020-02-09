import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Header,
  Icon,
  Button,
  Form,
  Select,
  Modal
} from 'semantic-ui-react'
import { fetchLabels, editLabel } from '../../actions/index'

const options = [
  { key: 'bbox', text: 'Draw a bounding box', value: 'bbox' },
  { key: 'polygon', text: 'Draw a polygon figure', value: 'polygon' }
]
  
class EditModal extends Component  {
  state = {
    showModal: false
  }
  handleUpdate = labelId => {
    const { label, editLabel, fetchLabels } = this.props
    const form = document.getElementById(labelId)
    // Getting name and type fields from respective label
    let name = form.querySelector('input').value
    let type = form.querySelector('div.text').innerHTML

    for(let option of options) {
      if (option.text === type) type = option.key;
    }
    const data = {
      _id: label._id,
      name,
      type,
      project: label.project
    }
    editLabel(label._id, data, fetchLabels(label.project))
    this.setState({ showModal: false })
  }
  render() {
    const { label } = this.props
    return <Modal 
      trigger={<Button
        key="pencil"
        icon="pencil"
        style={{ padding: 5 }}
        onClick={() => this.setState({ showModal: true })}
      />} 
      open={this.state.showModal}
      onClose={() => this.setState({ showModal: false })}
      closeIcon>
      <Header icon='pencil' content='Edit Label' />
      <Modal.Content>
        <Form id={label._id}>
          <Form.Field
            placeholder="Label name"
            control="input"
            defaultValue={label.name}
          />
          <Form.Field>
            <Select placeholder='Select Label type' defaultValue={label.type} options={options} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button key='green' color='green' onClick={() => this.handleUpdate(label._id)}>
          <Icon name='checkmark' /> Submit
        </Button>
        <Button key='red' color='red' onClick={() => this.setState({ showModal: false })}>
          <Icon name='remove' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  }
}
 
EditModal.propTypes = {
  fetchLabels: PropTypes.func,
  editLabel: PropTypes.func
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId))
    },
    editLabel: (labelId, data, callback) => {
      return dispatch(editLabel(labelId, data, callback))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(EditModal)
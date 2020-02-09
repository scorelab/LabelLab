import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select, Button, Icon, Table, Header } from 'semantic-ui-react'
import '../css/labelItem.css'

class LabelItem extends Component {
  state = {
    disabled: true
  }
  handleDisable = labelId => {
    // Displaying edit (submission) button
    const form = document.getElementById(labelId)
    const editButton = form.querySelector('button[type="submit"]')
    editButton.style.display = 'block'
    this.setState({ disabled: false })

    // Hiding edit and delete button while editing
    form.querySelectorAll('button.form-button-itself').forEach(btn => {
      btn.style.display = 'none'
    })
  }
  handleUpdate = labelId => {
    const {  value, onUpdate } = this.props
    const form = document.getElementById(labelId)
    // Getting name and type fields from respective label
    let name = form.querySelector('input').value
    let type = form.querySelector('div.text').innerHTML

    for(let option of options) {
      if (option.text === type) type = option.key;
    }
    const data = {
      _id: value._id,
      name,
      type,
      project: value.project
    }
    onUpdate(data)
    this.setState({ disabled: true })
  }
  render() {
    const { value, onChange, onDelete } = this.props
    return (
      <div className="form-card-parent">
        <Form className="form-card flex" id={value._id}>
          <div className="form-card-child">
            <Form.Field
              disabled={this.state.disabled}
              placeholder="Label name"
              control="input"
              defaultValue={value.name}
              className="form-card-child-field"
              onChange={e =>
                {
                onChange("name",e.target.value)
                }
              }
            />
            <Form.Select
              disabled={this.state.disabled}
              label="Label type"
              options={options}
              defaultValue={value.type}
              onChange={(e, change) =>
                onChange("type", change.value )
              }
              style={{ maxWidth: 400 }}
            />
            <Button 
              type="submit" 
              onClick={() => this.handleUpdate(value._id)}
              style={this.state.disabled ? { display: 'none' }: { display: 'block' }}
            >
              Edit
            </Button>
          </div>
          <div className="form-button-parent">
            <Button
              type="button"
              className="form-button-itself"
              onClick={() => this.handleDisable(value._id)}
              style={!this.state.disabled ? { display: 'none' }: { display: 'inline' }}
            >
              <Icon name="pencil" />
            </Button>
            <Button
              type="button"
              className="form-button-itself"
              onClick={() => onDelete(value)}
              style={!this.state.disabled ? { display: 'none' }: { display: 'inline' }}
            >
              <Icon name="trash" />
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default connect(null, null)(LabelItem)

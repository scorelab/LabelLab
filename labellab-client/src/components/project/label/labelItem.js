import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Icon } from 'semantic-ui-react'
import '../css/labelItem.css'

const options = [
  { key: 'bbox', text: 'Draw a bounding box', value: 'bbox' },
  { key: 'polygon', text: 'Draw a polygon figure', value: 'polygon' }
]

class LabelItem extends Component {
  render() {
    const { value, onChange, onDelete } = this.props
    return (
      <div className="form-card-parent">
        <Form className="form-card flex">
          <div className="form-card-child">
            <Form.Field
              placeholder="Label name"
              control="input"
              defaultValue={value.name}
              className="form-card-child-field"
              onChange={e =>
                onChange(value, { ...value, name: e.target.value })
              }
            />
            <Form.Select
              label="Label type"
              options={options}
              defaultValue={value.type}
              onChange={(e, change) =>
                onChange(value, { ...value, type: change.value })
              }
              style={{ maxWidth: 400 }}
            />
          </div>
          <div className="form-button-parent">
            <Button
              type="button"
              className="form-button-itself"
              onClick={() => onDelete(value)}
            >
              <Icon name="trash" />
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default connect(
  null,
  null
)(LabelItem)

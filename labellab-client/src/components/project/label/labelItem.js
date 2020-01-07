import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select, Button, Icon, Table, Header } from 'semantic-ui-react'
import '../css/labelItem.css'

class LabelItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changed: false
    }
  }

  render() {
    const { index, label, options } = this.props
    const { onChange, onDelete, onUpdate } = this.props
    return (
      <Table.Row key={index}>
        <Table.Cell collapsing>
          <Header as="h4">{index}</Header>
        </Table.Cell>
        <Table.Cell>
          <Input
            placeholder="Label name"
            control="input"
            defaultValue={label.name}
            onChange={e => {
              onChange('name', e.target.value)
              this.setState({
                changed: true
              })
            }}
          />
        </Table.Cell>
        <Table.Cell>
          <Select
            options={options}
            defaultValue={label.type}
            onChange={(e, change) => {
              onChange('type', change.value)
              this.setState({
                changed: true
              })
            }}
            style={{ maxWidth: 400 }}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button type="button" onClick={() => onDelete(label)}>
            <Icon name="trash" />
          </Button>
          <Button
            onClick={() => onUpdate(label)}
            disabled={this.state.changed ? false : true}
          >
            Update
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default connect(null, null)(LabelItem)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
    const { index, label, options, hasLabelsAccess } = this.props
    const { onChange, onDelete, onUpdate } = this.props
    console.log(label)
    return (
      <Table.Row key={index}>
        <Table.Cell collapsing>
          <Header as="h4">{index}</Header>
        </Table.Cell>
        <Table.Cell>
          <Input
            placeholder="Label name"
            control="input"
            defaultValue={label.label_name}
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
            defaultValue={label.label_type}
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
          <Link
            to={`/project/${label.project_id}/logs/entity/label/${label.id}`}
          >
            <Button icon="history" size="tiny" />
          </Link>
          {hasLabelsAccess ? (
            <Button
              negative
              basic
              type="button"
              onClick={() => onDelete(label)}
            >
              <Icon name="trash" />
            </Button>
          ) : null}
          {hasLabelsAccess ? (
            <Button
              onClick={() => onUpdate(label)}
              disabled={this.state.changed ? false : true}
            >
              Update
            </Button>
          ) : null}
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default connect(
  null,
  null
)(LabelItem)

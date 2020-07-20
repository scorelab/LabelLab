import React, { Component } from 'react'
import { Modal, Dropdown, Button, Header, Input } from 'semantic-ui-react'

import './css/addModelEntityModal.css'

class AddModelEntityModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedEntity: {},
      selectedEntityUserSettings: {}
    }

    this.dropdownOptions = []
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.dropdownOptions.length === 0) {
      this.dropdownOptions = this.getEntityOptions(this.props.options)
    }

    if (this.props.entityEditing) {
      const { entityEditing } = this.props

      const entityIndex = this.getEntityIndexFromModel(entityEditing.name)

      if (entityIndex !== -1) {
        const dropdownOption = this.dropdownOptions.find(
          option => option.value === entityEditing.name
        )

        this.setState({
          selectedEntity: dropdownOption,
          selectedEntityUserSettings: {
            name: entityEditing.name,
            settings: entityEditing.settings
          }
        })
      }
    } else {
      this.setState({
        selectedEntity: null,
        selectedEntityUserSettings: null
      })
    }
  }

  getEntityOptions = entities => {
    return entities.map((entity, index) => {
      return {
        key: entity.name,
        text: entity.name,
        value: entity.name,
        id: index,
        settings: entity.settings ? entity.settings : null
      }
    })
  }

  selectEntity = entity => {
    const dropdownOption = this.dropdownOptions.find(
      option => option.value === entity
    )

    this.setState({
      selectedEntity: dropdownOption,
      selectedEntityUserSettings: {
        name: dropdownOption.value,
        settings: []
      }
    })
  }

  getUserSettingIndex = entity => {
    const { selectedEntityUserSettings } = this.state
    const settingIndex = selectedEntityUserSettings.settings
      .map(setting => setting.name)
      .indexOf(entity)
    return settingIndex
  }

  getEntityIndexFromModel = entityName => {
    const entityIndex = this.props.modelEntities
      .map(entity => entity.name)
      .indexOf(entityName)
    return entityIndex
  }

  handleSettingChange = (label, value) => {
    const { selectedEntityUserSettings } = this.state

    const settingIndex = this.getUserSettingIndex(label)

    if (settingIndex !== -1) {
      // If the user has edited this setting already
      selectedEntityUserSettings.settings[settingIndex] = {
        name: label,
        value: value
      }
    } else {
      // If the user has edited this setting for the first time
      selectedEntityUserSettings.settings.push({ name: label, value: value })
    }

    this.setState({ selectedEntityUserSettings })
  }

  getSettingInput = setting => {
    const { selectedEntityUserSettings } = this.state

    const settingIndex = this.getUserSettingIndex(setting.label)

    switch (setting.type) {
      case 'input':
        return (
          <Input
            className="setting"
            name={setting.label}
            label={setting.label}
            value={
              settingIndex !== -1
                ? selectedEntityUserSettings.settings[settingIndex].value
                : ''
            }
            onChange={event =>
              this.handleSettingChange(setting.label, event.target.value)
            }
          />
        )
      case 'dropdown':
        return (
          <Dropdown
            className="setting"
            placeholder={setting.label}
            selection
            defaultValue={
              settingIndex !== -1
                ? selectedEntityUserSettings.settings[settingIndex].value
                : ''
            }
            options={setting.options.map((setting, index) => {
              return {
                key: setting,
                text: setting,
                value: setting,
                id: index
              }
            })}
            onChange={(event, { value }) => {
              this.handleSettingChange(setting.label, value)
            }}
          />
        )
      default:
        return null
    }
  }

  render() {
    const {
      open,
      close,
      entityEditing,
      entityName,
      addEntity,
      editEntity,
      modelEntities
    } = this.props
    const { selectedEntity, selectedEntityUserSettings } = this.state

    return (
      <Modal open={open} size="small">
        <Header
          content={
            entityEditing
              ? 'Please make the necessary changes'
              : `Please choose the ${entityName} you would like to add`
          }
        />
        <Modal.Content>
          <div className="add-entity-modal">
            {!entityEditing && (
              <Dropdown
                placeholder={`Select ${entityName}...`}
                selection
                options={this.dropdownOptions}
                onChange={(event, { value }) => this.selectEntity(value)}
              />
            )}
            {selectedEntity && selectedEntity.settings && (
              <div className="entity-settings">
                {selectedEntity.settings.map((setting, index) => {
                  return (
                    <div className="entity-settings-option" key={setting.label}>
                      {this.getSettingInput(setting)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            positive
            onClick={() => {
              if (entityEditing && editEntity) {
                editEntity(modelEntities, selectedEntityUserSettings)
              } else {
                addEntity(modelEntities, selectedEntityUserSettings)
              }
              this.setState({
                selectedEntity: {},
                selectedEntityUserSettings: {}
              })
              close()
            }}
          >
            Add
          </Button>
          <Button
            basic
            negative
            onClick={() => {
              this.setState({
                selectEntity: {},
                selectedEntityUserSettings: {}
              })
              close()
            }}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default AddModelEntityModal

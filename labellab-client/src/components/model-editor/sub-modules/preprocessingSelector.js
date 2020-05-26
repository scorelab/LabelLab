import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Card,
  Header,
  Button,
  Modal,
  Dropdown,
  Label,
  Icon,
  Grid,
  Input
} from 'semantic-ui-react'

import {
  addPreprocessingStep,
  removePreprocessingStep,
  setTrainTestSplit
} from '../../../actions/model'
import preprocessingStepOptions from './options/preprocessingStepOptions'

import './css/preprocessingSelector.css'

class PreprocessingSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      editingStep: null
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }))
  }

  handleChange = e => {
    const { setTrainTestSplit } = this.props

    e.preventDefault()

    setTrainTestSplit([e.target.name], e.target.value)
  }

  render() {
    const { addPreprocessingStep, removePreprocessingStep, model } = this.props
    const { modalOpen } = this.state

    return (
      <Card centered fluid className="preprocessing-card">
        <Card.Content>
          <div className="preprocessing-card-header-row">
            <Header className="preprocessing-card-header">
              Preprocessing Steps
            </Header>
            <div className="preprocessing-card-add-btn">
              <Button
                content="Add"
                size="mini"
                onClick={() => {
                  this.setState({ editingStep: null }, () => {
                    this.toggleModal()
                  })
                }}
              />
            </div>
          </div>
        </Card.Content>
        <Card.Content>
          {model.preprocessingSteps.map((step, index) => {
            return (
              <PreprocessingStep
                key={index}
                name={step.name}
                settings={step.settings}
                remove={() =>
                  removePreprocessingStep(model.preprocessingSteps, step.name)
                }
                edit={() => {
                  this.setState({ editingStep: step }, () => {
                    this.toggleModal()
                  })
                }}
              />
            )
          })}
        </Card.Content>
        <Card.Content>
          <div className="preprocessing-card-bottom-row">
            <Grid columns={3} divided>
              <Grid.Row>
                <Grid.Column>
                  <Input
                    label="Train"
                    placeholder="60%"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="train"
                    value={model.train}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Validation"
                    placeholder="20%"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="validation"
                    value={model.validation}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Test"
                    placeholder="20%"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="test"
                    value={model.test}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Card.Content>
        <AddPreprocessingStepModal
          model={model}
          stepEditing={this.state.editingStep}
          open={modalOpen}
          close={this.toggleModal}
          addStep={addPreprocessingStep}
          steps={model.preprocessingSteps}
        />
      </Card>
    )
  }
}

const PreprocessingStep = props => {
  return (
    <div className="preprocessing-step-label">
      <Label>
        {props.name}{' '}
        {props.settings.map(setting => `| ${setting.name} : ${setting.value}`)}
        {props.settings.length > 0 && (
          <Icon
            name="pencil"
            className="step-edit-icon"
            onClick={props.edit}
          ></Icon>
        )}
        <Icon
          name="remove"
          className="step-delete-icon"
          onClick={props.remove}
        ></Icon>
      </Label>
    </div>
  )
}

class AddPreprocessingStepModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedStep: {},
      selectedStepUserSettings: {}
    }

    this.dropdownOptions = []
  }

  componentWillReceiveProps() {
    if (this.dropdownOptions.length == 0) {
      this.dropdownOptions = preprocessingStepOptions.map((step, index) => {
        return {
          key: step.name,
          text: step.name,
          value: step.name,
          id: index,
          settings: step.settings ? step.settings : null
        }
      })
    }

    if (this.props.stepEditing) {
      const { stepEditing } = this.props

      const stepIndex = this.getStepIndexFromModel(stepEditing.name)

      if (stepIndex !== -1) {
        const dropdownOption = this.dropdownOptions.find(
          option => option.value === stepEditing.name
        )

        const preprocessingStep = this.dropdownOptions.find(
          step => step.value === stepEditing.name
        )

        this.setState({
          selectedStep: dropdownOption,
          selectedStepUserSettings: {
            name: stepEditing.name,
            settings: stepEditing.settings
          }
        })
      }
    } else {
      this.setState({
        selectedStep: null,
        selectedStepUserSettings: null
      })
    }
  }

  getUserSettingIndex = label => {
    const { selectedStepUserSettings } = this.state
    const settingIndex = selectedStepUserSettings.settings
      .map(setting => setting.name)
      .indexOf(label)
    return settingIndex
  }

  getStepIndexFromModel = stepName => {
    const stepIndex = this.props.model.preprocessingSteps
      .map(step => step.name)
      .indexOf(stepName)
    return stepIndex
  }

  selectStep = stepValue => {
    const dropdownOption = this.dropdownOptions.find(
      option => option.value === stepValue
    )

    this.setState({
      selectedStep: dropdownOption,
      selectedStepUserSettings: {
        name: dropdownOption.value,
        settings: []
      }
    })
  }

  handleSettingChange = (label, value) => {
    const { selectedStepUserSettings } = this.state

    const settingIndex = this.getUserSettingIndex(label)

    if (settingIndex !== -1) {
      // If the user has edited this setting already
      selectedStepUserSettings.settings[settingIndex] = {
        name: label,
        value: value
      }
    } else {
      // If the user has edited this setting for the first time
      selectedStepUserSettings.settings.push({ name: label, value: value })
    }

    this.setState({ selectedStepUserSettings })
  }

  getSettingInput = setting => {
    const { selectedStepUserSettings } = this.state

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
                ? selectedStepUserSettings.settings[settingIndex].value
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
    const { open, close, steps, addStep, stepEditing } = this.props
    const { selectedStep, selectedStepUserSettings } = this.state

    return (
      <Modal open={open} size="small">
        <Header
          content={
            stepEditing
              ? 'Please make the necessary changes'
              : 'Please choose the preprocessing step you would like to add'
          }
        />
        <Modal.Content>
          <div className="preprocessing-steps-modal">
            {!stepEditing && (
              <Dropdown
                placeholder="Select step..."
                selection
                options={this.dropdownOptions}
                onChange={(event, { value }) => this.selectStep(value)}
              />
            )}
            {selectedStep && selectedStep.settings && (
              <div className="preprocessing-step-settings">
                {selectedStep.settings.map((setting, index) => {
                  return (
                    <div
                      className="preprocessing-step-option"
                      key={setting.label}
                    >
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
              addStep(steps, selectedStepUserSettings)
              this.setState({ selectedStep: {}, selectedStepUserSettings: {} })
              close()
            }}
          >
            Add
          </Button>
          <Button
            basic
            negative
            onClick={() => {
              this.setState({ selectedStep: {}, selectedStepUserSettings: {} })
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

PreprocessingSelector.propTypes = {
  addPreprocessingStep: PropTypes.func.isRequired,
  removePreprocessingStep: PropTypes.func.isRequired,
  setTrainTestSplit: PropTypes.func.isRequired,
  preprocessingSteps: PropTypes.array,
  model: PropTypes.object
}

const mapStateToProps = state => ({
  model: state.model.model
})

export default withRouter(
  connect(
    mapStateToProps,
    { addPreprocessingStep, removePreprocessingStep, setTrainTestSplit }
  )(PreprocessingSelector)
)

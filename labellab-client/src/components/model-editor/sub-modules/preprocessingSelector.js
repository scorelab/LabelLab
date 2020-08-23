import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Card,
  Header,
  Button,
  Label,
  Icon,
  Grid,
  Input
} from 'semantic-ui-react'

import AddModelEntityModal from './addModelEntityModal'
import {
  addPreprocessingStep,
  removePreprocessingStep,
  setTrainTestSplit
} from '../../../actions'
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
          {model.preprocessingSteps && model.preprocessingSteps.map((step, index) => {
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
                    placeholder="0.6"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="train"
                    defaultValue={model.train}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Validation"
                    placeholder="0.2"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="validation"
                    defaultValue={model.validation}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Test"
                    placeholder="0.2"
                    fluid
                    size="mini"
                    className="train-test-split-option"
                    name="test"
                    defaultValue={model.test}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Card.Content>
        <AddModelEntityModal
          open={modalOpen}
          close={this.toggleModal}
          options={preprocessingStepOptions}
          entityName="step"
          modelEntities={model.preprocessingSteps}
          addEntity={addPreprocessingStep}
          entityEditing={this.state.editingStep}
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

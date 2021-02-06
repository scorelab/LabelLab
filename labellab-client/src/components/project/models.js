import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import {
  Button,
  Container,
  Dropdown,
  Header,
  Table,
  Modal,
  Input
} from 'semantic-ui-react'
import PropTypes from 'prop-types'

import {
  fetchProject,
  setProjectId,
  setName,
  setType,
  setSource,
  createModel,
  fetchProjectModels,
  deleteModel
} from '../../actions'
import './css/models.css'
import ModelTester from '../model-editor/sub-modules/modelTester'

class ModelsIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modelType: 'classifier',
      modelSource: 'transfer',
      open: false,
      testing: false,
      selectedModelId: 0
    }

    this.modelTypes = [
      {
        key: 'classifier',
        text: 'Classifier',
        value: 'classifier'
      }
    ]

    this.modelSources = [
      {
        key: 'tranfer',
        text: 'Transfer',
        value: 'transfer'
      },
      {
        key: 'upload',
        text: 'Upload',
        value: 'upload'
      },
      {
        key: 'custom',
        text: 'Custom',
        value: 'custom'
      }
    ]
  }

  componentDidMount() {
    const { setProjectId, fetchProjectModels, project } = this.props

    setProjectId(project.projectId)
    fetchProjectModels(project.projectId)
  }

  fetchProjectCallback = () => {
    const { fetchProject, project } = this.props
    fetchProject(project.projectId)
  }

  openTestingModal = (modelId) => {
    this.setState({
      selectedModelId: modelId,
      testing: true
    })
  }

  toggleOpen = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }))
  }

  render() {
    const { project, model, models, setName, setType, setSource, createModel, deleteModel, fetchProjectModels, history } = this.props
    const { modelType, modelSource, open, testing, selectedModelId } = this.state

    return (
      <Container>
        <Modal size="small" open={open} onClose={this.toggleOpen}>
          <Modal.Header>
            <p>Create New Model</p>
          </Modal.Header>
          <Modal.Content>
            <Input
              name="modelName"
              onChange={e => setName(e.target.value)}
              type="text"
              placeholder="* Model Name"
              label="Name"
              fluid
            />
            <br />
            <Dropdown
              placeholder="Select model type..."
              fluid
              selection
              options={this.modelTypes}
              onChange={(event, { value }) => {
                setType(value)
                this.setState({ modelType: value })
              }}
            />
            <br />
            <Dropdown
              placeholder="Select model source..."
              fluid
              selection
              options={this.modelSources}
              onChange={(event, { value }) => {
                setSource(value)
                this.setState({ modelSource: value })
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={() => createModel(model,
              (modelId) => history.push(`/model_editor/${modelType}/${modelSource}/${project.projectId}/${modelId}`))}
            >Create
            </Button>
          </Modal.Actions>
        </Modal>

        <TestModelModal
          open={testing}
          toggleOpen={() => {
            this.setState({
              testing: false
            })
          }}
          modelId={selectedModelId}
        />

        <Button positive onClick={this.toggleOpen}>
          Create New Model
        </Button>
        <Table color="green" celled padded striped stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine collapsing>
                S. No.
              </Table.HeaderCell>
              <Table.HeaderCell>Model Name</Table.HeaderCell>
              <Table.HeaderCell>Model Type</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {models &&
              models.map((model, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Header as="h4">{index + 1}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">{model.name}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as="h4">{model.type}</Header>
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Link
                      to={`/model_editor/${model.type}/${model.source}/${project.projectId}/${model.id}`}
                    >
                      <Button icon="pencil" label="Edit" size="tiny" />
                    </Link>
                    <Button
                      icon="trash"
                      label="Delete"
                      size="tiny"
                      onClick={() => {
                        deleteModel(model.id, () => fetchProjectModels(project.projectId))
                      }}
                      basic
                      negative
                    />
                    <Button
                      icon="eye"
                      label="Test"
                      size="tiny"
                      onClick={() => this.openTestingModal(model.id)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Container>
    )
  }
}

const TestModelModal = (props) => {
  const { open, toggleOpen, modelId } = props;

  return <Modal size="small" open={open} onClose={toggleOpen}>
    <Modal.Content>
      <ModelTester modelId={modelId} />
    </Modal.Content>
  </Modal>
}

ModelsIndex.propTypes = {
  project: PropTypes.object,
  fetchProject: PropTypes.func.isRequired,
  setProjectId: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  setSource: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    model: state.model.model,
    models: state.model.models
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: data => {
      return dispatch(fetchProject(data))
    },
    setProjectId: id => {
      return dispatch(setProjectId(id))
    },
    setName: name => {
      return dispatch(setName(name))
    },
    setType: type => {
      return dispatch(setType(type))
    },
    setSource: source => {
      return dispatch(setSource(source))
    },
    createModel: (model, callback) => {
      return dispatch(createModel(model, callback))
    },
    fetchProjectModels: id => {
      return dispatch(fetchProjectModels(id))
    },
    deleteModel: (id, callback) => {
      return dispatch(deleteModel(id, callback))
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModelsIndex))

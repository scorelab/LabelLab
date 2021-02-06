import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Button } from 'semantic-ui-react'

import LabelSelector from './sub-modules/labelSelector'
import PreprocessingSelector from './sub-modules/preprocessingSelector'
import CustomBuilder from './sub-modules/customBuilder'
import TransferLearningBuilder from './sub-modules/transferLearningBuilder'
import UploadBuilder from './sub-modules/uploadBuilder'
import TrainingGraphs from './sub-modules/trainingGraphs'
import Exporter from "./sub-modules/exporter"

import './css/classifierEditor.css'
import ModelTester from './sub-modules/modelTester'

class ClassifierEditor extends Component {
  getBuilderType = () => {
    const { source, projectId } = this.props

    switch (source) {
      case 'transfer':
        return <TransferLearningBuilder projectId={projectId} />
      case "custom":
        return <CustomBuilder />
      case "upload":
        return <UploadBuilder />
      default:
        return <div>Error loading component</div>
    }
  }

  render() {
    const { model, editModel } = this.props

    return model ?
      <Grid stackable columns={3}>
        <Grid.Column width={4}>
          <Segment className="classifier-column-heading">
            <Header>Classes</Header>
          </Segment>
          <LabelSelector />
        </Grid.Column>
        <Grid.Column width={7}>
          <Segment className="classifier-column-heading">
            <Header>Train</Header>
          </Segment>
          <PreprocessingSelector />
          {this.getBuilderType()}
        </Grid.Column>
        <Grid.Column width={5}>
          <Segment className="classifier-column-heading">
            <Header>Export/Test</Header>
          </Segment>
          <TrainingGraphs />
          <ModelTester />
          <Exporter />
          <Button positive fluid onClick={() => editModel(model, model.id)}>
            Save Changes
          </Button>
        </Grid.Column>
      </Grid> : <div />
  }
}

ClassifierEditor.propTypes = {
  model: PropTypes.object,
  editModel: PropTypes.func,
  projectId: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  model: state.model.model
})

export default connect(
  mapStateToProps,
  null
)(ClassifierEditor)

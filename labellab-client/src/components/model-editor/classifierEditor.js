import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Button } from 'semantic-ui-react'

import LabelSelector from './sub-modules/labelSelector'
import PreprocessingSelector from './sub-modules/preprocessingSelector'
import TransferLearningBuilder from './sub-modules/transferLearningBuilder'
import TrainingGraphs from './sub-modules/trainingGraphs'
import CustomBuilder from './sub-modules/customBuilder'
import Exporter from "./sub-modules/exporter"

import './css/classifierEditor.css'
import ModelTester from './sub-modules/modelTester'

class ClassifierEditor extends Component {
  getBuilderType = () => {
    const { source } = this.props

    switch (source) {
      case 'transfer':
        return <TransferLearningBuilder />
      case "custom":
        return <CustomBuilder />
      default:
        return <div>Error loading component</div>
    }
  }

  render() {
    const { labels, images, model, saveModel } = this.props

    return (
      <Grid stackable columns={3}>
        <Grid.Column width={4}>
          <Segment className="classifier-column-heading">
            <Header>Classes</Header>
          </Segment>
          <LabelSelector labels={labels} images={images} />
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
          <Button positive fluid onClick={() => saveModel(model)}>
            Save Changes
          </Button>
        </Grid.Column>
      </Grid>
    )
  }
}

ClassifierEditor.propTypes = {
  labels: PropTypes.array,
  images: PropTypes.array,
  model: PropTypes.object,
  saveModel: PropTypes.func
}

const mapStateToProps = state => ({
  model: state.model.model
})

export default connect(
  mapStateToProps,
  null
)(ClassifierEditor)

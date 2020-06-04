import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, Header } from 'semantic-ui-react'

import LabelSelector from './sub-modules/labelSelector'
import PreprocessingSelector from './sub-modules/preprocessingSelector'
import TransferLearningBuilder from './sub-modules/transferLearningBuilder'

import './css/classifierEditor.css'

class ClassifierEditor extends Component {
  getBuilderType = () => {
    const { source } = this.props

    switch (source) {
      case 'transfer':
        return <TransferLearningBuilder />
      default:
        return <div>Error loading component</div>
    }
  }

  render() {
    const { labels, images } = this.props

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
        </Grid.Column>
      </Grid>
    )
  }
}

ClassifierEditor.propTypes = {
  labels: PropTypes.array,
  images: PropTypes.array
}

export default ClassifierEditor

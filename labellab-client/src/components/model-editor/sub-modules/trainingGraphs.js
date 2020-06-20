import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Header, Card } from 'semantic-ui-react'

import './css/trainingGraphs.css'

class TrainingGraphs extends Component {
  render() {
    const { model } = this.props
    return (
      <Card centered fluid className="training-graphs-card">
        <Card.Content>
          <Header>Result</Header>
        </Card.Content>
        <Card.Content>
          {model && (
            <div className="training-graphs">
              {model.lossGraphUrl && (
                <img
                  src={model.lossGraphUrl}
                  alt="Loss graph"
                  className="training-graph"
                />
              )}
              {model.accuracyGraphUrl && (
                <img
                  src={model.accuracyGraphUrl}
                  alt="Accuracy graph"
                  className="training-graph"
                />
              )}
            </div>
          )}
          {model && (
            <div className="training-results">
              {model.modelLoss && <div>Loss: {model.modelLoss}%</div>}
              {model.modelAccuracy && (
                <div>Accuracy: {model.modelAccuracy}%</div>
              )}
            </div>
          )}
        </Card.Content>
      </Card>
    )
  }
}

TrainingGraphs.propTypes = {
  model: PropTypes.object
}

const mapStateToProps = state => ({
  model: state.model.model
})

export default connect(
  mapStateToProps,
  null
)(TrainingGraphs)

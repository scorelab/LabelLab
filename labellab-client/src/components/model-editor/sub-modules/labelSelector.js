import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Divider,
  Card,
  Header,
  Button,
  Modal,
  Dropdown,
  Label,
  Icon
} from 'semantic-ui-react'

import { addLabel, removeLabel } from '../../../actions/model'

import './css/labelSelector.css'

class LabelSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }))
  }

  getModelLabelDetails = () => {
    const { labels, model } = this.props
    const detailedLabels = labels.filter(label =>
      model.labels.includes(label.id)
    )
    return detailedLabels
  }

  render() {
    const { addLabel, removeLabel, labels, model, images } = this.props
    const { modalOpen } = this.state
    const modelLabels = this.getModelLabelDetails()

    return (
      <div>
        <div>
          {modelLabels &&
            modelLabels.length > 0 &&
            modelLabels.map((label, index) => {
              return (
                <LabelCard
                  key={index}
                  label={label}
                  removeLabel={() => removeLabel(model.labels, label.id)}
                  images={images.filter(
                    image =>
                      image.labelData && image.labelData[label.id].length > 0
                  )}
                />
              )
            })}
        </div>
        <div className="add-new-label-btn">
          {' '}
          <Button fluid white={1} onClick={this.toggleModal}>
            Add New Class
          </Button>
        </div>
        <AddLabelModal
          open={modalOpen}
          close={this.toggleModal}
          addLabel={label => addLabel(model.labels, label.id)}
          labels={labels}
        />
      </div>
    )
  }
}

class AddLabelModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLabel: ''
    }

    this.dropdownOptions = []
  }

  componentWillReceiveProps() {
    const { labels } = this.props

    const validOptions = labels.filter(label => label.count > 0)

    this.dropdownOptions = validOptions.map((label, index) => {
      return {
        key: label.name,
        text: label.name,
        value: label.name,
        id: label.id
      }
    })
  }

  selectLabel = labelValue => {
    this.setState({
      selectedLabel: this.dropdownOptions.find(
        option => option.value === labelValue
      )
    })
  }

  render() {
    const { open, close, addLabel } = this.props
    const { selectedLabel } = this.state

    return (
      <Modal open={open} size="small">
        <Header content="Please choose the label you would like to add" />
        <Modal.Content>
          <Dropdown
            placeholder="Select label..."
            selection
            options={this.dropdownOptions}
            onChange={(event, { value }) => this.selectLabel(value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            positive
            onClick={() => {
              addLabel(selectedLabel)
              close()
            }}
          >
            Add
          </Button>
          <Button basic negative onClick={close}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const LabelCard = props => {
  const { label, removeLabel, images } = props

  const iconMapping = {
    bbox: 'object ungroup outline',
    polygon: 'pencil alternate'
  }

  const getLabelImageElements = () => {
    var imageTags = []

    for (var i = 0; i < Math.min(3, images.length); i++) {
      const image_url = `${process.env.REACT_APP_HOST}:${
        process.env.REACT_APP_SERVER_PORT
      }/static/uploads/${images[i].project_id}/${images[i].image_url}`

      const imageTag = <img key={i} className="label-image" src={image_url} />
      imageTags.push(imageTag)
    }

    return (
      <div className="label-images">{imageTags.map(imageTag => imageTag)}</div>
    )
  }

  return (
    <Card fluid className="label-card">
      <div className="label-header-row">
        <p className="label-name">
          {label.name}
          <Icon
            className="label-type-icon"
            size="small"
            name={iconMapping[label.type]}
          />
        </p>
        <Icon
          name="close"
          size="big"
          className="label-delete-icon"
          onClick={removeLabel}
        ></Icon>
      </div>

      <Divider />
      {getLabelImageElements()}
      <Divider />
      <div className="label-count">
        <Label>{label.count} Images</Label>
      </div>
    </Card>
  )
}

LabelSelector.propTypes = {
  addLabel: PropTypes.func.isRequired,
  removeLabel: PropTypes.func.isRequired,
  labels: PropTypes.array,
  model: PropTypes.object,
  images: PropTypes.array
}

const mapStateToProps = state => ({
  model: state.model.model
})

export default withRouter(
  connect(
    mapStateToProps,
    { addLabel, removeLabel }
  )(LabelSelector)
)

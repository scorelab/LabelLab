import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Dimmer, Modal, Button } from 'semantic-ui-react'
import DocumentMeta from 'react-document-meta'
import {
  fetchLabels,
  updateLabels,
  fetchProjectImage,
  fetchProject,
  setNextPrev
} from '../../actions/index'
import LabelingApp from './LabelingApp.js'

class LabelingLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img: null,
      disableBack: false,
      disableNext: false
    }
  }
  componentDidMount() {
    const { match, fetchLabels, fetchProject, fetchProjectImage } = this.props
    fetchLabels(match.params.projectId)
    fetchProject(match.params.projectId, this.setImageState)
    fetchProjectImage(match.params.imageId, this.setImage)
  }
  componentDidUpdate(prevProps) {
    const { match, fetchLabels, fetchProject, fetchProjectImage } = this.props
    if (prevProps.match.params.imageId !== match.params.imageId) {
      fetchLabels(match.params.projectId)
      fetchProject(match.params.projectId, this.setImageState)
      fetchProjectImage(match.params.imageId, this.setImage)
    }
  }
  setImage = () => {
    const { image } = this.props
    this.setState({
      img: image
    })
  }
  setImageState = () => {
    const { match, setNextPrev, allImages } = this.props
    const len = allImages && allImages.length
    allImages &&
      allImages.map((image, index) => {
        if (image._id === match.params.imageId) {
          if (index === 0) {
            if (len <= 1) {
              this.setState(
                { disableBack: true, disableNext: true },
                setNextPrev({}, {})
              )
            } else {
              this.setState(
                { disableBack: true, disableNext: false },
                setNextPrev(allImages[index + 1], {})
              )
            }
          } else if (index === len - 1) {
            this.setState(
              { disableBack: false, disableNext: true },
              setNextPrev({}, allImages[index - 1])
            )
          } else {
            this.setState(
              { disableBack: false, disableNext: false },
              setNextPrev(allImages[index + 1], allImages[index - 1])
            )
          }
        }
      })
  }
  pushUpdate(labelData) {
    const { match, updateLabels } = this.props
    updateLabels(match.params.imageId, labelData)
  }
  render() {
    const {
      match,
      prev,
      next,
      history,
      image,
      labelActions,
      imageActions,
      lab
    } = this.props
    const { disableBack, disableNext, img } = this.state
    const props = {
      onBack: () => {
        return !disableBack
          ? history.push(`/labeller/${match.params.projectId}/${prev._id}`)
          : null
      },
      onSkip: () => {
        return !disableNext
          ? history.push(`/labeller/${match.params.projectId}/${next._id}`)
          : null
      },
      onLabelChange: this.pushUpdate.bind(this)
    }
    const title = image && image.imageName
    return (
      <DocumentMeta title={title}>
        {labelActions.isfetching || imageActions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : lab.length > 0 ? (
          <LabelingApp
            labels={lab}
            labelData={(img && img.labelData) || {}}
            imageUrl={
              process.env.REACT_APP_HOST +
              process.env.REACT_APP_SERVER_PORT +
              `/static/uploads/${image.imageUrl}?${Date.now()}`
            }
            demo={false}
            {...props}
          />
        ) : (
          <Modal size="small" open>
            <Modal.Content>
              <p>
                It seems that you have not created any labels in the project.
                Click on the below button to create labels!
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Link to={`/project/${match.params.projectId}}/labels`}>
                <Button positive content="Create Labels" />
              </Link>
            </Modal.Actions>
          </Modal>
        )}
      </DocumentMeta>
    )
  }
}

LabelingLoader.propTypes = {
  fetchProject: PropTypes.func,
  setNextPrev: PropTypes.func,
  fetchLabels: PropTypes.func,
  fetchProjectImage: PropTypes.func,
  updateLabels: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  lab: PropTypes.array,
  labelActions: PropTypes.object,
  imageActions: PropTypes.object,
  image: PropTypes.object,
  allImages: PropTypes.array,
  next: PropTypes.object,
  prev: PropTypes.object
}

const mapStateToProps = state => {
  return {
    lab: state.labels.labels,
    labelActions: state.labels.labelActions,
    imageActions: state.images.imageActions,
    image: state.images.currentImage,
    allImages: state.projects.currentProject.images,
    next: state.images.nextImage,
    prev: state.images.prevImage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: (imageId, callback) => {
      return dispatch(fetchProject(imageId, callback))
    },
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId))
    },
    fetchProjectImage: (imageId, callback) => {
      return dispatch(fetchProjectImage(imageId, callback))
    },
    updateLabels: (imageId, labelData) => {
      return dispatch(updateLabels(imageId, labelData))
    },
    setNextPrev: (next, prev) => {
      return dispatch(setNextPrev(next, prev))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelingLoader)

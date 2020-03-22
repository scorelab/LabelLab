import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Table,
  Button,
  Form,
  Dimmer,
  Loader,
  Icon,
  Checkbox,
  Dropdown
} from 'semantic-ui-react'
import { AutoSizer, List } from 'react-virtualized'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { submitImage, deleteImage, fetchProject } from '../../actions/index'
import './css/images.css'

class ImagesIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      file: '',
      imageNames: [],
      projectId: '',
      showform: false,
      format: '',
      maxSizeError: '',
      selectedList: [],
      imageUrls: [],
      photoIndex: 0,
      isOpen: false
    }
  }
  handleImageChange = e => {
    e.preventDefault()
    let files = e.target.files
    Array.from(files).forEach(file => {
      let reader = new FileReader()
      reader.onloadend = () => {
        this.setState(prevState => ({
          images: [...prevState.images, reader.result],
          file: file,
          format: file.type,
          imageNames: [...prevState.imageNames, file.name],
          imageUrls: [...prevState.imageUrls, URL.createObjectURL(file)]
        }))
      }
      reader.readAsDataURL(file)
    })
    this.setState({
      showform: !this.state.showform,
      isOpen: true
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.isOpen) {
      return
    }
    const { project, fetchProject, submitImage } = this.props
    const { imageNames, images, format } = this.state
    if (this.state.file && this.state.file.size > 101200) {
      this.setState({
        maxSizeError: 'max sized reached'
      })
    } else {
      let data = {
        imageNames: imageNames,
        images: images,
        projectId: project.projectId,
        format: format
      }
      submitImage(data, () => {
        this.setState({
          showform: false,
          images: [],
          imageNames: []
        })
        fetchProject(project.projectId)
      })
    }
  }
  handleDelete = () => {
    const { deleteImage, project, fetchProject } = this.props
    const self = this
    deleteImage({ images: Array.from(this.state.selectedList) }, () => {
      self.setState({
        selectedList: []
      })
      fetchProject(project.projectId)
    })
  }
  handleSelected = imageId => {
    if (!this.state.selectedList.includes(imageId)) {
      this.setState(prevState => ({
        selectedList: [...prevState.selectedList, imageId]
      }))
    } else {
      this.setState(prevState => ({
        selectedList: prevState.selectedList.filter(
          checkedImage => checkedImage != imageId
        )
      }))
    }
  }
  handleNameChange = e => {
    const value = e.target.value
    this.setState({ imageNames: [value] })
  }
  removeImage = () => {
    this.setState({
      images: [],
      file: '',
      imageNames: [],
      showform: !this.state.showform,
      format: '',
      maxSizeError: '',
      imageUrls: [],
      photoIndex: 0,
      isOpen: false
    })
  }

  render() {
    const { imageActions, project } = this.props
    const { showform, imageName, imageUrls } = this.state
    const { photoIndex, isOpen } = this.state
    return (
      <div>
        {imageActions.isdeleting ? (
          <Dimmer active>
            <Loader indeterminate>Removing Image :(</Loader>
          </Dimmer>
        ) : null}
        <div>
          <input
            type="file"
            multiple
            onChange={this.handleImageChange}
            className="image-file-input"
            id="image-embedpollfileinput"
          />
          <label
            htmlFor="image-embedpollfileinput"
            className="ui medium primary left floated button custom-margin"
          >
            Add Image
          </label>
        </div>
        {showform ? (
          <Form
            className="file-submit-form"
            encType="multiple/form-data"
            onSubmit={this.handleSubmit}
          >
            {this.state.images.length == 1 && (
              <Form.Field>
                <label>Image Name</label>
                <input
                  name="imageName"
                  value={imageName}
                  onChange={this.handleNameChange}
                  placeholder="Image Name"
                />
              </Form.Field>
            )}
            {imageUrls && isOpen ? (
              <Lightbox
                mainSrc={imageUrls[photoIndex]}
                nextSrc={imageUrls[(photoIndex + 1) % imageUrls.length]}
                prevSrc={
                  imageUrls[
                    (photoIndex + imageUrls.length - 1) % imageUrls.length
                  ]
                }
                onCloseRequest={() => this.setState({ isOpen: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + imageUrls.length - 1) % imageUrls.length
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % imageUrls.length
                  })
                }
              />
            ) : null}
            <Button loading={imageActions.isposting} type="submit">
              Submit
            </Button>
            <Button onClick={this.removeImage} type="delete">
              Cancel
            </Button>
            <Button onClick={() => this.setState({ isOpen: true })}>
              View
            </Button>
            {this.state.maxSizeError ? (
              <div className="max-size-error">
                The size of the file should not be greater than 101Kb!
              </div>
            ) : null}
          </Form>
        ) : null}
        <div className="image-table-container">
          <Table celled className="image-table" color="green">
            <Table.Header className="image-table-header">
              <Table.Row className="flex">
                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell width={1}></Table.HeaderCell>
                <Table.HeaderCell width={11}>Image Link</Table.HeaderCell>
                <Table.HeaderCell width={3}>
                  Actions
                  <Button
                    negative
                    disabled={!this.state.selectedList.length}
                    onClick={this.handleDelete}
                  >
                    Delete
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className="image-table-body">
              {project.images && project.images.length > 0 ? (
                <AutoSizedList
                  rowHeight={55}
                  rowCount={project && project.images && project.images.length}
                  rowRenderer={({ index, style, key }) => (
                    <Row
                      key={key}
                      style={style}
                      image={project.images[index]}
                      projectId={project.projectId}
                      onDelete={this.handleDelete}
                      imageId={index}
                      onSelect={this.handleSelected}
                      selected={this.state.selectedList.includes(
                        project.images[index]._id
                      )}
                      isLast={index === project.images.length - 1}
                    />
                  )}
                  overscanRowCount={10}
                />
              ) : null}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

ImagesIndex.propTypes = {
  project: PropTypes.object,
  imageActions: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func,
  submitImage: PropTypes.func,
  deleteImage: PropTypes.func
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    imageActions: state.images.imageActions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: data => {
      return dispatch(fetchProject(data))
    },
    submitImage: (data, callback) => {
      return dispatch(submitImage(data, callback))
    },
    deleteImage: (imageId, projectId, callback) => {
      return dispatch(deleteImage(imageId, projectId, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesIndex)

const Row = ({
  image,
  projectId,
  style,
  onDelete,
  imageId,
  onSelect,
  selected,
  isLast
}) => (
  <Table.Row
    style={{
      ...style,
      display: 'flex',
      borderBottom: isLast ? '1px solid rgba(34,36,38,.1)' : ''
    }}
  >
    <Table.Cell width={1}>
      {imageId + 1}
      {image.labelled ? <Icon name="checkmark green"></Icon> : null}
    </Table.Cell>
    <Table.Cell width={1}>
      <Checkbox
        onClick={() => {
          onSelect(image._id)
        }}
        checked={selected}
      />
    </Table.Cell>
    <Table.Cell width={11}>
      <a
        href={
          process.env.REACT_APP_HOST +
          ':' +
          process.env.REACT_APP_SERVER_PORT +
          `/static/uploads/${image.imageUrl}?${Date.now()}`
        }
      >
        {image.imageName}
      </a>
      {image.labelled ? (
        <span className="labelDropdown">
          <Dropdown text="Labels">
            <Dropdown.Menu>
              {Object.keys(image.labelData).map((key, index) =>
                image.labelData[key].length !== 0 ? (
                  <Dropdown.Item
                    text={key + '  ' + image.labelData[key].length}
                    key={index}
                  />
                ) : null
              )}
            </Dropdown.Menu>
          </Dropdown>
        </span>
      ) : null}
    </Table.Cell>
    <Table.Cell width={3}>
      <div>
        <Link to={`/labeller/${projectId}/${image._id}`}>
          <Button icon="pencil" label="Edit" size="tiny" />
        </Link>
        <Button
          icon="trash"
          label="Delete"
          size="tiny"
          onClick={async () => {
            await onSelect(image._id)
            onDelete()
          }}
        />
      </div>
    </Table.Cell>
  </Table.Row>
)

const AutoSizedList = props => (
  <AutoSizer>
    {({ height, width }) => <List height={height} width={width} {...props} />}
  </AutoSizer>
)

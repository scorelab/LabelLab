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
      image_names: [],
      projectId: '',
      showform: false,
      format: '',
      maxSizeError: '',
      selectedList: [],
      image_urls: [],
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
          image_names: [...prevState.image_names, file.name],
          image_urls: [...prevState.image_urls, URL.createObjectURL(file)]
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
    const { image_names, images, format } = this.state
    if (this.state.file && this.state.file.size > 101200) {
      this.setState({
        maxSizeError: 'max sized reached'
      })
    } else {
      let data = {
        image_names: image_names,
        images: images,
        projectId: project.projectId,
        format: format
      }
      submitImage(data, () => {
        this.setState({
          showform: false,
          images: [],
          image_names: []
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
    this.setState({ image_names: [value] })
  }
  removeImage = () => {
    this.setState({
      images: [],
      file: '',
      image_names: [],
      showform: !this.state.showform,
      format: '',
      maxSizeError: '',
      image_urls: [],
      photoIndex: 0,
      isOpen: false
    })
  }

  render() {
    const { imageActions, project } = this.props
    const { showform, image_name, image_urls } = this.state
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
            className="ui medium primary left floated button custom-margin positive"
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
                  name="image_name"
                  value={image_name}
                  onChange={this.handleNameChange}
                  placeholder="Image Name"
                />
              </Form.Field>
            )}
            {image_urls && isOpen ? (
              <Lightbox
                mainSrc={image_urls[photoIndex]}
                nextSrc={image_urls[(photoIndex + 1) % image_urls.length]}
                prevSrc={
                  image_urls[
                    (photoIndex + image_urls.length - 1) % image_urls.length
                  ]
                }
                onCloseRequest={() => this.setState({ isOpen: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + image_urls.length - 1) % image_urls.length
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % image_urls.length
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
                    basic
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
                        project.images[index].id
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
          onSelect(image.id)
        }}
        checked={selected}
      />
    </Table.Cell>
    <Table.Cell width={11}>
      <a
        rel={'external'}
        href={
          process.env.REACT_APP_SERVER_ENVIRONMENT !== 'dev'
            ? image.image_url
            : 'http://' +
              process.env.REACT_APP_HOST +
              ':' +
              process.env.REACT_APP_SERVER_PORT +
              `/static/uploads/${image.project_id}/${image.image_url}`
        }
      >
        {image.image_name}
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
        <Link to={`/labeller/${projectId}/${image.id}`}>
          <Button icon="pencil" label="Edit" size="tiny" />
        </Link>
        <Button
          negative
          basic
          icon="trash"
          label="Delete"
          size="tiny"
          onClick={async () => {
            await onSelect(image.id)
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

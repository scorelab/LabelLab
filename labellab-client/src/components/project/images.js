import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Button, Form, Dimmer, Loader, Icon } from 'semantic-ui-react'
import { AutoSizer, List } from 'react-virtualized'
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
      directoryName: '',
      directoryImageNames: [],
      directoryImageFormats: [],
      directoryImages: []
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
          imageNames: [...prevState.imageNames, file.name]
        }))
      }
      reader.readAsDataURL(file)
    })
    this.setState({
      showform: !this.state.showform
    })
  }
  handleAddDirectory = e => {
    e.preventDefault()
    const directoryInput = document.getElementById("directory-embedpollfileinput")

    Array.from(directoryInput.files).forEach(file => {
      const reader = new FileReader()
      // Validating file type to be image
      const directoryName = file.webkitRelativePath.split('/')[0]
      if (file.type.startsWith('image')) {
        reader.onloadend = () => {
          this.setState({
            directoryName,
            directoryImages: [...this.state.directoryImages, reader.result],
            directoryImageNames: [...this.state.directoryImageNames, file.name],
            directoryImageFormats: [...this.state.directoryImageFormats, file.type]
          })
        }
        reader.readAsDataURL(file)
      }
    });
    this.setState({
      showform: !this.state.showform
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { project, fetchProject, submitImage } = this.props
    const { imageName, image, format } = this.state
    const { directoryName, directoryImageNames, directoryImages, directoryImageFormats } = this.state
    let data = {}
    if (this.state.imageName) {
      data = {
        imageName,
        image,
        projectId: project.projectId,
        format
      }
    } else if (this.state.directoryName) {
      data = {
        directoryName,
        directoryImages,
        directoryImageNames,
        directoryImageFormats,
        projectId: project.projectId
      }
    }
    submitImage(data, () => {
      this.setState({
        showform: false,
        image: '',
        file: '',
        format: '',
        imageName: '',
        directoryImageNames: [],
        directoryImages: [],
        directoryImageFormats: [],
        directoryName: ''
      })
      fetchProject(project.projectId)
    })
  }
  handleDelete = imageId => {
    const { deleteImage, project, fetchProject } = this.props
    deleteImage(imageId, project.projectId, fetchProject(project.projectId))
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
      format: ''
    })
  }

  render() {
    const { imageActions, project } = this.props
    const { showform, imageName } = this.state
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
        <div>
          <input
            type="file" 
            webkitdirectory="true"
            mozdirectory="true"
            onChange={this.handleAddDirectory}
            className="image-file-input"
            id="directory-embedpollfileinput"
          />
          <label
            htmlFor="directory-embedpollfileinput"
            className="ui medium primary left floated button custom-margin"
          >
            Add Directory
          </label>
        </div>
        {showform ? (
          <Form
            className="file-submit-form"
            encType="multiple/form-data"
            onSubmit={this.handleSubmit}
          >
            <Form.Field>
              <label>{this.state.imageName ? 'Image': 'Directory'} Name</label>
              <input
                name={this.state.imageName ? 'imageName': 'directoryName'}
                value={this.state.imageName ? this.state.imageName: this.state.directoryName}
                onChange={this.handleChange}
                placeholder="Image Name"
              />
            </Form.Field>
            <Button loading={imageActions.isposting} type="submit">
              Submit
            </Button>
            <Button onClick={this.removeImage} type="delete">
              Cancel
            </Button>
          </Form>
        ) : null}
        <Table
          celled
          style={{ display: 'flex', flexDirection: 'column', height: 600 }}
        >
          <Table.Header className="image-table-header">
            <Table.Row className="flex image-table-row-back">
              <Table.HeaderCell style={columnStyles[0]}>ID</Table.HeaderCell>
              <Table.HeaderCell style={columnStyles[1]}>Directory</Table.HeaderCell>
              <Table.HeaderCell style={columnStyles[1]}>
                Image Link
              </Table.HeaderCell>
              <Table.HeaderCell style={columnStyles[2]}>
                Actions
              </Table.HeaderCell>
              <Table.HeaderCell className="image-table-special-headercell" />
            </Table.Row>
          </Table.Header>
          <Table.Body className="image-table-body">
            {project.images && project.images.length > 0 ? (
              <AutoSizedList
                rowHeight={55}
                rowCount={project && project.images && project.images.length}
                style={{ overflowY: 'scroll' }}
                rowRenderer={({ index, style, key }) => (
                  <Row
                    key={key}
                    style={style}
                    image={project.images[index]}
                    projectId={project.projectId}
                    onDelete={this.handleDelete}
                    imageId={index}
                  />
                )}
                overscanRowCount={10}
              />
            ) : null}
          </Table.Body>
        </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ImagesIndex)

const columnStyles = [
  { flex: '0 0 80px', lineHeight: '32px' },
  { flex: '1', lineHeight: '32px' },
  { flex: '0 0 250px', lineHeight: '32px' }
]

const Row = ({ image, projectId, style, onDelete, imageId }) => (
  <Table.Row style={{ ...style, display: 'flex' }}>
    <Table.Cell style={columnStyles[0]}>{imageId + 1}</Table.Cell>
    <Table.Cell style={columnStyles[1]}><i class="folder icon"></i>{ image.directory ? image.directory: null }</Table.Cell>
    <Table.Cell style={columnStyles[1]}>
      <a
        href={
          'http://' +
          process.env.REACT_APP_HOST +
          ':' +
          process.env.REACT_APP_SERVER_PORT +
          (image.directory.length > 0 ? `/static/uploads/${image.directory}/${image.imageUrl}?${Date.now()}` :`/static/uploads/${image.imageUrl}?${Date.now()}`)
        }
      >
        {image.imageName}
      </a>
    </Table.Cell>
    <Table.Cell style={columnStyles[2]}>
      <div>
        <Link to={`/labeller/${projectId}/${image._id}`}>
          <Button icon="pencil" label="Edit" size="tiny" />
        </Link>
        <Button
          icon="trash"
          label="Delete"
          size="tiny"
          onClick={() => onDelete(image._id)}
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
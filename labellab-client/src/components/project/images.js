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
      maxSizeError:''
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
  handleSubmit = e => {
    e.preventDefault()
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
        format: '',
        maxSizeError:''
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

              <Button loading={imageActions.isposting} type="submit">
                Submit
            </Button>
              <Button onClick={this.removeImage} type="delete">
                Cancel
            </Button>
            {this.state.maxSizeError? <div className="max-size-error">The size of the file should not be greater than 101Kb!</div>:null}
            </Form>
          ) : null}
          <Table
            celled
            style={{ display: 'flex', flexDirection: 'column', height: 600 }}
          >
            <Table.Header className="image-table-header">
              <Table.Row className="flex image-table-row-back">
                <Table.HeaderCell style={columnStyles[0]}>ID</Table.HeaderCell>
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
    <Table.Cell style={columnStyles[0]}>
      {imageId + 1}
      {image.labelled ? <Icon name="checkmark green"></Icon> : null}
    </Table.Cell>
    <Table.Cell style={columnStyles[1]}>
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

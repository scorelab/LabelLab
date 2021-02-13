import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Table,
  Button,
  Form,
  Dimmer,
  Loader,
  Icon,
  Checkbox,
  Dropdown,
  Modal,
  Image
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
      isOpen: false,
      number_of_images: 0,
      selectAll: false,
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9
      }
    }
  }
  handleImageChange = e => {
    e.preventDefault()
    let files = e.target.files
    let formData = new FormData()
    Array.from(files).forEach(file => {
      let reader = new FileReader()
      formData.append('images', file)
      formData.append('image_names', file.name)
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
    formData.append('format', this.state.format)
    formData.append('project_id', this.props.project.projectId)
    this.setState({
      showform: !this.state.showform,
      formData: formData,
      isOpen: true,
      number_of_images: files.length
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.isOpen) {
      return
    }
    const { project, fetchProject, submitImage } = this.props
    const { formData } = this.state
    if (this.state.file && this.state.file.size > 101200) {
      this.setState({
        maxSizeError: 'max sized reached'
      })
    } else {
      submitImage(formData, project.projectId, () => {
        this.setState({
          showform: false,
          images: [],
          formData: null,
          image_names: []
        })
        fetchProject(project.projectId)
      })
    }
  }
  handleDelete = () => {
    const { deleteImage, project, fetchProject } = this.props
    const self = this
    deleteImage(
      project.projectId,
      { images: Array.from(this.state.selectedList) },
      () => {
        self.setState({
          selectedList: []
        })
        fetchProject(project.projectId)
      }
    )
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
  handleSelectAll = () => {
    const {project} = this.props
    if(this.state.selectAll){
      this.setState(() => ({
        selectedList: [],
        selectAll:false
      }))
    }
    else {
      this.setState( () => ({
        selectedList: [...project?.images?.map((image)=>{
          return image.id;
        })],
        selectAll:true
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
  onImageLoaded = image => {
    this.imageRef = image
  }

  onCropComplete = crop => {
    this.makeClientCrop(crop)
  }

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop })
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(
        this.imageRef,
        crop,
        this.state.image_names[0]
      )
      const croppedImageURL = await this.getCroppedImgURL(
        this.imageRef,
        crop,
        this.state.image_names[0]
      )
      const new_cropped_image = []
      new_cropped_image.push(croppedImage)
      this.setState({
        images: new_cropped_image,
        croppedImageUrl: croppedImageURL,
        format: 'image/jpeg'
      })
    }
  }

  getCroppedImgURL(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    const base64Image = canvas.toDataURL('image/jpeg')

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty')
          return
        }
        blob.name = fileName
        window.URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = window.URL.createObjectURL(blob)
        resolve(this.fileUrl)
      }, 'image/jpeg')
    })
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return canvas.toDataURL('image/jpeg')
  }
  render() {
    const { imageActions, project } = this.props
    const {
      showform,
      image_name,
      image_urls,
      number_of_images,
      images,
      selectAll
    } = this.state
    const { photoIndex, isOpen } = this.state
    const { crop, croppedImageUrl } = this.state
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
          <Form className="file-submit-form" encType="multiple/form-data">
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
            <Button
              onClick={this.handleSubmit}
              loading={imageActions.isposting}
              type="submit"
            >
              Submit
            </Button>
            <Button onClick={this.removeImage} type="delete">
              Cancel
            </Button>
            <Button onClick={() => this.setState({ isOpen: true })}>
              View
            </Button>
            {number_of_images === 1 ? (
              <Modal trigger={<Button>Crop</Button>}>
                <Modal.Header>Crop Image</Modal.Header>
                <Modal.Content>
                  {images[0] && (
                    <ReactCrop
                      src={image_urls[0]}
                      crop={crop}
                      ruleOfThirds
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                  )}
                  {croppedImageUrl && (
                    <img
                      alt="Crop"
                      style={{ maxWidth: '100%' }}
                      src={croppedImageUrl}
                    />
                  )}
                </Modal.Content>
              </Modal>
            ) : null}
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
                <Table.HeaderCell width={1}>
                  <Checkbox
                    onClick={() => {
                      this.handleSelectAll()
                    }}
                    checked={selectAll}
                  />
                </Table.HeaderCell>
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

export default connect(mapStateToProps, mapDispatchToProps)(ImagesIndex)

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
              {Object.keys(image.labeldata).map((key, index) =>
                image.labeldata[key].length !== 0 ? (
                  <Dropdown.Item
                    text={key + '  ' + image.labeldata[key].length}
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

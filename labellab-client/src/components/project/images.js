import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button, Form, Dimmer, Loader } from "semantic-ui-react";
import { AutoSizer, List } from "react-virtualized";
import { submitImage, deleteImage, fetchProject } from "../../actions/index";
import "./css/images.css";

class ImagesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      file: "",
      imageName: "",
      projectId: "",
      showform: false,
      format: ""
    };
  }
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file,
        format: file.type,
        imageName: file.name,
        showform: true
      });
    };
    reader.readAsDataURL(file);
  };
  handleSubmit = e => {
    e.preventDefault();
    const { project, fetchProject, submitImage } = this.props;
    const { imageName, image, format } = this.state;
    let data = {
      imageName: imageName,
      image: image,
      projectId: project.projectId,
      format: format
    };
    submitImage(data, () => {
      this.setState({
        showform: false
      });
      fetchProject(project.projectId);
    });
  };
  handleDelete = imageId => {
    const { deleteImage, project, fetchProject } = this.props;
    deleteImage(imageId, project.projectId, fetchProject(project.projectId));
  };
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  render() {
    const { imageActions, project } = this.props;
    const { showform, imageName } = this.state;
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
            <Form.Field>
              <label>Image Name</label>
              <input
                name="imageName"
                value={imageName}
                onChange={this.handleChange}
                placeholder="Image Name"
              />
            </Form.Field>
            <Button loading={imageActions.isposting} type="submit">
              Submit
            </Button>
          </Form>
        ) : null}
        <Table
          celled
          style={{ display: "flex", flexDirection: "column", height: 600 }}
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
                style={{ overflowY: "scroll" }}
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
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    imageActions: state.images.imageActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProject: data => {
      return dispatch(fetchProject(data));
    },
    submitImage: (data, callback) => {
      return dispatch(submitImage(data, callback));
    },
    deleteImage: (imageId, projectId, callback) => {
      return dispatch(deleteImage(imageId, projectId, callback));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesIndex);

const columnStyles = [
  { flex: "0 0 80px", lineHeight: "32px" },
  { flex: "1", lineHeight: "32px" },
  { flex: "0 0 250px", lineHeight: "32px" }
];

const Row = ({ image, projectId, style, onDelete, imageId }) => (
  <Table.Row style={{ ...style, display: "flex" }}>
    {console.log(image)}
    <Table.Cell style={columnStyles[0]}>{imageId + 1}</Table.Cell>
    <Table.Cell style={columnStyles[1]}>
      <Link
        to={
          process.env.REACT_APP_HOST +
          process.env.REACT_APP_SERVER_PORT +
          `/static/uploads/${image.imageUrl}?${Date.now()}`
        }
      >
        {image.imageName}
      </Link>
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
);

const AutoSizedList = props => (
  <AutoSizer>
    {({ height, width }) => <List height={height} width={width} {...props} />}
  </AutoSizer>
);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Form, Dimmer, Loader } from "semantic-ui-react";
import { AutoSizer, List } from "react-virtualized";
import { submitImage, deleteImage } from "../../actions/image";
import { fetchProject } from "../../actions/project/fetchDetails";
import "./css/images.css";

class ImagesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      file: "",
      image_name: "",
      project_id: "",
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
        image_name: file.name,
        showform: true
      });
    };
    reader.readAsDataURL(file);
  };
  handleSubmit = e => {
    e.preventDefault();

    const { image_name, image, format } = this.state;
    let data = {
      image_name: image_name,
      image: image,
      project_id: this.props.project.project_id,
      format: format
    };
    this.props.submitImage(data, () => {
      this.setState({
        showform: false
      });
      this.props.fetchProject(this.props.project.project_id);
    });
  };
  handleDelete = image_id => {
    this.props.deleteImage(
      image_id,
      this.props.fetchProject(this.props.project.project_id)
    );
  };
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  render() {
    const { imageActions, project } = this.props;
    const { showform, image_name } = this.state;
    return (
      <div>
        {this.props.imageActions.isdeleting ? (
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
            for="image-embedpollfileinput"
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
                name="image_name"
                value={image_name}
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
          <Table.Header style={{ flex: "0 0 auto" }}>
            <Table.Row style={{ display: "flex", background: "#f9fafb" }}>
              <Table.HeaderCell style={columnStyles[0]}>ID</Table.HeaderCell>
              <Table.HeaderCell style={columnStyles[1]}>
                Image Link
              </Table.HeaderCell>
              <Table.HeaderCell style={columnStyles[2]}>
                Actions
              </Table.HeaderCell>
              {/* extra header cell to even out the width with a fake scrollbar */}
              <Table.HeaderCell
                style={{
                  flex: "0 0 auto",
                  opacity: 0,
                  overflowY: "scroll",
                  padding: 0,
                  border: 0
                }}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body style={{ height: "100%", flex: 1, outline: 0 }}>
            <AutoSizedList
              rowHeight={55}
              rowCount={project.images && project.images.length}
              style={{ overflowY: "scroll" }}
              rowRenderer={({ index, style, key }) => (
                <Row
                  key={key}
                  style={style}
                  image={project.images[index]}
                  projectId={project.project_id}
                  onDelete={this.handleDelete}
                  imageId={index}
                />
              )}
              overscanRowCount={10}
            />
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
    deleteImage: (image_id, callback) => {
      return dispatch(deleteImage(image_id, callback));
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
    <Table.Cell style={columnStyles[0]}>{imageId + 1}</Table.Cell>
    <Table.Cell style={columnStyles[1]}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={
          process.env.REACT_APP_HOST +
          process.env.REACT_APP_SERVER_PORT +
          `/static/uploads/${image.image_url}?${Date.now()}`
        }
      >
        {image.image_name}
      </a>
    </Table.Cell>
    <Table.Cell style={columnStyles[2]}>
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/labeller/${projectId}/${image._id}`}
        >
          <Button icon="pencil" label="Edit" size="tiny" />
        </a>
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

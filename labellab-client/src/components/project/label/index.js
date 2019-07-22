import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimmer, Loader, Button, Form, Icon } from "semantic-ui-react";
import { fetchLabels, createLabel, deleteLabel } from "../../../actions/index";
import LabelItem from "./labelItem.js";

const options = [
  { key: "bbox", text: "Draw a bounding box", value: "bbox" },
  { key: "polygon", text: "Draw a polygon figure", value: "polygon" }
];

class LabelIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showform: false,
      name: "New Label",
      type: "bbox"
    };
  }
  componentDidMount() {
    this.props.fetchLabels(this.props.location.pathname.substring(9, 33));
  }
  toggleForm = () => {
    this.setState({
      showform: true
    });
  };
  onChange = (name, data) => {
    this.setState({
      [name]: data
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    let data = {
      name: this.state.name,
      type: this.state.type,
      project_id: this.props.project.project_id
    };
    this.props.createLabel(data, this.callback);
  };
  callback = () => {
    this.setState({
      showform: false,
      name: "New Label",
      type: "bbox"
    });
    this.props.fetchLabels(this.props.project.project_id);
  };
  handleDelete = value => {
    this.props.deleteLabel(
      value._id,
      this.props.fetchLabels(this.props.project.project_id)
    );
  };
  render() {
    const value = {
      name: "New Label",
      type: "bbox"
    };
    return (
      <div>
        {this.props.actions.isfetching ? (
          <Dimmer active={this.props.actions.isfetching}>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}

        {this.props.actions.isdeleting ? (
          <Dimmer active>
            <Loader indeterminate>Removing Label :)</Loader>
          </Dimmer>
        ) : null}
        {this.props.labels !== undefined &&
          this.props.labels.map((label, index) => (
            <LabelItem
              value={label}
              key={index}
              onChange={this.onChange}
              onDelete={this.handleDelete}
            />
          ))}
        <Button onClick={this.toggleForm}>Create new Label</Button>
        {this.state.showform ? (
          <Form
            className="form-card"
            style={{ display: "flex" }}
            onSubmit={this.handleSubmit}
          >
            <div style={{ flex: 1, padding: "0 0.5em" }}>
              <Form.Field
                placeholder="Label name"
                control="input"
                defaultValue={value.name}
                style={{ padding: 3, fontSize: 24 }}
                onChange={e => this.onChange(e.target.name, e.target.value)}
                name="name"
              />
              <Form.Select
                label="Label type"
                options={options}
                defaultValue={value.type}
                onChange={(e, change) =>
                  this.onChange(change.name, change.value)
                }
                style={{ maxWidth: 400 }}
                name="type"
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <Button
                type="button"
                style={{ background: "transparent", padding: 0 }}
                onClick={this.onChange}
              >
                <Icon name="trash" />
              </Button>
            </div>
            <Button type="submit">Create</Button>
          </Form>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.labels.labelActions,
    labels: state.labels.labels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLabels: project_id => {
      return dispatch(fetchLabels(project_id));
    },
    createLabel: (data, callback) => {
      return dispatch(createLabel(data, callback));
    },
    deleteLabel: (label_id, callback) => {
      return dispatch(deleteLabel(label_id, callback));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelIndex);

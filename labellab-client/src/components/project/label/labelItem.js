import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Icon } from "semantic-ui-react";
// import {} from "../../actions";

const options = [
  { key: "bbox", text: "Draw a bounding box", value: "bbox" },
  { key: "polygon", text: "Draw a polygon figure", value: "polygon" }
];

class LabelItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { value, onChange } = this.props;
    return (
      <div
        style={{
          marginTop: "0.7em",
          padding: "1em",
          border: "solid 1px #efefef",
          background: "white",
          shadow: "rgb(204, 204, 204) 0px 1px 2px"
        }}
      >
        <Form className="form-card" style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "0 0.5em" }}>
            <Form.Field
              placeholder="Label name"
              control="input"
              defaultValue={value.name}
              style={{ padding: 3, fontSize: 24 }}
              onChange={e =>
                onChange(value, { ...value, name: e.target.value })
              }
            />
            <Form.Select
              label="Label type"
              options={options}
              defaultValue={value.type}
              onChange={(e, change) =>
                onChange(value, { ...value, type: change.value })
              }
              style={{ maxWidth: 400 }}
            />
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <Button
              type="button"
              style={{ background: "transparent", padding: 0 }}
              onClick={() => onChange(value, null)}
            >
              <Icon name="trash" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelItem);

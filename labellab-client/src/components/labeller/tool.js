import React, { Component } from "react";
import { connect } from "react-redux";
import { postLabel, fetchProject } from "../../actions/index";
import { Button } from "semantic-ui-react";
import "./css/tool.css";

class ToolIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      file: "",
      label: [],
      max_size_error: "",
      image_name: ""
    };
  }
  componentDidMount() {
    if (this.props.image !== "") {
      console.log(this.props);
      this.setState(
        {
          image: this.props.image,
          file: this.props.file,
          image_name: this.props.image_name,
          project_id: this.props.project_id
        },
        function() {
          this.handleDraw();
        }
      );
    }
    // if(!localStorage.getItem('user')){
    //     this.props.fetchProjectData()
    // }
    // else{
    //     this.props.history.push('/login')
    // }
  }
  handleDraw = () => {
    initDraw(
      document.getElementById("canvas"),
      this.handleLabel,
      this.handleRemoveLabel
    );
    var numRect = 0;
    var okTrigger = false;
    var buttonTrigger = 0;
    let tmp_height = "";
    let tmp_width = "";
    let coordinates = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };
    function initDraw(canvas, addcallback, removecallback) {
      function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) {
          //Moz
          mouse.x = ev.pageX + window.pageXOffset;
          mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) {
          //IE
          mouse.x = ev.clientX + document.body.scrollLeft;
          mouse.y = ev.clientY + document.body.scrollTop;
        }
      }

      var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      };
      var element = null;
      var field = null;

      canvas.onmousemove = function(e) {
        setMousePosition(e);
        if (element !== null) {
          element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
          element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
          element.style.left =
            mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
          element.style.top =
            mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
        }
      };

      function okClick() {
        okTrigger = true;
        let num = this.id.replace(/^\D+/g, "");
        let labelValue = document.getElementById("label" + num).value;
        buttonTrigger++;
        addcallback(coordinates, labelValue, num);
        // document.getElementById('label-container'+numRect).style.display = 'none'
      }
      function canClick() {
        let num = this.id.replace(/^\D+/g, "");
        document.getElementById("label-container" + num).remove();
        document.getElementById("rect" + num).remove();
        numRect = numRect - 1;
        buttonTrigger++;
        removecallback(num);
      }
      // function removeLabelContainer() {
      //   // document.getElementById('label-container'+numRect).style.display = 'none'
      // }

      canvas.onclick = function(e) {
        if (
          (numRect > 0 &&
            ((document.getElementById("label" + numRect) &&
              document.getElementById("label" + numRect).value === "") ||
              !okTrigger)) ||
          buttonTrigger === 1
        ) {
          if (buttonTrigger === 1) {
            console.log("empty");
            buttonTrigger = buttonTrigger - 1;
          }
        } else {
          if (element !== null) {
            okTrigger = false;
            numRect = numRect + 1;
            tmp_height = element.style.height;
            tmp_width = element.style.width;
            element = null;
            canvas.style.cursor = "default";
            let contain = document.createElement("div");
            contain.className = "label-container";
            contain.id = "label-container" + numRect;
            coordinates.startX = mouse.startX;
            coordinates.startY = mouse.startY;
            if (mouse.x > mouse.startX) {
              contain.style.left =
                (
                  mouse.startX +
                  parseInt(tmp_width.substring(0, tmp_width.indexOf("p"))) +
                  5
                ).toString() + "px";
              coordinates.endX =
                mouse.startX +
                parseInt(tmp_width.substring(0, tmp_width.indexOf("p")));
              if (mouse.y > mouse.startY) {
                contain.style.top =
                  (
                    mouse.startY +
                    parseInt(tmp_height.substring(0, tmp_height.indexOf("p")))
                  ).toString() + "px";
                coordinates.endY =
                  mouse.startY +
                  parseInt(tmp_height.substring(0, tmp_height.indexOf("p")));
              } else {
                contain.style.top =
                  (
                    mouse.y +
                    parseInt(tmp_height.substring(0, tmp_height.indexOf("p")))
                  ).toString() + "px";
                coordinates.endY =
                  mouse.startY -
                  parseInt(tmp_height.substring(0, tmp_height.indexOf("p")));
              }
            } else {
              contain.style.left =
                (
                  mouse.x +
                  parseInt(tmp_width.substring(0, tmp_width.indexOf("p"))) +
                  5
                ).toString() + "px";
              coordinates.endX =
                mouse.startX -
                parseInt(tmp_width.substring(0, tmp_width.indexOf("p")));
              if (mouse.y > mouse.startY) {
                contain.style.top =
                  (
                    mouse.startY +
                    parseInt(tmp_height.substring(0, tmp_height.indexOf("p")))
                  ).toString() + "px";
                coordinates.endY =
                  mouse.startY +
                  parseInt(tmp_height.substring(0, tmp_height.indexOf("p")));
              } else {
                contain.style.top =
                  (
                    mouse.y +
                    parseInt(tmp_height.substring(0, tmp_height.indexOf("p")))
                  ).toString() + "px";
                coordinates.endY =
                  mouse.startY -
                  parseInt(tmp_height.substring(0, tmp_height.indexOf("p")));
              }
            }
            if (coordinates.startX > coordinates.endX) {
              let temp = coordinates.startX;
              coordinates.startX = coordinates.endX;
              coordinates.endX = temp;
            }
            if (coordinates.startY > coordinates.endY) {
              let temp = coordinates.startY;
              coordinates.startY = coordinates.endY;
              coordinates.endY = temp;
            }
            canvas.appendChild(contain);
            let fieldParent = document.createElement("div");
            fieldParent.className = "ui input";
            contain.appendChild(fieldParent);
            field = document.createElement("input");
            field.autocomplete = "off";
            field.id = "label" + numRect;
            fieldParent.appendChild(field);
            let buttonParent = document.createElement("div");
            buttonParent.className = "button-parent";
            contain.appendChild(buttonParent);
            let okButton = document.createElement("button");
            okButton.className = "ui green button";
            okButton.id = "okButton" + numRect;
            okButton.innerHTML = "OK";
            okButton.onclick = okClick;
            buttonParent.appendChild(okButton);
            let canButton = document.createElement("button");
            canButton.className = "ui red button";
            canButton.id = "canButton" + numRect;
            canButton.innerHTML = "DESELECT";
            canButton.onclick = canClick;
            buttonParent.appendChild(canButton);
          } else {
            console.log("begun.");
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement("div");
            element.className = "rectangle";
            element.id = "rect" + (numRect + 1);
            element.style.left = mouse.x + "px";
            element.style.top = mouse.y + "px";
            canvas.appendChild(element);
            canvas.style.cursor = "crosshair";
          }
        }
      };
    }
  };
  handleLabel = (coordinates, label, num) => {
    this.setState(state => {
      const lab = state.label.concat({
        labelno: num,
        startX: coordinates.startX,
        endX: coordinates.endX,
        startY: coordinates.startY,
        endY: coordinates.endY,
        label_name: label
      });
      return {
        label: lab
      };
    });
  };
  handleRemoveLabel = num => {
    this.setState(state => {
      let labArray = state.label;
      state.label.map((l, index) => {
        if (num === l.labelno) {
          labArray = labArray
            .slice(0, index)
            .concat(labArray.slice(index + 1, labArray.length));
        }
      });
      return {
        label: labArray
      };
    });
  };

  handleLabelSubmit = () => {
    let { file, label } = this.state;
    if (file && file.size > 101200) {
      this.setState({
        max_size_error: "max sized reached"
      });
    } else {
      let data = {
        image_id: this.props.currentimage._id,
        label: label
      };
      this.props.postLabel(data, () =>
        this.props.fetchProject(this.props.project_id)
      );
    }
  };

  render() {
    const { actions } = this.props;
    return (
      <div className="tool-parent">
        {this.props.actions.error}
        {this.state.max_size_error}
        {this.state.image ? (
          <div
            style={{
              backgroundImage: `url(${this.state.image})`,
              backgroundSize: "contain"
            }}
            id="canvas"
          />
        ) : null}
        <Button
          className="tool-button"
          floated="right"
          loading={actions.isposting}
          onClick={this.handleLabelSubmit}
        >
          Submit
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    actions: state.labels.labelActions,
    currentimage: state.images.currentImage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postLabel: (data, callback) => {
      return dispatch(postLabel(data, callback));
    },
    fetchProject: data => {
      return dispatch(fetchProject(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolIndex);

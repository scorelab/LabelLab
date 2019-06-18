import React, { Component } from "react";

class LabelDraw extends Component {
  componentDidMount() {
    let canvas = document.getElementById("label-draw-parent");
    let element = document.createElement("div");
    element.className = "rectangle";
    element.id = "rect" + this.props.label._id + this.props.num;
    element.style.left = this.props.label.startX + "px";
    element.style.top = this.props.label.startY + "px";
    element.style.width =
      this.props.label.endX - this.props.label.startX + "px";
    element.style.height =
      this.props.label.endY - this.props.label.startY + "px";
    canvas.appendChild(element);
  }
  componentWillUnmount() {
    let element = document.getElementById(
      "rect" + this.props.label._id + this.props.num
    );
    if (element) element.remove();
  }
  render() {
    return <div id="label-draw-parent" />;
  }
}

export default LabelDraw;

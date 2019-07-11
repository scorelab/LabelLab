import React, { Component } from "react";
// import Hotkeys from 'react-hot-keys';
import update from "immutability-helper";

import "semantic-ui-css/semantic.min.css";

import Canvas from "./Canvas";
// import HotkeysPanel from './HotkeysPanel';
// import Sidebar from './Sidebar';
// import { PathToolbar, MakePredictionToolbar } from './CanvasToolbar';
// import Reference from './Reference';
import "./LabelingApp.css";

import { genId, colors } from "./utils";
// import { computeTrace } from "./tracing";
import { withHistory } from "./LabelingAppHistoryHOC";
import { withLoadImageData } from "./LoadImageDataHOC";

/*
 type Figure = {
   type: 'bbox' | 'polygon';
   points: [{ lat: Number, lng: Number }];
   ?color: Color;
 };
*/

class LabelingApp extends Component {
  constructor(props) {
    super(props);

    const { labels } = props;
    const toggles = {};
    labels.map(label => (toggles[label.id] = true));

    this.state = {
      selected: null,
      toggles,

      selectedFigureId: null,

      // UI
      reassigning: { status: false, type: null },
      hotkeysPanel: false
    };

    this.canvasRef = React.createRef();
  }

  handleSelected=(selected)=> {
    if (selected === this.state.selected) return;
    const { pushState } = this.props;

    if (!selected) {
      pushState(
        state => ({
          unfinishedFigure: null
        }),
        () => this.setState({ selected })
      );
      return;
    }

    const { labels } = this.props;

    const labelIdx = labels.findIndex(label => label.id === selected);
    const type = labels[labelIdx].type;
    const color = colors[labelIdx];

    pushState(
      state => ({
        unfinishedFigure: {
          id: null,
          color,
          type,
          points: []
        }
      }),
      () => this.setState({ selected })
    );
  }

  handleSelectionChange=(figureId)=> {
    if (figureId) {
      this.setState({ selectedFigureId: figureId });
    } else {
      this.setState({
        reassigning: { status: false, type: null },
        selectedFigureId: null
      });
    }
  }

  handleChange=(eventType, figure, newLabelId)=> {
    if (!figure.color) return;
    const { labels, figures, pushState, height, width, imageData } = this.props;
    const label =
      figure.color === "gray"
        ? { id: "__temp" }
        : labels[colors.indexOf(figure.color)];
    const idx = (figures[label.id] || []).findIndex(f => f.id === figure.id);

    switch (eventType) {
      case "new":
        pushState(
          state => ({
            figures: update(state.figures, {
              [label.id]: {
                $push: [
                  {
                    id: figure.id || genId(),
                    type: figure.type,
                    points: figure.points
                  }
                ]
              }
            }),
            unfinishedFigure: null
          }),
          () =>
            this.setState({
              selected: null
            })
        );
        break;

      // case "replace":
      //   pushState(state => {
      //     let { tracingOptions } = figure;
      //     if (tracingOptions && tracingOptions.enabled) {
      //       const imageInfo = {
      //         height,
      //         width,
      //         imageData
      //       };
      //       tracingOptions = {
      //         ...tracingOptions,
      //         trace: computeTrace(figure.points, imageInfo, tracingOptions)
      //       };
      //     } else {
      //       tracingOptions = { ...tracingOptions, trace: [] };
      //     }

      //     return {
      //       figures: update(state.figures, {
      //         [label.id]: {
      //           $splice: [
      //             [
      //               idx,
      //               1,
      //               {
      //                 id: figure.id,
      //                 type: figure.type,
      //                 points: figure.points,
      //                 tracingOptions
      //               }
      //             ]
      //           ]
      //         }
      //       })
      //     };
      //   });
        // break;

      case "delete":
        pushState(state => ({
          figures: update(state.figures, {
            [label.id]: {
              $splice: [[idx, 1]]
            }
          })
        }));
        break;

      case "unfinished":
        pushState(
          state => ({ unfinishedFigure: figure }),
          () => {
            const { unfinishedFigure } = this.props;
            const { type, points } = unfinishedFigure;
            if (type === "bbox" && points.length >= 2) {
              this.handleChange("new", unfinishedFigure);
            }
          }
        );
        break;

      case "recolor":
        if (label.id === newLabelId) return;
        pushState(state => ({
          figures: update(state.figures, {
            [label.id]: {
              $splice: [[idx, 1]]
            },
            [newLabelId]: {
              $push: [
                {
                  id: figure.id,
                  points: figure.points,
                  type: figure.type,
                  tracingOptions: figure.tracingOptions
                }
              ]
            }
          })
        }));
        break;

      default:
        throw new Error("unknown event type " + eventType);
    }
  }

  render() {
    const {
      labels,
      imageUrl,
      reference,
      onBack,
      onSkip,
      onSubmit,
      pushState,
      popState,
      figures,
      unfinishedFigure,
      height,
      width,
      models,
      makePrediction
    } = this.props;
    const {
      selected,
      selectedFigureId,
      reassigning,
      toggles,
      hotkeysPanel
    } = this.state;

    // const forwardedProps = {
    //   onBack,
    //   onSkip,
    //   onSubmit,
    //   models,
    //   makePrediction
    // };

    // let selectedFigure = null;
    const allFigures = [];
    labels.forEach((label, i) => {
      figures[label.id].forEach(figure => {
        if (
          toggles[label.id] &&
          (label.type === "bbox" || label.type === "polygon")
        ) {
          allFigures.push({
            color: colors[i],
            points: figure.points,
            id: figure.id,
            type: figure.type,
            tracingOptions: figure.tracingOptions
          });

          // if (figure.id === selectedFigureId) {
          //   selectedFigure = { ...figure, color: colors[i] };
          // }
        }
      });
    });
    figures.__temp.forEach(figure => {
      allFigures.push({
        color: "gray",
        ...figure
      });
    });
    console.log("here")
    return (
      <div>
        dasuhgduasdykas
      </div>
      // <div
      //   style={{ display: "flex", height: "100vh", flexDirection: "column" }}
      // >
      //   <div style={{ display: "flex", flex: 1, height: "100%" }}>
      //     <div style={{ flex: 4, display: "flex", flexDirection: "column" }}>
      //       <div style={{ position: "relative", height: "100%" }}>
      //         <Canvas
      //           url="https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F459225%2Fpexels-photo-459225.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D1%26w%3D500&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fnature%2F&docid=ShwNVOdFBcmkxM&tbnid=zXwrfQvPsQ5dwM%3A&vet=10ahUKEwjj75KNyq3jAhVNXSsKHfz9BNgQMwiIASgOMA4..i&w=500&h=237&client=ubuntu&bih=928&biw=1853&q=images&ved=0ahUKEwjj75KNyq3jAhVNXSsKHfz9BNgQMwiIASgOMA4&iact=mrc&uact=8"
      //           height="500"
      //           width="500"
      //           figures={allFigures}
      //           unfinishedFigure={unfinishedFigure}
      //           onChange={this.handleChange}
      //           onReassignment={type =>
      //             this.setState({ reassigning: { status: true, type } })
      //           }
      //           onSelectionChange={this.handleSelectionChange}
      //           ref={this.canvasRef}
      //           style={{ flex: 1 }}
      //         />
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default withLoadImageData(withHistory(LabelingApp));

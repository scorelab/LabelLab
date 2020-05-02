import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import Hotkeys from 'react-hot-keys';
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import 'semantic-ui-css/semantic.min.css'
import { createLabel } from '../../actions/index'
import Canvas from './Canvas'
// import HotkeysPanel from './HotkeysPanel';
import Sidebar from './Sidebar'
// import { PathToolbar, MakePredictionToolbar } from './CanvasToolbar';
// import Reference from './Reference';
import './css/LabelingApp.css'

import { genId, colors } from './utils'
// import { computeTrace } from "./tracing";
import { withHistory } from './LabelingAppHistoryHOC'
import { withLoadImageData } from './LoadImageDataHOC'

/*
 type Figure = {
   type: 'bbox' | 'polygon';
   points: [{ lat: Number, lng: Number }];
   ?color: Color;
 };
*/

class LabelingApp extends Component {
  constructor(props) {
    super(props)
    const { labels, projectId } = props
    const toggles = {}
    labels.map(label => (toggles[label.id] = true))

    this.state = {
      selected: null,
      toggles,
      genModelLoader: false,
      selectedFigureId: null,
      selectedModel: null,
      isModelSelected: false,
      // UI
      reassigning: { status: false, type: null },
      hotkeysPanel: false
    }

    this.canvasRef = React.createRef()
  }

  handleSelected = selected => {
    if (selected === this.state.selected) return
    const { pushState } = this.props

    if (!selected) {
      pushState(
        state => ({
          unfinishedFigure: null
        }),
        () => this.setState({ selected })
      )
      return
    }

    const { labels } = this.props
    const labelIdx = labels.findIndex(label => label.id === selected)
    const type = labels[labelIdx].type
    const color = colors[labelIdx]

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
    )
  }

  handleSelectionChange = figureId => {
    if (figureId) {
      this.setState({ selectedFigureId: figureId })
    } else {
      this.setState({
        reassigning: { status: false, type: null },
        selectedFigureId: null
      })
    }
  }

  handleChange = (eventType, figure, newLabelId) => {
    if (!figure.color) return
    // const { labels, figures, pushState, height, width, imageData } = this.props;
    const { labels, figures, pushState } = this.props
    const label =
      figure.color === 'gray'
        ? { id: '__temp' }
        : labels[colors.indexOf(figure.color)]
    const idx = (figures[label.id] || []).findIndex(f => f.id === figure.id)

    switch (eventType) {
      case 'new':
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
        )
        break

      case 'replace':
        pushState(state => {
          return {
            figures: update(state.figures, {
              [label.id]: {
                $splice: [
                  [
                    idx,
                    1,
                    {
                      id: figure.id,
                      type: figure.type,
                      points: figure.points
                    }
                  ]
                ]
              }
            })
          }
        })
        break

      case 'delete':
        pushState(state => ({
          figures: update(state.figures, {
            [label.id]: {
              $splice: [[idx, 1]]
            }
          })
        }))
        break

      case 'unfinished':
        pushState(
          state => ({ unfinishedFigure: figure }),
          () => {
            const { unfinishedFigure } = this.props
            const { type, points } = unfinishedFigure
            if (type === 'bbox' && points.length >= 2) {
              this.handleChange('new', unfinishedFigure)
            }
          }
        )
        break

      case 'recolor':
        if (label.id === newLabelId) return
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
        }))
        break

      default:
        throw new Error('unknown event type ' + eventType)
    }
  }

  handleNewLabelSubmit = name => {
    const { projectId, createLabel } = this.props
    let data = {
      name: name,
      type: 'bbox',
      projectId: projectId
    }
    createLabel(data, this.callback)
  }
  callback = () => {
    // this.genModelLoader: false
    window.location.reload()
  }

  render() {
    const {
      labels,
      imageUrl,
      projectUrl,
      // reference,
      onBack,
      onSkip,
      onSubmit,
      pushState,
      // popState,
      figures,
      unfinishedFigure,
      height,
      width,
      models,
      makePrediction
    } = this.props
    const {
      selected,
      // selectedFigureId,
      reassigning,
      toggles
      // hotkeysPanel
    } = this.state

    const forwardedProps = {
      onBack,
      onSkip,
      onSubmit,
      models,
      makePrediction
    }

    const modelOptions = [{ value: 'frcnn', text: 'Faster RCNN' }]

    const sidebarProps = reassigning.status
      ? {
          title: 'Select the new label',
          selected: null,
          onSelect: selected => {
            const figure = this.canvasRef.current.getSelectedFigure()
            if (figure) {
              this.handleChange('recolor', figure, selected)
            }

            this.setState({ reassigning: { status: false, type: null } })
          },
          filter: label => label.type === reassigning.type,
          labelData: figures
        }
      : {
          title: 'Labeling',
          selected,
          onSelect: this.handleSelected,
          toggles,
          modelOptions,
          onToggle: label =>
            this.setState({
              toggles: update(toggles, {
                [label.id]: { $set: !toggles[label.id] }
              })
            }),
          openHotkeys: () => this.setState({ hotkeysPanel: true }),
          genModelLoader: this.state.genModelLoader,
          isModelSelected: this.state.isModelSelected,
          handleModelSelect: e => {
            this.setState({
              // selectedModel: value,
              isModelSelected: true
            })
          },
          genbbox: async () => {
            this.setState({ genModelLoader: true })
            const existingLabels = []
            var detectedLabels = ''
            labels.map((label, _) => existingLabels.push(label.name))

            var cocoSsd = require('@tensorflow-models/coco-ssd')
            let img = new Image()
            img.crossOrigin = 'Anonymous'
            img.src = imageUrl
            // Load the model.
            const model = await cocoSsd.load()
            // Classify the image.
            const predictions = await model.detect(img)
            if (predictions.length !== 0) {
              predictions.forEach(predictedLabel => {
                if (
                  existingLabels.includes(predictedLabel.class) ||
                  existingLabels.includes(predictedLabel.class.toUpperCase())
                ) {
                  detectedLabels += predictedLabel.class + ', '
                } else {
                  existingLabels.push(predictedLabel.class)
                  this.handleNewLabelSubmit(predictedLabel.class)
                }
              })
            } else {
              alert('No label detected!')
            }
            if (detectedLabels.length !== 0) {
              detectedLabels = detectedLabels.slice(0, -2)
              alert(
                'No new label detected!\n' +
                  detectedLabels +
                  ' label/s already exists'
              )
            }
            this.setState({ genModelLoader: false })
          },
          onFormChange: (labelId, newValue) =>
            pushState(state => ({
              figures: update(figures, { [labelId]: { $set: newValue } })
            })),
          labelData: figures,
          onHome: () => this.props.history.push(projectUrl)
        }
    // let selectedFigure = null;
    const allFigures = []
    labels.forEach((label, i) => {
      figures[label.id].forEach(figure => {
        if (
          toggles[label.id] &&
          (label.type === 'bbox' || label.type === 'polygon')
        ) {
          allFigures.push({
            color: colors[i],
            points: figure.points,
            id: figure.id,
            type: figure.type,
            tracingOptions: figure.tracingOptions
          })

          // if (figure.id === selectedFigureId) {
          //   selectedFigure = { ...figure, color: colors[i] };
          // }
        }
      })
    })
    figures.__temp.forEach(figure => {
      allFigures.push({
        color: 'gray',
        ...figure
      })
    })
    return (
      <div
        style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', flex: 1, height: '100%' }}>
          <Sidebar
            labels={labels}
            {...sidebarProps}
            {...forwardedProps}
            style={{ flex: 1, maxWidth: 300 }}
          />
          <div style={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <Canvas
                url={imageUrl}
                height={height}
                width={width}
                figures={allFigures}
                unfinishedFigure={unfinishedFigure}
                onChange={this.handleChange}
                onReassignment={type =>
                  this.setState({ reassigning: { status: true, type } })
                }
                onSelectionChange={this.handleSelectionChange}
                ref={this.canvasRef}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LabelingApp.propTypes = {
  createLabel: PropTypes.func
}
const mapStateToProps = state => {
  return {
    labels: state.labels.labels
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // fetchLabels: projectId => {
    //   return dispatch(fetchLabels(projectId))
    // },
    createLabel: (data, callback) => {
      return dispatch(createLabel(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLoadImageData(withRouter(withHistory(LabelingApp))))

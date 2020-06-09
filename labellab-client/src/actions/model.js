import {
  SET_PROJECT_ID,
  SET_NAME,
  SET_TYPE,
  SET_SOURCE_TYPE,
  ADD_LABEL,
  REMOVE_LABEL,
  ADD_PREPROCESSING_STEP,
  REMOVE_PREPROCESSING_STEP,
  SET_TRAIN_TEST_SPLIT,
  SET_MODEL_PARAMETER,
  SET_TRANSFER_SOURCE,
  ADD_LAYER,
  EDIT_LAYER,
  REMOVE_LAYER,
  SAVE_MODEL_REQUEST,
  SAVE_MODEL_SUCCESS,
  SAVE_MODEL_FAILURE
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'

export const setProjectId = id => {
  return {
    type: SET_PROJECT_ID,
    payload: id
  }
}

export const setName = name => {
  return {
    type: SET_NAME,
    payload: name
  }
}

export const setType = type => {
  return {
    type: SET_TYPE,
    payload: type
  }
}

export const setSource = sourceType => {
  return {
    type: SET_SOURCE_TYPE,
    payload: sourceType
  }
}

export const addLabel = (labels, labelToAdd) => {
  if (!labels.includes(labelToAdd)) {
    labels.push(labelToAdd)
  }

  return {
    type: ADD_LABEL,
    payload: labels
  }
}

export const removeLabel = (labels, labelToRemove) => {
  labels = labels.filter(label => label !== labelToRemove)

  return {
    type: REMOVE_LABEL,
    payload: labels
  }
}

export const addPreprocessingStep = (steps, stepToAdd) => {
  if (steps.filter(step => step.name === stepToAdd.name).length <= 0) {
    steps.push(stepToAdd)
  }

  return {
    type: ADD_PREPROCESSING_STEP,
    payload: steps
  }
}

export const removePreprocessingStep = (steps, stepToRemove) => {
  steps = steps.filter(step => step.name !== stepToRemove)

  return {
    type: REMOVE_PREPROCESSING_STEP,
    payload: steps
  }
}

export const setTrainTestSplit = (field, value) => {
  const payload = {}
  payload[field] = value

  return {
    type: SET_TRAIN_TEST_SPLIT,
    payload
  }
}

export const setModelParameter = (field, value) => {
  const payload = {}
  payload[field] = value

  return {
    type: SET_MODEL_PARAMETER,
    payload
  }
}

export const setTransferLearningSource = value => {
  return {
    type: SET_TRANSFER_SOURCE,
    payload: value
  }
}

export const addLayer = (layers, layer) => {
  layers.push(layer)

  return {
    type: ADD_LAYER,
    payload: layers
  }
}

export const editLayer = (layers, index, editedLayer) => {
  layers[index] = editedLayer

  return {
    type: EDIT_LAYER,
    payload: layers
  }
}

export const removeLayer = (layers, layerToRemove) => {
  layers = layers.filter(layer => layer.name !== layerToRemove)

  return {
    type: REMOVE_LAYER,
    payload: layers
  }
}

export const saveModel = modelData => {
  return dispatch => {
    dispatch(request())
    FetchApi('POST', '/api/v1/models/save', modelData, true)
      .then(res => {
        dispatch(success())
      })
      .catch(err => {
        if (err.response) {
          err.response.message
            ? dispatch(failure(err.response.message))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: SAVE_MODEL_REQUEST }
  }
  function success() {
    return { type: SAVE_MODEL_SUCCESS }
  }
  function failure(error) {
    return { type: SAVE_MODEL_FAILURE, payload: error }
  }
}

import {
  ADD_LABEL,
  REMOVE_LABEL,
  ADD_PREPROCESSING_STEP,
  REMOVE_PREPROCESSING_STEP,
  SET_TRAIN_TEST_SPLIT
} from '../constants/index'

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

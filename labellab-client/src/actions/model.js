import { ADD_LABEL, REMOVE_LABEL } from '../constants/index'

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

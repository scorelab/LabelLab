import {
  ADD_LABEL,
  REMOVE_LABEL,
  ADD_PREPROCESSING_STEP,
  REMOVE_PREPROCESSING_STEP,
  SET_TRAIN_TEST_SPLIT,
  SET_MODEL_PARAMETER,
  SET_TRANSFER_SOURCE,
  ADD_LAYER,
  EDIT_LAYER,
  REMOVE_LAYER
} from '../constants/index'

const initialState = {
  modelActions: {},
  model: {
    labels: [],
    preprocessingSteps: [],
    train: '',
    test: '',
    validation: '',
    epochs: 0,
    batchSize: 0,
    learningRate: 0,
    loss: null,
    metric: null,
    optimizer: null,
    transferSource: null,
    layers: []
  },
  models: []
}

const model = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LABEL:
    case REMOVE_LABEL:
      return {
        ...state,
        model: {
          ...state.model,
          labels: action.payload
        }
      }
    case ADD_PREPROCESSING_STEP:
    case REMOVE_PREPROCESSING_STEP:
      return {
        ...state,
        model: {
          ...state.model,
          preprocessingSteps: action.payload
        }
      }
    case SET_TRAIN_TEST_SPLIT:
    case SET_MODEL_PARAMETER:
      return {
        ...state,
        model: {
          ...state.model,
          ...action.payload
        }
      }
    case SET_TRANSFER_SOURCE:
      return {
        ...state,
        transferSource: action.payload
      }
    case EDIT_LAYER:
    case ADD_LAYER:
    case REMOVE_LAYER:
      return {
        ...state,
        model: {
          ...state.model,
          layers: action.payload
        }
      }
    default:
      return state
  }
}

export default model

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

const initialState = {
  modelActions: {
    isSaving: false,
    errors: ''
  },
  model: {
    name: '',
    type: '',
    source: '',
    id: '',
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
    layers: [],
    projectId: '',
    accuracyGraphUrl: '',
    lossGraphUrl: '',
    modelAccuracy: null,
    modelLoss: null
  },
  models: []
}

const model = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECT_ID:
      return {
        ...state,
        model: {
          ...state.model,
          projectId: action.payload
        }
      }
    case SET_NAME:
      return {
        ...state,
        model: {
          ...state.model,
          name: action.payload
        }
      }
    case SET_TYPE:
      return {
        ...state,
        model: {
          ...state.model,
          type: action.payload
        }
      }
    case SET_SOURCE_TYPE:
      return {
        ...state,
        model: {
          ...state.model,
          source: action.payload
        }
      }
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
    case SAVE_MODEL_REQUEST:
      return {
        ...state,
        modelActions: {
          isSaving: true
        }
      }
    case SAVE_MODEL_FAILURE:
      return {
        ...state,
        modelActions: {
          isSaving: false,
          errors: action.payload
        }
      }
    case SAVE_MODEL_SUCCESS:
      return {
        ...state,
        model: action.payload.model,
        modelActions: {
          isSaving: false
        }
      }
    default:
      return state
  }
}

export default model

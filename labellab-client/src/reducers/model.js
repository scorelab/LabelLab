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
  SAVE_MODEL_FAILURE,
  SET_EXPORT_TYPE,
  TEST_MODEL_REQUEST,
  TEST_MODEL_FAILURE,
  TEST_MODEL_SUCCESS,
  UPLOAD_MODEL_REQUEST,
  UPLOAD_MODEL_FAILURE,
  UPLOAD_MODEL_SUCCESS,
  GET_TRAINED_MODELS_REQUEST,
  GET_TRAINED_MODELS_FAILURE,
  GET_TRAINED_MODELS_SUCCESS,
  GET_PROJECT_MODELS_REQUEST,
  GET_PROJECT_MODELS_FAILURE,
  GET_PROJECT_MODELS_SUCCESS,
  DELETE_MODEL_SUCCESS,
  DELETE_MODEL_FAILURE,
  DELETE_MODEL_REQUEST,
  GET_MODEL_REQUEST,
  GET_MODEL_FAILURE,
  GET_MODEL_SUCCESS,
  TRAIN_MODEL_REQUEST,
  TRAIN_MODEL_FAILURE,
  TRAIN_MODEL_SUCCESS,
} from '../constants/index'
import camelCase from "camelcase"

const initialState = {
  modelActions: {
    isSaving: false,
    isTesting: false,
    isFetching: false,
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
    modelLoss: null,
    exportType: ""
  },
  models: [],
  testResult: []
}

const keysToCamelCase = data => {
  const newData = {}

  for (var key in data) {
    newData[camelCase(key)] = data[key]
  }

  return newData
}

const model = (state = initialState, action) => {

  // This needs to be done since the backend passes variables in camelcase
  if (action.payload && action.payload.constructor == Object) {
    action.payload = keysToCamelCase(action.payload)
  }

  switch (action.type) {
    case SET_EXPORT_TYPE:
      return {
        ...state,
        model: {
          ...state.model,
          exportType: action.payload
        }
      }
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
        model: {
          ...state.model,
          transferSource: action.payload
        }
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
        model: action.payload,
        modelActions: {
          isSaving: false
        }
      }
    case GET_MODEL_REQUEST:
    case TRAIN_MODEL_REQUEST:
      return {
        ...state,
        modelActions: {
          isFetching: true
        }
      }
    case GET_MODEL_FAILURE:
    case TRAIN_MODEL_FAILURE:
      return {
        ...state,
        modelActions: {
          isFetching: false,
          errors: action.payload
        }
      }
    case GET_MODEL_SUCCESS:
    case TRAIN_MODEL_SUCCESS:
      return {
        ...state,
        model: action.payload,
        modelActions: {
          isFetching: false
        }
      }
    case TEST_MODEL_REQUEST:
      return {
        ...state,
        modelActions: {
          isTesting: true
        }
      }
    case TEST_MODEL_FAILURE:
      return {
        ...state,
        modelActions: {
          isTesting: false,
          errors: action.payload
        }
      }
    case TEST_MODEL_SUCCESS:
      return {
        ...state,
        testResult: action.payload,
        modelActions: {
          isTesting: false
        }
      }
    case UPLOAD_MODEL_REQUEST:
      return {
        ...state,
        modelActions: {
          isTesting: true
        }
      }
    case UPLOAD_MODEL_FAILURE:
      return {
        ...state,
        modelActions: {
          isTesting: false,
          errors: action.payload
        }
      }
    case UPLOAD_MODEL_SUCCESS:
      return {
        ...state,
        modelActions: {
          isTesting: false
        }
      }
    case GET_PROJECT_MODELS_REQUEST:
    case GET_TRAINED_MODELS_REQUEST:
    case DELETE_MODEL_REQUEST:
      return {
        ...state,
        modelActions: {
          isFetching: true
        }
      }
    case GET_PROJECT_MODELS_FAILURE:
    case GET_TRAINED_MODELS_FAILURE:
    case DELETE_MODEL_FAILURE:
      return {
        ...state,
        modelActions: {
          isFetching: false,
          errors: action.payload
        }
      }
    case GET_PROJECT_MODELS_SUCCESS:
    case GET_TRAINED_MODELS_SUCCESS:
    case DELETE_MODEL_SUCCESS:
      return {
        ...state,
        modelActions: {
          isFetching: false
        },
        models: action.payload
      }
    default:
      return state
  }
}

export default model

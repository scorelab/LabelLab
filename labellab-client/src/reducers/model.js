import {
  ADD_LABEL,
  REMOVE_LABEL,
  ADD_PREPROCESSING_STEP,
  REMOVE_PREPROCESSING_STEP,
  SET_TRAIN_TEST_SPLIT
} from '../constants/index'

const initialState = {
  modelActions: {},
  model: {
    labels: [],
    preprocessingSteps: [],
    train: '',
    test: '',
    validation: ''
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
      return {
        ...state,
        model: {
          ...state.model,
          ...action.payload
        }
      }
    default:
      return state
  }
}

export default model

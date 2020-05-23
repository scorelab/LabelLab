import { ADD_LABEL, REMOVE_LABEL } from '../constants/index'

const initialState = {
  modelActions: {},
  model: {
    labels: []
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
    default:
      return state
  }
}

export default model

import {
  ANALYTICS_TIME_LABEL_FAILURE,
  ANALYTICS_TIME_LABEL_REQUEST,
  ANALYTICS_TIME_LABEL_SUCCESS
} from '../constants/index'
const intialState = {
  isfetching: false,
  data: {}
}
const analytics = (state = intialState, action) => {
  switch (action.type) {
    case ANALYTICS_TIME_LABEL_REQUEST:
      return {
        ...state,
        isfetching: true
      }
    case ANALYTICS_TIME_LABEL_SUCCESS:
      return {
        ...state,
        isfetching: false,
        data: action.payload
      }
    case ANALYTICS_TIME_LABEL_FAILURE:
      return {
        ...state,
        isfetching: false
      }
    default:
      return state
  }
}

export default analytics

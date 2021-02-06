import {
  ANALYTICS_TIME_LABEL_FAILURE,
  ANALYTICS_TIME_LABEL_REQUEST,
  ANALYTICS_TIME_LABEL_SUCCESS,
  ANALYTICS_COUNT_LABEL_FAILURE,
  ANALYTICS_COUNT_LABEL_REQUEST,
  ANALYTICS_COUNT_LABEL_SUCCESS
} from '../constants/index'
const intialState = {
  isfetching: false,
  timeData: {},
  countData: {}
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
        timeData: action.payload
      }
    case ANALYTICS_TIME_LABEL_FAILURE:
      return {
        ...state,
        isfetching: false
      }
    case ANALYTICS_COUNT_LABEL_REQUEST:
      return {
        ...state,
        isfetching: true
      }
    case ANALYTICS_COUNT_LABEL_SUCCESS:
      return {
        ...state,
        isfetching: false,
        countData: action.payload
      }
    case ANALYTICS_COUNT_LABEL_FAILURE:
      return {
        ...state,
        isfetching: false
      }
    default:
      return state
  }
}

export default analytics

import {
  ANALYTICS_TIME_LABEL_FAILURE,
  ANALYTICS_TIME_LABEL_REQUEST,
  ANALYTICS_TIME_LABEL_SUCCESS,
  ANALYTICS_COUNT_LABEL_FAILURE,
  ANALYTICS_COUNT_LABEL_REQUEST,
  ANALYTICS_COUNT_LABEL_SUCCESS,
  ISSUE_ANALYTICS_FAILURE,
  ISSUE_ANALYTICS_REQUEST,
  ISSUE_ANALYTICS_SUCCESS
} from '../constants/index'
const intialState = {
  isfetching: false,
  timeData: {},
  countData: {},
  issueData: {}
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
    case ISSUE_ANALYTICS_REQUEST:
      return {
        ...state,
        isfetching: true
      }
    case ISSUE_ANALYTICS_SUCCESS:
      return {
        ...state,
        isfetching: false,
        issueData: action.payload
      }
    case ISSUE_ANALYTICS_FAILURE:
      return {
        ...state,
        isfetching: false
      }
    default:
      return state
  }
}

export default analytics

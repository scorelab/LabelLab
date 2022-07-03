import {
  FETCH_PROJECT_ISSUES_REQUEST,
  FETCH_PROJECT_ISSUES_SUCCESS,
  FETCH_PROJECT_ISSUES_FAILURE,
  FETCH_CATEGORY_SPECIFIC_ISSUES_REQUEST,
  FETCH_CATEGORY_SPECIFIC_ISSUES_SUCCESS,
  FETCH_CATEGORY_SPECIFIC_ISSUES_FAILURE,
  FETCH_TEAM_SPECIFIC_ISSUES_FAILURE,
  FETCH_TEAM_SPECIFIC_ISSUES_SUCCESS,
  FETCH_TEAM_SPECIFIC_ISSUES_REQUEST,
  FETCH_ENTITY_SPECIFIC_ISSUES_FAILURE,
  FETCH_ENTITY_SPECIFIC_ISSUES_SUCCESS,
  FETCH_ENTITY_SPECIFIC_ISSUES_REQUEST,
  CREATE_ISSUE_REQUEST,
  CREATE_ISSUE_SUCCESS,
  CREATE_ISSUE_FAILURE,
  UPDATE_ISSUE_FAILURE,
  UPDATE_ISSUE_REQUEST,
  UPDATE_ISSUE_SUCCESS,
  DELETE_ISSUE_FAILURE,
  DELETE_ISSUE_REQUEST,
  DELETE_ISSUE_SUCCESS,
  ASSIGN_ISSUE_FAILURE,
  ASSIGN_ISSUE_REQUEST,
  ASSIGN_ISSUE_SUCCESS,
  FETCH_ISSUE_REQUEST,
  FETCH_ISSUE_SUCCESS,
  FETCH_ISSUE_FAILURE,
  RECEIVE_COMMENT
} from '../constants/index'

const initialState = {
  issues: [],
  issuesActions: {
    isFetching: false,
    isUpdating: false,
    isDeleting: false,
    isPosting: false,
    isAssigning: false,
    errors: '',
  },
  currentIssue: {},
  comments: []
}

const issues = (state = initialState, action) => {

  const { type, payload } = action
  switch (type) {
    case FETCH_PROJECT_ISSUES_REQUEST:
    case FETCH_TEAM_SPECIFIC_ISSUES_REQUEST:
    case FETCH_ENTITY_SPECIFIC_ISSUES_REQUEST:
    case FETCH_CATEGORY_SPECIFIC_ISSUES_REQUEST:
      return {
        ...state,
        issuesActions: {
          isFetching: true
        }
      }
    case FETCH_PROJECT_ISSUES_SUCCESS:
    case FETCH_TEAM_SPECIFIC_ISSUES_SUCCESS:
    case FETCH_ENTITY_SPECIFIC_ISSUES_SUCCESS:
    case FETCH_CATEGORY_SPECIFIC_ISSUES_SUCCESS:
      return {
        ...state,
        issues: payload,
        issuesActions: {
          isFetching: false
        }
      }
    case FETCH_PROJECT_ISSUES_FAILURE:
    case FETCH_TEAM_SPECIFIC_ISSUES_FAILURE:
    case FETCH_ENTITY_SPECIFIC_ISSUES_FAILURE:
    case FETCH_CATEGORY_SPECIFIC_ISSUES_FAILURE:
      return {
        ...state,
        issuesActions: {
          isFetching: false,
          errors: payload
        }
      }
    case CREATE_ISSUE_REQUEST:
      return {
        ...state,
        issuesActions: {
          isPosting: true
        }
      }
    case CREATE_ISSUE_FAILURE:
      return {
        ...state,
        issuesActions: {
          isPosting: false,
          error: 'Something went wrong!'
        }
      }
    case CREATE_ISSUE_SUCCESS:
      return {
        ...state,
        issuesActions: {
          isPosting: false
        }
      }
    case UPDATE_ISSUE_REQUEST:
      return {
        ...state,
        issuesActions: {
          isUpdating: true
        }
      }
    case UPDATE_ISSUE_FAILURE:
      return {
        ...state,
        issuesActions: {
          isUpdating: false,
          error: 'Something went wrong!'
        }
      }
    case UPDATE_ISSUE_SUCCESS:
      return {
        ...state,
        issuesActions: {
          isUpdating: false
        },
      }
    case DELETE_ISSUE_REQUEST:
      return {
        ...state,
        issuesActions: {
          isDeleting: true
        }
      }
    case DELETE_ISSUE_FAILURE:
      return {
        ...state,
        issuesActions: {
          isDeleting: false,
          error: 'Something went wrong!'
        }
      }
    case DELETE_ISSUE_SUCCESS:
      return {
        ...state,
        issuesActions: {
          isDeleting: false
        },
      }
    case FETCH_ISSUE_REQUEST:
      return {
        ...state,
        issuesActions: {
          isFetching: true
        }
      }
    case FETCH_ISSUE_SUCCESS:
      return {
        ...state,
        issuesActions: {
          isFetching: false
        },
        currentIssue: payload,
        comments: payload.comments.reverse()
      }
    case FETCH_ISSUE_FAILURE:
      return {
        ...state,
        issuesActions: {
          isFetching: false,
          errors: payload
        }
      }
    case ASSIGN_ISSUE_REQUEST:
      return {
        ...state,
        issuesActions: {
          isAssigning: true
        }
      }
    case ASSIGN_ISSUE_SUCCESS:
      return {
        ...state,
        issuesActions: {
          isAssigning: false
        }
      }
    case ASSIGN_ISSUE_FAILURE:
      return {
        ...state,
        issuesActions: {
          isAssigning: false,
          errors: payload
        }
      }
    case RECEIVE_COMMENT:
      return {
        ...state,
        comments: [
          {
            id: payload.id,
            body: payload.body,
            issue_id: payload.issueId,
            user_id: payload.userId,
            username: payload.username,
            thumbnail: payload.thumbnail,
            timestamp: payload.timestamp
          },
          ...state.comments
        ]
      }
    default:
      return state
  }
}

export default issues

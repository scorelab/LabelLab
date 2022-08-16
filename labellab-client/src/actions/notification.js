import {
    FETCH_NOTIFICATION_FAILURE,
    FETCH_NOTIFICATION_REQUEST,
    FETCH_NOTIFICATION_SUCCESS,
    RECEIVE_NOTIFICATION
  } from '../constants/index'
  import { toast } from 'react-semantic-toasts'
  import socket from '../utils/webSocket'
  import FetchApi from '../utils/FetchAPI'
  import { icons } from '../constants/options'

  
  export const fetchNotification = () => {
    return dispatch => {
      dispatch(request())
      FetchApi.get("/api/v1/notifications")
        .then(res => {
          dispatch(success(res.data.body))
        })
        .catch(err => {
          if (err.response) {
            err.response.data
              ? dispatch(failure(err.response.data.msg))
              : dispatch(failure(err.response.statusText, null))
          }
        })
    }
    function request() {
      return { type: FETCH_NOTIFICATION_REQUEST }
    }
    function success(data) {
      return { type: FETCH_NOTIFICATION_SUCCESS, payload: data }
    }
    function failure(error) {
      return { type: FETCH_NOTIFICATION_FAILURE, payload: error }
    }
  }

  export const handleNotificationReceive = userId => {
    return dispatch => {
      socket.on('notification', data => {
        const loggedUserId = data.user_id
        if (loggedUserId == userId) {
          toast({
            type: 'info',
            title: data.message,
            animation: 'fade up',
            icon: icons[data.type],
            size: 'small',
            time: 3000
          })
          dispatch(success(data)) 
        }
      })
    }
    function success(data) {
      return { type: RECEIVE_NOTIFICATION, payload: data }
    }
  }
  
  
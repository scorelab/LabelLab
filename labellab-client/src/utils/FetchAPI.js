import axios from 'axios'
import { setAuthToken, saveAcessToken, getToken } from './token'

const FetchApi = axios.create({
  baseURL: `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_SERVER_PORT}`,
  timeout: 20000,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

/**
 * API request interceptor
 */
FetchApi.interceptors.request.use(
  request => {
    const token = getToken('access_token');
    if (token) {
      if (
        request.url.includes('token_refresh') ||
        request.url.includes('logout_refresh')
      ) {
        request.headers.Authorization = `Bearer ${localStorage.refresh_token}`
      } else {
        request.headers.Authorization = `Bearer ${localStorage.access_token}`
      }
    }
    // config.headers['Content-Type'] = 'application/json';
    return request;
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * API response interceptor
 */
let fetchingAccessToken = false
let subscribers = []

const onAccessTokenFetched = access_token => {
  subscribers = subscribers.filter(callback => callback(access_token))
}

const addSubscriber = callback => {
  subscribers.push(callback)
}

FetchApi.interceptors.response.use(
  response => response,
  // handling errors
  error => {
    const { config: originalRequest, response } = error
    const status = response ? response.status : 500
    switch (status) {
      //handing 401 erros
      case 401: {
        if (!fetchingAccessToken) {
          fetchingAccessToken = true

          FetchApi.post(`/api/v1/auth/token_refresh`, {})
            .then(res => {
              const { access_token } = res.data
              console.log(res)
              fetchingAccessToken = false
              //update header
              setAuthToken(access_token)
              //saving new access_token
              saveAcessToken(access_token)
              //invoking callback
              onAccessTokenFetched(access_token)
            })
            .catch(err => {
              console.log(err)
            })
        }
        const retryOriginalRequest = new Promise(resolve => {
          addSubscriber(access_token => {
            originalRequest.headers.Authorization = access_token
            resolve(axios(originalRequest))
          })
        })
        return retryOriginalRequest
      }
      default: {
        return Promise.reject(error)
      }
    }
  }
)

export default FetchApi
import axios from 'axios'
import { getToken } from './token'
import { TOKEN_TYPE } from '../constants/index'

const FetchApi = (method, url, params, TokenType) => {
  if (process.env.REACT_APP_SERVER_ENVIRONMENT === 'dev') {
    url =
      `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_SERVER_PORT}${url}`
  }
  return new Promise((resolve, reject) => {
    if (TokenType) {
      axios({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + getToken(TOKEN_TYPE)
        },
        responseType: 'json'
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      axios({
        method: method,
        url: url,
        data: params,
        responseType: 'json'
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    }
  })
}

export default FetchApi

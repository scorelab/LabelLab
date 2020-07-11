import axios from 'axios'
 // token can be of refresh type or access type

export function hasToken(token_type) {
  const token = getToken(token_type)
  return !!token
}
export function getToken(token) {
  return localStorage.getItem(token)
}

export const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = token
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

export const saveAllTokens = tokens => {
  if (
    tokens &&
    tokens.access_token &&
    tokens.refresh_token &&
    tokens.body
  ) {
    //Setting the tokens to local storage
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    localStorage.setItem('user_details', JSON.stringify(tokens.body))
  }
}

export const saveAcessToken = token => {
  if (token) {
    //Setting the access token to local storage
    localStorage.setItem('access_token', token)
  }
}

export const removeAllTokens = () => {
  // deleting the present tokens
  if (hasToken('access_token')) {
    localStorage.removeItem('access_token')
  }
  if(hasToken('refresh_token')){
    localStorage.removeItem('refresh_token')
  }
  if(hasToken('user_details')){
    localStorage.removeItem('user_details')
  }
}
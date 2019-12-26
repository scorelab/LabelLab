import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { store } from './utils/store'
import { Provider } from 'react-redux'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})

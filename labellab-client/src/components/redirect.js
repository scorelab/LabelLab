import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
class Redirect extends Component {
  // componentDidMount() {
  //   let token = window.location.search.substring(1)
  //   if (token) {
  //     setToken(TOKEN_TYPE, token, true)
  //   }
  // }
  render() {
    return (
      <React.Fragment>
        <Header content="Redirecting........" />
      </React.Fragment>
    )
  }
}

export default Redirect

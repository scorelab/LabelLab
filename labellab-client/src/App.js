import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import AppIndex from './components/index'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={AppIndex} />
        </Switch>
      </BrowserRouter>
    )
  }
}

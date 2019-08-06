import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getSearchProjects } from '../../actions/index'
import './css/searchbar.css'

class SearchProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      value: '',
      results: []
    }
  }
  componentWillMount() {
    this.resetComponent()
  }
  resetComponent = () =>
    this.setState({ isLoading: false, value: '', results: [] })

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.props.history.push({
      pathname: '/project/' + result.id + '/team'
    })
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    this.props.searchProject(value.trim())
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      this.setState({
        isLoading: false
      })
    }, 300)
  }

  generateResults = () => {
    const { search } = this.props
    let results = []
    if (search == null) {
      return results
    }

    search.map((project, index) =>
      project.projectDescription
        ? results.push({
            key: index,
            title: project.projectName,
            description: project.projectDescription,
            id: project._id
          })
        : null
    )

    return results
  }
  render() {
    const { isLoading, value } = this.state

    return (
      <Search
        className="searchbar-parent"
        size="large"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true
        })}
        results={this.generateResults()}
        value={value}
        placeholder="Search"
        minCharacters={1}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    search: state.searchProjects
  }
}

const mapActionToProps = dispatch => {
  return {
    searchProject: query => {
      return dispatch(getSearchProjects(query))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(SearchProject)

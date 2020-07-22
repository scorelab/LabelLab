import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getSearchUser } from '../../actions/index'
import './css/searchUser.css'

class SearchUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      value: '',
      results: []
    }
  }
  componentDidMount() {
    this.resetComponent()
  }
  resetComponent = () =>
    this.setState({ isLoading: false, value: '', results: [] })

  handleResultSelect = (e, { result }) => {
    const { updateState } = this.props
    this.setState({ value: result.email }, updateState(result.email))
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    this.props.searchUser(value.trim())
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

    search.map((user, index) =>
      user
        ? results.push({
            key: index,
            title: user.name,
            description: user.email,
            email: user.email,
            id: user.id
          })
        : null
    )

    return results
  }
  render() {
    const { isLoading, value } = this.state

    return (
      <Search
        className="searchbar-user-parent"
        size="large"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true
        })}
        results={this.generateResults()}
        value={value}
        placeholder="Search members.."
        minCharacters={1}
      />
    )
  }
}

SearchUser.propTypes = {
  updateState: PropTypes.func,
  search: PropTypes.array,
  searchUser: PropTypes.func
}

const mapStateToProps = state => {
  return {
    search: state.searchUser
  }
}

const mapActionToProps = dispatch => {
  return {
    searchUser: query => {
      return dispatch(getSearchUser(query))
    }
  }
}

export default connect(mapStateToProps, mapActionToProps)(SearchUser)

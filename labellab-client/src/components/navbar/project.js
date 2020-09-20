import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import {
  Image,
  Header,
  Dropdown,
  Icon,
  Search,
  Grid,
  Label
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasToken } from '../../utils/token'
import { fetchUser } from '../../actions/index'
import { TOKEN_TYPE } from '../../constants/index'
import './css/navbar.css'

const initialState = { isLoading: false, results: [], value: '' }

const resultRenderer = ({ image_name }) => (
  <>
    <Label content={image_name} />
  </>
)

resultRenderer.propTypes = {
  image_name: PropTypes.string,
}

class ProjectNavbar extends Component {
  state = initialState

  handleResultSelect = (e, { result }) => {
    const { projectId } = this.props.project
    this.setState({
      value: result.image_name,
      projectId: projectId
    })
    this.props.history.push('/project/' + projectId + '/images/#' + result._id)
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.image_name)

      this.setState({
        isLoading: false,
        results: _.filter(this.props.project.images, isMatch)
      })
    }, 300)
  }
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.fetchUser()
    } else {
      this.props.history.push('/login')
    }
  }
  pushRouter = () => {
    this.props.history.push('/')
  }
  handleClick = () => {
    this.props.history.push('/logout')
  }
  render() {
    const { title, isfetching, user } = this.props
    const { isLoading, value, results } = this.state
    return (
      <header className="navbar">
        <div className="project-nav-title" onClick={this.pushRouter}>
          <Link to="/">
            <Icon name="arrow left" />
            Dashboard
          </Link>
        </div>
        <input type="checkbox" className="menu-btn" id="menu-btn" />
        <label htmlFor="menu-btn" className="menu-icon">
          <span className="nav-icon"></span>
        </label>
        <ul className="dropdown-menu">
          <li className="searchBar">
            <Search
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true
              })}
              results={results}
              value={value}
              resultRenderer={resultRenderer}
              placeholder="Search Images..."
              {...this.props}
            />
          </li>
          <li>
            <Header textAlign="center" as="h2" content={title} />
          </li>
          <li className="subnavbar">
            <Link to="/profile">
              <Header
                className="username"
                textAlign="center"
                as="h5"
                content={user.username}
              />
              {isfetching ? (
                <h4>LOADING</h4>
              ) : user ? (
                <Image
                  className="profilepic"
                  centered
                  src={
                    user.profileImage === ''
                      ? `${user.thumbnail}`
                      : `${user.profileImage}?${Date.now()}`
                  }
                  size="mini"
                  circular
                />
              ) : null}
            </Link>
            <Dropdown className="dropdown">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/profile">Profile</Link>
                </Dropdown.Item>
                <Dropdown.Item as="label" onClick={this.handleClick}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li>
            <h4 className="logout">Logout</h4>
          </li>
        </ul>
      </header>
    )
  }
}

ProjectNavbar.propTypes = {
  isfetching: PropTypes.bool,
  history: PropTypes.object,
  user: PropTypes.object,
  fetchUser: PropTypes.func,
  title: PropTypes.string,
  project: PropTypes.object
}

const mapStateToProps = state => {
  const image_name = state.projects.currentProject.images
    ? state.projects.currentProject.images.map(image => image.image_name)
    : null
  return {
    labels: state.labels.labels,
    project: state.projects.currentProject,
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching,
    image_name
  }
}

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      return dispatch(fetchUser())
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(ProjectNavbar)

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Image, Header, Dropdown, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hasToken } from '../../utils/token'
import { fetchUser } from '../../actions/index'
import { TOKEN_TYPE } from '../../constants/index'
import './css/navbar.css'
class ProjectNavbar extends Component {
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
    return (
      <div className="navbar">
        <div className="startnav">
          <div className="project-nav-title" onClick={this.pushRouter}>
            <Link to="/">
              <Icon name="arrow left" />
              Dashboard
            </Link>
          </div>
        </div>
        <div className="navbar-title">
          <Header textAlign="center" as="h2" content={title} />
        </div>
        <div className="subnavbar">
          <ul>
            <li>
              <Header textAlign="center" as="h5" content={user.username} />
            </li>
            <li>
              {isfetching ? (
                <h4>LOADING</h4>
              ) : user ? (
                <a target="_blank" rel="noopener noreferrer" href="/profile">
                  <Image
                    centered
                    src={
                      user.profileImage === ''
                        ? `${user.thumbnail}`
                        : `${user.profileImage}?${Date.now()}`
                    }
                    size="mini"
                    circular
                  />
                </a>
              ) : null}
            </li>
            <li>
              <Dropdown>
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
          </ul>
        </div>
      </div>
    )
  }
}

ProjectNavbar.propTypes = {
  isfetching: PropTypes.bool,
  history: PropTypes.object,
  user: PropTypes.object,
  fetchUser: PropTypes.func,
  title: PropTypes.string
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching
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

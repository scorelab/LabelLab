import React, { Component } from 'react'
import { Image, Header, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './css/navbar.css'
import Searchbar from './searchbar'
class Navbar extends Component {
  handleClick = () => {
    this.props.history.push('/logout')
  }
  render() {
    const { history, user, isfetching } = this.props

    return (
      <header className="navbar">
        <div className="main-nav-title">LABELLAB</div>
        <input type="checkbox" className="menu-btn" id="menu-btn" />
        <label htmlFor="menu-btn" className="menu-icon">
          <span className="nav-icon"></span>
        </label>
        <ul className="dropdown-menu">
          <li className="searchBar">
            <Searchbar history={history} />
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

Navbar.propTypes = {
  isfetching: PropTypes.bool,
  history: PropTypes.object,
  user: PropTypes.object
}

const mapStateToProps = state => {
  return {
    isfetching: state.user.userActions.isfetching
  }
}

export default connect(
  mapStateToProps,
  null
)(Navbar)

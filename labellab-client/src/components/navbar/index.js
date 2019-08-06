import React, { Component } from 'react'
import { Image, Header, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import './css/navbar.css'
import Searchbar from './searchbar'
class Navbar extends Component {
  handleClick = () => {
    this.props.history.push('/logout')
  }
  render() {
    const { history, user, isfetching } = this.props
    return (
      <div className="navbar">
        <div className="startnav">
          <div className="main-nav-title">LABELLAB</div>
          <div className="searchBar">
            <Searchbar history={history} />
          </div>
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
              ) : null}
            </li>
            <li>
              <Dropdown>
                <Dropdown.Menu>
                  <Dropdown.Item text="Settings" />
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

const mapStateToProps = state => {
  return {
    isfetching: state.user.userActions.isfetching
  }
}

const mapActionToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(Navbar)

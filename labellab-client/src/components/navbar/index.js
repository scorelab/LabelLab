import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image, Header, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import "./css/navbar.css";
import Searchbar from "./searchbar";
class Navbar extends Component {
  handleClick = () => {
    console.log(this.props,"here");
    this.props.history.push("/logout");
  };
  render() {
    return (
      <div className="navbar">
        <div className="startnav">
          <div className="title">LABELLAB</div>
          <div className="searchBar">
            <Searchbar />
          </div>
        </div>
        <div className="subnavbar">
          <ul>
            <li>
              <Header
                textAlign="center"
                as="h5"
                content={this.props.user.username}
              />
            </li>
            <li>
              {this.props.isfetching ? (
                <h4>LOADING</h4>
              ) : this.props.user && this.props.user.image ? (
                <Image
                  centered
                  src={
                    process.env.REACT_APP_HOST +
                    process.env.REACT_APP_SERVER_PORT +
                    `/static/img/${this.props.user.image}?${Date.now()}`
                  }
                  size="mini"
                  circular
                />
              ) : null}
            </li>
            <li>
              <Dropdown floated labelled>
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
    );
  }
}

const mapStateToProps = dispatch => {
  return {};
};

const mapActionToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Navbar);

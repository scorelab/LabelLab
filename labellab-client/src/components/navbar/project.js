import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image, Header, Dropdown, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { hasToken } from "../../utils/token";
import { fetchUser } from "../../actions/index";
import { TOKEN_TYPE } from "../../constants/index";
import "./css/navbar.css";
class ProjectNavbar extends Component {
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.fetchUser();
    } else {
      this.props.history.push("/login");
    }
  }
  pushRouter=()=>{
      this.props.history.push("/")
  }
  handleClick = () => {
    console.log(this.props, "here");
    this.props.history.push("/logout");
  };
  render() {
    console.log(this.props);
    return (
      <div className="navbar">
        <div className="startnav">
          <div className="title" onClick={this.pushRouter}>
            <Link to="/">
              <Icon name="arrow left" />
              Dashboard
            </Link>
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

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching
  };
};

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      return dispatch(fetchUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(ProjectNavbar);

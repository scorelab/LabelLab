import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Image, Header } from "semantic-ui-react";
import { fetchUser } from "../../actions/index";
import { hasToken } from "../../utils/token";
import { TOKEN_TYPE } from "../../constants/index";
class Profile extends Component {
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.fetchUser();
    } else {
      this.props.history.push("/login");
    }
  }
  render() {
    const { user } = this.props;
    const { actions } = this.props;
    return (
      <div>
        <Header as="h2">Profile</Header>
        <Card>
          {actions.isfetching ? (
            <h4>LOADING</h4>
          ) : user && user.image ? (
            <Image
              centered
              src={
                process.env.REACT_APP_HOST +
                process.env.REACT_APP_SERVER_PORT +
                `/static/img/${user.image}?${Date.now()}`
              }
              size="massive"
            />
          ) : null}
          <Card.Content>
            <Card.Header>{user.name}</Card.Header>
            <Card.Description>
              {user.email}
              {user.username}
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    actions: state.user.userActions,
    user: state.user.userDetails
  };
};

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      dispatch(fetchUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Profile);

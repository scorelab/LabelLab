import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  Image,
  Header,
  Container,
  Menu,
  Dimmer,
  Loader
} from "semantic-ui-react";
import Navbar from "../navbar/project";
import { fetchUser, uploadImage, fetchAllProject } from "../../actions/index";
import { hasToken } from "../../utils/token";
import { TOKEN_TYPE } from "../../constants/index";
import CardLoader from "../../utils/cardLoader";
import "./css/profile.css";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      image: ""
    };
  }
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.fetchUser();
      this.props.fetchAllProject();
    } else {
      this.props.history.push("/login");
    }
  }
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file
      });
      this.onSubmit(e);
    };
    reader.readAsDataURL(file);
  };
  onSubmit = e => {
    let { file, image } = this.state;
    if (file && file.size > 101200) {
      this.setState({
        max_size_error: "max sized reached"
      });
    } else {
      let data = {
        image: image,
        format: file.type
      };
      this.props.uploadImage(data, this.imageCallback);
    }
  };
  handleClick = id => {
    this.props.history.push({
      pathname: "/project/" + id + "/team"
    });
  };
  imageCallback = () => {
    this.props.fetchUser();
  };
  render() {
    const { user } = this.props;
    return (
      <div>
        <Navbar title="Profile" history={this.props.history} />
        <Container>
          <div className="profile-first">
            <div className="profile-first-leftbar">
              {this.props.isfetching ? (
                <Dimmer active>
                  <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
              ) : this.props.user ? (
                <Image
                  centered
                  src={
                    this.props.user.profile_image === ""
                      ? `${this.props.user.thumbnail}`
                      : `${this.props.user.profile_image}?${Date.now()}`
                  }
                  size="medium"
                />
              ) : null}
              <div>
                <input
                  type="file"
                  onChange={this.handleImageChange}
                  className="profile-file-input"
                  id="profile-embedpollfileinput"
                />
                <label
                  htmlFor="profile-embedpollfileinput"
                  className="ui medium primary left floated button custom-margin"
                >
                  Change Profile Image
                </label>
              </div>
            </div>
            <div className="profile-first-rightbar">
              <Header as="h4" content={user.email} />
              <Header as="h4" content={user.username} />
              <div className="profile-rightbar-child">
                <Header as="h5" content="Total Projects" />
                <Header as="h5" content="Total Images" />
                <Header as="h5" content="Total Labels" />
              </div>
            </div>
          </div>
          <div className="project-second">
            <div className="project-second-leftbar">
              <Menu vertical>
                <Menu.Item as={Link} to="" name="projects">
                  Projects
                </Menu.Item>

                <Menu.Item as={Link} to="" name="analytics">
                  Analytics
                </Menu.Item>

                <Menu.Item as={Link} to="" name="summary">
                  Summary
                </Menu.Item>
              </Menu>
            </div>
            <div className="project-second-rightbar">
              <Card.Group itemsPerRow={3}>
                {!this.props.actions.isfetching ? (
                  this.props.projects[0] &&
                  this.props.projects.map((project, index) => (
                    <Card onClick={() => this.handleClick(project._id)}>
                      <Card.Content
                        className="card-headers"
                        header={project.project_name}
                      />
                      <Card.Content description="Image Labelling App" />
                      <Card.Content extra />
                    </Card>
                  ))
                ) : (
                  <CardLoader />
                )}
              </Card.Group>
            </div>
          </div>
          {/* <Card>
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
          </Card> */}
        </Container>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching,
    projects: state.projects.allProjects,
    actions: state.projects.projectActions
  };
};

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      dispatch(fetchUser());
    },
    uploadImage: (data, callback) => {
      dispatch(uploadImage(data, callback));
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject());
    }
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Profile);

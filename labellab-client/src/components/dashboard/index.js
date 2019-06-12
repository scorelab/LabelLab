import React, { Component } from "react";
// import { Link } from "react-router-dom";
import {
  Modal,
  Dimmer,
  // Segment,
  Button,
  Loader,
  Menu,
  Image,
  Header,
  Container,
  Input
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  //   setData,
  log_out,
  uploadImage,
  fetchUser,
  initProject
} from "../../actions/index";
import { hasToken } from "../../utils/token";
import { TOKEN_TYPE } from "../../constants/index";
// import LabelPreview from "./labelpreview";
// import home from "./css/dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      file: "",
      image: "",
      open: false,
      max_size_error: "",
      project_name: ""
    };
  }
  componentDidMount() {
    if (hasToken(TOKEN_TYPE)) {
      this.props.fetchUser();
    } else {
      this.props.history.push("/login");
    }
  }

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
  imageCallback = msg => {
    this.props.fetchUser();
  };
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
  handleLogout = () => {
    this.props.logout(this.logoutCallback);
  };
  logoutCallback = () => {
    this.props.history.push("/login");
  };
  handleSidebarHide = () => {
    this.setState({
      visible: false
    });
  };
  handleShowClick = () => {
    this.setState({
      visible: true
    });
  };
  handleCreateProject = () => {
    this.setState({
      open: !this.state.open
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleProjectSubmit = () => {
    this.props.initProject(
      { project_name: this.state.project_name },
      this.projectCallback
    );
    this.close();
  };
  projectCallback = id => {
    this.props.history.push({
      pathname: "/tool",
      search: "?project_id=" + id
    });
  };
  callback() {}
  close = () => this.setState({ open: false });
  render() {
    const { open } = this.state;
    return (
      <div styleName={{ height: "100vh" }}>
        <Container styleName="home.container">
          {this.props.errors}
          <Dimmer active={this.props.isinitializing}>
            <Loader indeterminate>Preparing Files</Loader>
          </Dimmer>
          <Modal size="small" open={open} onClose={this.close}>
            <Modal.Content>
              <p>Enter Project Name:</p>
            </Modal.Content>
            <Modal.Actions>
              <Input
                name="project_name"
                onChange={this.handleChange}
                type="text"
                placeholder="Project name"
              />
              <Button
                positive
                onClick={this.handleProjectSubmit}
                content="Create Project"
              />
            </Modal.Actions>
          </Modal>
          <Menu styleName="home.menu">
            <Menu.Menu position="right">
              <Menu.Item fitted styleName="home.borderless">
                {this.props.isfetching ? (
                  <h4>LOADING</h4>
                ) : this.props.user && this.props.user.image ? (
                  <Image
                    centered
                    src={`http://localhost:5000${
                      this.props.user.image
                    }?${Date.now()}`}
                    size="mini"
                  />
                ) : null}
              </Menu.Item>
              <Menu.Item>
                <Header
                  textAlign="center"
                  as="h5"
                  content={this.props.user.username}
                />
              </Menu.Item>
              <div>
                <input
                  type="file"
                  onChange={this.handleImageChange}
                  className="file-input"
                  id="embedpollfileinput"
                />
                <label
                  htmlFor="embedpollfileinput"
                  className="ui medium primary left floated button custom-margin"
                >
                  Update Profile Image
                </label>
              </div>
              <Menu.Item>
                <Button onClick={this.handleLogout}>Logout</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <div>{this.state.max_size_error}</div>
          <div className="create-project-button">
            <Button primary onClick={this.handleCreateProject}>
              Create New Project
            </Button>
          </div>
          {/* <Segment>
                            <Input onChange={this.handleImageChange} type="file" />
                            <div id="file-name-display"></div>
                            <Button onClick={this.onSubmit}>Upload Image</Button>
                        </Segment> */}
          {/* <div className="previous-heading">
            <Header textAlign="left" as="h3" content="Previous Works" />
            <LabelPreview />
          </div> */}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    statusText: state.register.statusText,
    details: state.auth.details,
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching,
    errors: state.user.userActions.errors,
    isinitializing: state.user.userActions.isinitializing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: callback => {
      dispatch(log_out(callback));
    },
    // setData: (data, callback) => {
    //   dispatch(setData(data, callback));
    // },
    uploadImage: (data, callback) => {
      dispatch(uploadImage(data, callback));
    },
    fetchUser: () => {
      dispatch(fetchUser());
    },
    initProject: (data, callback) => [dispatch(initProject(data, callback))]
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

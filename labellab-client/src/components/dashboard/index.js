import React, { Component } from "react";
import {
  Modal,
  Dimmer,
  Button,
  Loader,
  Header,
  Container,
  Input,
  Icon
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  log_out,
  uploadImage,
  fetchUser,
  initProject,
  fetchAllProject
} from "../../actions/index";
import Navbar from "../navbar/index";
import { hasToken } from "../../utils/token";
import { TOKEN_TYPE } from "../../constants/index";
import PreviousWork from "./previous";
import "./css/dashboard.css";

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
      this.props.fetchAllProject();
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
      pathname: "/project/" + id + "/team"
    });
  };
  callback() {}
  close = () => this.setState({ open: false });
  render() {
    const { open } = this.state;
    return (
      <div className="dashboard-parent">
        <Navbar
          user={this.props.user}
          isfetching={this.props.isfetching}
          history={this.props.history}
        />
        <Container className="home.container">
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
          <div className="create-project-button">
            <Button
              icon
              className="create-button"
              onClick={this.handleCreateProject}
              labelPosition="left"
            >
              <Icon name="add" />
              Start New Project
            </Button>
          </div>
          <div className="previous-heading">
            <Header textAlign="left" as="h3" content="Previous Works" />
            <PreviousWork />
          </div>
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
    isinitializing: state.projects.projectActions.isinitializing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: callback => {
      dispatch(log_out(callback));
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject());
    },
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

import React, { Component } from 'react'
import {
  Modal,
  Dimmer,
  Button,
  Loader,
  Header,
  Container,
  Input,
  Icon
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  logout,
  uploadImage,
  fetchUser,
  initProject,
  fetchAllProject
} from '../../actions/index'
import Navbar from '../navbar/index'
import { hasToken } from '../../utils/token'
import { TOKEN_TYPE } from '../../constants/index'
import PreviousWork from './previous'
import './css/dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      file: '',
      image: '',
      open: false,
      maxSizeError: '',
      projectName: '',
      projectDescription: '',
      invalidDetails: true
    }
  }
  componentDidMount() {
    const { fetchAllProject, fetchUser, history } = this.props
    if (hasToken(TOKEN_TYPE)) {
      fetchAllProject()
      fetchUser()
    } else {
      history.push('/login')
    }
  }

  onSubmit = e => {
    const { file, image } = this.state
    if (file && file.size > 101200) {
      this.setState({
        maxSizeError: 'max sized reached'
      })
    } else {
      let data = {
        image: image,
        format: file.type
      }
      this.props.uploadImage(data, this.imageCallback)
    }
  }
  imageCallback = msg => {
    this.props.fetchAllProject()
  }
  handleImageChange = e => {
    e.preventDefault()
    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file
      })
      this.onSubmit(e)
    }
    reader.readAsDataURL(file)
  }
  handleLogout = () => {
    this.props.logout(this.logoutCallback)
  }
  logoutCallback = () => {
    this.props.history.push('/login')
  }
  handleSidebarHide = () => {
    this.setState({
      visible: false
    })
  }
  handleShowClick = () => {
    this.setState({
      visible: true
    })
  }
  handleCreateProject = () => {
    this.setState({
      open: !this.state.open
    })
  }
  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        if (this.state.projectName === '') {
          this.setState({
            invalidDetails: true
          })
        } else {
          this.setState({
            invalidDetails: false
          })
        }
      }
    )
  }
  handleProjectSubmit = () => {
    this.props.initProject(
      {
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription
      },
      this.projectCallback
    )
    this.close()
  }
  projectCallback = id => {
    this.props.history.push({
      pathname: '/project/' + id + '/team'
    })
  }
  callback() {}
  close = () => this.setState({ open: false })
  render() {
    const { user, isfetching, isinitializing, history, errors } = this.props
    const { open } = this.state
    return (
      <div className="dashboard-parent">
        <Navbar user={user} isfetching={isfetching} history={history} />
        <div className="dashboard-container">
          {errors}
          <Dimmer active={isinitializing}>
            <Loader indeterminate>Preparing Files</Loader>
          </Dimmer>
          <Modal size="tiny" open={open} onClose={this.close}>
            <Modal.Header>
              <p>Enter Project Details</p>
            </Modal.Header>
            <Modal.Actions>
              <div className="modal-actions">
                <Input
                  name="projectName"
                  onChange={this.handleChange}
                  type="text"
                  placeholder="* Project Name"
                  label="Name"
                />
                <Input
                  name="projectDescription"
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Project Description"
                  label="Description"
                />
                <div>
                  <Button
                    positive
                    onClick={this.handleProjectSubmit}
                    content="Create Project"
                    disabled={this.state.invalidDetails ? true : false}
                  />
                </div>
              </div>
            </Modal.Actions>
          </Modal>
          <div className="create-project-button">
            <Button
              icon
              positive
              className="create-project"
              onClick={this.handleCreateProject}
              labelPosition="left"
            >
              <Icon name="add" />
              Start New Project
            </Button>
          </div>
          <div className="previous-heading">
            <Header
              className="mobile-padding"
              textAlign="left"
              as="h3"
              content="Previous Works"
            />
            <PreviousWork />
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  isfetching: PropTypes.bool,
  errors: PropTypes.string,
  isinitializing: PropTypes.bool,
  history: PropTypes.object,
  logout: PropTypes.func,
  fetchAllProject: PropTypes.func,
  fetchUser: PropTypes.func,
  uploadImage: PropTypes.func,
  initProject: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    isfetching: state.user.userActions.isfetching,
    errors: state.user.userActions.errors,
    isinitializing: state.projects.projectActions.isinitializing
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: callback => {
      dispatch(logout(callback))
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject())
    },
    fetchUser: () => {
      return dispatch(fetchUser())
    },
    uploadImage: (data, callback) => {
      dispatch(uploadImage(data, callback))
    },
    initProject: (data, callback) => [dispatch(initProject(data, callback))]
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

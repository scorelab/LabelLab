import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Card,
  Image,
  Header,
  Container,
  Menu,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import Navbar from '../navbar/project'
import {
  fetchUser,
  uploadImage,
  fetchAllProject,
  fetchCount
} from '../../actions/index'
import { hasToken } from '../../utils/token'
import { TOKEN_TYPE } from '../../constants/index'
import CardLoader from '../../utils/cardLoader'
import Edit from './edit'
import './css/profile.css'
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      image: ''
    }
  }
  componentDidMount() {
    const { history, fetchUser, fetchAllProject, fetchCount } = this.props
    if (hasToken(TOKEN_TYPE)) {
      fetchUser()
      fetchAllProject()
      fetchCount()
    } else {
      history.push('/login')
    }
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
  onSubmit = e => {
    let { file, image } = this.state
    if (file && file.size > 101200) {
      this.setState({
        max_size_error: 'max sized reached'
      })
    } else {
      let data = {
        image: image,
        format: file.type
      }
      this.props.uploadImage(data, this.imageCallback)
    }
  }
  handleClick = id => {
    this.props.history.push({
      pathname: '/project/' + id + '/team'
    })
  }
  imageCallback = () => {
    this.props.fetchUser()
  }
  render() {
    const { user, history, isfetching, profile, actions, projects } = this.props
    return (
      <div>
        <Navbar title="Profile" history={history} />
        <Container>
          {!isfetching ? (
            <React.Fragment>
              <div className="profile-first">
                <div className="profile-first-leftbar">
                  <Image
                    centered
                    src={
                      user.profileImage === ''
                        ? `${user.thumbnail}`
                        : `${user.profileImage}?${Date.now()}`
                    }
                    size="small"
                  />
                  <div className="profile-edit-button">
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
                      Edit
                    </label>
                  </div>
                </div>
                <div className="profile-first-rightbar">
                  <Edit />
                  <div className="profile-rightbar-child">
                    <div>
                      <Header as="h5" content="Total Projects" />
                      {profile.totalProjects}
                    </div>
                    <div>
                      <Header as="h5" content="Total Images" />
                      {profile.totalImages}
                    </div>
                    <div>
                      <Header as="h5" content="Total Labels" />
                      {profile.totalLabels}
                    </div>
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
                    {!actions.isfetching ? (
                      projects[0] &&
                      projects.map((project, index) => (
                        <Card
                          key={index}
                          onClick={() => this.handleClick(project._id)}
                        >
                          <Card.Content
                            className="card-headers"
                            header={project.projectName}
                          />
                          <Card.Content description={project.projectDescription} />
                          <Card.Content extra />
                        </Card>
                      ))
                    ) : (
                      <CardLoader />
                    )}
                  </Card.Group>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <Dimmer active>
              <Loader indeterminate>Loading..</Loader>
            </Dimmer>
          )}
        </Container>
      </div>
    )
  }
}

Profile.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  isfetching: PropTypes.bool,
  projects: PropTypes.array,
  actions: PropTypes.object,
  history: PropTypes.object,
  fetchAllProject: PropTypes.func,
  fetchCount: PropTypes.func,
  fetchUser: PropTypes.func,
  uploadImage: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    profile: state.user.userProfile,
    isfetching: state.user.userActions.isfetching,
    projects: state.projects.allProjects,
    actions: state.projects.projectActions
  }
}

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      return dispatch(fetchUser())
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject())
    },
    fetchCount: () => {
      return dispatch(fetchCount())
    },
    uploadImage: (data, callback) => {
      return dispatch(uploadImage(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(Profile)

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
          <div className="profile-first">
            <div className="profile-first-leftbar">
              {isfetching ? (
                <Dimmer active>
                  <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
              ) : user ? (
                <Image
                  centered
                  src={
                    user.profileImage === ''
                      ? `${user.thumbnail}`
                      : `${user.profileImage}?${Date.now()}`
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
                <div>
                  <Header as="h5" content="Total Projects" />
                  {profile.total_projects}
                </div>
                <div>
                  <Header as="h5" content="Total Images" />
                  {profile.total_images}
                </div>
                <div>
                  <Header as="h5" content="Total Labels" />
                  {profile.total_labels}
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

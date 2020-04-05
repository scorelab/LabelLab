import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Button, Modal, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { editUser, fetchUser, uploadImage } from '../../actions/index'
import './css/profile-card.css'

class ProfileCard extends Component {
  state = {
    open: false,
    name: '',
    username: '',
    submitted: false,
    file: '',
    image: ''
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { name, username } = this.state
    const { updateUser } = this.props
    this.setState({
      submitted: true
    })
    if (name && username) {
      let data = {
        name: name,
        username: username
      }
      updateUser(data, this.callback)
    }
  }
  callback = () => {
    this.props.fetchUser()
  }
  closeModal = () => this.setState({ open: false })
  openModal = () => this.setState({ open: true })

  handleImageChange = e => {
    e.preventDefault()
    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file
      })
      this.onSubmit()
    }
    reader.readAsDataURL(file)
  }
  handleRemoveImage = () => {
    this.setState({
      image: null,
      file: null
    })
    this.onSubmit()
  }
  onSubmit = () => {
    const { uploadImage } = this.props
    let { file, image } = this.state
    if (!file && !image) {
      let data = {
        image: null,
        format: null
      }
      uploadImage(data, this.imageCallback)
    } else if (file && file.size > 101200) {
      this.setState({
        max_size_error: 'max sized reached'
      })
    } else {
      let data = {
        image: image,
        format: file.type
      }
      uploadImage(data, this.imageCallback)
    }
  }

  imageCallback = () => {
    this.setState({
      image: null,
      file: null
    })
    this.props.fetchUser()
  }

  render() {
    const { actions, user } = this.props
    const { name, open, username } = this.state

    return (
      <React.Fragment>
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Loading..</Loader>
          </Dimmer>
        ) : (
          <div className="profile-card">
            <div className="header">
              <img
                src={
                  user.profileImage === ''
                    ? `${user.thumbnail}`
                    : `${user.profileImage}?${Date.now()}`
                }
                alt=""
                className="image"
              />
              <div className="details">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
            <div className="content">
              <div className="detail">
                <div className="key">Name</div>
                <div className="value">{user.name}</div>
              </div>
              <div className="detail">
                <div className="key">Username</div>
                <div className="value">{user.username}</div>
              </div>
              <div className="detail">
                <div className="key">Email</div>
                <div className="value">{user.email}</div>
                {this.state.max_size_error ? (
                  <div className="image_size_error">
                    Max size of the profile pic should be 101Kb
                  </div>
                ) : null}
              </div>
            </div>
            <div className="actions">
              <Button primary className="btn-edit" onClick={this.openModal}>
                Edit
              </Button>
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
                Change Image
              </label>
              <Button
                negative
                basic
                icon="delete"
                onClick={this.handleRemoveImage}
              />
            </div>
          </div>
        )}
        <Modal size="small" open={open} onClose={this.closeModal}>
          <Modal.Header>
            <p>Edit User Details</p>
          </Modal.Header>
          <Modal.Actions>
            <div className="modal-actions">
              <div>
                <Input
                  name="name"
                  type="text"
                  label="Name"
                  placeholder="Name..."
                  defaultValue={user.name}
                  onChange={this.onChange}
                />
              </div>
              <div>
                <Input
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Username..."
                  defaultValue={user.username}
                  onChange={this.onChange}
                />
              </div>
              <div>
                <Button positive onClick={this.handleSubmit} content="Submit" />
              </div>
            </div>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

ProfileCard.propTypes = {
  updateUser: PropTypes.func,
  fetchUser: PropTypes.func,
  history: PropTypes.object,
  actions: PropTypes.object,
  user: PropTypes.object
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    actions: state.user.userActions
  }
}

const mapActionToProps = dispatch => {
  return {
    updateUser: (data, callback) => {
      return dispatch(editUser(data, callback))
    },
    fetchUser: () => {
      return dispatch(fetchUser())
    },
    uploadImage: (data, callback) => {
      return dispatch(uploadImage(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(ProfileCard)

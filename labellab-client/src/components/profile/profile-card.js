import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Label,
  Dimmer,
  Loader,
  Button,
  Card,
  Modal,
  Input
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { editUser, fetchUser } from '../../actions/index'
import './css/profile-card.css'

class ProfileCard extends Component {
  render() {
    const { actions, user } = this.props
    console.log(user)
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
            </div>
            <div className="content">
              <div className="detail">
                <div className="key">Username</div>
                <div className="value">{user.username}</div>
              </div>
            </div>
            <div className="content">
              <div className="detail">
                <div className="key">Email</div>
                <div className="value">{user.email}</div>
              </div>
            </div>
            <div className="actions">
              <Button primary className="btn-edit">
                Edit
              </Button>
            </div>
          </div>
        )}
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(ProfileCard)

// <Modal size="small" open={open} onClose={this.closeModal}>
//           <Modal.Header>
//             <p>Edit User Details</p>
//           </Modal.Header>
//           <Modal.Actions>
//             <div className="modal-actions">
//               <div>
//                 <Input
//                   name="name"
//                   type="text"
//                   label="Name"
//                   placeholder="Name..."
//                   defaultValue={name}
//                   onChange={this.onChange}
//                 />
//               </div>
//               <div>
//                 <Input
//                   name="username"
//                   type="text"
//                   label="Username"
//                   placeholder="Username..."
//                   defaultValue={username}
//                   onChange={this.onChange}
//                 />
//               </div>
//               <div>
//                 <Button positive onClick={this.handleSubmit} content="Submit" />
//               </div>
//             </div>
//           </Modal.Actions>
//         </Modal>

// onChange = e => {
//   this.setState({
//     [e.target.name]: e.target.value
//   })
// }
// handleSubmit = e => {
//   e.preventDefault()
//   const { name, username } = this.state
//   const { updateUser } = this.props
//   this.setState({
//     submitted: true
//   })
//   if (name && username) {
//     let data = {
//       name: name,
//       username: username
//     }
//     updateUser(data, this.callback)
//   }
// }
// callback = () => {
//   this.props.fetchUser()
// }
// closeModal = () => this.setState({ open: false })
// openModal = () => this.setState({ open: true })

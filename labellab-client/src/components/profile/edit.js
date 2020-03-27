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
import './css/edit.css'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      open: false
    }
  }
  componentDidMount() {
    const { user } = this.props
    this.setState({
      name: user.userDetails.name,
      username: user.userDetails.username
    })
  }
  componentDidUpdate(prevProps) {
    const { user } = this.props
    if (prevProps.user !== user) {
      this.setState({
        name: user.userDetails.name,
        username: user.userDetails.username
      })
    }
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
  render() {
    const { name, username, open } = this.state
    const { actions, user } = this.props
    return (
      <React.Fragment>
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Loading..</Loader>
          </Dimmer>
        ) : (
          <Card className="user-card">
            <Card.Header as="h2" className="user-card-header">
              User Information
              <Button floated="right" type="button" onClick={this.openModal}>
                Edit
              </Button>
            </Card.Header>
            <Card.Content>
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
                        defaultValue={name}
                        onChange={this.onChange}
                      />
                    </div>
                    <div>
                      <Input
                        name="username"
                        type="text"
                        label="Username"
                        placeholder="Username..."
                        defaultValue={username}
                        onChange={this.onChange}
                      />
                    </div>
                    <div>
                      <Button
                        positive
                        onClick={this.handleSubmit}
                        content="Submit"
                      />
                    </div>
                  </div>
                </Modal.Actions>
              </Modal>
              <div className="user-details">
                <div className="user-detail">
                  <Label color="white" size="big" image>
                    Name
                    <Label.Detail>{user.userDetails.name}</Label.Detail>
                  </Label>
                </div>

                <div className="user-detail">
                  <Label color="white" size="big" image>
                    Username
                    <Label.Detail>{user.userDetails.username}</Label.Detail>
                  </Label>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </React.Fragment>
    )
  }
}

Edit.propTypes = {
  updateUser: PropTypes.func,
  fetchUser: PropTypes.func,
  history: PropTypes.object,
  actions: PropTypes.object,
  user: PropTypes.object
}

const mapStateToProps = state => {
  return {
    user: state.user,
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
)(Edit)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Dimmer, Loader, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { editUser, fetchUser } from '../../actions/index'
import './css/edit.css'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: ''
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
  render() {
    const { name, username } = this.state
    const { actions } = this.props
    return (
      <React.Fragment>
        {actions.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Loading..</Loader>
          </Dimmer>
        ) : (
          <Form>
            <div>
              <Form.Input
                fluid
                label="Name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={this.onChange}
              />
              <Form.Input
                fluid
                label="Username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.onChange}
              />
            </div>
            <div className="profile-form-button-parent">
              <Button floated="right" type="button" onClick={this.handleSubmit}>
                Save
              </Button>
            </div>
          </Form>
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

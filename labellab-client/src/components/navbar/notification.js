import React, { Component } from 'react'
import {
    Dropdown
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import PropTypes from 'prop-types'
import { hasToken } from '../../utils/token'
import { fetchUser, fetchNotification, handleNotificationReceive } from '../../actions/index'
import { TOKEN_TYPE } from '../../constants/index'
import { icons } from '../../constants/options'
import './css/navbar.css'


class Notification extends Component {

    componentDidMount() {
        const { fetchUser, fetchNotification, handleNotificationReceive, user } = this.props;
        if (hasToken(TOKEN_TYPE)) {
            fetchUser()
            fetchNotification()
            handleNotificationReceive(user.id)
        } else {
            this.props.history.push('/login')
        }
    }
    render() {
        const { notifications } = this.props
        return (
            <React.Fragment>
                <Dropdown
                    icon='bell outline large'
                    floating
                    scrolling
                >
                    <Dropdown.Menu>
                        <Dropdown.Header content='Notifications' />
                        <Dropdown.Divider />
                        {notifications.notifications && notifications.notifications.length > 0 ? (
                            notifications.notifications.map((notification, key) => {
                                return (
                                    <Dropdown.Item key={key} icon={icons[notification.type]} text={notification.message} divider />
                                )
                            })
                        ) : (
                            <div>No notification!</div>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <SemanticToastContainer maxToasts={1}/>
            </React.Fragment>
        )
    }
}

Notification.propTypes = {
    history: PropTypes.object,
    user: PropTypes.object,
    fetchUser: PropTypes.func,
    project: PropTypes.object,
    notifications: PropTypes.array
}

const mapStateToProps = state => {
    return {
        user: state.user.userDetails,
        isfetching: state.user.userActions.isfetching,
        notifications: state.notifications,
    }
}

const mapActionToProps = dispatch => {
    return {
        fetchUser: () => {
            return dispatch(fetchUser())
        },
        fetchNotification: () => {
            return dispatch(fetchNotification());
        },
        handleNotificationReceive: (userId) => {
            return dispatch(handleNotificationReceive(userId));
        }
    }
}

export default connect(
    mapStateToProps,
    mapActionToProps
)(Notification)

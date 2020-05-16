import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import { Dimmer, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchProject,
  getTimeLabel,
  getLabelCount,
  fetchLabels
} from '../../actions/index'
import Load from '../loading/index'
import './css/index.css'

const Loading = ({ error }) => {
  if (error) return <div>Error loading component</div>
  else return <Load />
}

const PrivateRoute = Loadable({
  loader: () => import('../../utils/pR'),
  loading: Loading
})

const Sidebar = Loadable({
  loader: () => import('./sidebar'),
  loading: Loading
})
const ProjectNavbar = Loadable({
  loader: () => import('../navbar/project'),
  loading: Loading
})
const Images = Loadable({
  loader: () => import('./images'),
  loading: Loading
})
const Analytics = Loadable({
  loader: () => import('./analytics'),
  loading: Loading
})
const ProjectDescription = Loadable({
  loader: () => import('./projectDesc'),
  loading: Loading
})
const Team = Loadable({
  loader: () => import('./team'),
  loading: Loading
})
const Labels = Loadable({
  loader: () => import('./label/index'),
  loading: Loading
})
const Models = Loadable({
  loader: () => import('./models'),
  loading: Loading
})

class ProjectIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const {
      match,
      fetchProject,
      fetchTimeLabel,
      fetchLabels,
      fetchLabelCount
    } = this.props
    fetchProject(match.params.projectId)
    fetchTimeLabel(match.params.projectId)
    fetchLabels(match.params.projectId)
    fetchLabelCount(match.params.projectId)
  }
  render() {
    const { match, actions, history, actionsLabel } = this.props
    return (
      <React.Fragment>
        {actions.isfetching || actionsLabel.isfetching ? (
          <Dimmer active>
            <Loader indeterminate>Have some patience :)</Loader>
          </Dimmer>
        ) : null}
        {actions.isuploading ? (
          <Dimmer active>
            <Loader indeterminate>Uploading Image</Loader>
          </Dimmer>
        ) : null}
        <ProjectNavbar history={history} />
        <div className="project-main">
          <Sidebar history={history} />
          <div className="project-non-side-section">
            <ProjectDescription history={history} />
            <Switch>
              <PrivateRoute
                exact
                path={`${match.path}/team`}
                component={Team}
              />
              <PrivateRoute
                exact
                path={`${match.path}/images`}
                component={Images}
              />
              <PrivateRoute
                exact
                path={`${match.path}/analytics`}
                component={Analytics}
              />
              <PrivateRoute
                exact
                path={`${match.path}/labels`}
                component={Labels}
              />
              <PrivateRoute
                exact
                path={`${match.path}/models`}
                component={Models}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

ProjectIndex.propTypes = {
  projects: PropTypes.object,
  actions: PropTypes.object,
  history: PropTypes.object,
  fetchProject: PropTypes.func,
  fetchTimeLabel: PropTypes.func,
  match: PropTypes.object,
  actionsLabel: PropTypes.object,
  fetchLabels: PropTypes.func
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject,
    actions: state.projects.projectActions,
    actionsLabel: state.labels.labelActions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId))
    },
    fetchProject: data => {
      return dispatch(fetchProject(data))
    },
    fetchTimeLabel: projectId => {
      return dispatch(getTimeLabel(projectId))
    },
    fetchLabelCount: projectId => {
      return dispatch(getLabelCount(projectId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectIndex)

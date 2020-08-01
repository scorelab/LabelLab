import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loadable from 'react-loadable'
import Loader from '../loading/index'

import { fetchLabels, fetchProject, editModel, getModel } from '../../actions/index'

import './css/modelEditor.css'

const Loading = ({ error }) => {
  if (error) return <div>Error loading component</div>
  else return <Loader />
}

const ClassifierEditor = Loadable({
  loader: () => import('./classifierEditor.js'),
  loading: Loading
})

class ModelEditor extends Component {
  componentDidMount() {
    const { fetchLabels, fetchProject, getModel, match } = this.props

    getModel(match.params.modelId)
    fetchLabels(match.params.projectId)
    fetchProject(match.params.projectId)
  }

  getEditorType = () => {
    const { match, editModel, project } = this.props

    switch (match.params.type) {
      case 'classifier':
        return (
          <ClassifierEditor
            source={match.params.source}
            editModel={editModel}
            projectId={project.projectId}
          />
        )
      default:
        return <div>Error loading component</div>
    }
  }

  render() {
    return <div className="model-editor">{this.getEditorType()}</div>
  }
}

ModelEditor.propTypes = {
  fetchLabels: PropTypes.func,
  fetchProject: PropTypes.func
}

const mapStateToProps = state => ({
  project: state.projects.currentProject
})

const mapDispatchToProps = dispatch => {
  return {
    fetchLabels: projectId => {
      return dispatch(fetchLabels(projectId))
    },
    fetchProject: projectId => {
      return dispatch(fetchProject(projectId))
    },
    editModel: (model, modelId) => {
      return dispatch(editModel(model, modelId))
    },
    getModel: modelId => {
      return dispatch(getModel(modelId))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelEditor)

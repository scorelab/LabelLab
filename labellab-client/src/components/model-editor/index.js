import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loadable from 'react-loadable'
import Loader from '../loading/index'

import { fetchLabels } from '../../actions/label'
import { fetchProject } from '../../actions/project/fetchDetails'
import { saveModel } from '../../actions/model'

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
    const { fetchLabels, fetchProject, match } = this.props

    fetchLabels(match.params.projectId)
    fetchProject(match.params.projectId)
  }

  getEditorType = () => {
    const { match, labels, project, saveModel } = this.props

    switch (match.params.type) {
      case 'classifier':
        return (
          <ClassifierEditor
            labels={labels}
            images={project.images}
            source={match.params.source}
            saveModel={saveModel}
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
  labels: PropTypes.array,
  fetchLabels: PropTypes.func,
  fetchProject: PropTypes.func,
  saveModel: PropTypes.func
}

const mapStateToProps = state => ({
  labels: state.labels.labels,
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
    saveModel: modelData => {
      return dispatch(saveModel(modelData))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelEditor)

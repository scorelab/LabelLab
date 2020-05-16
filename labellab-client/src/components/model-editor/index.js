import React, { Component } from 'react'
import {Container} from "semantic-ui-react"
import Loadable from 'react-loadable'
import Loader from '../loading/index'

import "./css/modelEditor.css"

const Loading = ({ error }) => {
  if (error) return <div>Error loading component</div>
  else return <Loader />
}

const ClassifierEditor = Loadable({
  loader: () => import('./classifierEditor.js'),
  loading: Loading
})

class ModelEditor extends Component {

    getEditorType = () => {

        const {type} = this.props.match.params;

        switch(type) {
            case "classifier":
                return <ClassifierEditor />;
            default:
                return <div>Error loading component</div>
        }
    }

    render() {
        return (
            <div className="model-editor">
                {this.getEditorType()}
            </div>
        )
    }
}

export default ModelEditor;
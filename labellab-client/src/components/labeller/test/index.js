import React, { Component } from "react";
import LabelingApp from "./LabelingApp.js";

import { Loader } from "semantic-ui-react";
import DocumentMeta from "react-document-meta";


export default class LabelingLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      image: null,
      isLoaded: false,
      error: null
    };
  }
  pushUpdate(labelData) {
    console.log(labelData)
  }
  markcomplete(){
    
  }
  render() {
    const props = {
      onLabelChange: this.pushUpdate.bind(this),
    };
    const labels = [{ id: "djahbsd", name: "Car", type: "polygon" }];
    const title = "dfahsgdu";
    return (
      <DocumentMeta title={title}>
        <LabelingApp
          labels={labels}
          // reference={{ referenceLink, referenceText }}
          labelData={{}}
          imageUrl="http://localhost:4000/static/project/5d0f8870643b413a6707c776.png"
          // fetch={this.fetch.bind(this)}
          demo={false}
          {...props}
        />
      </DocumentMeta>
    );
  }
}
